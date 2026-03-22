"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";

type DemoStep = "idle" | "sending" | "sms-received" | "sentiment" | "google-review" | "complete";

const STEP_DURATIONS: Record<DemoStep, number> = {
  idle: 800,
  sending: 1500,
  "sms-received": 2500,
  sentiment: 2000,
  "google-review": 2500,
  complete: 0,
};

function PhoneFrame({ children, label }: { children: React.ReactNode; label: string }) {
  return (
    <div className="flex flex-col items-center gap-3">
      <span className="text-sm font-medium text-slate-500">{label}</span>
      <div className="relative w-[260px] h-[480px] sm:w-[280px] sm:h-[520px] bg-slate-900 rounded-[2.5rem] p-3 shadow-2xl shadow-slate-900/30">
        {/* Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-6 bg-slate-900 rounded-b-2xl z-10" />
        {/* Screen */}
        <div className="relative w-full h-full bg-white rounded-[2rem] overflow-hidden">
          {children}
        </div>
      </div>
    </div>
  );
}

function StarRating({ filled, animate }: { filled: number; animate: boolean }) {
  return (
    <div className="flex gap-1 justify-center">
      {[1, 2, 3, 4, 5].map((star) => (
        <motion.span
          key={star}
          initial={animate ? { scale: 0, rotate: -180 } : { scale: 1 }}
          animate={
            star <= filled
              ? { scale: 1, rotate: 0, color: "#f59e0b" }
              : { scale: 1, rotate: 0, color: "#e2e8f0" }
          }
          transition={{
            delay: animate ? star * 0.15 : 0,
            type: "spring",
            stiffness: 300,
            damping: 15,
          }}
          className="text-2xl sm:text-3xl"
        >
          ★
        </motion.span>
      ))}
    </div>
  );
}

function ContractorScreen({ step, onSend }: { step: DemoStep; onSend: () => void }) {
  const isSending = step === "sending";
  const isSent = ["sms-received", "sentiment", "google-review", "complete"].includes(step);

  return (
    <div className="flex flex-col h-full">
      {/* Status bar */}
      <div className="flex items-center justify-between px-5 pt-8 pb-2">
        <span className="text-xs text-slate-400">9:41 AM</span>
        <div className="flex gap-1">
          <div className="w-4 h-2 bg-slate-300 rounded-sm" />
          <div className="w-4 h-2 bg-slate-300 rounded-sm" />
          <div className="w-4 h-2 bg-green-400 rounded-sm" />
        </div>
      </div>

      {/* App header */}
      <div className="px-4 pt-2 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
            <span className="text-white text-xs font-bold">★</span>
          </div>
          <span className="text-sm font-bold text-slate-800">StarCatch</span>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col px-4 pt-6">
        <h3 className="text-base font-bold text-slate-800 mb-1">Send Review Request</h3>
        <p className="text-xs text-slate-500 mb-5">Customer will receive an SMS in seconds</p>

        {/* Customer name */}
        <label className="text-xs font-medium text-slate-600 mb-1.5">Customer Name</label>
        <div className="w-full h-10 bg-slate-50 border border-slate-200 rounded-xl px-3 flex items-center mb-4">
          <span className="text-sm text-slate-700">Sarah Johnson</span>
        </div>

        {/* Phone number */}
        <label className="text-xs font-medium text-slate-600 mb-1.5">Phone Number</label>
        <div className="w-full h-10 bg-slate-50 border border-slate-200 rounded-xl px-3 flex items-center mb-6">
          <span className="text-sm text-slate-700">(512) 555-0189</span>
        </div>

        {/* Job type */}
        <label className="text-xs font-medium text-slate-600 mb-1.5">Service</label>
        <div className="w-full h-10 bg-slate-50 border border-slate-200 rounded-xl px-3 flex items-center mb-8">
          <span className="text-sm text-slate-700">Kitchen remodel ✓</span>
        </div>

        {/* Send button */}
        <motion.button
          onClick={onSend}
          disabled={isSending || isSent}
          whileTap={!isSending && !isSent ? { scale: 0.95 } : {}}
          className={`w-full h-12 rounded-2xl font-semibold text-sm transition-all duration-300 ${
            isSent
              ? "bg-green-500 text-white"
              : isSending
              ? "bg-amber-400 text-white"
              : "bg-gradient-to-r from-amber-400 to-orange-500 text-white shadow-lg shadow-amber-500/30 hover:shadow-amber-500/50"
          }`}
        >
          <AnimatePresence mode="wait">
            {isSent ? (
              <motion.span
                key="sent"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
                Sent!
              </motion.span>
            ) : isSending ? (
              <motion.span
                key="sending"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center justify-center gap-2"
              >
                <motion.span
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                  className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                />
                Sending...
              </motion.span>
            ) : (
              <motion.span key="default" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                Send Review Request →
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </div>

      {/* Bottom indicator bar */}
      <div className="flex justify-center pb-3">
        <div className="w-28 h-1 bg-slate-200 rounded-full" />
      </div>
    </div>
  );
}

function CustomerScreen({ step }: { step: DemoStep }) {
  const showSms = ["sms-received", "sentiment", "google-review", "complete"].includes(step);
  const showSentiment = ["sentiment", "google-review", "complete"].includes(step);
  const showGoogle = ["google-review", "complete"].includes(step);

  return (
    <div className="flex flex-col h-full">
      {/* Status bar */}
      <div className="flex items-center justify-between px-5 pt-8 pb-2">
        <span className="text-xs text-slate-400">9:41 AM</span>
        <div className="flex gap-1">
          <div className="w-4 h-2 bg-slate-300 rounded-sm" />
          <div className="w-4 h-2 bg-slate-300 rounded-sm" />
          <div className="w-4 h-2 bg-green-400 rounded-sm" />
        </div>
      </div>

      {/* SMS View */}
      <AnimatePresence mode="wait">
        {!showSms && (
          <motion.div
            key="empty"
            className="flex-1 flex flex-col items-center justify-center px-6"
          >
            <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
            </div>
            <p className="text-sm text-slate-400 text-center">Waiting for message...</p>
          </motion.div>
        )}

        {showSms && !showSentiment && (
          <motion.div
            key="sms"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex-1 flex flex-col px-4 pt-2"
          >
            {/* SMS header */}
            <div className="flex items-center gap-3 pb-3 border-b border-slate-100 mb-4">
              <div className="w-9 h-9 rounded-full bg-green-500 flex items-center justify-center">
                <span className="text-white text-sm font-bold">D</span>
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-800">Delgado Plumbing</p>
                <p className="text-xs text-slate-400">(512) 555-0101</p>
              </div>
            </div>

            {/* Chat bubble */}
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.3,