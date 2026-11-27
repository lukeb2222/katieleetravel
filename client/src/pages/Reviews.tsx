import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { trpc } from "@/lib/trpc";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Star } from "lucide-react";
import { toast } from "sonner";
import { EMAIL_DRAFT_TOAST, IS_STATIC, STATIC_REVIEWS, openEmailDraft } from "@/lib/static";

function FadeInSection({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.7, delay, ease: [0.23, 1, 0.32, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function StarRating({ rating, onRate, interactive = false }: { rating: number; onRate?: (r: number) => void; interactive?: boolean }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={interactive ? 24 : 16}
          className={`${star <= rating ? "fill-yellow-500 text-yellow-500" : "text-gray-300"} ${interactive ? "cursor-pointer hover:text-yellow-400" : ""}`}
          onClick={() => interactive && onRate?.(star)}
        />
      ))}
    </div>
  );
}

export default function Reviews() {
  const { data, isLoading } = trpc.reviews.approved.useQuery(undefined, { enabled: !IS_STATIC });
  const reviews = IS_STATIC ? STATIC_REVIEWS : data;
  const submitReview = trpc.reviews.submit.useMutation();
  const utils = trpc.useUtils();

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    location: "",
    rating: 5,
    destination: "",
    title: "",
    content: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (IS_STATIC) {
      openEmailDraft(`Review from ${form.name}`, {
        Name: form.name,
        Email: form.email,
        Location: form.location,
        Rating: `${form.rating} / 5`,
        Destination: form.destination,
        Title: form.title,
        Review: form.content,
      });
      toast.success(EMAIL_DRAFT_TOAST);
      return;
    }
    try {
      const result = await submitReview.mutateAsync(form);
      if (result.autoApproved) {
        toast.success("Thank you! Your review has been published.");
        utils.reviews.approved.invalidate();
      } else {
        toast.success("Thank you! Your review has been submitted and is pending approval.");
      }
      setShowForm(false);
      setForm({ name: "", email: "", location: "", rating: 5, destination: "", title: "", content: "" });
    } catch {
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="min-h-screen">
      <Navigation />

      {/* Hero */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-24">
        <div className="container max-w-4xl text-center">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-label text-primary mb-4"
          >
            Client Stories
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7 }}
            className="font-serif text-4xl md:text-5xl lg:text-6xl mb-6"
          >
            What Our Clients Say
          </motion.h1>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            <button
              onClick={() => setShowForm(!showForm)}
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 text-label hover:bg-primary/90 transition-colors duration-200"
            >
              {showForm ? "Close Form" : "Leave a Review"}
            </button>
          </motion.div>
        </div>
      </section>

      {/* Review Form */}
      {showForm && (
        <section className="pb-16">
          <div className="container max-w-2xl">
            <motion.form
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              onSubmit={handleSubmit}
              className="bg-white border border-border rounded-lg p-8 space-y-6"
            >
              <h3 className="font-serif text-2xl mb-4">Share Your Experience</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-label text-xs block mb-2">Name *</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full border border-border rounded px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="text-label text-xs block mb-2">Email *</label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full border border-border rounded px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-label text-xs block mb-2">Location</label>
                  <input
                    type="text"
                    value={form.location}
                    onChange={(e) => setForm({ ...form, location: e.target.value })}
                    className="w-full border border-border rounded px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                    placeholder="e.g. San Francisco, CA"
                  />
                </div>
                <div>
                  <label className="text-label text-xs block mb-2">Destination Traveled</label>
                  <input
                    type="text"
                    value={form.destination}
                    onChange={(e) => setForm({ ...form, destination: e.target.value })}
                    className="w-full border border-border rounded px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                    placeholder="e.g. Maldives"
                  />
                </div>
              </div>

              <div>
                <label className="text-label text-xs block mb-2">Rating *</label>
                <StarRating rating={form.rating} onRate={(r) => setForm({ ...form, rating: r })} interactive />
              </div>

              <div>
                <label className="text-label text-xs block mb-2">Review Title</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full border border-border rounded px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                  placeholder="Summarize your experience"
                />
              </div>

              <div>
                <label className="text-label text-xs block mb-2">Your Review *</label>
                <textarea
                  required
                  rows={5}
                  value={form.content}
                  onChange={(e) => setForm({ ...form, content: e.target.value })}
                  className="w-full border border-border rounded px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary resize-none"
                  placeholder="Tell us about your experience with Katie Lee Travel Co."
                />
              </div>

              <button
                type="submit"
                disabled={submitReview.isPending}
                className="w-full bg-primary text-primary-foreground py-3 text-label hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                {submitReview.isPending ? "Submitting..." : "Submit Review"}
              </button>
            </motion.form>
          </div>
        </section>
      )}

      {/* Reviews Grid */}
      <section className="py-16 bg-secondary/50">
        <div className="container max-w-5xl">
          {isLoading ? (
            <div className="text-center text-muted-foreground">Loading reviews...</div>
          ) : reviews && reviews.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {reviews.map((review, i) => (
                <FadeInSection key={review.id} delay={i * 0.1}>
                  <div className="bg-white p-8 rounded-lg border border-border">
                    <StarRating rating={review.rating} />
                    {review.title && (
                      <h3 className="font-serif text-xl mt-4 mb-2">{review.title}</h3>
                    )}
                    <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                      "{review.content}"
                    </p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span className="font-medium text-foreground">{review.name}</span>
                      {review.destination && <span>{review.destination}</span>}
                    </div>
                  </div>
                </FadeInSection>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-muted-foreground font-serif text-xl">No reviews yet. Be the first to share your experience!</p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
