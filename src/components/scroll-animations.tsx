"use client";

import { useEffect } from "react";

export function ScrollAnimations() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!("IntersectionObserver" in window)) return;

    const elements = Array.from(
      document.querySelectorAll(
        ".lp-step, .lp-feature, .lp-testimonial"
      )
    );

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            obs.unobserve(entry.target); // stop observing once visible
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -100px 0px",
      }
    );

    elements.forEach((el) => observer.observe(el));

    const handleScroll = () => {
      const heroBg = document.querySelector(".lp-hero-bg");
      if (!heroBg) return;

      const scrolled = window.scrollY;
      heroBg.style.transform = `translateY(${scrolled * 0.5}px)`;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return null;
}
