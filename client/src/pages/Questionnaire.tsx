import { useState } from "react";
import { motion } from "framer-motion";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { CheckCircle } from "lucide-react";
import { asset } from "@/lib/static";

const LOGO_URL = asset("/images/katie-lee-logo.png");

export default function Questionnaire() {
  const submitQuestionnaire = trpc.questionnaire.submit.useMutation();
  const [submitted, setSubmitted] = useState(false);
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    destination: "",
    travelDates: "",
    flexibility: "",
    travelers: "",
    budget: "",
    occasion: "",
    accommodationStyle: "",
    interests: "",
    dietaryNeeds: "",
    mobilityNeeds: "",
    additionalNotes: "",
  });

  const updateField = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await submitQuestionnaire.mutateAsync(form);
      toast.success("Questionnaire submitted successfully!");
      setSubmitted(true);
    } catch {
      toast.error("Something went wrong. Please try again.");
    }
  };

  const steps = [
    {
      title: "About You",
      fields: (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-label text-xs block mb-2">First Name *</label>
              <input type="text" required value={form.firstName} onChange={(e) => updateField("firstName", e.target.value)} className="w-full border border-border rounded-md px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary" />
            </div>
            <div>
              <label className="text-label text-xs block mb-2">Last Name *</label>
              <input type="text" required value={form.lastName} onChange={(e) => updateField("lastName", e.target.value)} className="w-full border border-border rounded-md px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-label text-xs block mb-2">Email *</label>
              <input type="email" required value={form.email} onChange={(e) => updateField("email", e.target.value)} className="w-full border border-border rounded-md px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary" />
            </div>
            <div>
              <label className="text-label text-xs block mb-2">Phone</label>
              <input type="tel" value={form.phone} onChange={(e) => updateField("phone", e.target.value)} className="w-full border border-border rounded-md px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary" />
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Trip Details",
      fields: (
        <div className="space-y-6">
          <div>
            <label className="text-label text-xs block mb-2">Where would you like to go?</label>
            <input type="text" value={form.destination} onChange={(e) => updateField("destination", e.target.value)} className="w-full border border-border rounded-md px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary" placeholder="e.g. Italy, Maldives, or 'Surprise me!'" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-label text-xs block mb-2">Preferred Travel Dates</label>
              <input type="text" value={form.travelDates} onChange={(e) => updateField("travelDates", e.target.value)} className="w-full border border-border rounded-md px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary" placeholder="e.g. March 15-25, 2025" />
            </div>
            <div>
              <label className="text-label text-xs block mb-2">Date Flexibility</label>
              <select value={form.flexibility} onChange={(e) => updateField("flexibility", e.target.value)} className="w-full border border-border rounded-md px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary bg-white">
                <option value="">Select...</option>
                <option value="exact">Exact dates</option>
                <option value="flexible_few_days">Flexible by a few days</option>
                <option value="flexible_week">Flexible by a week</option>
                <option value="very_flexible">Very flexible</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-label text-xs block mb-2">Number of Travelers</label>
              <input type="text" value={form.travelers} onChange={(e) => updateField("travelers", e.target.value)} className="w-full border border-border rounded-md px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary" placeholder="e.g. 2 adults, 1 child" />
            </div>
            <div>
              <label className="text-label text-xs block mb-2">Budget Range</label>
              <select value={form.budget} onChange={(e) => updateField("budget", e.target.value)} className="w-full border border-border rounded-md px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary bg-white">
                <option value="">Select...</option>
                <option value="5000-10000">$5,000 - $10,000</option>
                <option value="10000-25000">$10,000 - $25,000</option>
                <option value="25000-50000">$25,000 - $50,000</option>
                <option value="50000+">$50,000+</option>
                <option value="flexible">Flexible / No set budget</option>
              </select>
            </div>
          </div>
          <div>
            <label className="text-label text-xs block mb-2">Special Occasion?</label>
            <input type="text" value={form.occasion} onChange={(e) => updateField("occasion", e.target.value)} className="w-full border border-border rounded-md px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary" placeholder="e.g. Anniversary, Honeymoon, Birthday" />
          </div>
        </div>
      ),
    },
    {
      title: "Preferences",
      fields: (
        <div className="space-y-6">
          <div>
            <label className="text-label text-xs block mb-2">Accommodation Style</label>
            <textarea value={form.accommodationStyle} onChange={(e) => updateField("accommodationStyle", e.target.value)} rows={3} className="w-full border border-border rounded-md px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary resize-none" placeholder="e.g. Luxury resort, Boutique hotel, Overwater villa, Private villa..." />
          </div>
          <div>
            <label className="text-label text-xs block mb-2">Interests & Activities</label>
            <textarea value={form.interests} onChange={(e) => updateField("interests", e.target.value)} rows={3} className="w-full border border-border rounded-md px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary resize-none" placeholder="e.g. Fine dining, Spa, Adventure, Culture, Beach, Wine tasting..." />
          </div>
          <div>
            <label className="text-label text-xs block mb-2">Dietary Needs or Restrictions</label>
            <input type="text" value={form.dietaryNeeds} onChange={(e) => updateField("dietaryNeeds", e.target.value)} className="w-full border border-border rounded-md px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary" placeholder="e.g. Vegetarian, Gluten-free, Allergies" />
          </div>
          <div>
            <label className="text-label text-xs block mb-2">Mobility or Accessibility Needs</label>
            <input type="text" value={form.mobilityNeeds} onChange={(e) => updateField("mobilityNeeds", e.target.value)} className="w-full border border-border rounded-md px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary" />
          </div>
          <div>
            <label className="text-label text-xs block mb-2">Anything Else We Should Know?</label>
            <textarea value={form.additionalNotes} onChange={(e) => updateField("additionalNotes", e.target.value)} rows={4} className="w-full border border-border rounded-md px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary resize-none" placeholder="Any other preferences, must-haves, or things to avoid..." />
          </div>
        </div>
      ),
    },
  ];

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-md"
        >
          <CheckCircle className="mx-auto mb-6 text-primary" size={48} />
          <h1 className="font-serif text-3xl mb-4">Thank You!</h1>
          <p className="text-muted-foreground leading-relaxed">
            Your travel questionnaire has been submitted. Katie will review your preferences and be in touch soon to start planning your dream trip.
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Minimal header - no full navigation since this is a standalone form */}
      <div className="border-b border-border py-6">
        <div className="container flex items-center justify-center">
          <img src={LOGO_URL} alt="Katie Lee Travel Co." className="h-12" />
        </div>
      </div>

      <div className="container max-w-2xl py-12 md:py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-10">
            <h1 className="font-serif text-3xl md:text-4xl mb-3">Travel Questionnaire</h1>
            <p className="text-muted-foreground">
              Help us understand your travel style so we can create the perfect trip for you.
            </p>
          </div>

          {/* Progress */}
          <div className="flex items-center justify-center gap-2 mb-10">
            {steps.map((s, i) => (
              <div key={i} className="flex items-center gap-2">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-colors ${
                    i <= step ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                  }`}
                >
                  {i + 1}
                </div>
                {i < steps.length - 1 && (
                  <div className={`w-12 h-0.5 ${i < step ? "bg-primary" : "bg-muted"}`} />
                )}
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit}>
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="font-serif text-2xl mb-6">{steps[step].title}</h2>
              {steps[step].fields}
            </motion.div>

            <div className="flex justify-between mt-10">
              {step > 0 ? (
                <button
                  type="button"
                  onClick={() => setStep(step - 1)}
                  className="border border-border px-6 py-2.5 text-label text-sm hover:bg-muted transition-colors"
                >
                  Back
                </button>
              ) : (
                <div />
              )}
              {step < steps.length - 1 ? (
                <button
                  type="button"
                  onClick={() => setStep(step + 1)}
                  className="bg-primary text-primary-foreground px-6 py-2.5 text-label text-sm hover:bg-primary/90 transition-colors"
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={submitQuestionnaire.isPending}
                  className="bg-primary text-primary-foreground px-6 py-2.5 text-label text-sm hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                  {submitQuestionnaire.isPending ? "Submitting..." : "Submit Questionnaire"}
                </button>
              )}
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
