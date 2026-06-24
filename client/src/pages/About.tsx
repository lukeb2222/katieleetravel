import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

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

export default function About() {
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
            About Us
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7 }}
            className="font-serif text-4xl md:text-5xl lg:text-6xl mb-6"
          >
            Full-Service Travel Planning at Its Finest
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="text-muted-foreground text-lg leading-relaxed"
          >
            Katie Lee Travel Co. offers our clients personalized travel planning and concierge services that make your trip effortless, seamless and so luxurious.
          </motion.p>
        </div>
      </section>

      {/* About Content */}
      <section className="py-16 md:py-24 bg-secondary/50">
        <div className="container max-w-5xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <FadeInSection>
              <img
                src="/images/about-katie.jpg"
                alt="Luxury travel"
                className="w-full h-[400px] object-cover rounded-lg"
              />
            </FadeInSection>
            <FadeInSection delay={0.2}>
              <h2 className="font-serif text-3xl mb-6">Our Story</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                When you book with us, you are a VIP at the top luxury hotels in the world receiving outstanding service, the best rooms and special amenities like complimentary upgrades, free breakfast and spa services offered only to our clients.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Katie Lee Travel Co.'s affiliation with luxury travel agency SmartFlyer, a Virtuoso agency, allows us to have special partnerships with the best hotels and vendors worldwide. This means you will have private access to the most exclusive hotels and the full VIP treatment.
              </p>
            </FadeInSection>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-24 md:py-32">
        <div className="container max-w-5xl">
          <FadeInSection>
            <div className="text-center mb-16">
              <p className="text-label text-primary mb-4">Our Team</p>
              <h2 className="font-serif text-3xl md:text-4xl">Meet the Experts</h2>
            </div>
          </FadeInSection>

          {/* Katie */}
          <FadeInSection>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
              <img
                src="/images/katie-photo.jpg"
                alt="Katie Tseng Mohammed"
                className="w-full max-w-sm mx-auto h-[400px] object-cover rounded-lg"
              />
              <div>
                <h3 className="font-serif text-3xl mb-2">Katie Tseng Mohammed</h3>
                <p className="text-label text-primary mb-4">Founder</p>
                <p className="text-muted-foreground leading-relaxed">
                  Katie Lee Travel Co. was created by Katie Tseng Mohammed who was born and raised in the Bay Area. As a dentist, Katie is very meticulous, creative and has a fine eye for detail but she also has a passion for traveling the globe. Katie is constantly seeking out new destinations and unique ends of the earth so her clients can have the most memorable experiences and vacations.
                </p>
              </div>
            </div>
          </FadeInSection>

          {/* Shelby */}
          <FadeInSection>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="order-2 lg:order-1">
                <h3 className="font-serif text-3xl mb-2">Shelby Marie Karros</h3>
                <p className="text-label text-primary mb-4">Travel Advisor</p>
                <p className="text-muted-foreground leading-relaxed">
                  Shelby, a former tax accountant, born and raised in Southern California. She and her husband have two middle school age boys. They have settled into Menlo Park and are enjoying everything the Bay Area has to offer. Her passion for travel has allowed her to help her clients fulfill their dreams and create memories of a lifetime. A few of her favorite destinations are Italy, France and Greece, but she equally loves to explore white sand beaches around the globe.
                </p>
              </div>
              <img
                src="/images/shelby-photo.jpg"
                alt="Shelby Marie Karros"
                className="w-full max-w-sm mx-auto h-[400px] object-cover rounded-lg order-1 lg:order-2"
              />
            </div>
          </FadeInSection>
        </div>
      </section>

      {/* Affiliations */}
      <section className="py-16 bg-secondary/50">
        <div className="container max-w-3xl text-center">
          <FadeInSection>
            <p className="text-label text-primary mb-4">Our Affiliations</p>
            <h2 className="font-serif text-2xl md:text-3xl mb-6">Trusted Partners</h2>
            <p className="text-muted-foreground leading-relaxed">
              As a proud affiliate of both Virtuoso and SmartFlyer, we have access to exclusive partnerships with the world's finest hotels and travel vendors, ensuring our clients receive unparalleled VIP treatment wherever they go.
            </p>
            <div className="flex items-center justify-center gap-12 mt-8 opacity-70">
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
