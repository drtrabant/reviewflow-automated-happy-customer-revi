typescript
"use client";

import React, { useState, useEffect, useRef } from "react";

// ============================================
// StarRating - Animated 5-star display
// ============================================
interface StarRatingProps {
  rating: number;
  maxStars?: number;
  size?: "sm" | "md" | "lg" | "xl";
  animated?: boolean;
  interactive?: boolean;
  onRate?: (rating: number) => void;
}

export function StarRating({
  rating,
  maxStars = 5,
  size = "md",
  animated = true,
  interactive = false,
  onRate,
}: StarRatingProps) {
  const [displayRating, setDisplayRating] = useState(animated ? 0 : rating);
  const [hoverRating, setHoverRating] = useState(0);

  useEffect(() => {
    if (!animated) {
      setDisplayRating(rating);
      return;
    }
    let current = 0;
    const step = rating / 20;
    const interval = setInterval(() => {
      current += step;
      if (current >= rating) {
        setDisplayRating(rating);
        clearInterval(interval);
      } else {
        setDisplayRating(current);
      }
    }, 30);
    return () => clearInterval(interval);
  }, [rating, animated]);

  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
    xl: "w-10 h-10",
  };

  const activeRating = hoverRating || displayRating;

  return (
    <div className="flex items-center gap-0.5" role="img" aria-label={`${rating} out of ${maxStars} stars`}>
      {Array.from({ length: maxStars }, (_, i) => {
        const starIndex = i + 1;
        const fillPercent = Math.min(1, Math.max(0, activeRating - i));

        return (
          <button
            key={i}
            type="button"
            disabled={!interactive}
            className={`relative ${sizeClasses[size]} ${
              interactive ? "cursor-pointer hover:scale-110 transition-transform" : "cursor-default"
            } ${animated ? "transition-all duration-300" : ""}`}
            style={{
              animationDelay: animated ? `${i * 100}ms` : undefined,
            }}
            onClick={() => interactive && onRate?.(starIndex)}
            onMouseEnter={() => interactive && setHoverRating(starIndex)}
            onMouseLeave={() => interactive && setHoverRating(0)}
            aria-label={interactive ? `Rate ${starIndex} stars` : undefined}
          >
            {/* Empty star (background) */}
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="#D1D5DB"
              strokeWidth="1.5"
              className={`absolute inset-0 ${sizeClasses[size]}`}
            >
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
            {/* Filled star (foreground with clip) */}
            <div
              className="absolute inset-0 overflow-hidden"
              style={{ width: `${fillPercent * 100}%` }}
            >
              <svg
                viewBox="0 0 24 24"
                fill="#FBBF24"
                stroke="#F59E0B"
                strokeWidth="1.5"
                className={sizeClasses[size]}
              >
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            </div>
          </button>
        );
      })}
    </div>
  );
}

// ============================================
// ChatBubble - SMS-style message bubbles
// ============================================
interface ChatBubbleProps {
  message: string;
  sender: "business" | "customer" | "system";
  timestamp?: string;
  animated?: boolean;
  delay?: number;
}

export function ChatBubble({
  message,
  sender,
  timestamp,
  animated = false,
  delay = 0,
}: ChatBubbleProps) {
  const [visible, setVisible] = useState(!animated);

  useEffect(() => {
    if (!animated) return;
    const timer = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(timer);
  }, [animated, delay]);

  if (!visible) return <div className="h-0" />;

  const isOutgoing = sender === "business";
  const isSystem = sender === "system";

  if (isSystem) {
    return (
      <div
        className={`flex justify-center my-2 ${
          animated ? "animate-fade-in" : ""
        }`}
      >
        <span className="text-xs text-gray-400 bg-gray-50 rounded-full px-3 py-1">
          {message}
        </span>
      </div>
    );
  }

  return (
    <div
      className={`flex ${isOutgoing ? "justify-end" : "justify-start"} mb-2 ${
        animated ? "animate-slide-up" : ""
      }`}
    >
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-2.5 ${
          isOutgoing
            ? "bg-blue-500 text-white rounded-br-md"
            : "bg-gray-100 text-gray-900 rounded-bl-md"
        }`}
      >
        <p className="text-sm leading-relaxed whitespace-pre-wrap">{message}</p>
        {timestamp && (
          <p
            className={`text-[10px] mt-1 ${
              isOutgoing ? "text-blue-100" : "text-gray-400"
            }`}
          >
            {timestamp}
          </p>
        )}
      </div>
    </div>
  );
}

// ============================================
// MetricCard - Big number + trend arrow
// ============================================
interface MetricCardProps {
  label: string;
  value: string | number;
  trend?: {
    direction: "up" | "down" | "neutral";
    value: string;
  };
  icon?: React.ReactNode;
  size?: "sm" | "md" | "lg";
}

export function MetricCard({
  label,
  value,
  trend,
  icon,
  size = "md",
}: MetricCardProps) {
  const valueSizes = {
    sm: "text-2xl",
    md: "text-4xl",
    lg: "text-5xl",
  };

  const trendColors = {
    up: "text-emerald-600 bg-emerald-50",
    down: "text-red-600 bg-red-50",
    neutral: "text-gray-500 bg-gray-50",
  };

  const trendArrows = {
    up: "↑",
    down: "↓",
    neutral: "→",
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-2">
        <span className="text-sm font-medium text-gray-500 uppercase tracking-wide">
          {label}
        </span>
        {icon && <span className="text-gray-400">{icon}</span>}
      </div>
      <div className="flex items-end gap-3">
        <span
          className={`${valueSizes[size]} font-bold text-gray-900 tabular-nums leading-none`}
        >
          {value}
        </span>
        {trend && (
          <span
            className={`inline-flex items-center gap-0.5 text-sm font-semibold px-2 py-0.5 rounded-full ${
              trendColors[trend.direction]
            }`}
          >
            {trendArrows[trend.direction]} {trend.value}
          </span>
        )}
      </div>
    </div>
  );
}

// ============================================
// PricingCard - Tier display with features
// ============================================
interface PricingCardProps {
  name: string;
  price: string;
  period?: string;
  description: string;
  features: string[];
  highlighted?: boolean;
  badge?: string;
  ctaText?: string;
  onCtaClick?: () => void;
}

export function PricingCard({
  name,
  price,
  period = "/month",
  description,
  features,
  highlighted = false,
  badge,
  ctaText = "Get Started",
  onCtaClick,
}: PricingCardProps) {
  return (
    <div
      className={`relative rounded-2xl p-8 ${
        highlighted
          ? "bg-blue-600 text-white ring-4 ring-blue-600/20 shadow-xl scale-[1.02]"
          : "bg-white text-gray-900 border border-gray-200 shadow-sm"
      } transition-all hover:shadow-lg`}
    >
      {badge && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
          <span className="bg-amber-400 text-amber-900 text-xs font-bold uppercase tracking-wide px-3 py-1 rounded-full">
            {badge}
          </span>
        </div>
      )}

      <div className="mb-6">
        <h3
          className={`text-lg font-semibold mb-1 ${
            highlighted ? "text-blue-100" : "text-gray-500"
          }`}
        >
          {name}
        </h3>
        <div className="flex items-baseline gap-1">
          <span className="text-4xl font-bold">{price}</span>
          {period && (
            <span
              className={`text-sm ${
                highlighted ? "text-blue-200" : "text-gray-400"
              }`}
            >
              {period}
            </span>
          )}
        </div>
        <p
          className={`mt-2 text-sm ${
            highlighted ? "text-blue-100" : "text-gray-500"
          }`}
        >
          {description}
        </p>
      </div>

      <ul className="space-y-3 mb-8">
        {features.map((feature, i) => (
          <li key={i} className="flex items-start gap-2.5">
            <svg
              className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                highlighted ? "text-blue-200" : "text-emerald-500"
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
            <span