import { NextResponse } from 'next/server';
import { generateAssistantAnswer } from '@/lib/assistant/answer';

export const runtime = 'nodejs';

type AssistantRequestBody = {
  question?: string;
  history?: Array<{ role: 'user' | 'assistant'; content: string }>;
};

const JSON_UTF8 = { 'Content-Type': 'application/json; charset=utf-8' };

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as AssistantRequestBody;
    const question = body.question?.trim() ?? '';
    const history = Array.isArray(body.history) ? body.history : [];

    if (!question) {
      return NextResponse.json({ error: 'Question is required.' }, { status: 400, headers: JSON_UTF8 });
    }

    const { answer } = await generateAssistantAnswer(question, 'en', history);

    return NextResponse.json({ answer, language: 'en' }, { headers: JSON_UTF8 });
  } catch {
    return NextResponse.json(
      { error: 'Unable to generate a response right now. Please try again.' },
      { status: 500, headers: JSON_UTF8 }
    );
  }
}
