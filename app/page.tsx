"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Bookmark,
  BookmarkCheck,
  Check,
  ChevronRight,
  CircleUserRound,
  Clock3,
  LoaderCircle,
  LogOut,
  Menu,
  RotateCcw,
  Sparkles,
  Target,
  X,
} from "lucide-react";
import type { Session } from "@supabase/supabase-js";
import { builtinExercises } from "@/lib/builtin-exercises";
import { sampleExercise } from "@/lib/sample-exercise";
import { getSupabaseBrowserClient, isSupabaseConfigured } from "@/lib/supabase";
import type {
  AnswerValue,
  AttemptRecord,
  Exercise,
  QuizAnswer,
  VocabularyItem,
} from "@/lib/types";

type View = "home" | "reader" | "quiz" | "results" | "library" | "words";
type QuizItem =
  | {
      key: string;
      kind: "mcq" | "vocabulary";
      label: string;
      prompt: string;
      options: string[];
      correct: number;
      explanation: string;
    }
  | {
      key: string;
      kind: "evidence";
      label: string;
      prompt: string;
      options: string[];
      values: AnswerValue[];
      correct: AnswerValue;
      explanation: string;
    };

const topicSuggestions = [
  "Arbeitswelt im Wandel",
  "Wohnen in Großstädten",
  "Sprache und Identität",
  "Künstliche Intelligenz im Alltag",
  "Kultur und Erinnerung",
];

const starterExercises = [sampleExercise, ...builtinExercises];

function createQuiz(exercise: Exercise): QuizItem[] {
  const mcq: QuizItem[] = exercise.mcq.map((question, index) => ({
    key: `mcq-${index}`,
    kind: "mcq",
    label: "Textverständnis",
    prompt: question.question,
    options: question.options,
    correct: question.correctIndex,
    explanation: question.explanation,
  }));
  const evidence: QuizItem[] = exercise.evidence.map((question, index) => ({
    key: `evidence-${index}`,
    kind: "evidence",
    label: "Richtig · Falsch · Nicht im Text",
    prompt: question.statement,
    options: ["Richtig", "Falsch", "Nicht im Text"],
    values: ["richtig", "falsch", "nicht_im_text"],
    correct: question.correctAnswer,
    explanation: question.explanation,
  }));
  const vocabulary: QuizItem[] = exercise.vocabularyQuiz.map((question, index) => ({
    key: `vocabulary-${index}`,
    kind: "vocabulary",
    label: "Wortschatz im Kontext",
    prompt: question.sentence,
    options: question.options,
    correct: question.correctIndex,
    explanation: question.explanation,
  }));
  return [...mcq, ...evidence, ...vocabulary];
}

function Logo() {
  return (
    <button className="brand" type="button" onClick={() => window.scrollTo({ top: 0 })}>
      <span className="brand-mark">C1</span>
      <span>C1 Testspiel</span>
    </button>
  );
}

function AuthScreen({ onSession }: { onSession: (session: Session) => void }) {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return;
    setLoading(true);
    setMessage("");
    const result =
      mode === "login"
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signUp({ email, password });
    setLoading(false);
    if (result.error) {
      setMessage(result.error.message);
      return;
    }
    if (result.data.session) {
      onSession(result.data.session);
    } else {
      setMessage("Prüfe dein E-Mail-Postfach und bestätige deine Anmeldung.");
    }
  }

  return (
    <main className="auth-page">
      <div className="auth-brand"><Logo /></div>
      <section className="auth-copy">
        <p className="eyebrow">Lesen. Verstehen. Behalten.</p>
        <h1>Dein ruhiger Ort für anspruchsvolles Deutsch.</h1>
        <p>
          Erstelle persönliche C1-Lesetexte, trainiere telc-nahe Aufgaben und sammle
          Wörter, die du wirklich lernen möchtest.
        </p>
        <div className="auth-proof">
          <span><BookOpen size={18} /> C1-Lesetraining</span>
          <span><Target size={18} /> Detaillierte Auswertung</span>
        </div>
      </section>
      <section className="auth-card">
        <p className="eyebrow">Persönlicher Zugang</p>
        <h2>{mode === "login" ? "Willkommen zurück" : "Konto erstellen"}</h2>
        <p className="muted">Dein Lernstand bleibt auf allen Geräten verfügbar.</p>
        <form onSubmit={submit}>
          <label>
            E-Mail
            <input
              required
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="du@beispiel.de"
            />
          </label>
          <label>
            Passwort
            <input
              required
              minLength={8}
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Mindestens 8 Zeichen"
            />
          </label>
          {message && <p className="form-message">{message}</p>}
          <button className="primary-button full" disabled={loading} type="submit">
            {loading && <LoaderCircle className="spin" size={17} />}
            {mode === "login" ? "Anmelden" : "Registrieren"}
          </button>
        </form>
        <button className="text-button" type="button" onClick={() => setMode(mode === "login" ? "signup" : "login")}>
          {mode === "login" ? "Noch kein Konto? Registrieren" : "Schon registriert? Anmelden"}
        </button>
      </section>
    </main>
  );
}

export default function Home() {
  const [session, setSession] = useState<Session | null>(null);
  const [authReady, setAuthReady] = useState(!isSupabaseConfigured);
  const [view, setView] = useState<View>("home");
  const [mobileNav, setMobileNav] = useState(false);
  const [topic, setTopic] = useState("Arbeitswelt im Wandel");
  const [length, setLength] = useState<"kurz" | "mittel" | "lang">("mittel");
  const [tone, setTone] = useState<"sachlich" | "essayistisch" | "reportage">("sachlich");
  const [exercise, setExercise] = useState<Exercise>(sampleExercise);
  const [exercises, setExercises] = useState<Exercise[]>(starterExercises);
  const [attempts, setAttempts] = useState<AttemptRecord[]>([]);
  const [savedWords, setSavedWords] = useState<VocabularyItem[]>([]);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");
  const [quizIndex, setQuizIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, AnswerValue>>({});
  const [latestAttempt, setLatestAttempt] = useState<AttemptRecord | null>(null);

  const demoMode = !isSupabaseConfigured;
  const quiz = useMemo(() => createQuiz(exercise), [exercise]);

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return;
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setAuthReady(true);
    });
    const { data } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setAuthReady(true);
    });
    return () => data.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!session) return;
    async function loadCloudData() {
      const supabase = getSupabaseBrowserClient();
      if (!supabase || !session) return;
      const [exerciseRows, attemptRows, wordRows] = await Promise.all([
        supabase.from("exercises").select("content").order("created_at", { ascending: false }),
        supabase.from("attempts").select("*").order("completed_at", { ascending: false }),
        supabase.from("saved_words").select("*").order("created_at", { ascending: false }),
      ]);
      if (exerciseRows.data?.length) {
        const cloudExercises = exerciseRows.data.map((row) => row.content as Exercise);
        const cloudIds = new Set(cloudExercises.map((item) => item.id));
        setExercises([
          ...cloudExercises,
          ...starterExercises.filter((item) => !cloudIds.has(item.id)),
        ]);
      }
      if (attemptRows.data) {
        setAttempts(
          attemptRows.data.map((row) => ({
            id: row.id,
            exerciseId: row.exercise_id,
            title: row.title,
            score: row.score,
            total: row.total,
            completedAt: row.completed_at,
            answers: row.answers as QuizAnswer[],
          })),
        );
      }
      if (wordRows.data) {
        setSavedWords(
          wordRows.data.map((row) => ({
            term: row.term,
            article: row.article,
            meaningEn: row.meaning_en,
            example: row.example,
          })),
        );
      }
    }
    void loadCloudData();
  }, [session]);

  function openView(next: View) {
    setView(next);
    setMobileNav(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function openExercise(nextExercise: Exercise) {
    setExercise(nextExercise);
    setAnswers({});
    setQuizIndex(0);
    setLatestAttempt(null);
    openView("reader");
  }

  async function generateExercise(event: FormEvent) {
    event.preventDefault();
    setGenerating(true);
    setError("");
    if (demoMode) {
      await new Promise((resolve) => setTimeout(resolve, 700));
      const matchingExercises = length === "lang" ? builtinExercises.slice(0, 3) : builtinExercises.slice(3);
      const nextExercise = matchingExercises[Math.floor(Math.random() * matchingExercises.length)];
      openExercise(nextExercise);
      setGenerating(false);
      return;
    }
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify({ topic, length, tone }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Der Text konnte nicht erstellt werden.");
      const generated = data.exercise as Exercise;
      setExercises((current) => [generated, ...current]);
      openExercise(generated);
      const supabase = getSupabaseBrowserClient();
      if (supabase && session) {
        await supabase.from("exercises").insert({
          id: generated.id,
          user_id: session.user.id,
          title: generated.title,
          topic: generated.topic,
          content: generated,
        });
      }
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unbekannter Fehler");
    } finally {
      setGenerating(false);
    }
  }

  async function toggleWord(word: VocabularyItem) {
    const alreadySaved = savedWords.some((item) => item.term === word.term);
    setSavedWords((current) =>
      alreadySaved ? current.filter((item) => item.term !== word.term) : [word, ...current],
    );
    const supabase = getSupabaseBrowserClient();
    if (!supabase || !session) return;
    if (alreadySaved) {
      await supabase.from("saved_words").delete().eq("user_id", session.user.id).eq("term", word.term);
    } else {
      await supabase.from("saved_words").insert({
        user_id: session.user.id,
        exercise_id: exercise.id,
        term: word.term,
        article: word.article,
        meaning_en: word.meaningEn,
        example: word.example,
      });
    }
  }

  async function finishQuiz() {
    const evaluated = quiz.map((item) => {
      const value = answers[item.key];
      return {
        key: item.key,
        value,
        correct: value === item.correct,
        prompt: item.prompt,
        explanation: item.explanation,
      } as QuizAnswer;
    });
    const attempt: AttemptRecord = {
      id: crypto.randomUUID(),
      exerciseId: exercise.id,
      title: exercise.title,
      score: evaluated.filter((answer) => answer.correct).length,
      total: evaluated.length,
      completedAt: new Date().toISOString(),
      answers: evaluated,
    };
    setAttempts((current) => [attempt, ...current]);
    setLatestAttempt(attempt);
    openView("results");
    const supabase = getSupabaseBrowserClient();
    if (supabase && session) {
      await supabase.from("attempts").insert({
        id: attempt.id,
        user_id: session.user.id,
        exercise_id: attempt.exerciseId,
        title: attempt.title,
        score: attempt.score,
        total: attempt.total,
        answers: attempt.answers,
      });
    }
  }

  async function signOut() {
    await getSupabaseBrowserClient()?.auth.signOut();
    setView("home");
  }

  if (!authReady) {
    return <main className="loading-page"><LoaderCircle className="spin" size={28} /></main>;
  }
  if (isSupabaseConfigured && !session) {
    return <AuthScreen onSession={setSession} />;
  }

  const completedIds = new Set(attempts.map((attempt) => attempt.exerciseId));
  const average = attempts.length
    ? Math.round(
        (attempts.reduce((sum, attempt) => sum + attempt.score / attempt.total, 0) /
          attempts.length) *
          100,
      )
    : 0;

  return (
    <div className="app-shell">
      <header className="topbar">
        <Logo />
        <nav className={mobileNav ? "nav-links open" : "nav-links"}>
          <button className={view === "home" ? "active" : ""} onClick={() => openView("home")}>Neu</button>
          <button className={view === "library" ? "active" : ""} onClick={() => openView("library")}>Bibliothek</button>
          <button className={view === "words" ? "active" : ""} onClick={() => openView("words")}>Wortschatz</button>
        </nav>
        <div className="header-actions">
          {demoMode && <span className="demo-badge">Demo</span>}
          {!demoMode && (
            <button className="icon-button" type="button" aria-label="Abmelden" onClick={signOut}>
              <LogOut size={19} />
            </button>
          )}
          <button className="menu-button" type="button" aria-label="Menü" onClick={() => setMobileNav(!mobileNav)}>
            {mobileNav ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </header>

      {view === "home" && (
        <main>
          <section className="hero-section">
            <div className="hero-copy">
              <p className="eyebrow">Dein nächstes Lesetraining</p>
              <h1>Ein neuer Text.<br /><em>Genau für dein C1.</em></h1>
              <p className="hero-lead">
                Wähle ein Thema und erhalte einen anspruchsvollen Text mit telc-nahen
                Fragen und relevantem Wortschatz.
              </p>
            </div>
            <form className="generator-card" onSubmit={generateExercise}>
              <div className="generator-heading">
                <span><Sparkles size={18} /></span>
                <div>
                  <h2>Text erstellen</h2>
                  <p>In wenigen Sekunden bereit</p>
                </div>
              </div>
              <label className="field-label" htmlFor="topic">Thema</label>
              <input
                id="topic"
                value={topic}
                maxLength={120}
                onChange={(event) => setTopic(event.target.value)}
                placeholder="z. B. Zukunft der Arbeit"
              />
              <div className="suggestion-row">
                {topicSuggestions.slice(0, 3).map((suggestion) => (
                  <button type="button" key={suggestion} onClick={() => setTopic(suggestion)}>{suggestion}</button>
                ))}
              </div>
              <div className="form-grid">
                <label>
                  Länge
                  <select value={length} onChange={(event) => setLength(event.target.value as typeof length)}>
                    <option value="kurz">Kurz · ca. 700 Wörter</option>
                    <option value="mittel">Mittel · ca. 1.000 Wörter</option>
                    <option value="lang">Lang · ca. 1.300 Wörter</option>
                  </select>
                </label>
                <label>
                  Stil
                  <select value={tone} onChange={(event) => setTone(event.target.value as typeof tone)}>
                    <option value="sachlich">Sachlich</option>
                    <option value="essayistisch">Essayistisch</option>
                    <option value="reportage">Reportage</option>
                  </select>
                </label>
              </div>
              {error && <p className="form-message error">{error}</p>}
              <button className="primary-button full" disabled={generating || topic.trim().length < 3}>
                {generating ? <LoaderCircle className="spin" size={18} /> : <Sparkles size={18} />}
                {generating ? "Text wird geschrieben …" : "Lesetraining erstellen"}
              </button>
              {demoMode && <p className="demo-note">In der Vorschau öffnet der Button einen passenden Text aus der Bibliothek.</p>}
            </form>
          </section>

          <section className="overview-section">
            <div className="section-heading">
              <div>
                <p className="eyebrow">Dein Lernstand</p>
                <h2>Mit jedem Text ein Stück sicherer.</h2>
              </div>
              <button className="text-link" onClick={() => openView("library")}>Alle Texte <ArrowRight size={16} /></button>
            </div>
            <div className="stats-grid">
              <article><span><BookOpen size={20} /></span><strong>{attempts.length}</strong><p>Texte abgeschlossen</p></article>
              <article><span><Target size={20} /></span><strong>{average || "—"}{average ? "%" : ""}</strong><p>Durchschnitt</p></article>
              <article><span><Bookmark size={20} /></span><strong>{savedWords.length}</strong><p>Wörter gespeichert</p></article>
            </div>
          </section>
        </main>
      )}

      {view === "reader" && (
        <main className="reader-page">
          <button className="back-button" onClick={() => openView("home")}><ArrowLeft size={17} /> Zur Übersicht</button>
          <header className="article-header">
            <p className="eyebrow">{exercise.topic}</p>
            <h1>{exercise.title}</h1>
            <p>{exercise.subtitle}</p>
            <div className="article-meta">
              <span>C1</span><span><Clock3 size={15} /> {exercise.estimatedMinutes} Min. Lesezeit</span>
              <span>{exercise.paragraphs.join(" ").split(/\s+/).length} Wörter</span>
            </div>
          </header>
          <div className="reading-layout">
            <article className="reading-text">
              {exercise.paragraphs.map((paragraph, index) => <p key={index}>{paragraph}</p>)}
              <div className="quiz-cta">
                <p className="eyebrow">Bereit?</p>
                <h2>Prüfe, was vom Text geblieben ist.</h2>
                <p>{quiz.length} Aufgaben zu Verständnis, Textbelegen und Wortschatz.</p>
                <button className="primary-button" onClick={() => openView("quiz")}>Quiz beginnen <ArrowRight size={18} /></button>
              </div>
            </article>
            <aside className="vocab-aside">
              <div className="aside-heading"><p className="eyebrow">Wortschatz</p><span>{exercise.vocabulary.length}</span></div>
              {exercise.vocabulary.map((word) => {
                const saved = savedWords.some((item) => item.term === word.term);
                return (
                  <article className="word-card" key={word.term}>
                    <button aria-label={saved ? "Wort entfernen" : "Wort speichern"} onClick={() => toggleWord(word)}>
                      {saved ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
                    </button>
                    <h3>{word.term}</h3>
                    <p className="translation">{word.meaningEn}</p>
                    <p>{word.example}</p>
                  </article>
                );
              })}
            </aside>
          </div>
        </main>
      )}

      {view === "quiz" && (
        <main className="quiz-page">
          <div className="quiz-topline">
            <button className="back-button" onClick={() => openView("reader")}><ArrowLeft size={17} /> Zum Text</button>
            <span>{quizIndex + 1} / {quiz.length}</span>
          </div>
          <div className="progress-track"><span style={{ width: `${((quizIndex + 1) / quiz.length) * 100}%` }} /></div>
          <section className="question-card">
            <p className="eyebrow">{quiz[quizIndex].label}</p>
            <h1>{quiz[quizIndex].prompt}</h1>
            <div className="answer-list">
              {quiz[quizIndex].options.map((option, index) => {
                const item = quiz[quizIndex];
                const value = item.kind === "evidence" ? item.values[index] : index;
                const selected = answers[item.key] === value;
                const answered = answers[item.key] !== undefined;
                const correctOption = value === item.correct;
                const answerClass = answered
                  ? correctOption
                    ? "answer-correct"
                    : selected
                      ? "answer-incorrect"
                      : "answer-locked"
                  : selected
                    ? "selected"
                    : "";
                return (
                  <button
                    className={answerClass}
                    type="button"
                    key={option}
                    disabled={answered}
                    onClick={() => setAnswers((current) => ({ ...current, [item.key]: value }))}
                  >
                    <span>{String.fromCharCode(65 + index)}</span>
                    <strong>{option}</strong>
                    {answered && correctOption && <Check size={18} />}
                    {answered && selected && !correctOption && <X size={18} />}
                  </button>
                );
              })}
            </div>
            {answers[quiz[quizIndex].key] !== undefined && (
              <div
                className={`instant-feedback ${answers[quiz[quizIndex].key] === quiz[quizIndex].correct ? "correct" : "incorrect"}`}
                role="status"
              >
                <span>{answers[quiz[quizIndex].key] === quiz[quizIndex].correct ? <Check size={19} /> : <X size={19} />}</span>
                <div>
                  <strong>{answers[quiz[quizIndex].key] === quiz[quizIndex].correct ? "Richtig" : "Nicht ganz"}</strong>
                  <p>{quiz[quizIndex].explanation}</p>
                </div>
              </div>
            )}
            <div className="question-actions">
              <button className="secondary-button" disabled={quizIndex === 0} onClick={() => setQuizIndex(quizIndex - 1)}><ArrowLeft size={17} /> Zurück</button>
              {quizIndex < quiz.length - 1 ? (
                <button className="primary-button" disabled={answers[quiz[quizIndex].key] === undefined} onClick={() => setQuizIndex(quizIndex + 1)}>Weiter <ArrowRight size={17} /></button>
              ) : (
                <button className="primary-button" disabled={answers[quiz[quizIndex].key] === undefined} onClick={finishQuiz}>Auswerten <Check size={17} /></button>
              )}
            </div>
          </section>
        </main>
      )}

      {view === "results" && latestAttempt && (
        <main className="results-page">
          <section className="result-hero">
            <div className="score-ring"><strong>{Math.round((latestAttempt.score / latestAttempt.total) * 100)}%</strong><span>{latestAttempt.score} von {latestAttempt.total}</span></div>
            <div>
              <p className="eyebrow">Auswertung</p>
              <h1>{latestAttempt.score / latestAttempt.total >= 0.75 ? "Sehr sicher gelesen." : "Eine gute Grundlage."}</h1>
              <p>Deine falschen Antworten bleiben gespeichert, damit du gezielt zurückkommen kannst.</p>
            </div>
          </section>
          <section className="review-list">
            <div className="section-heading"><div><p className="eyebrow">Im Detail</p><h2>Antworten verstehen</h2></div></div>
            {latestAttempt.answers.map((answer, index) => (
              <article className={answer.correct ? "correct" : "incorrect"} key={answer.key}>
                <span>{answer.correct ? <Check size={17} /> : <X size={17} />}</span>
                <div><p className="question-number">Aufgabe {index + 1}</p><h3>{answer.prompt}</h3><p>{answer.explanation}</p></div>
              </article>
            ))}
          </section>
          <div className="result-actions">
            <button className="secondary-button" onClick={() => { setAnswers({}); setQuizIndex(0); openView("quiz"); }}><RotateCcw size={17} /> Noch einmal</button>
            <button className="primary-button" onClick={() => openView("home")}>Neuen Text erstellen <ArrowRight size={17} /></button>
          </div>
        </main>
      )}

      {view === "library" && (
        <main className="collection-page">
          <header className="collection-header"><p className="eyebrow">Bibliothek</p><h1>Deine Lesetexte</h1><p>Alle Texte, Versuche und Ergebnisse an einem Ort.</p></header>
          <div className="library-grid">
            {exercises.map((item) => {
              const attempt = attempts.find((entry) => entry.exerciseId === item.id);
              return (
                <article className="library-card" key={item.id} onClick={() => openExercise(item)}>
                  <div className="library-card-top"><span>{item.topic}</span>{completedIds.has(item.id) && <span className="complete"><Check size={14} /> Fertig</span>}</div>
                  <h2>{item.title}</h2><p>{item.subtitle}</p>
                  <div><span><Clock3 size={15} /> {item.estimatedMinutes} Min.</span><span>{attempt ? `${attempt.score}/${attempt.total} richtig` : "Noch nicht getestet"}</span><ChevronRight size={18} /></div>
                </article>
              );
            })}
          </div>
        </main>
      )}

      {view === "words" && (
        <main className="collection-page">
          <header className="collection-header"><p className="eyebrow">Wortschatz</p><h1>Gespeicherte Wörter</h1><p>Deine persönliche C1-Sammlung wächst mit jedem Text.</p></header>
          {savedWords.length ? (
            <div className="word-library">
              {savedWords.map((word) => (
                <article key={word.term}><div><span>{word.article}</span><h2>{word.term}</h2></div><p className="translation">{word.meaningEn}</p><p>{word.example}</p><button onClick={() => toggleWord(word)}><X size={16} /> Entfernen</button></article>
              ))}
            </div>
          ) : (
            <div className="empty-state"><Bookmark size={28} /><h2>Noch keine Wörter gespeichert</h2><p>Öffne einen Text und markiere Wörter, die du wiederholen möchtest.</p><button className="primary-button" onClick={() => openView("library")}>Zur Bibliothek</button></div>
          )}
        </main>
      )}

      <footer><Logo /><p>Persönliches C1-Lesetraining</p><span><CircleUserRound size={16} /> {demoMode ? "Vorschau" : session?.user.email}</span></footer>
    </div>
  );
}
