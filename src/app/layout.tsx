import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Fraunces, DM_Sans } from "next/font/google";
import { Providers } from "@/components/providers";
import { NavbarScroll } from "@/components/navbar-scroll";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Return to Roots | African Cultural Immersion & Heritage Travel, Starting in Ghana",
  description:
    "African cultural immersion and heritage journeys, starting in Ghana. Curated experiences, storytelling, and guided 2–4 week immersion for the diaspora.",
  openGraph: {
    title: "Return to Roots — African Cultural Immersion, Starting in Ghana",
    description:
      "Curated heritage journeys across Africa, starting in Ghana. Community, storytelling, and guided immersion for the diaspora.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${fraunces.variable} ${dmSans.variable}`}>
      <body>
        <Providers>
          <NavbarScroll />
          <header className="lp-navbar">
            <div className="lp-navbar-container">
              <Link href="/" className="lp-navbar-brand">
                <Image
                  src="/logo.png"
                  alt="Return to Roots"
                  width={76}
                  height={76}
                  className="lp-navbar-logo"
                  priority
                />
              </Link>
              <nav className="lp-navbar-nav">
                <a href="#how-it-works" className="lp-navbar-link">How It Works</a>
                <a href="#start-journey" className="lp-navbar-cta">Start Journey</a>
              </nav>
            </div>
          </header>
          <main id="main">{children}</main>
          {/* <footer className="footer">
            <div className="footer-top">
              <div className="shell">
                <div className="footer-grid">
                  <div className="footer-brand">
                    <Link href="/" className="footer-brand-name">Return to Roots</Link>
                    <span className="footer-pill" aria-hidden="true">Ghana · Africa</span>
                    <p className="footer-tagline">
                      African cultural immersion and heritage travel, starting in Ghana. Curated experiences,
                      storytelling, and guided journeys for the diaspora.
                    </p>
                  </div>
                  <div className="footer-col">
                    <h3 className="footer-heading">Explore</h3>
                    <ul className="footer-links">
                      <li><Link href="/">Home</Link></li>
                      <li><Link href="/#what-we-do">What we do</Link></li>
                      <li><Link href="/experiences">Journeys</Link></li>
                      <li><Link href="/learn">Learn</Link></li>
                      <li><Link href="/community">Community</Link></li>
                      <li><Link href="/pricing">Pricing</Link></li>
                      <li><Link href="/long-term">Long-term stay</Link></li>
                    </ul>
                  </div>
                  <div className="footer-col">
                    <h3 className="footer-heading">Connect</h3>
                    <ul className="footer-links">
                      <li><Link href="/request">Journey inquiry</Link></li>
                      <li><Link href="/request?type=residency">Residency consultation</Link></li>
                      <li><Link href="/#start-journey" className="footer-cta">Start your journey</Link></li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <div className="footer-bottom">
              <div className="shell">
                <p className="footer-copy">© {new Date().getFullYear()} Return to Roots</p>
                <p className="footer-tag">African cultural immersion · Starting in Ghana</p>
              </div>
            </div>
          </footer> */}
        {/* </div> */}
        </Providers>
      </body>
    </html>
  );
}
