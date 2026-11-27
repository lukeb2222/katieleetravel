import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { trpc } from "@/lib/trpc";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { toast } from "sonner";
import { CheckCircle } from "lucide-react";
import { EMAIL_DRAFT_TOAST, IS_STATIC, openEmailDraft } from "@/lib/static";

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

type FormTab = "message" | "questionnaire";

export default function Contact() {
  const submitContact = trpc.contact.submit.useMutation();
  const submitQuestionnaire = trpc.questionnaire.submit.useMutation();
  const [activeTab, setActiveTab] = useState<FormTab>("message");
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [questionnaireSubmitted, setQuestionnaireSubmitted] = useState(false);

  // Contact form state
  const [contactForm, setContactForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  // Questionnaire form state
  const [step, setStep] = useState(0);
  const [qForm, setQForm] = useState({
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

  const updateQField = (field: string, value: string) => {
    setQForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (IS_STATIC) {
      openEmailDraft(contactForm.subject || "Travel inquiry", {
        Name: `${contactForm.firstName} ${contactForm.lastName}`,
        Email: contactForm.email,
        Phone: contactForm.phone,
        Message: contactForm.message,
      });
      toast.success(EMAIL_DRAFT_TOAST);
      return;
    }
    try {
      await submitContact.mutateAsync(contactForm);
      toast.success("Message sent! We'll be in touch soon.");
      setContactSubmitted(true);
    } catch {
      toast.error("Something went wrong. Please try again.");
    }
  };

  const handleQuestionnaireSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (IS_STATIC) {
      openEmailDraft("Travel questionnaire", {
        Name: `${qForm.firstName} ${qForm.lastName}`,
        Email: qForm.email,
        Phone: qForm.phone,
        Destination: qForm.destination,
        "Travel dates": qForm.travelDates,
        Flexibility: qForm.flexibility,
        Travelers: qForm.travelers,
        Budget: qForm.budget,
        Occasion: qForm.occasion,
        "Accommodation style": qForm.accommodationStyle,
        Interests: qForm.interests,
        "Dietary needs": qForm.dietaryNeeds,
        "Mobility needs": qForm.mobilityNeeds,
        "Additional notes": qForm.additionalNotes,
      });
      toast.success(EMAIL_DRAFT_TOAST);
      return;
    }
    try {
      await submitQuestionnaire.mutateAsync(qForm);
      toast.success("Questionnaire submitted successfully!");
      setQuestionnaireSubmitted(true);
    } catch {
      toast.error("Something went wrong. Please try again.");
    }
  };

  const questionnaireSteps = [
    {
      title: "About You",
      fields: (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-label text-xs block mb-2">First Name *</label>
              <input type="text" required value={qForm.firstName} onChange={(e) => updateQField("firstName", e.target.value)} className="w-full border border-border rounded-md px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary bg-white" />
            </div>
            <div>
              <label className="text-label text-xs block mb-2">Last Name *</label>
              <input type="text" required value={qForm.lastName} onChange={(e) => updateQField("lastName", e.target.value)} className="w-full border border-border rounded-md px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary bg-white" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-label text-xs block mb-2">Email *</label>
              <input type="email" required value={qForm.email} onChange={(e) => updateQField("email", e.target.value)} className="w-full border border-border rounded-md px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary bg-white" />
            </div>
            <div>
              <label className="text-label text-xs block mb-2">Phone</label>
              <input type="tel" value={qForm.phone} onChange={(e) => updateQField("phone", e.target.value)} className="w-full border border-border rounded-md px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary bg-white" />
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
            <input type="text" value={qForm.destination} onChange={(e) => updateQField("destination", e.target.value)} className="w-full border border-border rounded-md px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary bg-white" placeholder="e.g. Italy, Maldives, or 'Surprise me!'" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-label text-xs block mb-2">Preferred Travel Dates</label>
              <input type="text" value={qForm.travelDates} onChange={(e) => updateQField("travelDates", e.target.value)} className="w-full border border-border rounded-md px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary bg-white" placeholder="e.g. March 15-25, 2025" />
            </div>
            <div>
              <label className="text-label text-xs block mb-2">Date Flexibility</label>
              <select value={qForm.flexibility} onChange={(e) => updateQField("flexibility", e.target.value)} className="w-full border border-border rounded-md px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary bg-white">
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
              <input type="text" value={qForm.travelers} onChange={(e) => updateQField("travelers", e.target.value)} className="w-full border border-border rounded-md px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary bg-white" placeholder="e.g. 2 adults, 1 child" />
            </div>
            <div>
              <label className="text-label text-xs block mb-2">Budget Range</label>
              <select value={qForm.budget} onChange={(e) => updateQField("budget", e.target.value)} className="w-full border border-border rounded-md px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary bg-white">
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
            <input type="text" value={qForm.occasion} onChange={(e) => updateQField("occasion", e.target.value)} className="w-full border border-border rounded-md px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary bg-white" placeholder="e.g. Anniversary, Honeymoon, Birthday" />
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
            <textarea value={qForm.accommodationStyle} onChange={(e) => updateQField("accommodationStyle", e.target.value)} rows={3} className="w-full border border-border rounded-md px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary resize-none bg-white" placeholder="e.g. Luxury resort, Boutique hotel, Overwater villa, Private villa..." />
          </div>
          <div>
            <label className="text-label text-xs block mb-2">Interests & Activities</label>
            <textarea value={qForm.interests} onChange={(e) => updateQField("interests", e.target.value)} rows={3} className="w-full border border-border rounded-md px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary resize-none bg-white" placeholder="e.g. Fine dining, Spa, Adventure, Culture, Beach, Wine tasting..." />
          </div>
          <div>
            <label className="text-label text-xs block mb-2">Dietary Needs or Restrictions</label>
            <input type="text" value={qForm.dietaryNeeds} onChange={(e) => updateQField("dietaryNeeds", e.target.value)} className="w-full border border-border rounded-md px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary bg-white" placeholder="e.g. Vegetarian, Gluten-free, Allergies" />
          </div>
          <div>
            <label className="text-label text-xs block mb-2">Mobility or Accessibility Needs</label>
            <input type="text" value={qForm.mobilityNeeds} onChange={(e) => updateQField("mobilityNeeds", e.target.value)} className="w-full border border-border rounded-md px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary bg-white" />
          </div>
          <div>
            <label className="text-label text-xs block mb-2">Anything Else We Should Know?</label>
            <textarea value={qForm.additionalNotes} onChange={(e) => updateQField("additionalNotes", e.target.value)} rows={4} className="w-full border border-border rounded-md px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary resize-none bg-white" placeholder="Any other preferences, must-haves, or things to avoid..." />
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen">
      <Navigation />

      {/* Hero - Matching OG minimal style */}
      <section className="pt-32 pb-8 md:pt-40 md:pb-12">
        <div className="container max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <p className="text-foreground/80 text-lg leading-relaxed mb-2">
              Katie Lee Travel Co. is based in the<br />
              San Francisco Bay Area.
            </p>
            <p className="text-foreground/80 text-lg leading-relaxed">
              Say Hello:<br />
              <a href="mailto:Katie.Lee@SmartFlyer.com" className="text-primary hover:underline">
                Katie.Lee@SmartFlyer.com
              </a>
            </p>
          </motion.div>
        </div>
      </section>

      {/* Tab Selector */}
      <section className="py-8">
        <div className="container max-w-2xl">
          <FadeInSection>
            <div className="flex gap-1 bg-secondary rounded-lg p-1 mb-8">
              <button
                onClick={() => setActiveTab("message")}
                className={`flex-1 py-2.5 text-label text-sm rounded-md transition-all duration-200 ${
                  activeTab === "message"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Send a Message
              </button>
              <button
                onClick={() => setActiveTab("questionnaire")}
                className={`flex-1 py-2.5 text-label text-sm rounded-md transition-all duration-200 ${
                  activeTab === "questionnaire"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Travel Questionnaire
              </button>
            </div>
          </FadeInSection>
        </div>
      </section>

      {/* Contact Form */}
      {activeTab === "message" && (
        <section className="pb-16 md:pb-24">
          <div className="container max-w-2xl">
            {contactSubmitted ? (
              <FadeInSection>
                <div className="text-center py-16">
                  <CheckCircle className="mx-auto mb-6 text-primary" size={48} />
                  <h2 className="font-serif text-3xl mb-4">Thank You</h2>
                  <p className="text-muted-foreground">
                    We've received your message and will get back to you shortly.
                  </p>
                </div>
              </FadeInSection>
            ) : (
              <FadeInSection>
                <form onSubmit={handleContactSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-label text-xs block mb-2">First Name *</label>
                      <input
                        type="text"
                        required
                        value={contactForm.firstName}
                        onChange={(e) => setContactForm({ ...contactForm, firstName: e.target.value })}
                        className="w-full border-b border-border bg-transparent px-0 py-2.5 text-sm focus:outline-none focus:border-primary transition-colors"
                      />
                    </div>
                    <div>
                      <label className="text-label text-xs block mb-2">Last Name *</label>
                      <input
                        type="text"
                        required
                        value={contactForm.lastName}
                        onChange={(e) => setContactForm({ ...contactForm, lastName: e.target.value })}
                        className="w-full border-b border-border bg-transparent px-0 py-2.5 text-sm focus:outline-none focus:border-primary transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-label text-xs block mb-2">Email *</label>
                      <input
                        type="email"
                        required
                        value={contactForm.email}
                        onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                        className="w-full border-b border-border bg-transparent px-0 py-2.5 text-sm focus:outline-none focus:border-primary transition-colors"
                      />
                    </div>
                    <div>
                      <label className="text-label text-xs block mb-2">Phone</label>
                      <input
                        type="tel"
                        value={contactForm.phone}
                        onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                        className="w-full border-b border-border bg-transparent px-0 py-2.5 text-sm focus:outline-none focus:border-primary transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-label text-xs block mb-2">Subject</label>
                    <input
                      type="text"
                      value={contactForm.subject}
                      onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                      className="w-full border-b border-border bg-transparent px-0 py-2.5 text-sm focus:outline-none focus:border-primary transition-colors"
                    />
                  </div>

                  <div>
                    <label className="text-label text-xs block mb-2">Message *</label>
                    <textarea
                      required
                      rows={5}
                      value={contactForm.message}
                      onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                      className="w-full border-b border-border bg-transparent px-0 py-2.5 text-sm focus:outline-none focus:border-primary transition-colors resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitContact.isPending}
                    className="bg-primary text-primary-foreground px-8 py-3 text-label hover:bg-primary/90 transition-colors disabled:opacity-50"
                  >
                    {submitContact.isPending ? "Sending..." : "Send Message"}
                  </button>
                </form>
              </FadeInSection>
            )}
          </div>
        </section>
      )}

      {/* Questionnaire Form */}
      {activeTab === "questionnaire" && (
        <section className="pb-16 md:pb-24">
          <div className="container max-w-2xl">
            {questionnaireSubmitted ? (
              <FadeInSection>
                <div className="text-center py-16">
                  <CheckCircle className="mx-auto mb-6 text-primary" size={48} />
                  <h1 className="font-serif text-3xl mb-4">Thank You!</h1>
                  <p className="text-muted-foreground leading-relaxed">
                    Your travel questionnaire has been submitted. Katie will review your preferences and be in touch soon to start planning your dream trip.
                  </p>
                </div>
              </FadeInSection>
            ) : (
              <FadeInSection>
                <div className="text-center mb-8">
                  <p className="text-muted-foreground text-sm">
                    Help us understand your travel style so we can create the perfect trip for you.
                  </p>
                </div>

                {/* Progress */}
                <div className="flex items-center justify-center gap-2 mb-10">
                  {questionnaireSteps.map((_, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-colors ${
                          i <= step ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {i + 1}
                      </div>
                      {i < questionnaireSteps.length - 1 && (
                        <div className={`w-12 h-0.5 ${i < step ? "bg-primary" : "bg-muted"}`} />
                      )}
                    </div>
                  ))}
                </div>

                <form onSubmit={handleQuestionnaireSubmit}>
                  <motion.div
                    key={step}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h2 className="font-serif text-2xl mb-6">{questionnaireSteps[step].title}</h2>
                    {questionnaireSteps[step].fields}
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
                    {step < questionnaireSteps.length - 1 ? (
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
              </FadeInSection>
            )}
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}
