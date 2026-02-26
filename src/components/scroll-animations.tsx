"use client";

import { useEffect } from "react";

export function ScrollAnimations() {
  useEffect(() => {
    // Scroll-triggered animations
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -100px 0px",
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        }
      });
    }, observerOptions);

    // Observe all elements with scroll animation classes
    const elements = document.querySelectorAll(".lp-step, .lp-feature, .lp-testimonial");
    elements.forEach((el) => observer.observe(el));

    // Parallax effect for hero image
    const handleScroll = () => {
      const heroBg = document.querySelector(".lp-hero-bg");
      const heroImg = document.querySelector(".lp-hero-img");
      if (heroBg && heroImg) {
        const scrolled = window.pageYOffset;
        const parallaxSpeed = 0.5;
        heroBg.style.transform = `translateY(${scrolled * parallaxSpeed}px)`;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      elements.forEach((el) => observer.unobserve(el));
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return null;
}
