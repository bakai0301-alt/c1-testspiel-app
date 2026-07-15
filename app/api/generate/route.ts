import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { zodTextFormat } from "openai/helpers/zod";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";

const generationRequestSchema = z.object({
  topic: z.string().trim().min(3).max(120),
  length: z.enum(["kurz", "mittel", "lang"]),
  tone: z.enum(["sachlich", "essayistisch", "reportage"]),
});

const exerciseSchema = z.object({
  title: z.string(),
  subtitle: z.string(),
  topic: z.string(),
  estimatedMinutes: z.number().int(),
  paragraphs: z.array(z.string()).min(5).max(10),
  mcq: z
    .array(
      z.object({
        question: z.string(),
        options: z.array(z.string()).length(4),
        correctIndex: z.number().int().min(0).max(3),
        explanation: z.string(),
      }),
    )
    .length(6),
  evidence: z
    .array(
      z.object({
        statement: z.string(),
        correctAnswer: z.enum(["richtig", "falsch", "nicht_im_text"]),
        explanation: z.string(),
      }),
    )
    .length(6),
  vocabulary: z
    .array(
      z.object({
        term: z.string(),
        article: z.string(),
        meaningEn: z.string(),
        example: z.string(),
      }),
    )
    .length(12),
  vocabularyQuiz: z
    .array(
      z.object({
        sentence: z.string(),
        options: z.array(z.string()).length(4),
        correctIndex: z.number().int().min(0).max(3),
        explanation: z.string(),
      }),
    )
    .length(5),
});

const targetWords = {
  kurz: "650–750",
  mittel: "900–1050",
  lang: "1200–1400",
};

async function authenticate(request: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const token = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");

  if (!supabaseUrl || !supabaseKey || !token) return null;

  const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data.user) return null;

  const allowedEmail = process.env.ALLOWED_EMAIL?.trim().toLowerCase();
  if (allowedEmail && data.user.email?.toLowerCase() !== allowedEmail) return null;
  return data.user;
}

export async function POST(request: NextRequest) {
  try {
    const user = await authenticate(request);
    if (!user) {
      return NextResponse.json(
        { error: "Bitte melde dich an, um einen Text zu generieren." },
        { status: 401 },
      );
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Die Textgenerierung ist noch nicht konfiguriert." },
        { status: 503 },
      );
    }

    const parsed = generationRequestSchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json({ error: "Ungültige Einstellungen." }, { status: 400 });
    }

    const { topic, length, tone } = parsed.data;
    const client = new OpenAI({ apiKey });
    const response = await client.responses.parse({
      model: process.env.OPENAI_MODEL || "gpt-5.6-luna",
      store: false,
      reasoning: { effort: "low" },
      instructions: `Du erstellst hochwertige Leseübungen für eine erwachsene Person, die sich auf telc Deutsch C1 vorbereitet. Schreibe idiomatisches, natürliches Deutsch auf echtem C1-Niveau. Der Text muss inhaltlich kohärent, differenziert und anspruchsvoll sein, ohne künstlich kompliziert zu wirken. Erfinde keine überprüfbaren aktuellen Statistiken, konkreten Studienergebnisse oder Zitate. Stelle alle Aufgaben ausschließlich auf Grundlage des erzeugten Textes. Formuliere plausible Distraktoren. Bei Aufgaben vom Typ richtig/falsch/nicht im Text muss die Kategorie eindeutig belegbar sein. Wähle zwölf tatsächlich nützliche C1-Wörter oder feste Wendungen aus dem Text. Bei Nomen steht im Feld article der bestimmte Artikel, ansonsten ein Gedankenstrich. Die Bedeutungen werden knapp auf Englisch erklärt.`,
      input: `Thema: ${topic}\nLänge: ${targetWords[length]} Wörter\nStil: ${tone}\nErstelle sechs anspruchsvolle Multiple-Choice-Fragen, sechs telc-ähnliche Aussagen mit den Antwortmöglichkeiten richtig, falsch oder nicht im Text sowie fünf kontextgebundene Wortschatzaufgaben. Vermeide Fragen, die sich ohne Lesen allein durch Allgemeinwissen beantworten lassen.`,
      text: {
        format: zodTextFormat(exerciseSchema, "c1_reading_exercise"),
      },
    });

    if (!response.output_parsed) {
      throw new Error("The model did not return a complete exercise.");
    }

    const exercise = {
      ...response.output_parsed,
      id: crypto.randomUUID(),
      level: "C1" as const,
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json({ exercise });
  } catch (error) {
    console.error("Exercise generation failed", error);
    return NextResponse.json(
      { error: "Der Text konnte gerade nicht erstellt werden. Bitte versuche es erneut." },
      { status: 500 },
    );
  }
}
