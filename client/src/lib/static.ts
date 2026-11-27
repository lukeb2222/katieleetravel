// Support for the static (GitHub Pages) build, which has no backend server.
// The Pages workflow sets VITE_STATIC_SITE=true; the normal full-stack build
// leaves it unset and behaves exactly as before.

export const IS_STATIC = import.meta.env.VITE_STATIC_SITE === "true";

/** Router base without a trailing slash ("" at the domain root). */
export const ROUTER_BASE = import.meta.env.BASE_URL.replace(/\/+$/, "");

/** Resolve a file in client/public against the deployed base path. */
export function asset(path: string): string {
  return import.meta.env.BASE_URL + path.replace(/^\/+/, "");
}

export const CONTACT_EMAIL = "Katie.Lee@SmartFlyer.com";

/**
 * With no backend to receive a form, hand the submission to the visitor's
 * own email app as a pre-filled message addressed to Katie.
 */
export function openEmailDraft(subject: string, fields: Record<string, string | number>) {
  const body = Object.entries(fields)
    .filter(([, value]) => String(value).trim() !== "")
    .map(([label, value]) => `${label}: ${value}`)
    .join("\n");
  window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export const EMAIL_DRAFT_TOAST = "Your email app should now be open — press send to finish.";

export type StaticReview = {
  id: number;
  name: string;
  destination: string;
  rating: number;
  title: string | null;
  content: string;
};

/** The published client testimonials, shown when there is no reviews database. */
export const STATIC_REVIEWS: StaticReview[] = [
  {
    name: "David and Cindy",
    destination: "Italy",
    content:
      "Best trip ever! Couldn't have gone any better (unless it was a week longer!). All the hotels, restaurants, activities were great. Can't wait to go back! Thanks so much for your help.",
  },
  {
    name: "Jon and Leigh Ann",
    destination: "Spain + France",
    content:
      "WOW!! Seriously, WOW! You are truly amazing!!! Jon and I had the most amazing, magical honeymoon and owe it all to you!! Thank you so much for everything!! We felt like royalty the entire time. Each hotel was insanely gorgeous, I kept telling Jon that we were in heaven and asking him whether this was actually our lives. The notes that you left for us at each hotel were amazing...and the upgrades in Paris and St. Tropez?!?! Omg! Thank you so, so much! We repeatedly said how great you were on this trip and are so appreciative of all of your efforts. You really helped us create the trip of a lifetime. Thank you, thank you, thank you!!!",
  },
  {
    name: "David and Haley",
    destination: "Indonesia + Japan",
    content:
      "We had such a great time on our honeymoon and can't thank you enough for all of your help -- especially helping with all of the last minute requests we threw at you. We're already excited for our next adventure, whatever that may be, and will most definitely be asking for your help again.",
  },
  {
    name: "Loren and Andrew",
    destination: "Indonesia",
    content:
      "We're finally back from the honeymoon and I just wanted to say thank you for planning such an amazing trip! We had the absolute best time. Nihi was completely incredible and we really loved everywhere we went, stayed, all the meals, etc. It was perfect! Thank you again and we can't wait to work with you on our future trips!",
  },
  {
    name: "Jen and Greg",
    destination: "Italy",
    content: "Katie - It was simply the best trip of our lives!",
  },
  {
    name: "Matt and Haley",
    destination: "Japan",
    content:
      "Thanks, Katie! The trip was fantastic. I could go on and on about how great it was. We are legit depressed that we're not still in Tokyo :) Thanks so much for planning for us.",
  },
  {
    name: "Tyler and Caitlin",
    destination: "South of France + Paris",
    content:
      "Thank YOU for an amazing trip! It was such an awesome experience and really happy with how it turned out. Really enjoyed every part, but Paris was probably our favorite. Excited to do another trip next summer!!",
  },
  {
    name: "Megan and Tyler",
    destination: "Bali",
    content:
      "We absolutely loved Bali! There was so much to do and we feel like it's a place we could go back to next year and still have plenty to do and see. So thank you for all the great recommendations and planning! We had an absolute blast and already want to go back!",
  },
].map((review, index) => ({ id: index + 1, rating: 5, title: null, ...review }));
