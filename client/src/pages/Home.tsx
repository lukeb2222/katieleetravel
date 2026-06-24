import { useEffect, useRef, useState } from "react";
import { Link } from "wouter";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { trpc } from "@/lib/trpc";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { ArrowRight, Globe, Star, Heart, MapPin, Calendar, Plane, Quote } from "lucide-react";

const HERO_IMAGES = [
  "/images/hero-1.jpg",
  "/images/hero-2.jpg",
  "/images/hero-3.jpg",
];

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

function TestimonialCarousel() {
  const { data: reviews, isLoading } = trpc.reviews.approved.useQuery();
  const [currentIndex, setCurrentIndex] = useState(0);
  const testimonials = reviews || [];

  useEffect(() => {
    if (testimonials.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  if (isLoading) {
    return (
      <section className="py-24 md:py-32 bg-secondary/50">
        <div className="container max-w-4xl text-center">
          <Quote className="mx-auto mb-6 text-primary/30 animate-pulse" size={48} strokeWidth={1} />
          <div className="h-24 flex items-center justify-center">
            <div className="w-3/4 h-4 bg-primary/10 rounded animate-pulse" />
          </div>
        </div>
      </section>
    );
  }

  if (testimonials.length === 0) return null;

  const current = testimonials[currentIndex];

  return (
    <section className="py-24 md:py-32 bg-secondary/50">
      <div className="container max-w-4xl text-center">
        <FadeInSection>
          <Quote className="mx-auto mb-6 text-primary/30" size={48} strokeWidth={1} />
          <div className="relative min-h-[200px] flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
                className="absolute inset-0 flex flex-col items-center justify-center"
              >
                <p className="font-serif text-xl md:text-2xl text-foreground/80 italic leading-relaxed mb-6 px-4">
                  "{current?.content?.length > 200 ? current.content.substring(0, 200) + '...' : current?.content}"
                </p>
                <div className="flex items-center gap-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} className="fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-sm font-medium text-foreground">{current?.name}</p>
                {current?.destination && (
                  <p className="text-xs text-muted-foreground mt-1">{current.destination}</p>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Dots */}
          <div className="flex justify-center gap-2 mt-8">
            {testimonials.map((_: any, i: number) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  currentIndex === i ? "bg-primary w-5" : "bg-primary/20"
                }`}
              />
            ))}
          </div>

          <Link
            href="/reviews"
            className="inline-flex items-center gap-2 mt-8 text-label text-primary hover:text-foreground transition-colors"
          >
            Read All Reviews <ArrowRight size={14} />
          </Link>
        </FadeInSection>
      </div>
    </section>
  );
}

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen">
      <Navigation />

      {/* Hero Section */}
      <section className="relative h-screen overflow-hidden">
        {HERO_IMAGES.map((img, i) => (
          <div
            key={img}
            className="absolute inset-0 transition-opacity duration-1000 ease-out-smooth"
            style={{ opacity: currentSlide === i ? 1 : 0 }}
          >
            <img src={img} alt="" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/30" />
          </div>
        ))}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-4">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-label mb-4 tracking-[0.25em]"
          >
            Expert Luxury Travel Planning
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="font-serif text-5xl md:text-7xl lg:text-8xl font-normal italic mb-6"
          >
            For Those Who Travel with Intention
          </motion.h1>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.8 }}
          >
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 border border-white/80 px-8 py-3 text-label text-white hover:bg-white hover:text-foreground transition-all duration-300"
            >
              Start Planning <ArrowRight size={16} />
            </Link>
          </motion.div>
        </div>

        {/* Slide indicators */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3">
          {HERO_IMAGES.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                currentSlide === i ? "bg-white w-6" : "bg-white/50"
              }`}
            />
          ))}
        </div>
      </section>

      {/* Mission Statement */}
      <section className="py-24 md:py-32">
        <div className="container max-w-4xl text-center">
          <FadeInSection>
            <Globe className="mx-auto mb-6 text-primary" size={32} strokeWidth={1} />
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl leading-tight mb-6">
              A boutique global travel agency creating custom luxury vacations worldwide.
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed max-w-2xl mx-auto">
              Katie Lee Travel Co. offers personalized travel planning and concierge services that make your trip effortless, seamless and luxurious. As a Virtuoso and SmartFlyer affiliate, we provide VIP access to the world's finest hotels and experiences.
            </p>
          </FadeInSection>
        </div>
      </section>

      {/* Services Section - Split Layout */}
      <section className="py-16 md:py-24 bg-secondary/50">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <FadeInSection>
              <img
                src="/images/services-image.jpg"
                alt="Luxury travel destination"
                className="w-full h-[500px] object-cover rounded-lg"
              />
            </FadeInSection>
            <FadeInSection delay={0.2}>
              <p className="text-label text-primary mb-4">What We Offer</p>
              <h2 className="font-serif text-3xl md:text-4xl mb-6">
                Full-Service Travel Planning at Its Finest
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-8">
                When you book with us, you are a VIP at the top luxury hotels in the world receiving outstanding service, the best rooms and special amenities like complimentary upgrades, free breakfast and spa services offered only to our clients.
              </p>
              <div className="space-y-4">
                {[
                  { icon: Star, text: "VIP hotel access & complimentary upgrades" },
                  { icon: Heart, text: "Personalized concierge services" },
                  { icon: MapPin, text: "Curated destination experiences" },
                ].map(({ icon: Icon, text }, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <Icon size={18} className="text-primary shrink-0" strokeWidth={1.5} />
                    <span className="text-foreground/80">{text}</span>
                  </div>
                ))}
              </div>
              <Link
                href="/about"
                className="inline-flex items-center gap-2 mt-8 text-label text-primary hover:text-foreground transition-colors"
              >
                Learn More <ArrowRight size={14} />
              </Link>
            </FadeInSection>
          </div>
        </div>
      </section>

      {/* How It Works - 6 Steps */}
      <section className="py-24 md:py-32">
        <div className="container">
          <FadeInSection>
            <div className="text-center mb-16">
              <p className="text-label text-primary mb-4">The Process</p>
              <h2 className="font-serif text-3xl md:text-4xl">
                From Wanderlust to Bon Voyage
              </h2>
            </div>
          </FadeInSection>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              { step: "01", title: "Contact Us", desc: "Reach out and tell us about your dream trip." },
              { step: "02", title: "Questionnaire", desc: "Complete our travel questionnaire so we understand your style." },
              { step: "03", title: "Consultation", desc: "Schedule a meeting or call to discuss your vision." },
              { step: "04", title: "Planning", desc: "We craft a personalized itinerary tailored to you." },
              { step: "05", title: "Bookings", desc: "We handle all reservations with VIP access." },
              { step: "06", title: "Bon Voyage", desc: "Enjoy your trip with 24/7 concierge support." },
            ].map((item, i) => (
              <FadeInSection key={i} delay={i * 0.1}>
                <div className="text-center p-6">
                  <span className="font-serif text-4xl text-primary/30 block mb-3">{item.step}</span>
                  <h3 className="font-serif text-xl mb-2">{item.title}</h3>
                  <p className="text-muted-foreground text-sm">{item.desc}</p>
                </div>
              </FadeInSection>
            ))}
          </div>
        </div>
      </section>

      {/* Our Team Section */}
      <section className="py-24 md:py-32 bg-[#2d3b2d] text-white">
        <div className="container">
          <FadeInSection>
            <div className="text-center mb-16">
              <p className="text-label text-white/50 mb-4">Our Team</p>
              <h2 className="font-serif text-3xl md:text-4xl text-white">
                Meet the Experts
              </h2>
            </div>
          </FadeInSection>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto">
            <FadeInSection delay={0.1}>
              <div className="text-center">
                <img
                  src="/images/katie-photo.jpg"
                  alt="Katie Tseng Mohammed"
                  className="w-48 h-48 rounded-full object-cover mx-auto mb-6 border-2 border-white/20"
                />
                <h3 className="font-serif text-2xl mb-2">Katie Tseng Mohammed</h3>
                <p className="text-label text-white/50 mb-4">Founder</p>
                <p className="text-white/70 text-sm leading-relaxed">
                  Born and raised in the Bay Area, Katie is meticulous, creative and has a fine eye for detail. She is constantly seeking out new destinations and unique experiences so her clients can have the most memorable vacations.
                </p>
              </div>
            </FadeInSection>
            <FadeInSection delay={0.2}>
              <div className="text-center">
                <img
                  src="/images/shelby-photo.jpg"
                  alt="Shelby Marie Karros"
                  className="w-48 h-48 rounded-full object-cover mx-auto mb-6 border-2 border-white/20"
                />
                <h3 className="font-serif text-2xl mb-2">Shelby Marie Karros</h3>
                <p className="text-label text-white/50 mb-4">Travel Advisor</p>
                <p className="text-white/70 text-sm leading-relaxed">
                  A former tax accountant from Southern California, Shelby's passion for travel allows her to help clients fulfill their dreams. Her favorite destinations include Italy, France, Greece, and white sand beaches around the globe.
                </p>
              </div>
            </FadeInSection>
          </div>
        </div>
      </section>

      {/* Hotel Portal CTA */}
      <section className="py-24 md:py-32">
        <div className="container max-w-3xl text-center">
          <FadeInSection>
            <Plane className="mx-auto mb-6 text-primary" size={32} strokeWidth={1} />
            <h2 className="font-serif text-3xl md:text-4xl mb-4">
              Book a Hotel Directly
            </h2>
            <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
              Prefer to browse and book on your own? Access our Virtuoso portal for exclusive rates and VIP amenities at the world's finest hotels.
            </p>
            <a
              href="https://www.virtuoso.com/advisor/katiemohammed"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-3 text-label hover:bg-primary/90 transition-colors duration-200"
            >
              Browse Hotels <ArrowRight size={16} />
            </a>
          </FadeInSection>
        </div>
      </section>

      {/* Featured Testimonials */}
      <TestimonialCarousel />

      {/* Partner Logos */}
      <section className="py-12 border-t border-border">
        <div className="container">
          <FadeInSection>
            <div className="flex items-center justify-center gap-12 md:gap-20 opacity-70">
              <img src="/images/virtuoso-logo.png" alt="Virtuoso" className="h-10 md:h-12 object-contain" />
              <img src="/images/smartflyer-logo.png" alt="SmartFlyer" className="h-10 md:h-12 object-contain" />
            </div>
          </FadeInSection>
        </div>
      </section>

      <Footer />
    </div>
  );
}
