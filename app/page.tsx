typescript
"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

// Star animation component
function AnimatedStars() {
  const [stars, setStars] = useState<
    { id: number; x: number; y: number; delay: number; size: number }[]
  >([]);

  useEffect(() => {
    const generated = Array.from({ length: 12 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 3,
      size: 12 + Math.random() * 20,
    }));
    setStars(generated);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {stars.map((star) => (
        <div
          key={star.id}
          className="absolute animate-float text-yellow-400 opacity-60"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            animationDelay: `${star.delay}s`,
            fontSize: `${star.size}px`,
          }}
        >
          ★
        </div>
      ))}
    </div>
  );
}

// Phone mockup showing SMS flow
function PhoneMockup() {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setStep(1), 1500),
      setTimeout(() => setStep(2), 3000),
      setTimeout(() => setStep(3), 4500),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="relative mx-auto w-[260px] sm:w-[280px]">
      {/* Phone frame */}
      <div className="bg-gray-900 rounded-[2.5rem] p-3 shadow-2xl">
        <div className="bg-white rounded-[2rem] overflow-hidden">
          {/* Status bar */}
          <div className="bg-gray-100 px-6 py-2 flex justify-between items-center text-[10px] text-gray-500">
            <span>9:41 AM</span>
            <div className="w-16 h-4 bg-gray-900 rounded-full mx-auto" />
            <span>5G 🔋</span>
          </div>
          {/* SMS conversation */}
          <div className="p-4 min-h-[340px] flex flex-col justify-end space-y-3">
            <div
              className={`transition-all duration-500 ${
                step >= 1
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-4"
              }`}
            >
              <div className="bg-blue-500 text-white rounded-2xl rounded-br-sm px-4 py-2.5 text-sm max-w-[85%] ml-auto">
                Mike from Delgado Plumbing hopes you&apos;re happy with the
                work! Tap to share your experience 👇
              </div>
              <div className="text-[10px] text-gray-400 text-right mt-1">
                starcatch.io/r/mike
              </div>
            </div>

            <div
              className={`transition-all duration-500 ${
                step >= 2
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-4"
              }`}
            >
              <div className="bg-gray-100 rounded-2xl rounded-bl-sm px-4 py-2.5 text-sm max-w-[85%]">
                ★★★★★
                <br />
                <span className="text-gray-600">
                  Mike was fantastic! Fixed our leak same day. Highly recommend!
                </span>
              </div>
            </div>

            <div
              className={`transition-all duration-500 ${
                step >= 3
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-4"
              }`}
            >
              <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-2.5 text-sm text-green-700 flex items-center gap-2">
                <span className="text-lg">✓</span>
                <span>Review posted to Google!</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Animated counter
function AnimatedCounter({
  end,
  duration = 2000,
  prefix = "",
  suffix = "",
}: {
  end: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
}) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const startTime = Date.now();
          const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.round(eased * end));
            if (progress < 1) requestAnimationFrame(animate);
          };
          animate();
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end, duration]);

  return (
    <span ref={ref}>
      {prefix}
      {count}
      {suffix}
    </span>
  );
}

// Testimonial card
function TestimonialCard({
  name,
  business,
  location,
  quote,
  reviewsBefore,
  reviewsAfter,
  rating,
}: {
  name: string;
  business: string;
  location: string;
  quote: string;
  reviewsBefore: number;
  reviewsAfter: number;
  rating: number;
  image?: string;
}) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col h-full">
      <div className="flex items-center gap-1 mb-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <span
            key={i}
            className={`text-lg ${
              i < rating ? "text-yellow-400" : "text-gray-200"
            }`}
          >
            ★
          </span>
        ))}
      </div>
      <p className="text-gray-700 text-sm leading-relaxed mb-4 flex-1">
        &ldquo;{quote}&rdquo;
      </p>
      <div className="flex items-center justify-between border-t border-gray-50 pt-4">
        <div>
          <p className="font-semibold text-gray-900 text-sm">{name}</p>
          <p className="text-gray-500 text-xs">
            {business} · {location}
          </p>
        </div>
        <div className="text-right">
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-gray-400">{reviewsBefore}</span>
            <span className="text-green-500">→</span>
            <span className="text-green-600 font-bold text-sm">
              {reviewsAfter}
            </span>
          </div>
          <p className="text-[10px] text-gray-400">Google reviews</p>
        </div>
      </div>
    </div>
  );
}

export default function LandingPage() {
  const [email, setEmail] = useState("");
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [mobileCtaVisible, setMobileCtaVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setMobileCtaVisible(window.scrollY > 600);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const validateEmail = (value: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(value);
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError("");

    const sanitized = email.trim().toLowerCase();
    if (!sanitized) {
      setEmailError("Please enter your email address.");
      return;
    }
    if (!validateEmail(sanitized)) {
      setEmailError("Please enter a valid email address.");
      return;
    }

    // In production, this would POST to an API route
    setEmailSubmitted(true);
  };

  return (
    <>
      <style jsx global>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
            opacity: 0.4;
          }
          25% {
            opacity: 0.7;
          }
          50% {
            transform: translateY(-20px) rotate(10deg);
            opacity: 0.6;
          }
          75% {
            opacity: 0.3;
          }
        }
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
      `}</style>

      <div className="min-h-screen bg-white">
        {/* Navigation */}
        <nav className="fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-md z-50 border-b border-gray-100">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-2xl">⭐</span>
              <span className="font-bold text-xl text-gray-900">
                star<span className="text-yellow-500">catch</span>
              </span>
            </div>
            <div className="hidden sm:flex items-center gap-6 text-sm text-gray-600">
              <a href="#how-it-works" className="hover:text-gray-900 transition">
                How It Works
              </a>
              <a href="#pricing" className="hover:text-gray-900 transition">
                Pricing
              </a>
              <Link
                href="/login"
                className="text-gray-600 hover:text-gray-900 transition"
              >
                Log In
              </Link>
              <Link
                href="/signup"
                className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold px-5 py-2.5 rounded-full text-sm transition shadow-sm"
              >
                Get Started Free
              </Link>
            </div>
            <Link
              href="/signup"
              className="sm:hidden bg-yellow-400 hover:bg-yellow-500