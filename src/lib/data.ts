const PEXELS = "https://images.pexels.com/photos";

function pexels(id: number, w = 800) {
  return `${PEXELS}/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${w}`;
}

export type JourneyTheme = "gold" | "teal" | "accent";

export type ExperienceItem = {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  duration: string;
  durationWeeks: [number, number];
  location: string;
  region: "accra" | "coastal" | "kumasi" | "multi";
  focus: string;
  description: string;
  highlights: readonly string[];
  included: readonly string[];
  image: string;
  imageAlt: string;
  theme: JourneyTheme;
  priceRange: string;
  bestFor: readonly string[];
  bestTime: string;
};

export const EXPERIENCE_HIGHLIGHTS: ExperienceItem[] = [
  {
    id: "accra-immersion",
    slug: "accra-immersion",
    title: "Accra Immersion",
    tagline: "Live like family in the capital",
    duration: "2–3 weeks",
    durationWeeks: [2, 3],
    location: "Greater Accra",
    region: "accra",
    focus: "Ga culture, homestays, markets",
    description:
      "Stay with a local family in Greater Accra, learn Ga culture and history, and explore markets and traditional ceremonies. Designed for those who want to live like family—not tourists.",
    highlights: ["Local family homestay", "Ga culture & history", "Market tours", "Traditional ceremonies"],
    included: ["Homestay accommodation", "Local coordinator", "Cultural orientation", "Market & community visits"],
    image: pexels(1422408),
    imageAlt: "Accra cityscape and culture",
    theme: "gold",
    priceRange: "From $1,800",
    bestFor: ["First-time visitors", "Solo travelers", "Couples"],
    bestTime: "Year-round",
  },
  {
    id: "heritage-history",
    slug: "heritage-history",
    title: "Heritage & History",
    tagline: "Walk the path of ancestors",
    duration: "3–4 weeks",
    durationWeeks: [3, 4],
    location: "Coastal & Central",
    region: "coastal",
    focus: "Cape Coast, Elmina, ancestral storytelling",
    description:
      "Cape Coast and Elmina, kente weaving, and festival participation. Ancestral storytelling and guided visits to historic sites. For those ready to walk the path of ancestors.",
    highlights: ["Cape Coast & Elmina", "Ancestral storytelling", "Kente weaving", "Festival participation"],
    included: ["Accommodation", "Heritage site visits", "Kente workshop", "Elder-led storytelling sessions"],
    image: pexels(3075993),
    imageAlt: "Cape Coast and heritage sites",
    theme: "teal",
    priceRange: "From $2,400",
    bestFor: ["Families", "Heritage seekers", "Groups"],
    bestTime: "Sep–Dec, Feb–Apr",
  },
  {
    id: "roots-reconnection",
    slug: "roots-reconnection",
    title: "Roots Reconnection",
    tagline: "Go deep into Ashanti land",
    duration: "2–4 weeks",
    durationWeeks: [2, 4],
    location: "Kumasi & beyond",
    region: "kumasi",
    focus: "Ashanti kingdom, village stays",
    description:
      "Village stays, language immersion, and elder-led rituals in Kumasi and beyond. Deepen your connection to Ashanti kingdom heritage with hands-on experiences and community-centred learning.",
    highlights: ["Ashanti kingdom heritage", "Village stays", "Language immersion", "Elder-led rituals"],
    included: ["Village homestay", "Language lessons", "Elder-led rituals", "Kingdom heritage visits"],
    image: pexels(13634354),
    imageAlt: "Kente and Ashanti culture",
    theme: "accent",
    priceRange: "From $2,100",
    bestFor: ["Language learners", "Deep immersion", "Solo & small groups"],
    bestTime: "Year-round",
  },
  {
    id: "ghana-highlights",
    slug: "ghana-highlights",
    title: "Ghana Highlights",
    tagline: "Accra, coast, and Kumasi in one journey",
    duration: "3–4 weeks",
    durationWeeks: [3, 4],
    location: "Accra · Coast · Kumasi",
    region: "multi",
    focus: "Multi-region introduction",
    description:
      "A curated introduction across Ghana: homestay in Accra, heritage sites on the coast, and time in Kumasi. Ideal for first-time visitors who want a broad taste before committing to a deeper single-region journey.",
    highlights: ["Accra homestay", "Cape Coast & Elmina", "Kumasi visit", "Flexible pacing"],
    included: ["All accommodation", "Inter-city transport", "Local coordinators", "Cultural orientation"],
    image: pexels(1422408),
    imageAlt: "Ghana cultural journey",
    theme: "gold",
    priceRange: "From $3,200",
    bestFor: ["First-time visitors", "Limited time", "Overview seekers"],
    bestTime: "Sep–Apr",
  },
];

export const EXPERIENCES = EXPERIENCE_HIGHLIGHTS;

export function getExperienceBySlug(slug: string): ExperienceItem | null {
  return EXPERIENCES.find((e) => e.slug === slug) ?? null;
}

export function getAllExperienceSlugs(): string[] {
  return EXPERIENCES.map((e) => e.slug);
}

export function getSimilarJourneys(current: ExperienceItem, limit = 2): ExperienceItem[] {
  return EXPERIENCES.filter((e) => e.slug !== current.slug)
    .sort((a, b) => {
      const sameTheme = (x: ExperienceItem) => (x.theme === current.theme ? 1 : 0);
      const sameRegion = (x: ExperienceItem) => (x.region === current.region ? 1 : 0);
      const score = (x: ExperienceItem) => sameTheme(x) * 2 + sameRegion(x);
      return score(b) - score(a);
    })
    .slice(0, limit);
}

export const DURATION_FILTERS = [
  { value: "all", label: "Any duration" },
  { value: "2-3", label: "2–3 weeks" },
  { value: "3-4", label: "3–4 weeks" },
  { value: "2-4", label: "2–4 weeks" },
] as const;

export const REGION_FILTERS = [
  { value: "all", label: "All regions" },
  { value: "accra", label: "Greater Accra" },
  { value: "coastal", label: "Coastal & Central" },
  { value: "kumasi", label: "Kumasi & beyond" },
  { value: "multi", label: "Multi-region" },
] as const;

export type DurationFilter = (typeof DURATION_FILTERS)[number]["value"];
export type RegionFilter = (typeof REGION_FILTERS)[number]["value"];

export function filterExperiences(
  duration: DurationFilter,
  region: RegionFilter
): ExperienceItem[] {
  return EXPERIENCES.filter((e) => {
    const matchDuration =
      duration === "all" ||
      (duration === "2-3" && e.durationWeeks[0] === 2 && e.durationWeeks[1] === 3) ||
      (duration === "3-4" && e.durationWeeks[0] === 3 && e.durationWeeks[1] === 4) ||
      (duration === "2-4" && e.durationWeeks[0] === 2 && e.durationWeeks[1] === 4);
    const matchRegion = region === "all" || e.region === region;
    return matchDuration && matchRegion;
  });
}

export const TESTIMONIALS = [
  {
    quote:
      "Finally, a way to reconnect that didn't feel like a tour bus. I stayed with a family, learned names of foods I'd only heard in stories, and left with a deeper sense of who I am.",
    author: "Michelle T.",
    origin: "Washington, D.C.",
    avatar: pexels(13786953, 150),
  },
  {
    quote:
      "I wanted my kids to understand where we come from. Return to Roots made it possible—authentic, respectful, and guided every step of the way.",
    author: "James K.",
    origin: "Atlanta, GA",
    avatar: pexels(2379004, 150),
  },
  {
    quote:
      "Not touristy. Not superficial. Just real connections, real people, and a journey I'll carry for life.",
    author: "Amina S.",
    origin: "Brooklyn, NY",
    avatar: pexels(1181686, 150),
  },
] as const;

export const HERO_IMAGE = pexels(13634354, 1600);
export const HERO_IMAGE_ALT = "African cultural immersion—heritage journeys starting in Ghana";

export type PlanId = "explorer" | "immersion" | "legacy";

export const SUBSCRIPTION_PLANS = [
  {
    id: "explorer" as PlanId,
    name: "Explorer",
    tagline: "Dip your toes",
    price: 29,
    period: "month",
    description: "Curated content, community access, and early booking for journeys.",
    features: [
      "Access to cultural content library",
      "Community feed & member directory",
      "Early access to new experiences",
      "Monthly live Q&A sessions",
      "Newsletter & journey prep guides",
    ],
    cta: "Start Explorer",
    highlighted: false,
  },
  {
    id: "immersion" as PlanId,
    name: "Immersion",
    tagline: "Most popular",
    price: 79,
    period: "month",
    description: "Everything in Explorer, plus dedicated journey support and exclusive events.",
    features: [
      "Everything in Explorer",
      "Dedicated journey coordinator",
      "Exclusive in-person & virtual events",
      "Discounts on experiences (10%)",
      "Priority booking for group journeys",
    ],
    cta: "Start Immersion",
    highlighted: true,
  },
  {
    id: "legacy" as PlanId,
    name: "Legacy",
    tagline: "Deep commitment",
    price: 199,
    period: "month",
    description: "Full concierge experience, residency guidance, and lifetime community benefits.",
    features: [
      "Everything in Immersion",
      "Full concierge for 2–4 week journeys",
      "Residency & long‑stay consultation",
      "20% off all experiences",
      "Lifetime community access",
    ],
    cta: "Start Legacy",
    highlighted: false,
  },
] as const;

export type SubscriptionPlan = (typeof SUBSCRIPTION_PLANS)[number];

export function getPlanById(id: string): SubscriptionPlan | null {
  return SUBSCRIPTION_PLANS.find((p) => p.id === id) ?? null;
}

export const COMMUNITY_STORIES = [
  {
    id: "s1",
    author: "Michelle T.",
    origin: "Washington, D.C.",
    avatar: pexels(13786953, 96),
    title: "First week in Accra",
    excerpt: "Homestay family showed me how to cook waakye. Never thought I'd cry over rice and beans.",
    image: pexels(1422408, 600),
    date: "2 weeks ago",
    tags: ["Accra", "Homestay", "Food"],
    journeySlug: "accra-immersion",
    journeyTitle: "Accra Immersion",
  },
  {
    id: "s2",
    author: "James K.",
    origin: "Atlanta, GA",
    avatar: pexels(2379004, 96),
    title: "Cape Coast with my daughter",
    excerpt: "We walked through the doors together. She asked the questions I couldn't form at her age.",
    image: pexels(3075993, 600),
    date: "1 month ago",
    tags: ["Heritage", "Family", "Cape Coast"],
    journeySlug: "heritage-history",
    journeyTitle: "Heritage & History",
  },
  {
    id: "s3",
    author: "Amina S.",
    origin: "Brooklyn, NY",
    avatar: pexels(1181686, 96),
    title: "Kente weavers in Kumasi",
    excerpt: "Spent a morning learning the patterns. Each one carries a story. I'm still processing.",
    image: pexels(13634354, 600),
    date: "3 weeks ago",
    tags: ["Kumasi", "Kente", "Craft"],
    journeySlug: "roots-reconnection",
    journeyTitle: "Roots Reconnection",
  },
] as const;

export const COMMUNITY_MEMBERS = [
  { name: "Michelle T.", location: "D.C. → Accra", avatar: pexels(13786953, 80), journey: "Accra Immersion", journeySlug: "accra-immersion" },
  { name: "James K.", location: "Atlanta → Cape Coast", avatar: pexels(2379004, 80), journey: "Heritage & History", journeySlug: "heritage-history" },
  { name: "Amina S.", location: "Brooklyn → Kumasi", avatar: pexels(2739792, 80), journey: "Roots Reconnection", journeySlug: "roots-reconnection" },
  { name: "David M.", location: "Houston → Ghana", avatar: pexels(2379004, 80), journey: "Exploring", journeySlug: "ghana-highlights" },
  { name: "Keisha L.", location: "Chicago → Accra", avatar: pexels(2739792, 80), journey: "Accra Immersion", journeySlug: "accra-immersion" },
] as const;

export type ContentTheme = "heritage" | "language" | "daily-life" | "history" | "craft";

export type CulturalContentItem = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  type: "article";
  theme: ContentTheme;
  region: string;
  readTime: string;
  image: string;
  imageAlt: string;
};

export const CULTURAL_CONTENT: CulturalContentItem[] = [
  {
    id: "c1",
    slug: "ga-greetings-everyday-phrases",
    title: "Ga greetings and everyday phrases",
    excerpt: "Start with the basics: how to greet, thank, and show respect in Ga—the language of Greater Accra.",
    body: "Ga is one of the main languages of Greater Accra. Learning a few phrases before you arrive—especially greetings like \"Good morning\" (Maakye) and \"Thank you\" (Na wo)—shows respect and opens doors. Elders and homestay families appreciate the effort. This short guide covers essential greetings, how to address people by age and role, and simple phrases for market and home.",
    type: "article",
    theme: "language",
    region: "accra",
    readTime: "5 min",
    image: pexels(1422408, 600),
    imageAlt: "Accra street life",
  },
  {
    id: "c2",
    slug: "cape-coast-elmina-brief-history",
    title: "Cape Coast and Elmina: a brief history",
    excerpt: "Understanding the forts and their place in history—before you walk through the doors.",
    body: "The castles at Cape Coast and Elmina are UNESCO World Heritage sites and places of profound significance for the diaspora. Understanding their history—the transatlantic trade, resistance, and the role of these buildings—helps visitors approach with the right context. We recommend reading and reflecting before you go, and going with guides who honour both the history and the emotions these spaces carry.",
    type: "article",
    theme: "heritage",
    region: "coastal",
    readTime: "8 min",
    image: pexels(3075993, 600),
    imageAlt: "Cape Coast",
  },
  {
    id: "c3",
    slug: "kente-patterns-meaning",
    title: "Kente: patterns and meaning",
    excerpt: "An introduction to kente cloth—colors, symbols, and the stories woven in.",
    body: "Kente cloth is woven in the Ashanti and Ewe traditions. Each pattern and colour carries meaning—from royalty and spirituality to community and nature. Learning the basics before you visit weavers in Kumasi or the coast deepens the experience. You'll start to read the stories in the cloth and understand why it's often worn at important ceremonies and family gatherings.",
    type: "article",
    theme: "craft",
    region: "kumasi",
    readTime: "6 min",
    image: pexels(13634354, 600),
    imageAlt: "Kente weaving",
  },
  {
    id: "c4",
    slug: "homestay-etiquette-what-to-expect",
    title: "Homestay etiquette and what to expect",
    excerpt: "How to show respect, participate in daily life, and build trust with your host family.",
    body: "Staying with a local family is at the heart of many Return to Roots journeys. Showing respect through small actions—asking before taking photos, helping with light tasks, dressing appropriately, and learning names and greetings—builds trust. This guide covers what to expect, how to offer help, and how to navigate meals and shared spaces so you feel like part of the family, not a guest passing through.",
    type: "article",
    theme: "daily-life",
    region: "accra",
    readTime: "4 min",
    image: pexels(1422408, 600),
    imageAlt: "Community and family",
  },
  {
    id: "c5",
    slug: "ashanti-kingdom-short-overview",
    title: "Ashanti kingdom: a short overview",
    excerpt: "The Golden Stool, the king, and why Kumasi remains the heart of Ashanti culture.",
    body: "The Asante (Ashanti) kingdom has a rich history of governance, symbolism, and resistance. The Golden Stool, the role of the Asantehene, and the importance of Kumasi in Ghana's past and present are central to understanding the region. This overview gives you the context you need before visiting Kumasi—so that when you meet elders and participate in ceremonies, you have a foundation to build on.",
    type: "article",
    theme: "history",
    region: "kumasi",
    readTime: "7 min",
    image: pexels(13634354, 600),
    imageAlt: "Ashanti culture",
  },
];

export const CONTENT_THEMES: { value: ContentTheme; label: string }[] = [
  { value: "heritage", label: "Heritage" },
  { value: "language", label: "Language" },
  { value: "daily-life", label: "Daily life" },
  { value: "history", label: "History" },
  { value: "craft", label: "Craft" },
];

export function getContentBySlug(slug: string): CulturalContentItem | null {
  return CULTURAL_CONTENT.find((c) => c.slug === slug) ?? null;
}

export function getAllContentSlugs(): string[] {
  return CULTURAL_CONTENT.map((c) => c.slug);
}
