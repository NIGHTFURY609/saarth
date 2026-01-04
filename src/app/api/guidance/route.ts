import { NextResponse } from 'next/server';
import { generateSteps } from '@/lib/llm';

export async function POST(req: Request) {
  const { serviceName, language } = await req.json();
  const steps = await generateSteps(serviceName, language);
  return NextResponse.json({ steps });
}