import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import {
  createContactSubmission,
  getContactSubmissions,
  updateContactStatus,
  createQuestionnaireResponse,
  getQuestionnaireResponses,
  updateQuestionnaireStatus,
  createReview,
  getApprovedReviews,
  getAllReviews,
  updateReviewStatus,
} from "./db";
import { notifyOwner } from "./_core/notification";
import { invokeLLM } from "./_core/llm";

const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== "admin") {
    throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
  }
  return next({ ctx });
});

/**
 * Check if a review is positive using LLM sentiment analysis.
 * Returns true if the review content is genuinely positive.
 */
async function isReviewPositive(content: string, title?: string): Promise<boolean> {
  try {
    const response = await invokeLLM({
      messages: [
        {
          role: "system",
          content: "You are a review moderation assistant. Analyze the following review and determine if it is genuinely positive. A positive review expresses satisfaction, gratitude, or praise. A negative or mixed review contains complaints, sarcasm, backhanded compliments, or dissatisfaction. Respond with JSON: {\"positive\": true} or {\"positive\": false}",
        },
        {
          role: "user",
          content: `Review title: ${title || "N/A"}\nReview content: ${content}`,
        },
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "review_sentiment",
          strict: true,
          schema: {
            type: "object",
            properties: {
              positive: { type: "boolean", description: "Whether the review is genuinely positive" },
            },
            required: ["positive"],
            additionalProperties: false,
          },
        },
      },
    });

    const result = JSON.parse(response.choices[0].message.content as string);
    return result.positive === true;
  } catch (error) {
    console.warn("[Review Moderation] LLM check failed, defaulting to manual review:", error);
    return false; // If LLM fails, require manual approval
  }
}

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  contact: router({
    submit: publicProcedure
      .input(z.object({
        firstName: z.string().min(1),
        lastName: z.string().min(1),
        email: z.string().email(),
        phone: z.string().optional(),
        subject: z.string().optional(),
        message: z.string().min(1),
      }))
      .mutation(async ({ input }) => {
        await createContactSubmission(input);
        await notifyOwner({
          title: "New Contact Form Submission",
          content: `${input.firstName} ${input.lastName} (${input.email}) sent a message: \"${input.subject || 'No subject'}\"`,
        });
        return { success: true };
      }),
    list: adminProcedure.query(async () => {
      return getContactSubmissions();
    }),
    updateStatus: adminProcedure
      .input(z.object({
        id: z.number(),
        status: z.enum(["new", "read", "replied", "archived"]),
        adminNotes: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        await updateContactStatus(input.id, input.status, input.adminNotes);
        return { success: true };
      }),
    reply: adminProcedure
      .input(z.object({
        id: z.number(),
        email: z.string().email(),
        firstName: z.string(),
        message: z.string().min(1),
      }))
      .mutation(async ({ input }) => {
        // Use the notification system to alert the owner about the reply
        // The actual email is sent via mailto link opened on the client side
        // We update the status to "replied" and store the reply as admin notes
        await updateContactStatus(input.id, "replied", `Reply sent: ${input.message}`);
        await notifyOwner({
          title: "Reply Sent to Client",
          content: `You replied to ${input.firstName} (${input.email}): "${input.message.substring(0, 200)}${input.message.length > 200 ? '...' : ''}"`,
        });
        return { success: true };
      }),
  }),

  questionnaire: router({
    submit: publicProcedure
      .input(z.object({
        firstName: z.string().min(1),
        lastName: z.string().min(1),
        email: z.string().email(),
        phone: z.string().optional(),
        destination: z.string().optional(),
        travelDates: z.string().optional(),
        flexibility: z.string().optional(),
        travelers: z.string().optional(),
        budget: z.string().optional(),
        occasion: z.string().optional(),
        accommodationStyle: z.string().optional(),
        interests: z.string().optional(),
        dietaryNeeds: z.string().optional(),
        mobilityNeeds: z.string().optional(),
        additionalNotes: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        await createQuestionnaireResponse(input);
        await notifyOwner({
          title: "New Questionnaire Submitted",
          content: `${input.firstName} ${input.lastName} (${input.email}) submitted a travel questionnaire for ${input.destination || 'unspecified destination'}.`,
        });
        return { success: true };
      }),
    list: adminProcedure.query(async () => {
      return getQuestionnaireResponses();
    }),
    updateStatus: adminProcedure
      .input(z.object({
        id: z.number(),
        status: z.enum(["new", "reviewed", "in_progress", "completed"]),
        adminNotes: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        await updateQuestionnaireStatus(input.id, input.status, input.adminNotes);
        return { success: true };
      }),
  }),

  reviews: router({
    submit: publicProcedure
      .input(z.object({
        name: z.string().min(1),
        email: z.string().email(),
        location: z.string().optional(),
        rating: z.number().min(1).max(5),
        destination: z.string().optional(),
        title: z.string().optional(),
        content: z.string().min(1),
      }))
      .mutation(async ({ input }) => {
        // Only auto-approve if 5 stars AND content is genuinely positive
        let autoApproved = false;
        if (input.rating === 5) {
          const isPositive = await isReviewPositive(input.content, input.title);
          autoApproved = isPositive;
        }
        await createReview({ ...input, status: autoApproved ? "approved" : "pending" });
        if (!autoApproved) {
          await notifyOwner({
            title: "New Review Needs Approval",
            content: `${input.name} left a ${input.rating}-star review${input.destination ? ` about ${input.destination}` : ''}. Please review and approve/reject it in the admin dashboard.`,
          });
        }
        return { success: true, autoApproved };
      }),
    approved: publicProcedure.query(async () => {
      return getApprovedReviews();
    }),
    list: adminProcedure.query(async () => {
      return getAllReviews();
    }),
    updateStatus: adminProcedure
      .input(z.object({
        id: z.number(),
        status: z.enum(["pending", "approved", "rejected"]),
      }))
      .mutation(async ({ input }) => {
        await updateReviewStatus(input.id, input.status);
        return { success: true };
      }),
  }),
});

export type AppRouter = typeof appRouter;
