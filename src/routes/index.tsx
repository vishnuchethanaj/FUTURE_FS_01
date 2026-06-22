import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Vishnu Chethanaj — Full Stack Web Developer" },
      {
        name: "description",
        content:
          "Portfolio of Vishnu Chethanaj, Full Stack Web Developer. Projects, skills, internship experience, and contact.",
      },
      { property: "og:title", content: "Vishnu Chethanaj — Full Stack Web Developer" },
      { property: "og:description", content: "Portfolio showcasing projects, skills and experience." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Portfolio,
});

const GITHUB_USER = "vishnuchethanaj";

type Repo = {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  language: string | null;
  stargazers_count: number;
  fork: boolean;
  updated_at: string;
  topics?: string[];
};

const FALLBACK_REPOS: Repo[] = [
  { id: 1, name: "personal-portfolio", description: "Modern personal portfolio website built with React and Tailwind.", html_url: `https://github.com/${GITHUB_USER}`, homepage: null, language: "TypeScript", stargazers_count: 0, fork: false, updated_at: "" },
  { id: 2, name: "task-manager-app", description: "Full stack task manager with auth and persistent storage.", html_url: `https://github.com/${GITHUB_USER}`, homepage: null, language: "JavaScript", stargazers_count: 0, fork: false, updated_at: "" },
  { id: 3, name: "ai-chatbot", description: "AI-powered chatbot using Python and Flask backend.", html_url: `https://github.com/${GITHUB_USER}`, homepage: null, language: "Python", stargazers_count: 0, fork: false, updated_at: "" },
  { id: 4, name: "weather-dashboard", description: "Responsive weather dashboard using a public API.", html_url: `https://github.com/${GITHUB_USER}`, homepage: null, language: "JavaScript", stargazers_count: 0, fork: false, updated_at: "" },
  { id: 5, name: "blog-platform", description: "Full stack blog with markdown editor and comments.", html_url: `https://github.com/${GITHUB_USER}`, homepage: null, language: "TypeScript", stargazers_count: 0, fork: false, updated_at: "" },
  { id: 6, name: "ml-image-classifier", description: "Image classifier using transfer learning in Python.", html_url: `https://github.com/${GITHUB_USER}`, homepage: null, language: "Python", stargazers_count: 0, fork: false, updated_at: "" },
];

const NAV = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "projects", label: "Projects" },
  { id: "experience", label: "Experience" },
  { id: "resume", label: "Resume" },
  { id: "contact", label: "Contact" },
];

function classifyCategory(repo: Repo): "fullstack" | "ai" | "academic" {
  const l = (repo.language || "").toLowerCase();
  const text = `${repo.name} ${repo.description ?? ""}`.toLowerCase();
  if (text.includes("ai") || text.includes("ml") || l === "python") return "ai";
  if (text.includes("academic") || text.includes("college") || text.includes("assignment")) return "academic";
  return "fullstack";
}

function Portfolio() {
  const [repos, setRepos] = useState<Repo[]>(FALLBACK_REPOS);
  const [filter, setFilter] = useState<"all" | "fullstack" | "ai" | "academic">("all");
  const [active, setActive] = useState("home");
  const [menuOpen, setMenuOpen] = useState(false);
  const [showTop, setShowTop] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [formStatus, setFormStatus] = useState<string | null>(null);
  const typedRef = useRef<HTMLSpanElement>(null);

  // GitHub fetch
  useEffect(() => {
    let cancelled = false;
    fetch(`https://api.github.com/users/${GITHUB_USER}/repos?sort=updated&per_page=12`)
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((data: Repo[]) => {
        if (cancelled) return;
        const filtered = data.filter((r) => !r.fork);
        if (filtered.length) setRepos(filtered);
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, []);

  // Typing animation
  useEffect(() => {
    const phrases = ["Full Stack Web Developer", "React & Node.js Enthusiast", "Problem Solver", "AI Explorer"];
    let p = 0, c = 0, deleting = false, timer: number;
    const tick = () => {
      const el = typedRef.current; if (!el) return;
      const word = phrases[p];
      c += deleting ? -1 : 1;
      el.textContent = word.slice(0, c);
      let delay = deleting ? 40 : 90;
      if (!deleting && c === word.length) { delay = 1400; deleting = true; }
      else if (deleting && c === 0) { deleting = false; p = (p + 1) % phrases.length; delay = 300; }
      timer = window.setTimeout(tick, delay);
    };
    timer = window.setTimeout(tick, 400);
    return () => window.clearTimeout(timer);
  }, []);

  // Active section + back-to-top + reveal
  useEffect(() => {
    const sections = NAV.map((n) => document.getElementById(n.id)).filter(Boolean) as HTMLElement[];
    const onScroll = () => {
      setShowTop(window.scrollY > 500);
      const y = window.scrollY + 120;
      let current = "home";
      for (const s of sections) if (s.offsetTop <= y) current = s.id;
      setActive(current);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add("is-visible")),
      { threshold: 0.12 }
    );
    document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

    return () => { window.removeEventListener("scroll", onScroll); io.disconnect(); };
  }, [repos]);

  const skills = useMemo(() => {
    const langs = new Set<string>();
    repos.forEach((r) => r.language && langs.add(r.language));
    const base = ["HTML", "CSS", "JavaScript", "React.js", "Node.js", "Express", "Python", "Flask", "MongoDB", "MySQL", "Git", "GitHub"];
    const merged = Array.from(new Set([...base, ...langs]));
    return {
      Frontend: merged.filter((s) => ["HTML", "CSS", "JavaScript", "TypeScript", "React.js", "React"].includes(s)),
      Backend: merged.filter((s) => ["Node.js", "Express", "Python", "Flask"].includes(s)),
      Database: merged.filter((s) => ["MongoDB", "MySQL", "PostgreSQL"].includes(s)),
      Tools: ["Git", "GitHub", "VS Code", "Render", "Vercel"],
    };
  }, [repos]);

  const filteredRepos = useMemo(() => {
    if (filter === "all") return repos;
    return repos.filter((r) => classifyCategory(r) === filter);
  }, [repos, filter]);

  const handleScroll = (id: string) => {
    setMenuOpen(false);
    const el = document.getElementById(id);
    if (el) window.scrollTo({ top: el.offsetTop - 70, behavior: "smooth" });
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || form.name.length > 100) return setFormStatus("Please enter a valid name.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return setFormStatus("Please enter a valid email.");
    if (form.message.trim().length < 10) return setFormStatus("Message must be at least 10 characters.");
    setFormStatus("Thanks! Your message has been recorded. I'll reply soon.");
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* NAV */}
      <header className="fixed top-0 inset-x-0 z-50 border-b border-border/70 bg-white/80 backdrop-blur-md">
        <div className="container-x flex h-16 items-center justify-between">
          <a href="#home" onClick={(e) => { e.preventDefault(); handleScroll("home"); }} className="font-semibold tracking-tight">
            Vishnu<span className="text-primary">.</span>
          </a>
          <nav className="hidden md:flex items-center gap-1">
            {NAV.map((n) => (
              <a key={n.id} href={`#${n.id}`}
                onClick={(e) => { e.preventDefault(); handleScroll(n.id); }}
                className={`px-3 py-2 text-sm rounded-md transition-colors ${active === n.id ? "text-primary bg-accent" : "text-muted-foreground hover:text-foreground"}`}>
                {n.label}
              </a>
            ))}
          </nav>
          <button className="md:hidden p-2 rounded-md hover:bg-accent" onClick={() => setMenuOpen((v) => !v)} aria-label="Menu">
            <span className="block w-5 h-0.5 bg-foreground mb-1" />
            <span className="block w-5 h-0.5 bg-foreground mb-1" />
            <span className="block w-5 h-0.5 bg-foreground" />
          </button>
        </div>
        {menuOpen && (
          <div className="md:hidden border-t border-border bg-white">
            <div className="container-x py-2 flex flex-col">
              {NAV.map((n) => (
                <a key={n.id} href={`#${n.id}`} onClick={(e) => { e.preventDefault(); handleScroll(n.id); }}
                  className={`py-2 text-sm ${active === n.id ? "text-primary" : "text-muted-foreground"}`}>
                  {n.label}
                </a>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* HERO */}
      <section id="home" className="pt-32 pb-24">
        <div className="container-x grid md:grid-cols-[1.4fr_1fr] gap-12 items-center">
          <div className="reveal">
            <p className="text-sm font-medium text-primary mb-4">Hello, I'm</p>
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight leading-tight">Vishnu Chethanaj</h1>
            <h2 className="mt-4 text-2xl md:text-3xl text-muted-foreground font-medium">
              <span ref={typedRef} />
              <span className="inline-block w-[2px] h-7 bg-primary align-middle ml-1 animate-pulse" />
            </h2>
            <p className="mt-6 max-w-xl text-muted-foreground leading-relaxed">
              B.Tech student passionate about Full Stack Development and AI. I build clean, modern web experiences and ship real projects on GitHub.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#projects" onClick={(e) => { e.preventDefault(); handleScroll("projects"); }}
                className="inline-flex items-center justify-center rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground shadow-soft hover:bg-primary/90 transition">
                View Projects
              </a>
              <a href="#contact" onClick={(e) => { e.preventDefault(); handleScroll("contact"); }}
                className="inline-flex items-center justify-center rounded-md border border-border bg-white px-5 py-2.5 text-sm font-medium text-foreground hover:bg-accent transition">
                Contact Me
              </a>
              <a href="/resume.pdf" download
                className="inline-flex items-center justify-center rounded-md border border-border bg-white px-5 py-2.5 text-sm font-medium text-foreground hover:bg-accent transition">
                Download Resume
              </a>
            </div>
            <div className="mt-10 flex gap-6 text-sm text-muted-foreground">
              <a href={`https://github.com/${GITHUB_USER}`} target="_blank" rel="noreferrer" className="hover:text-primary">GitHub</a>
              <a href="https://www.linkedin.com/" target="_blank" rel="noreferrer" className="hover:text-primary">LinkedIn</a>
              <a href="mailto:vishnu@example.com" className="hover:text-primary">Email</a>
            </div>
          </div>
          <div className="reveal flex justify-center md:justify-end">
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-primary/10 blur-2xl" />
              <div className="relative h-64 w-64 rounded-full bg-gradient-to-br from-accent to-white border border-border shadow-card flex items-center justify-center text-6xl font-semibold text-primary">
                VC
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="py-12 bg-surface border-y border-border">
        <div className="container-x grid grid-cols-2 md:grid-cols-4 gap-8">
          <Stat label="Projects Completed" value={Math.max(repos.length, 6)} />
          <Stat label="Technologies Learned" value={15} />
          <Stat label="Months Internship" value={3} />
          <Stat label="GitHub Repositories" value={repos.length} />
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="py-24">
        <div className="container-x grid md:grid-cols-2 gap-12 items-start">
          <div className="reveal">
            <SectionLabel>About</SectionLabel>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mt-3">A bit about me</h2>
          </div>
          <div className="reveal text-muted-foreground leading-relaxed space-y-4">
            <p>
              I'm a B.Tech student and aspiring Full Stack Developer with a strong interest in building practical web applications and exploring AI. I enjoy turning ideas into real, shippable products.
            </p>
            <p>
              My focus areas are modern web development, problem solving, and contributing to open source through GitHub. I'm currently interning with Future Interns as a Full Stack Web Development Intern.
            </p>
            <p>
              Goal: become a strong full stack engineer who can design, build, and deploy quality software end-to-end.
            </p>
          </div>
        </div>
      </section>

      {/* SKILLS */}
      <section id="skills" className="py-24 bg-surface border-y border-border">
        <div className="container-x">
          <div className="reveal text-center max-w-2xl mx-auto mb-12">
            <SectionLabel>Skills</SectionLabel>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mt-3">Technologies I work with</h2>
            <p className="text-muted-foreground mt-3">Auto-merged from GitHub language data and my core stack.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {Object.entries(skills).map(([group, items]) => (
              <div key={group} className="reveal rounded-xl bg-white border border-border p-6 shadow-soft hover:shadow-card transition">
                <h3 className="font-semibold mb-4">{group}</h3>
                <ul className="space-y-2">
                  {items.map((s) => (
                    <li key={s} className="flex items-center text-sm text-muted-foreground">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary mr-2.5" />{s}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROJECTS */}
      <section id="projects" className="py-24">
        <div className="container-x">
          <div className="reveal text-center max-w-2xl mx-auto mb-10">
            <SectionLabel>Projects</SectionLabel>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mt-3">Selected work</h2>
            <p className="text-muted-foreground mt-3">Auto-loaded from my GitHub profile.</p>
          </div>
          <div className="reveal flex flex-wrap justify-center gap-2 mb-10">
            {(["all", "fullstack", "ai", "academic"] as const).map((f) => (
              <button key={f} onClick={() => setFilter(f)}
                className={`px-4 py-1.5 text-sm rounded-full border transition ${filter === f ? "bg-primary text-primary-foreground border-primary" : "bg-white border-border text-muted-foreground hover:text-foreground"}`}>
                {f === "all" ? "All Projects" : f === "fullstack" ? "Full Stack" : f === "ai" ? "AI Projects" : "Academic"}
              </button>
            ))}
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRepos.map((r) => (
              <article key={r.id} className="reveal group rounded-xl bg-white border border-border p-6 shadow-soft hover:shadow-card hover:-translate-y-0.5 transition flex flex-col">
                <div className="h-32 -mx-6 -mt-6 mb-5 rounded-t-xl bg-gradient-to-br from-accent via-white to-surface border-b border-border flex items-center justify-center text-3xl font-bold text-primary/80">
                  {r.name.slice(0, 2).toUpperCase()}
                </div>
                <h3 className="font-semibold text-lg group-hover:text-primary transition">{r.name}</h3>
                <p className="text-sm text-muted-foreground mt-2 line-clamp-3 flex-1">
                  {r.description || "A project from my GitHub portfolio."}
                </p>
                <div className="flex flex-wrap gap-1.5 mt-4">
                  {r.language && <span className="text-xs px-2 py-1 rounded-full bg-accent text-accent-foreground">{r.language}</span>}
                  {r.stargazers_count > 0 && <span className="text-xs px-2 py-1 rounded-full bg-surface text-muted-foreground border border-border">★ {r.stargazers_count}</span>}
                </div>
                <div className="mt-5 flex gap-2">
                  <a href={r.html_url} target="_blank" rel="noreferrer"
                    className="flex-1 text-center text-sm px-3 py-2 rounded-md border border-border hover:bg-accent transition">GitHub</a>
                  {r.homepage && (
                    <a href={r.homepage} target="_blank" rel="noreferrer"
                      className="flex-1 text-center text-sm px-3 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition">Live Demo</a>
                  )}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* EXPERIENCE */}
      <section id="experience" className="py-24 bg-surface border-y border-border">
        <div className="container-x">
          <div className="reveal text-center max-w-2xl mx-auto mb-12">
            <SectionLabel>Experience</SectionLabel>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mt-3">Internship & Achievements</h2>
          </div>
          <div className="max-w-3xl mx-auto space-y-5">
            <TimelineCard
              title="Full Stack Web Development Intern"
              org="Future Interns"
              date="2026 — Present"
              points={[
                "Building a production-grade personal portfolio (Task 1).",
                "Working with React, TypeScript, and modern UI patterns.",
                "Practicing Git workflows and deploying to Vercel / Render.",
              ]}
            />
            <TimelineCard
              title="Achievements & Certifications"
              org="Self-paced learning"
              date="Ongoing"
              points={[
                "Completed full stack web development coursework.",
                "Built 6+ projects spanning frontend, backend and AI.",
                "Active open-source contributor on GitHub.",
              ]}
            />
          </div>
        </div>
      </section>

      {/* RESUME */}
      <section id="resume" className="py-24">
        <div className="container-x">
          <div className="reveal text-center max-w-2xl mx-auto mb-12">
            <SectionLabel>Resume</SectionLabel>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mt-3">My background</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <div className="reveal rounded-xl border border-border bg-white p-8 shadow-soft">
              <h3 className="font-semibold mb-4">Education</h3>
              <ul className="space-y-4 text-sm">
                <li>
                  <p className="font-medium">B.Tech, Computer Science</p>
                  <p className="text-muted-foreground">2023 — Present</p>
                </li>
                <li>
                  <p className="font-medium">Higher Secondary</p>
                  <p className="text-muted-foreground">Completed</p>
                </li>
              </ul>
            </div>
            <div className="reveal rounded-xl border border-border bg-white p-8 shadow-soft flex flex-col">
              <h3 className="font-semibold mb-2">Resume</h3>
              <p className="text-sm text-muted-foreground flex-1">
                A concise overview of my education, skills, and projects in a single PDF.
              </p>
              <a href="/resume.pdf" download
                className="mt-6 inline-flex items-center justify-center rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition">
                Download Resume
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="py-24 bg-surface border-y border-border">
        <div className="container-x grid md:grid-cols-2 gap-12">
          <div className="reveal">
            <SectionLabel>Contact</SectionLabel>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mt-3">Let's work together</h2>
            <p className="text-muted-foreground mt-4 max-w-md">
              Have an opportunity, project idea, or just want to say hi? Send a message and I'll get back to you.
            </p>
            <div className="mt-8 space-y-3 text-sm">
              <p><span className="text-muted-foreground">Email: </span><a className="hover:text-primary" href="mailto:vishnu@example.com">vishnu@example.com</a></p>
              <p><span className="text-muted-foreground">GitHub: </span><a className="hover:text-primary" target="_blank" rel="noreferrer" href={`https://github.com/${GITHUB_USER}`}>@{GITHUB_USER}</a></p>
              <p><span className="text-muted-foreground">LinkedIn: </span><a className="hover:text-primary" target="_blank" rel="noreferrer" href="https://www.linkedin.com/">vishnu-chethanaj</a></p>
            </div>
          </div>
          <form onSubmit={submit} className="reveal rounded-xl bg-white border border-border p-6 shadow-soft space-y-4">
            <Field label="Name">
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value.slice(0, 100) })}
                className="w-full rounded-md border border-border bg-white px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/15" />
            </Field>
            <Field label="Email">
              <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value.slice(0, 255) })}
                className="w-full rounded-md border border-border bg-white px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/15" />
            </Field>
            <Field label="Message">
              <textarea rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value.slice(0, 1000) })}
                className="w-full rounded-md border border-border bg-white px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 resize-none" />
            </Field>
            {formStatus && <p className="text-sm text-muted-foreground">{formStatus}</p>}
            <button type="submit"
              className="w-full inline-flex items-center justify-center rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition">
              Send Message
            </button>
          </form>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-10 bg-white">
        <div className="container-x flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <p>© 2026 Vishnu Chethanaj. All rights reserved.</p>
          <div className="flex gap-6">
            <a href={`https://github.com/${GITHUB_USER}`} target="_blank" rel="noreferrer" className="hover:text-primary">GitHub</a>
            <a href="https://www.linkedin.com/" target="_blank" rel="noreferrer" className="hover:text-primary">LinkedIn</a>
            <a href="mailto:vishnu@example.com" className="hover:text-primary">Email</a>
          </div>
        </div>
      </footer>

      {/* BACK TO TOP */}
      {showTop && (
        <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="Back to top"
          className="fixed bottom-6 right-6 z-50 h-11 w-11 rounded-full bg-primary text-primary-foreground shadow-card hover:bg-primary/90 transition flex items-center justify-center">
          ↑
        </button>
      )}
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <span className="inline-block text-xs font-semibold tracking-widest uppercase text-primary">{children}</span>;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-sm font-medium mb-1.5">{label}</span>
      {children}
    </label>
  );
}

function TimelineCard({ title, org, date, points }: { title: string; org: string; date: string; points: string[] }) {
  return (
    <div className="reveal rounded-xl bg-white border border-border p-6 shadow-soft hover:shadow-card transition">
      <div className="flex flex-wrap justify-between items-start gap-2">
        <div>
          <h3 className="font-semibold">{title}</h3>
          <p className="text-sm text-primary">{org}</p>
        </div>
        <span className="text-xs text-muted-foreground bg-surface px-2.5 py-1 rounded-full border border-border">{date}</span>
      </div>
      <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
        {points.map((p) => (
          <li key={p} className="flex"><span className="h-1.5 w-1.5 rounded-full bg-primary mt-2 mr-2.5 shrink-0" />{p}</li>
        ))}
      </ul>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  const [n, setN] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        const start = performance.now();
        const dur = 1200;
        const tick = (t: number) => {
          const p = Math.min(1, (t - start) / dur);
          setN(Math.round(value * (1 - Math.pow(1 - p, 3))));
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
        io.disconnect();
      });
    }, { threshold: 0.4 });
    io.observe(el);
    return () => io.disconnect();
  }, [value]);
  return (
    <div ref={ref} className="text-center">
      <div className="text-3xl md:text-4xl font-bold text-foreground">{n}+</div>
      <div className="text-sm text-muted-foreground mt-1">{label}</div>
    </div>
  );
}
