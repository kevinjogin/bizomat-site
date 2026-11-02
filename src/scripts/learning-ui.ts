// KEVOS® learning paths in the browser: the course view under the homepage question box.
// Loaded only after a visitor asks for a learning path (dynamic import from src/scripts/discovery.ts).
//
// Flow: a course arranged from the Library appears at once; KEVOS® AI's plan replaces it when it arrives. A lesson
// shows its Library readings and Tools at once; KEVOS® AI's lesson (explanation, the key things to understand,
// exercises, knowledge check) fills in when ready. Without AI, the lesson keeps the Library's own words.
// All text is set with textContent (no HTML from data). Progress lives in sessionStorage (this tab only).
import type { Engine } from '../lib/discovery/search.ts';
import type { DiscoveryDetails } from '../lib/discovery/plan.ts';
import { gatherCandidates, type Candidates, type Depth, type Intent } from '../lib/learning/retrieve.ts';
import { courseFromPlan, DEPTH_LABEL, draftCourse, formatDuration, LEVEL_LABEL, lessons, type Course, type Lesson, type ReadingRef, type ToolRef } from '../lib/learning/course.ts';
import { learnAsk, learnLesson, learnPlan, lessonSources, readProgress, saveProgress, VisitorError, type ChapterOutline, type LessonContent, type Progress, type Style } from '../lib/learning/client.ts';

type Track = (e: Record<string, unknown>) => void;
interface Ctx { engine: Engine; details: DiscoveryDetails | null; track: Track; onQuick: (question: string) => void; status: (msg: string) => void; mount: (node: HTMLElement) => void }

// ---------- DOM helpers ----------
const el = <K extends keyof HTMLElementTagNameMap>(tag: K, cls?: string, text?: string) => {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (text !== undefined) n.textContent = text;
  return n;
};
const a = (href: string, text: string, cls?: string) => { const x = el('a', cls, text); x.href = href; return x; };
const btn = (text: string, cls: string, on: () => void) => { const b = el('button', cls, text); b.type = 'button'; b.addEventListener('click', on); return b; };
const ul = (items: string[], cls = 'lc-list') => { const u = el('ul', cls); for (const t of items) u.append(el('li', undefined, t)); return u; };
const tag = (text: string, kind: 'source' | 'ai' | 'tool' | 'note') => el('span', `lc-tag lc-tag--${kind}`, text);
const pad = (n: number) => String(n).padStart(2, '0');

/** A course in progress on the page. */
class CourseView {
  root = el('article', 'lc');
  private course!: Course;
  private progress!: Progress;
  private contents = new Map<string, { style: Style; content: LessonContent | null }>();
  private nav = el('nav', 'lc__nav');
  private main = el('section', 'lc__main');
  private head = el('header', 'lc__head');
  private statusLine = el('p', 'lc__status');
  private current: string | null = null;
  private pendingPlan = false;

  constructor(private ctx: Ctx, private question: string, public intent: Intent, private candidates: Candidates) {
    this.root.setAttribute('aria-label', 'Your learning path');
    this.statusLine.setAttribute('role', 'status');
    const body = el('div', 'lc__body');
    body.append(this.nav, this.main);
    this.root.append(this.head, body);
  }

  /** Show a course (draft or AI). Keeps the open lesson when it still exists. */
  show(course: Course, pending: boolean, note = '') {
    this.course = course;
    this.pendingPlan = pending;
    this.progress = readProgress(course.id);
    this.statusLine.textContent = pending ? 'KEVOS® AI is planning your personalised course from these resources…' : note;
    this.renderHead();
    this.renderNav();
    const keep = this.current && lessons(course).some((l) => l.id === this.current) ? this.current : null;
    if (keep) this.openLesson(keep, false); else this.renderOverview();
  }

  // ---------- Header: title, facts, depth, progress ----------
  private renderHead() {
    const c = this.course;
    this.head.replaceChildren();
    const eyebrow = el('p', 'lc__eyebrow');
    eyebrow.append(el('span', undefined, 'Your learning path'), ' ', tag(c.source === 'ai' ? 'Planned by KEVOS® AI from the Library and Tools' : 'Arranged from the Library (no AI)', c.source === 'ai' ? 'ai' : 'source'));
    this.head.append(eyebrow, el('h3', 'lc__title', c.title));
    if (c.description) this.head.append(el('p', 'lc__desc', c.description));
    const facts = el('dl', 'lc__facts');
    const all = lessons(c);
    for (const [k, v] of [['Level', LEVEL_LABEL[c.level]], ['Learning depth', DEPTH_LABEL[c.depth]], ['Modules', String(c.modules.length)], ['Lessons', String(all.length)], ['Estimated study time', formatDuration(c.minutes)]] as const) {
      const d = el('div'); d.append(el('dt', undefined, k), el('dd', undefined, v)); facts.append(d);
    }
    this.head.append(facts);
    const depth = el('div', 'lc__depth');
    depth.setAttribute('role', 'group');
    depth.setAttribute('aria-label', 'Learning depth');
    depth.append(el('span', 'lc__depth-label', 'Learning depth:'));
    for (const d of ['quick', 'structured', 'complete', 'professional'] as Depth[]) {
      const b = btn(DEPTH_LABEL[d], 'lc-chip', () => this.changeDepth(d));
      b.setAttribute('aria-pressed', String(d === c.depth));
      depth.append(b);
    }
    this.head.append(depth, this.statusLine);
    const done = all.filter((l) => this.progress.done.includes(l.id)).length;
    const pct = all.length ? Math.round((done / all.length) * 100) : 0;
    const prog = el('div', 'lc__progress');
    const bar = el('div', 'lc__bar');
    bar.setAttribute('role', 'progressbar');
    bar.setAttribute('aria-valuemin', '0'); bar.setAttribute('aria-valuemax', '100'); bar.setAttribute('aria-valuenow', String(pct));
    bar.setAttribute('aria-label', 'Course progress');
    const fill = el('span'); fill.style.width = `${pct}%`; bar.append(fill);
    prog.append(bar, el('p', 'lc__progress-text', `${done} of ${all.length} lessons complete (${pct}%). Progress is kept in this browser tab only.`));
    this.head.append(prog);
  }

  private changeDepth(d: Depth) {
    if (d === this.course.depth) return;
    this.ctx.track({ type: 'learn', kind: 'depth', id: d });
    if (d === 'quick') { this.ctx.onQuick(this.question); return; }
    startCourse(this.ctx, this.question, { ...this.intent, depth: d }, this.candidates, this);
  }

  // ---------- Contents ----------
  private renderNav() {
    this.nav.replaceChildren();
    this.nav.setAttribute('aria-label', 'Course contents');
    this.nav.append(el('h4', 'lc__nav-title', 'Course contents'));
    const overview = btn('Course overview', 'lc-navlink', () => this.renderOverview());
    if (!this.current) overview.setAttribute('aria-current', 'page');
    this.nav.append(overview);
    this.course.modules.forEach((m, mi) => {
      const det = el('details', 'lc-mod');
      det.open = mi === 0 || m.lessons.some((l) => l.id === this.current);
      det.append(el('summary', 'lc-mod__title', `Module ${pad(mi + 1)}: ${m.title}`));
      const ol = el('ol', 'lc-mod__lessons');
      for (const l of m.lessons) {
        const li = el('li');
        const state = this.progress.done.includes(l.id) ? 'done' : this.progress.opened.includes(l.id) ? 'opened' : 'new';
        const b = btn(`${l.id} ${l.title}`, `lc-navlink lc-navlink--${state}`, () => this.openLesson(l.id));
        b.setAttribute('aria-label', `Lesson ${l.id}: ${l.title} (${state === 'done' ? 'complete' : state === 'opened' ? 'opened' : 'not started'})`);
        if (l.id === this.current) b.setAttribute('aria-current', 'page');
        li.append(b);
        ol.append(li);
      }
      det.append(ol);
      this.nav.append(det);
    });
  }

  // ---------- Overview ----------
  private renderOverview() {
    this.current = null;
    this.renderNav();
    const c = this.course;
    const m = this.main;
    m.replaceChildren();
    m.append(el('h4', 'lc__h', 'Course overview'));
    if (c.objectives.length) { m.append(el('h5', 'lc__sub', 'Learning objectives')); m.append(ul(c.objectives)); }
    if (c.outcomes.length) { m.append(el('h5', 'lc__sub', 'Expected outcomes')); m.append(ul(c.outcomes)); }
    m.append(el('h5', 'lc__sub', 'Modules'));
    const ol = el('ol', 'lc-modlist');
    c.modules.forEach((mod, i) => {
      const li = el('li');
      li.append(el('strong', undefined, `Module ${pad(i + 1)}: ${mod.title}`));
      if (mod.summary) li.append(el('p', undefined, mod.summary));
      li.append(el('p', 'lc-muted', `${mod.lessons.length} lesson${mod.lessons.length === 1 ? '' : 's'}: ${mod.lessons.map((l) => l.title).join(' · ')}`));
      ol.append(li);
    });
    m.append(ol);
    if (c.gaps.length) {
      const g = el('div', 'lc-gap');
      g.append(el('p', 'lc-gap__title', 'Limited Library coverage'), ul(c.gaps), el('p', 'lc-muted', 'KEVOS® does not claim to cover every part of this subject. These areas need other sources.'));
      m.append(g);
    }
    const remembered = [...new Set([...this.contents.values()].flatMap((x) => x.content?.key.remember ?? []))];
    if (remembered.length) { m.append(el('h5', 'lc__sub', 'Key things so far (from the lessons you opened)')); m.append(ul(remembered.slice(0, 12))); }
    const first = lessons(c)[0];
    if (first) m.append(btn(this.progress.opened.length ? 'Continue the course →' : 'Start the course →', 'lc-primary', () => this.openLesson(this.progress.current && lessons(c).some((l) => l.id === this.progress.current) ? this.progress.current : first.id)));
  }

  // ---------- Lesson ----------
  openLesson(id: string, focus = true) {
    const all = lessons(this.course);
    const idx = all.findIndex((l) => l.id === id);
    if (idx < 0) return;
    const lesson = all[idx];
    this.current = id;
    if (!this.progress.opened.includes(id)) this.progress.opened.push(id);
    this.progress.current = id;
    saveProgress(this.course.id, this.progress);
    this.ctx.track({ type: 'learn', kind: 'lesson', id });
    this.renderHead();
    this.renderNav();
    // The lesson renders after its chapter outlines load; focus its title once it is on the page.
    void this.renderLesson(lesson, all, idx).then(() => { if (focus && this.current === id) this.main.querySelector<HTMLElement>('.lc-lesson__title')?.focus({ preventScroll: false }); });
    const key = `${this.course.id}:${id}`;
    if (!this.contents.has(key)) this.loadLesson(lesson, 'standard');
  }

  private async loadLesson(lesson: Lesson & { module: string }, style: Style) {
    const key = `${this.course.id}:${lesson.id}`;
    this.contents.set(key, { style, content: null });
    this.lessonStatus('KEVOS® AI is writing this lesson from the Library readings…');
    let content: LessonContent | null = null;
    try { content = await learnLesson(this.course, lesson.module, lesson, style); } catch (err) { if (err instanceof VisitorError) this.lessonStatus(err.message); }
    this.contents.set(key, { style, content });
    if (this.current === lesson.id) {
      const all = lessons(this.course);
      this.renderLesson(all.find((l) => l.id === lesson.id)!, all, all.findIndex((l) => l.id === lesson.id), content ? '' : 'KEVOS® AI could not write this lesson right now. Here is what the Library itself says; the readings and tools below are complete.');
    }
  }

  private lessonStatus(msg: string) { const s = this.main.querySelector('.lc-lesson__status'); if (s) s.textContent = msg; }

  private async renderLesson(lesson: Lesson & { module: string; moduleIndex: number }, all: ReturnType<typeof lessons>, idx: number, note = '') {
    const m = this.main;
    const entry = this.contents.get(`${this.course.id}:${lesson.id}`);
    const content = entry?.content ?? null;
    const sources = await lessonSources(lesson);
    if (this.current !== lesson.id) return;
    // When the AI lesson replaces the Library version, keep focus on the title if it was there.
    const titleHadFocus = document.activeElement?.classList.contains('lc-lesson__title') && m.contains(document.activeElement);
    m.replaceChildren();
    m.append(el('p', 'lc-crumb', `Module ${pad(lesson.moduleIndex + 1)}: ${lesson.module} · Lesson ${lesson.id}`));
    const h = el('h4', 'lc-lesson__title', lesson.title); h.tabIndex = -1; m.append(h);
    if (lesson.objective) { const p = el('p', 'lc-objective'); p.append(el('strong', undefined, 'Learning objective: '), lesson.objective); m.append(p); }
    const status = el('p', 'lc-lesson__status'); status.setAttribute('role', 'status'); status.textContent = note || (entry && !content && !note ? 'KEVOS® AI is writing this lesson from the Library readings…' : ''); m.append(status);
    // Lesson actions (AI)
    const actions = el('div', 'lc-actions');
    actions.setAttribute('role', 'group'); actions.setAttribute('aria-label', 'Change this lesson');
    for (const [style, label] of [['simpler', 'Explain more simply'], ['technical', 'More technical'], ['examples', 'More examples'], ['exercises', 'More exercises']] as [Style, string][]) {
      const b = btn(label, 'lc-chip', () => { this.ctx.track({ type: 'learn', kind: 'style', id: style }); this.loadLesson(lesson, style); });
      if (entry?.style === style) b.setAttribute('aria-pressed', 'true');
      actions.append(b);
    }
    m.append(actions);

    // LEARN + UNDERSTAND
    if (content) {
      const learn = el('section', 'lc-sec');
      learn.append(this.secHead('Learn', tag('KEVOS® AI explanation, based on the readings below', 'ai')));
      for (const para of content.explanation.split(/\n+/)) learn.append(el('p', undefined, para));
      if (content.why) { const p = el('p'); p.append(el('strong', undefined, 'Why it matters: '), content.why); learn.append(p); }
      if (content.concepts.length) { learn.append(el('h6', 'lc-mini', 'Main concepts')); learn.append(ul(content.concepts)); }
      m.append(learn);
    }
    m.append(this.keyThings(content, sources));

    // READ (Library)
    const read = el('section', 'lc-sec');
    read.append(this.secHead('Read', tag('Library', 'source')));
    if (!lesson.readings.length) read.append(el('p', 'lc-gap__inline', 'No Library chapter fits this lesson yet.'));
    lesson.readings.forEach((r, i) => read.append(this.readingCard(r, i, content, sources[i]?.outline ?? null)));
    m.append(read);

    // APPLY (Tools)
    const apply = el('section', 'lc-sec');
    apply.append(this.secHead('Apply', tag('Tools', 'tool')));
    if (!lesson.tools.length) apply.append(el('p', 'lc-muted', 'No calculator is needed for this lesson, or none in Tools fits it yet.'));
    lesson.tools.forEach((t, i) => apply.append(this.toolCard(t, i, content)));
    m.append(apply);

    // PRACTISE
    const prac = el('section', 'lc-sec');
    prac.append(this.secHead('Practise', content ? tag('Suggested by KEVOS® AI', 'ai') : tag('From the Library', 'source')));
    if (content?.example) { const p = el('p'); p.append(el('strong', undefined, 'Example: '), content.example); prac.append(p); }
    const tasks = content?.exercises.length ? content.exercises : sources.flatMap((s) => (s.outline?.exr ? [{ task: s.outline.exr }] : s.outline?.ex ? [{ task: `Work through the chapter's worked example: ${s.outline.ex}` }] : []));
    if (tasks.length) {
      const ol = el('ol', 'lc-list');
      for (const t of tasks) {
        const li = el('li', undefined, t.task);
        const tool = 'tool' in t && t.tool ? lesson.tools[(t.tool as number) - 1] : undefined;
        if (tool) { li.append(' '); li.append(a(tool.app, `Open ${tool.name} →`, 'lc-inline')); }
        ol.append(li);
      }
      prac.append(ol);
    } else prac.append(el('p', 'lc-muted', lesson.tools.length ? `Enter your own values in ${lesson.tools[0].name} and compare the result with what you expected.` : 'Explain the main idea of this lesson in your own words, then check it against the reading.'));
    m.append(prac);

    // VERIFY
    m.append(this.verify(lesson, content, sources));
    if (content?.assumptions.length) {
      const as = el('div', 'lc-gap');
      as.append(el('p', 'lc-gap__title', 'Assumptions to check'), ul(content.assumptions));
      m.append(as);
    }

    // Follow-up
    m.append(this.askBox(lesson, content));

    // Navigation
    const nav = el('div', 'lc-lessonnav');
    const prev = all[idx - 1], next = all[idx + 1];
    if (prev) nav.append(btn(`← Previous lesson`, 'lc-nb', () => this.openLesson(prev.id)));
    nav.append(btn('Back to course', 'lc-nb', () => this.renderOverview()));
    nav.append(btn('Course contents', 'lc-nb', () => { this.nav.scrollIntoView({ block: 'start', behavior: 'smooth' }); (this.nav.querySelector('[aria-current]') as HTMLElement | null)?.focus(); }));
    const done = this.progress.done.includes(lesson.id);
    nav.append(btn(done ? 'Completed ✓' : 'Mark lesson complete', `lc-nb ${done ? 'is-done' : 'lc-nb--primary'}`, () => {
      if (!this.progress.done.includes(lesson.id)) this.progress.done.push(lesson.id);
      saveProgress(this.course.id, this.progress);
      this.ctx.track({ type: 'learn', kind: 'complete', id: lesson.id });
      if (next) this.openLesson(next.id); else { this.renderHead(); this.renderOverview(); }
    }));
    if (next) nav.append(btn('Next lesson →', 'lc-nb', () => this.openLesson(next.id)));
    m.append(nav);
    if (titleHadFocus) h.focus({ preventScroll: true });
  }

  private secHead(title: string, label: HTMLElement) { const h = el('h5', 'lc-sec__title', title); h.append(' ', label); return h; }

  /** THE KEY THINGS TO UNDERSTAND: from KEVOS® AI (grounded on the readings) or, without AI, from the Library text. */
  private keyThings(content: LessonContent | null, sources: { title: string; outline: ChapterOutline | null }[]): HTMLElement {
    const box = el('section', 'lc-key');
    box.setAttribute('aria-label', 'The key things to understand');
    box.append(el('h5', 'lc-key__title', 'THE KEY THINGS TO UNDERSTAND'));
    const row = (label: string, body: string | HTMLElement) => { const d = el('div', 'lc-key__row'); d.append(el('p', 'lc-key__label', label)); d.append(typeof body === 'string' ? el('p', 'lc-key__text', body) : body); box.append(d); };
    if (content) {
      const k = content.key;
      box.append(tag(k.basis === 'source' ? 'KEVOS® AI summary of the Library readings' : 'KEVOS® AI, general knowledge: check against the readings', k.basis === 'source' ? 'ai' : 'note'));
      if (k.principle) row('Central principle', k.principle);
      if (k.essential) row('Essential concept', k.essential);
      if (k.why) row('Why it matters', k.why);
      if (k.misunderstandings.length) row('Common misunderstandings', ul(k.misunderstandings));
      if (k.implications) row('Practical implications', k.implications);
      if (k.remember.length) { const ol = el('ol', 'lc-key__remember'); for (const r of k.remember) ol.append(el('li', undefined, r)); row('What to remember', ol); }
      return box;
    }
    const o = sources.map((s) => s.outline).filter((x): x is ChapterOutline => Boolean(x));
    box.append(tag('From the Library: the chapters’ own words (no AI)', 'source'));
    const lead = o.find((x) => x.sum)?.sum ?? o[0]?.s;
    if (lead) row('Central idea', lead);
    const mis = o.flatMap((x) => x.mis ?? []).slice(0, 3);
    if (mis.length) row('Common mistakes', ul(mis));
    const terms = [...new Set(o.flatMap((x) => x.t))].slice(0, 8);
    if (terms.length) row('Key terms to understand', ul(terms));
    if (!o.length) box.append(el('p', 'lc-key__text', 'Open the reading below; its summary and common mistakes are the key things for this lesson.'));
    return box;
  }

  private readingCard(r: ReadingRef, i: number, content: LessonContent | null, outline: ChapterOutline | null) {
    const card = el('article', 'lc-card');
    card.append(el('p', 'lc-card__kind', `Reading ${i + 1} · ${r.book}${r.minutes ? ` · about ${r.minutes} min` : ''}`));
    const t = el('h6', 'lc-card__title'); t.append(a(r.url, r.title)); card.append(t);
    const note = content?.readingNotes.find((n) => n.n === i + 1);
    const why = el('p'); why.append(el('strong', undefined, 'Why it is relevant: '), note?.why || r.about); card.append(why);
    const what = note?.understand || (outline?.h.length ? `What it covers: ${outline.h.slice(0, 5).join('; ')}.` : '');
    if (what) { const p = el('p'); p.append(el('strong', undefined, note?.understand ? 'What to understand: ' : ''), what); card.append(p); }
    if (r.verified) card.append(tag('Verified link to this lesson’s tool', 'source'));
    card.append(a(r.url, 'Read the chapter →', 'lc-card__cta'));
    return card;
  }

  private toolCard(t: ToolRef, i: number, content: LessonContent | null) {
    const card = el('article', 'lc-card lc-card--tool');
    card.append(el('p', 'lc-card__kind', `Tool ${i + 1}${t.linked ? ' · linked to this lesson’s reading' : ''}`));
    const h = el('h6', 'lc-card__title'); h.append(a(t.url, t.name)); card.append(h);
    card.append(el('p', undefined, t.about));
    const note = content?.toolNotes.find((n) => n.n === i + 1);
    if (note?.why) { const p = el('p'); p.append(el('strong', undefined, 'Why it is relevant: '), note.why); card.append(p); }
    if (note?.use) { const p = el('p'); p.append(el('strong', undefined, 'Use it to: '), note.use); card.append(p); }
    if (t.outputs.length) { const p = el('p'); p.append(el('strong', undefined, 'What you can work out: '), t.outputs.join('; '), ' ', tag('from the tool', 'tool')); card.append(p); }
    if (t.inputs.length) { const p = el('p'); p.append(el('strong', undefined, 'You will need: '), t.inputs.join('; '), ' ', tag('from the tool', 'tool')); card.append(p); }
    card.append(a(t.app, 'Open the tool →', 'lc-card__cta'));
    return card;
  }

  private verify(lesson: Lesson, content: LessonContent | null, sources: { outline: ChapterOutline | null }[]) {
    const sec = el('section', 'lc-sec');
    sec.append(this.secHead('Verify', content ? tag('Suggested by KEVOS® AI', 'ai') : tag('From the Library and Tools', 'source')));
    const items = content?.verify.length ? content.verify : [
      ...lesson.tools.filter((t) => t.check).map((t) => `${t.name}: ${t.check}`),
      `Explain "${lesson.title}" in your own words without looking at the reading.`,
      'Name one place in your own work where this applies.',
    ];
    const list = el('ul', 'lc-checklist');
    for (const it of items) { const li = el('li'); const lab = el('label'); const cb = el('input'); cb.type = 'checkbox'; lab.append(cb, ' ', it); li.append(lab); list.append(li); }
    sec.append(list);
    if (content?.completion.length) { sec.append(el('h6', 'lc-mini', 'Completion criteria')); sec.append(ul(content.completion)); }
    // Knowledge check
    const checks = content?.checks ?? [];
    const questions = checks.length ? null : sources.flatMap((s) => s.outline?.q ?? []).slice(0, 3);
    if (checks.length) sec.append(this.quiz(lesson.id, checks));
    else if (questions?.length) { sec.append(el('h6', 'lc-mini', 'Questions to answer from the reading')); sec.append(ul(questions)); }
    return sec;
  }

  private quiz(lessonId: string, checks: LessonContent['checks']) {
    const form = el('form', 'lc-quiz');
    form.append(el('h6', 'lc-mini', 'Knowledge check'));
    checks.forEach((c, qi) => {
      const fs = el('fieldset', 'lc-quiz__q');
      fs.append(el('legend', undefined, `${qi + 1}. ${c.q}`));
      c.options.forEach((o, oi) => { const lab = el('label', 'lc-quiz__opt'); const r = el('input'); r.type = 'radio'; r.name = `q-${lessonId}-${qi}`; r.value = String(oi); lab.append(r, ' ', o); fs.append(lab); });
      fs.append(el('p', 'lc-quiz__fb'));
      form.append(fs);
    });
    const result = el('p', 'lc-quiz__result'); result.setAttribute('role', 'status');
    const check = el('button', 'lc-nb lc-nb--primary', 'Check answers'); check.type = 'submit';
    const retake = btn('Retake', 'lc-nb', () => { form.reset(); form.querySelectorAll('.lc-quiz__fb').forEach((f) => { f.textContent = ''; f.className = 'lc-quiz__fb'; }); result.textContent = ''; });
    form.append(check, retake, result);
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let right = 0;
      form.querySelectorAll<HTMLFieldSetElement>('.lc-quiz__q').forEach((fs, qi) => {
        const picked = fs.querySelector<HTMLInputElement>('input:checked');
        const ok = picked && Number(picked.value) === checks[qi].answer;
        if (ok) right++;
        const fb = fs.querySelector('.lc-quiz__fb')!;
        fb.className = `lc-quiz__fb ${ok ? 'is-right' : 'is-wrong'}`;
        fb.textContent = `${ok ? 'Correct. ' : picked ? `Not quite: the answer is “${checks[qi].options[checks[qi].answer]}”. ` : 'Not answered. '}${checks[qi].explain}`;
      });
      result.textContent = `${right} of ${checks.length} correct.`;
      if (!this.progress.checks.includes(lessonId)) { this.progress.checks.push(lessonId); saveProgress(this.course.id, this.progress); }
      this.ctx.track({ type: 'learn', kind: 'check', id: lessonId });
    });
    return form;
  }

  private askBox(lesson: Lesson, content: LessonContent | null) {
    const sec = el('section', 'lc-sec lc-ask');
    sec.append(this.secHead('Ask about this lesson', tag('KEVOS® AI', 'ai')));
    const form = el('form', 'lc-ask__form');
    const label = el('label', 'visually-hidden', 'Your question about this lesson');
    const id = `lc-ask-${lesson.id.replace('.', '-')}`;
    label.htmlFor = id;
    const input = el('input'); input.id = id; input.type = 'text'; input.maxLength = 500; input.placeholder = 'e.g. How would this apply in a small workshop?';
    const go = el('button', 'lc-nb lc-nb--primary', 'Ask'); go.type = 'submit';
    const answers = el('div', 'lc-ask__answers'); answers.setAttribute('aria-live', 'polite');
    form.append(label, input, go);
    sec.append(form, answers);
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const q = input.value.trim();
      if (!q) { input.focus(); return; }
      go.disabled = true;
      const item = el('div', 'lc-ask__item');
      item.append(el('p', 'lc-ask__q', q));
      const ans = el('p', 'lc-ask__a', 'Thinking…');
      item.append(ans);
      answers.prepend(item);
      try {
        const r = await learnAsk(this.course, lesson, content ? `${content.explanation} ${content.key.principle}` : lesson.objective, q);
        ans.textContent = r ? r.answer : 'KEVOS® AI could not answer right now. The readings above are the best place to look.';
        if (r) item.append(tag(r.basis === 'source' ? `Based on the lesson’s readings${r.refs.length ? ` (${r.refs.map((n) => lesson.readings[n - 1]?.title).filter(Boolean).join('; ')})` : ''}` : 'General knowledge: check it against the readings', r.basis === 'source' ? 'ai' : 'note'));
        input.value = '';
      } catch (err) {
        ans.textContent = err instanceof VisitorError ? err.message : 'Something went wrong. Please try again.';
      } finally { go.disabled = false; }
    });
    return sec;
  }
}

// ---------- Starting a course ----------
let mounted: CourseView | null = null;
/**
 * Build and show a course: the Library draft at once (returned as soon as it is on the page), then the AI plan in the
 * background. Reuses `view` when only the depth changes.
 */
export function startCourse(ctx: Ctx, question: string, intent: Intent, candidates: Candidates | null, view?: CourseView): CourseView | null {
  const depth = (intent.depth === 'quick' ? 'complete' : intent.depth) as Exclude<Depth, 'quick'>;
  const c = candidates ?? gatherCandidates(ctx.engine, question, intent);
  const draft = draftCourse(question, intent, c, ctx.details, depth);
  if (!draft) return null;
  const v = view ?? new CourseView(ctx, question, intent, c);
  mounted = v;
  v.intent = intent;
  v.show(draft, true);
  if (!view) ctx.mount(v.root);
  ctx.status('Showing a first course from the Library. KEVOS® AI is planning your personalised version…');
  ctx.track({ type: 'learn', kind: 'course', id: depth });
  void planInBackground(ctx, question, intent, c, depth, draft, v);
  return v;
}

async function planInBackground(ctx: Ctx, question: string, intent: Intent, c: Candidates, depth: Exclude<Depth, 'quick'>, draft: Course, v: CourseView) {
  let plan = null;
  try {
    plan = await learnPlan(question, intent, depth,
      c.readings.map((r) => ({ id: r.url, title: r.title, book: r.book, topic: r.topic, about: r.about.slice(0, 200) })),
      c.tools.map((t) => ({ id: t.id, name: t.name, about: t.about.slice(0, 180), linked: t.linkedTo.map((u) => `R${c.readings.findIndex((r) => r.url === u) + 1}`).filter((x) => x !== 'R0') })));
  } catch (err) {
    if (err instanceof VisitorError) { v.show(draft, false, err.message); ctx.status(err.message); return; }
  }
  if (mounted !== v || v.intent !== intent) return; // a newer request or depth replaced this one
  const course = plan ? courseFromPlan(question, intent, plan, c, ctx.details, depth) : null;
  if (course) { v.show(course, false); ctx.status(`Your course is ready: ${course.modules.length} modules, ${lessons(course).length} lessons.`); }
  else { v.show(draft, false, 'KEVOS® AI could not plan a course right now, so this course is arranged from the Library chapters that best match your goal.'); ctx.status('Your course is ready (arranged from the Library).'); }
}
export type { CourseView };
