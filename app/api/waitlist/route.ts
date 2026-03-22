typescript
import { NextRequest, NextResponse } from "next/server";
import { readFile, writeFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import path from "path";

// In-memory rate limiting
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 5;

interface WaitlistEntry {
  email: string;
  business_type: string;
  created_at: string;
  ip: string;
}

const DATA_DIR = path.join(process.cwd(), "data");
const WAITLIST_FILE = path.join(DATA_DIR, "waitlist.json");

function isValidEmail(email: string): boolean {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email) && email.length <= 320;
}

const ALLOWED_BUSINESS_TYPES = [
  "plumbing",
  "electrical",
  "roofing",
  "remodeling",
  "hvac",
  "landscaping",
  "painting",
  "cleaning",
  "salon",
  "restaurant",
  "auto_repair",
  "dental",
  "veterinary",
  "other",
];

function isValidBusinessType(type: string): boolean {
  return ALLOWED_BUSINESS_TYPES.includes(type);
}

function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  const realIp = request.headers.get("x-real-ip");
  if (realIp) {
    return realIp;
  }
  return "unknown";
}

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }

  entry.count++;
  if (entry.count > RATE_LIMIT_MAX_REQUESTS) {
    return true;
  }

  return false;
}

// Periodic cleanup of stale rate limit entries
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of rateLimitMap.entries()) {
    if (now > value.resetAt) {
      rateLimitMap.delete(key);
    }
  }
}, 5 * 60 * 1000);

async function readWaitlist(): Promise<WaitlistEntry[]> {
  try {
    if (!existsSync(WAITLIST_FILE)) {
      return [];
    }
    const data = await readFile(WAITLIST_FILE, "utf-8");
    return JSON.parse(data);
  } catch {
    return [];
  }
}

async function writeWaitlist(entries: WaitlistEntry[]): Promise<void> {
  if (!existsSync(DATA_DIR)) {
    await mkdir(DATA_DIR, { recursive: true });
  }
  await writeFile(WAITLIST_FILE, JSON.stringify(entries, null, 2), "utf-8");
}

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request);

    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: "Too many requests. Please try again in a minute." },
        { status: 429 }
      );
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid request body." },
        { status: 400 }
      );
    }

    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { error: "Invalid request body." },
        { status: 400 }
      );
    }

    const { email, business_type } = body as Record<string, unknown>;

    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { error: "Email is required." },
        { status: 400 }
      );
    }

    const sanitizedEmail = email.trim().toLowerCase();

    if (!isValidEmail(sanitizedEmail)) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    if (!business_type || typeof business_type !== "string") {
      return NextResponse.json(
        { error: "Business type is required." },
        { status: 400 }
      );
    }

    const sanitizedBusinessType = business_type.trim().toLowerCase();

    if (!isValidBusinessType(sanitizedBusinessType)) {
      return NextResponse.json(
        { error: "Please select a valid business type." },
        { status: 400 }
      );
    }

    const entries = await readWaitlist();

    const isDuplicate = entries.some(
      (entry) => entry.email === sanitizedEmail
    );

    if (isDuplicate) {
      return NextResponse.json(
        {
          status: "duplicate",
          message: "You're already on the waitlist! We'll be in touch soon.",
        },
        { status: 200 }
      );
    }

    const newEntry: WaitlistEntry = {
      email: sanitizedEmail,
      business_type: sanitizedBusinessType,
      created_at: new Date().toISOString(),
      ip,
    };

    entries.push(newEntry);
    await writeWaitlist(entries);

    return NextResponse.json(
      {
        status: "success",
        message: "You're on the list! We'll reach out when your spot is ready.",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Waitlist signup error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}