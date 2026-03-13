import Image from "next/image";
import Link from "next/link";
import { HERO_IMAGE, HERO_IMAGE_ALT, TESTIMONIALS } from "@/lib/data";
import { ScrollAnimations } from "@/components/scroll-animations";
import { JourneyInquiryForm } from "@/components/journey-inquiry-form";
import "./landing-page.css";

export default function HomePage() {
  return (
    <div className="single-page-landing">
      <ScrollAnimations />
      {/* Hero Section */}
      <section aria-labelledby="hero-heading" className="lp-hero">
        <div className="lp-hero-bg">
          <Image
            src={HERO_IMAGE}
            alt={HERO_IMAGE_ALT}
            fill
            priority
            sizes="100vw"
            className="lp-hero-img"
          />
          <div className="lp-hero-overlay" />
        </div>
        <div className="lp-hero-content">
          <div className="lp-hero-badge">
            <span>African Cultural Immersion</span>
            <span className="lp-hero-badge-dot">·</span>
            <span>Starting in Ghana</span>
          </div>
          <h1 id="hero-heading" className="lp-hero-title">
            Reconnect with Your Roots
          </h1>
          <p className="lp-hero-subtitle">
            Curated heritage journeys across Africa, starting in Ghana. Authentic storytelling, education, and guided cultural immersion for the diaspora.
          </p>
          <div className="lp-hero-actions">
            <a href="#start-journey" className="lp-btn lp-btn-primary">
              Begin Your Journey
            </a>
            <a href="#how-it-works" className="lp-btn lp-btn-secondary">
              How It Works
            </a>
          </div>
          <div className="lp-hero-stats">
            <div className="lp-stat">
              <div className="lp-stat-number">2-4</div>
              <div className="lp-stat-label">Week Journeys</div>
            </div>
            <div className="lp-stat">
              <div className="lp-stat-number">100+</div>
              <div className="lp-stat-label">Travelers</div>
            </div>
            <div className="lp-stat">
              <div className="lp-stat-number">100%</div>
              <div className="lp-stat-label">Authentic</div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem/Solution */}
      <section className="lp-problem">
        <div className="lp-container">
          <div className="lp-problem-content">
            <p className="lp-tagline">
              You can relax on a beach anywhere. You can only return to your roots once.
            </p>
            <h2 className="lp-section-title">Not a Tour. A Journey Home.</h2>
            <p className="lp-section-text">
              Most travel experiences treat you like a tourist. We treat you like family returning home. 
              Every journey is crafted with elders, historians, and local communities—not tour operators.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="lp-how">
        <div className="lp-container">
          <div className="lp-section-header">
            <h2 className="lp-section-title">How It Works</h2>
            <p className="lp-section-subtitle">Three simple steps to begin your journey</p>
          </div>
          <div className="lp-steps">
            <div className="lp-step">
              <div className="lp-step-number">01</div>
              <h3 className="lp-step-title">Submit Your Inquiry</h3>
              <p className="lp-step-text">
                Tell us about your interests, timeline, and what you hope to discover. No commitment required.
              </p>
            </div>
            <div className="lp-step">
              <div className="lp-step-number">02</div>
              <h3 className="lp-step-title">We Craft Your Journey</h3>
              <p className="lp-step-text">
                We connect you with local coordinators, homestay families, and cultural guides who understand your needs.
              </p>
            </div>
            <div className="lp-step">
              <div className="lp-step-number">03</div>
              <h3 className="lp-step-title">Begin Your Journey</h3>
              <p className="lp-step-text">
                Experience authentic cultural immersion, learn from elders, and reconnect with your heritage.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="lp-features">
        <div className="lp-container">
          <div className="lp-section-header">
            <h2 className="lp-section-title">What Makes Us Different</h2>
            <p className="lp-section-subtitle">Authentic experiences designed for the diaspora</p>
          </div>
          <div className="lp-features-grid">
            <div className="lp-feature">
              <div className="lp-feature-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2L2 7l10 5 10-5-10-5z" />
                  <path d="M2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
              </div>
              <h3 className="lp-feature-title">Authentic Storytelling</h3>
              <p className="lp-feature-text">
                Stories from elders and communities—not tourist scripts. Real narratives that honor truth and tradition.
              </p>
            </div>
            <div className="lp-feature">
              <div className="lp-feature-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                </svg>
              </div>
              <h3 className="lp-feature-title">Cultural Education</h3>
              <p className="lp-feature-text">
                Learn language, customs, and history in context—before, during, and after your visit.
              </p>
            </div>
            <div className="lp-feature">
              <div className="lp-feature-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </div>
              <h3 className="lp-feature-title">Homestay Experiences</h3>
              <p className="lp-feature-text">
                Live with local families, not in hotels. Build real connections and experience daily life authentically.
              </p>
            </div>
            <div className="lp-feature">
              <div className="lp-feature-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
              </div>
              <h3 className="lp-feature-title">Local Coordinators</h3>
              <p className="lp-feature-text">
                Every journey includes a dedicated local coordinator who understands both cultures and your needs.
              </p>
            </div>
            <div className="lp-feature">
              <div className="lp-feature-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
              </div>
              <h3 className="lp-feature-title">Ongoing Support</h3>
              <p className="lp-feature-text">
                We&apos;re with you before, during, and after your journey. Questions? We&apos;re here to help.
              </p>
            </div>
            <div className="lp-feature">
              <div className="lp-feature-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
              </div>
              <h3 className="lp-feature-title">Flexible Pricing</h3>
              <p className="lp-feature-text">
                Journeys starting from $1,800. We work with you to create an experience that fits your budget.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="lp-testimonials">
        <div className="lp-container">
          <div className="lp-section-header">
            <h2 className="lp-section-title">Stories from the Journey</h2>
            <p className="lp-section-subtitle">Real experiences from the diaspora</p>
          </div>
          <div className="lp-testimonials-grid">
            {TESTIMONIALS.map((testimonial, i) => (
              <div key={i} className="lp-testimonial">
                <div className="lp-testimonial-content">
                  <p className="lp-testimonial-quote">&ldquo;{testimonial.quote}&rdquo;</p>
                </div>
                <div className="lp-testimonial-author">
                  <Image
                    src={testimonial.avatar}
                    alt=""
                    width={48}
                    height={48}
                    className="lp-testimonial-avatar"
                  />
                  <div>
                    <div className="lp-testimonial-name">{testimonial.author}</div>
                    <div className="lp-testimonial-location">{testimonial.origin}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Inquiry Form Section */}
      <section id="start-journey" className="lp-inquiry">
        <div className="lp-container">
          <div className="lp-inquiry-header">
            <h2 className="lp-cta-title">Ready to Begin Your Journey?</h2>
            <p className="lp-cta-text">
              Submit an inquiry today. We&apos;ll guide you through dates, preferences, and next steps—so you know exactly what happens after you apply.
            </p>
          </div>
          <div className="lp-inquiry-form-wrapper">
            <JourneyInquiryForm />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="lp-footer">
        <div className="lp-container">
          <div className="lp-footer-content">
            <div className="lp-footer-brand">
              <Link href="/" className="lp-footer-logo-link">
                <Image
                  src="/logo.png"
                  alt="Return to Roots"
                  width={120}
                  height={120}
                  className="lp-footer-logo"
                />
              </Link>
              <p className="lp-footer-tagline">African cultural immersion · Starting in Ghana</p>
            </div>
            <div className="lp-footer-links">
              <a href="mailto:returntorootsafrica@gmail.com" className="lp-footer-link">Contact</a>
              <a href="#how-it-works" className="lp-footer-link">How It Works</a>
              <a href="#start-journey" className="lp-footer-link">Start Journey</a>
            </div>
          </div>
          <div className="lp-footer-bottom">
            <p className="lp-footer-copy">© {new Date().getFullYear()} Return to Roots. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
