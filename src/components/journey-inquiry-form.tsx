"use client";

import { useState } from "react";

export function JourneyInquiryForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    preferredDates: "",
    duration: "",
    interests: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      // Try API route first
      const response = await fetch("/api/inquiry", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitStatus("success");
        setIsSubmitting(false);
        // Reset form after showing success
        setTimeout(() => {
          setFormData({
            name: "",
            email: "",
            phone: "",
            preferredDates: "",
            duration: "",
            interests: "",
            message: "",
          });
          setSubmitStatus("idle");
        }, 5000);
      } else {
        throw new Error("API submission failed");
      }
    } catch (error) {
      // Fallback to mailto if API fails
      try {
        const emailBody = `
New Journey Inquiry from Return to Roots Website

Name: ${formData.name}
Email: ${formData.email}
Phone: ${formData.phone || "Not provided"}

Preferred Dates: ${formData.preferredDates || "Not specified"}
Duration: ${formData.duration || "Not specified"}

Interests:
${formData.interests || "Not specified"}

Message:
${formData.message || "No additional message"}
        `.trim();

        const mailtoLink = `mailto:hello@returntoroots.com?subject=New Journey Inquiry from ${encodeURIComponent(formData.name)}&body=${encodeURIComponent(emailBody)}`;
        window.location.href = mailtoLink;
        
        setSubmitStatus("success");
        setIsSubmitting(false);
        setTimeout(() => {
          setFormData({
            name: "",
            email: "",
            phone: "",
            preferredDates: "",
            duration: "",
            interests: "",
            message: "",
          });
          setSubmitStatus("idle");
        }, 3000);
      } catch (fallbackError) {
        setSubmitStatus("error");
        setIsSubmitting(false);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="lp-inquiry-form">
      <div className="lp-form-grid">
        <div className="lp-form-field">
          <label htmlFor="name" className="lp-form-label">
            Full Name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            className="lp-form-input"
            placeholder="Your name"
          />
        </div>

        <div className="lp-form-field">
          <label htmlFor="email" className="lp-form-label">
            Email Address *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
            className="lp-form-input"
            placeholder="your.email@example.com"
          />
        </div>

        <div className="lp-form-field">
          <label htmlFor="phone" className="lp-form-label">
            Phone Number
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="lp-form-input"
            placeholder="+1 (555) 000-0000"
          />
        </div>

        <div className="lp-form-field">
          <label htmlFor="duration" className="lp-form-label">
            Preferred Duration
          </label>
          <select
            id="duration"
            name="duration"
            value={formData.duration}
            onChange={handleChange}
            className="lp-form-input"
          >
            <option value="">Select duration</option>
            <option value="2 weeks">2 weeks</option>
            <option value="3 weeks">3 weeks</option>
            <option value="4 weeks">4 weeks</option>
            <option value="flexible">Flexible</option>
          </select>
        </div>

        <div className="lp-form-field lp-form-field-full">
          <label htmlFor="preferredDates" className="lp-form-label">
            Preferred Travel Dates
          </label>
          <input
            type="text"
            id="preferredDates"
            name="preferredDates"
            value={formData.preferredDates}
            onChange={handleChange}
            className="lp-form-input"
            placeholder="e.g., March 2025 or Q2 2025"
          />
        </div>

        <div className="lp-form-field lp-form-field-full">
          <label htmlFor="interests" className="lp-form-label">
            What are you most interested in?
          </label>
          <textarea
            id="interests"
            name="interests"
            value={formData.interests}
            onChange={handleChange}
            className="lp-form-input"
            rows={3}
            placeholder="e.g., Learning Ga language, visiting Cape Coast, homestay experience..."
          />
        </div>

        <div className="lp-form-field lp-form-field-full">
          <label htmlFor="message" className="lp-form-label">
            Additional Message
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            className="lp-form-input"
            rows={4}
            placeholder="Tell us more about what you're looking for..."
          />
        </div>
      </div>

      {submitStatus === "success" && (
        <div className="lp-form-success">
          Thank you! Your inquiry has been submitted. We&apos;ll be in touch within 1–2 business days.
        </div>
      )}

      {submitStatus === "error" && (
        <div className="lp-form-error">
          Something went wrong. Please try again or email us directly at hello@returntoroots.com
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="lp-btn lp-btn-primary lp-btn-large lp-form-submit"
      >
        {isSubmitting ? "Submitting..." : "Submit Inquiry"}
      </button>

      <p className="lp-form-note">
        * Required fields. By submitting this form, you agree to be contacted by Return to Roots.
      </p>
    </form>
  );
}
