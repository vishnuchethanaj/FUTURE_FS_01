import { createFileRoute } from "@tanstack/react-router";
import { Code2, Database, Github, Linkedin, Mail, ServerCog, Sparkles, Wrench } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import profileImage from "../image.png";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "VishnuChethana — Full Stack Web Developer" },
      {
        name: "description",
        content:
          "Portfolio of VishnuChethana, Full Stack Web Developer. Projects, skills, internship experience, and contact.",
      },
      { property: "og:title", content: "VishnuChethana — Full Stack Web Developer" },
      { property: "og:description", content: "Portfolio showcasing projects, skills and experience." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Portfolio,
});

const GITHUB_USER = "vishnuchethanaj";
const LINKEDIN_URL = "https://www.linkedin.com/in/vishnuchethanajogiparthi/";
const EMAIL = "vishnuchethana.j@gmail.com";
const PROFILE_IMAGE = profileImage;

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

const normalizeRepoName = (value: string) => value.toLowerCase().replace(/[^a-z0-9]/g, "");

const PINNED_PROJECTS: Repo[] = [
  {
    id: 1001,
    name: "Online-Shopping-Cart",
    description: "Online shopping cart project with a deployed live demo.",
    html_url: "https://github.com/vishnuchethanaj/Online-Shopping-Cart",
    homepage: "https://shopkart-nlya.onrender.com/",
    language: "JavaScript",
    stargazers_count: 0,
    fork: false,
    updated_at: "",
  },
  {
    id: 1002,
    name: "CCTV",
    description: "CCTV monitoring project with a deployed live demo.",
    html_url: "https://github.com/vishnuchethanaj/CCTV",
    homepage: "https://cctv-1-vn1h.onrender.com/",
    language: "Python",
    stargazers_count: 0,
    fork: false,
    updated_at: "",
  },
  {
    id: 1003,
    name: "Spam_Email_Detector",
    description: "Spam email detector with a deployed live demo.",
    html_url: "https://github.com/vishnuchethanaj/Spam_Email_Detector",
    homepage: "https://spam-email-detectorr.vercel.app/",
    language: "Python",
    stargazers_count: 0,
    fork: false,
    updated_at: "",
  },
  {
    id: 1004,
    name: "Mern-Stack-Project-Food-Donation",
    description: "Food donation platform built with MERN, deployed and demo-ready.",
    html_url: "https://github.com/vishnuchethanaj/Mern-Stack-Project-Food-Donation",
    homepage: "https://mern-stack-project-food-donation.onrender.com/",
    language: "JavaScript",
    stargazers_count: 0,
    fork: false,
    updated_at: "",
  },
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

function classifyCategory(repo: Repo): "fullstack" | "ai" | "mern stack" {
  const l = (repo.language || "").toLowerCase();
  const text = `${repo.name} ${repo.description ?? ""}`.toLowerCase();
  if (text.includes("ai") || text.includes("ml") || l === "python") return "ai";
  if (text.includes("academic") || text.includes("college") || text.includes("assignment")) return "academic";
  return "fullstack";
}

function Portfolio() {
  const [repos, setRepos] = useState<Repo[]>(FALLBACK_REPOS);
  const [filter, setFilter] = useState<"all" | "fullstack" | "ai" | "mern stack">("all");
  const [active, setActive] = useState("home");
  const [menuOpen, setMenuOpen] = useState(false);
  const [showTop, setShowTop] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [formStatus, setFormStatus] = useState<string | null>(null);
  const typedRef = useRef<HTMLSpanElement>(null);

  // GitHub fetch
  useEffect(() => {
    let cancelled = false;
    const projectLinks: Record<string, { github: string; render?: string }> = {
      autocorrectionai: {
        github: "https://github.com/vishnuchethanaj/Autocorrection-AI",
        render: "https://autocorrection-ai.onrender.com/",
      },
      dealnestcoupons: {
        github: "https://github.com/vishnuchethanaj/Dealnest-Coupons",
        render: "https://dealnest-frontend.onrender.com/",
      },
      heartdiseaseprediction: {
        github: "https://github.com/vishnuchethanaj/Heart_Disease_Prediction",
        render: "https://heart-disease-prediction-2-lff4.onrender.com/",
      },
      onlineshoppingcart: {
        github: "https://github.com/vishnuchethanaj/Online-Shopping-Cart",
        render: "https://shopkart-nlya.onrender.com/",
      },
      cctv: {
        github: "https://github.com/vishnuchethanaj/CCTV",
        render: "https://cctv-1-vn1h.onrender.com/",
      },
      spamemaildetector: {
        github: "https://github.com/vishnuchethanaj/Spam_Email_Detector",
        render: "https://spam-email-detectorr.vercel.app/",
      },
      mernstackprojectfooddonation: {
        github: "https://github.com/vishnuchethanaj/Mern-Stack-Project-Food-Donation",
        render: "https://mern-stack-project-food-donation.onrender.com/",
      }
    };
    fetch(`https://api.github.com/users/${GITHUB_USER}/repos?sort=updated&per_page=100`)
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((data: Repo[]) => {
        if (cancelled) return;
        const enriched = data
          .filter((r) => !r.fork)
          .map((r) => {
            const link = projectLinks[normalizeRepoName(r.name)];
            return {
              ...r,
              html_url: link?.github || r.html_url,
              homepage: link?.render || r.homepage,
            };
          });
        const existingNames = new Set(enriched.map((r) => normalizeRepoName(r.name)));
        const pinned = PINNED_PROJECTS.filter((project) => !existingNames.has(normalizeRepoName(project.name)));
        setRepos([...pinned, ...enriched]);
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, []);

  // Typing animation for hero phrases
  useEffect(() => {
    const phrases = ["Full Stack Web Developer", "Problem Solver", "AI Explorer"];
    let phraseIndex = 0;
    let charIndex = 0;
    let deleting = false;
    let timer: number | undefined;

    const tick = () => {
      const el = typedRef.current;
      if (!el) return;
      const current = phrases[phraseIndex];
      if (!deleting) {
        charIndex++;
        el.textContent = current.slice(0, charIndex);
        if (charIndex === current.length) {
          deleting = true;
          timer = window.setTimeout(tick, 1200);
          return;
        }
      } else {
        charIndex--;
        el.textContent = current.slice(0, charIndex);
        if (charIndex === 0) {
          deleting = false;
          phraseIndex = (phraseIndex + 1) % phrases.length;
        }
      }
      timer = window.setTimeout(tick, deleting ? 40 : 90);
    };

    timer = window.setTimeout(tick, 400);
    return () => { if (timer) window.clearTimeout(timer); };
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
  }, [repos, filter]);

  const skills = useMemo(() => {
    const langs = new Set<string>();
    repos.forEach((r) => r.language && langs.add(r.language));
    const base = ["HTML", "CSS", "JavaScript", "React.js", "Node.js", "Express", "Python", "Flask", "MongoDB", "MySQL", "Git", "GitHub"];
    const merged = Array.from(new Set([...base, ...langs]));
    return {
      Frontend: merged.filter((s) => ["HTML", "CSS", "JavaScript", "React.js", "React"].includes(s)),
      Backend: merged.filter((s) => ["Node.js", "Express", "Python", "Flask"].includes(s)),
      Database: merged.filter((s) => ["MongoDB", "MySQL", ].includes(s)),
      Tools: ["Git", "GitHub", "VS Code", "Render"],
    };
  }, [repos]);

  const skillCards = useMemo(() => ([
    {
      label: "Frontend",
      description: "Interfaces, layout systems, and interactive UI built for desktop and mobile.",
      icon: Code2,
      accent: "from-blue-500/10 via-white to-sky-50",
      emoji: "UI",
      items: skills.Frontend,
      highlight: "Responsive web apps",
    },
    {
      label: "Backend",
      description: "Application logic, APIs, and server-side flows that keep projects running.",
      icon: ServerCog,
      accent: "from-emerald-500/10 via-white to-green-50",
      emoji: "API",
      items: skills.Backend,
      highlight: "APIs and services",
    },
    {
      label: "Database",
      description: "Data modeling and storage that supports clean, reliable app behavior.",
      icon: Database,
      accent: "from-amber-500/10 via-white to-orange-50",
      emoji: "DB",
      items: skills.Database,
      highlight: "Data and persistence",
    },
    {
      label: "Tools",
      description: "The workflow stack I use to ship, track, and deploy projects efficiently.",
      icon: Wrench,
      accent: "from-violet-500/10 via-white to-fuchsia-50",
      emoji: "OPS",
      items: skills.Tools,
      highlight: "Build and deploy",
    },
  ]), [skills]);

  const filteredRepos = useMemo(() => {
    const excluded = ["it", "Lost-Found"];
    const filtered = repos.filter((r) => !excluded.includes(r.name) && Boolean(r.homepage));
    if (filter === "all") return filtered;
    return filtered.filter((r) => classifyCategory(r) === filter);
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
    <div className="relative min-h-screen bg-background text-foreground">
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-sky-50/60 via-white to-white" />
        <div className="absolute inset-0 bg-grid-pattern opacity-60" />
        <div className="absolute left-10 top-20 h-72 w-72 rounded-full bg-sky-400/20 blur-3xl" />
        <div className="absolute right-10 top-56 h-56 w-56 rounded-full bg-blue-300/15 blur-3xl" />
        <div className="absolute left-1/2 top-[22rem] h-80 w-80 -translate-x-1/2 rounded-full bg-cyan-200/10 blur-3xl" />
      </div>
      {/* NAV */}
      <header className="fixed top-0 inset-x-0 z-50 border-b border-border/10 bg-white/70 backdrop-blur-xl shadow-soft">
        <div className="container-x flex h-16 items-center justify-between">
          <a href="#home" onClick={(e) => { e.preventDefault(); handleScroll("home"); }} className="font-semibold tracking-tight text-foreground transition hover:text-primary">
            Vishnuchethana <span className="text-primary">!</span>
          </a>
          <nav className="hidden md:flex items-center gap-1">
            {NAV.map((n) => (
              <a key={n.id} href={`#${n.id}`}
                onClick={(e) => { e.preventDefault(); handleScroll(n.id); }}
                className={`px-2.5 py-1.5 text-sm rounded-lg transition duration-200 ease-out ${active === n.id ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-foreground hover:bg-accent/70"}`}>
                {n.label}
              </a>
            ))}
          </nav>
          <button className="md:hidden p-1.5 rounded-lg transition duration-200 ease-out hover:bg-accent/70" onClick={() => setMenuOpen((v) => !v)} aria-label="Menu">
            <span className="block w-5 h-0.5 bg-foreground mb-1" />
            <span className="block w-5 h-0.5 bg-foreground mb-1" />
            <span className="block w-5 h-0.5 bg-foreground" />
          </button>
        </div>
        {menuOpen && (
          <div className="md:hidden border-t border-border/10 bg-white/90 backdrop-blur-lg">
            <div className="container-x py-2 flex flex-col">
              {NAV.map((n) => (
                <a key={n.id} href={`#${n.id}`} onClick={(e) => { e.preventDefault(); handleScroll(n.id); }}
                  className={`py-2 px-2 text-sm rounded-lg transition duration-200 ease-out ${active === n.id ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-foreground hover:bg-accent/70"}`}>
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
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight leading-tight">JOGIPARTHI VISHNUCHTHANA</h1>
            <h2 className="mt-4 text-2xl md:text-3xl text-muted-foreground font-medium">
              <span ref={typedRef} />
              <span className="inline-block w-[2px] h-7 bg-primary align-middle ml-1 animate-pulse" />
            </h2>
            <p className="mt-6 max-w-xl text-muted-foreground leading-relaxed">
              B.Tech Computer Science Student specializing in
Full Stack Development and    AI-powered applications.
Passionate about building scalable web solutions,
modern user experiences, and real-world projects.
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
            <div className="mt-10 flex gap-6 text-sm text-muted-foreground items-center">
              <a href={`https://github.com/${GITHUB_USER}`} target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-primary">
                <Github size={16} /> <span>GitHub</span>
              </a>
              <a href={LINKEDIN_URL} target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-primary">
                <Linkedin size={16} /> <span>LinkedIn</span>
              </a>
              <a href={`mailto:${EMAIL}`} className="flex items-center gap-2 hover:text-primary">
                <Mail size={16} /> <span>Email</span>
              </a>
            </div>
          </div>
          <div className="reveal flex justify-center md:justify-end">
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-primary/10 blur-2xl" />
              <div className="relative h-80 w-80 md:h-96 md:w-96 overflow-hidden rounded-full border border-border shadow-card bg-white">
                <img
                  src={PROFILE_IMAGE}
                  alt="Profile photo of Vishnu Chethana"
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 rounded-full ring-4 ring-primary/20 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="py-12 bg-surface border-y border-border">
        <div className="container-x grid grid-cols-2 md:grid-cols-4 gap-8">
          <Stat label="Projects Completed" value={(repos.length,9)} />
          <Stat label="Technologies Learned" value={9} />
          <Stat label="Months Internship" value={2} />
          <Stat label="GitHub Repositories" value={repos.length} />
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="py-24">
        <div className="container-x grid md:grid-cols-2 gap-12 items-start">
          <div className="reveal">
            <SectionLabel>About</SectionLabel>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mt-3">About Me</h2>
          </div>
          <div className="reveal text-muted-foreground leading-relaxed space-y-4">
            <p>
              I am a B.Tech Computer Science student at KLH University with a strong interest in Full Stack Development and Artificial Intelligence.
            </p>
            <p>
             Over the past year, I have built multiple web applications including AI-based tools, e-commerce projects, and data-driven applications using HTML, CSS, JavaScript, React, Python, Flask, and MySQL.
            </p>
            <p>
              I enjoy building projects, learning new technologies, and improving my development skills through practical experience. My goal is to grow as a developer and build useful software.
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
          <div className="grid lg:grid-cols-[1.1fr_1.9fr] gap-6 items-stretch">
            <div className="reveal rounded-2xl border border-border bg-white p-8 shadow-soft relative overflow-hidden">
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary via-sky-400 to-emerald-400" />
              <div className="flex items-center gap-3 mb-5">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-card">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold tracking-[0.3em] uppercase text-primary">Skill snapshot</p>
                  <h3 className="text-xl font-semibold mt-1">What I actually build with</h3>
                </div>
              </div>
              <p className="text-sm leading-6 text-muted-foreground">
                These are the tools and technologies that show up in my portfolio work, internship tasks, and day-to-day development.
              </p>
              <div className="mt-8 grid grid-cols-2 gap-3">
                <div className="rounded-2xl border border-border bg-surface p-4">
                  <p className="text-2xl font-bold text-foreground">4</p>
                  <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground mt-1">Core areas</p>
                </div>
                <div className="rounded-2xl border border-border bg-surface p-4">
                  <p className="text-2xl font-bold text-foreground">15+</p>
                  <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground mt-1">Tools tracked</p>
                </div>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-5">
              {skillCards.map(({ label, description, icon: Icon, accent, emoji, items, highlight }) => (
                <article key={label} className="reveal group rounded-2xl border border-border bg-white p-6 shadow-soft hover:shadow-card transition overflow-hidden relative">
                  <div className={`absolute inset-0 bg-gradient-to-br ${accent} opacity-80`} />
                  <div className="relative">
                    <div className="flex items-center justify-between gap-4 mb-4">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-background border border-border shadow-soft">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <span className="text-[10px] font-semibold tracking-[0.28em] uppercase text-muted-foreground bg-white/80 px-2.5 py-1 rounded-full border border-border">
                        {emoji}
                      </span>
                    </div>
                    <h3 className="font-semibold text-lg">{label}</h3>
                    <p className="text-sm text-muted-foreground mt-2 leading-6">{description}</p>
                    <p className="mt-4 text-xs font-semibold uppercase tracking-[0.24em] text-primary">{highlight}</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {items.map((s) => (
                        <span key={s} className="inline-flex items-center rounded-full border border-border bg-white/90 px-3 py-1.5 text-xs font-medium text-foreground shadow-sm">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </article>
              ))}
            </div>
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
            {(["all", "fullstack", "ai"] as const).map((f) => (
              <button key={f} onClick={() => setFilter(f)}
                className={`px-4 py-1.5 text-sm rounded-full border transition ${filter === f ? "bg-primary text-primary-foreground border-primary" : "bg-white border-border text-muted-foreground hover:text-foreground"}`}>
                {f === "all" ? "All Projects" : f === "fullstack" ? "Full Stack" : f === "ai" ? "AI Projects" : "All Projects"}
              </button>
            ))}
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRepos.map((r) => (
              <article key={r.id} className="reveal group rounded-xl bg-white border border-border p-6 shadow-soft hover:shadow-card hover:-translate-y-0.5 transition flex flex-col">
                <div className="h-32 -mx-6 -mt-6 mb-5 rounded-t-xl bg-gradient-to-br from-accent via-white to-surface border-b border-border flex items-center justify-center text-2xl font-bold text-foreground px-4 text-center">
                  <span className="truncate">{r.name}</span>
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
                "Practicing Git workflows and deploying to Render.",
              ]}
            />
            <TimelineCard
              title="PCAP Certified Associate Python Programmer"
              org="Python Institute"
              date="March 31, 2026"
              points={[
                "Earned PCAP-31-03 certification in General-Purpose Programming.",
                "Recognized for proficiency in Python fundamentals and programming concepts.",
                "Validated skills in data handling, control flow, and object-oriented programming.",
              ]}
            />
            <Dialog>
              <DialogTrigger asChild>
                <button className="w-full text-left reveal rounded-xl bg-white border border-border p-6 shadow-soft hover:shadow-card transition">
                  <div className="flex flex-wrap justify-between items-start gap-2">
                    <div>
                      <h3 className="font-semibold">Salesforce Certified Agentforce Specialist</h3>
                      <p className="text-sm text-primary">Salesforce</p>
                    </div>
                    <span className="text-xs text-muted-foreground bg-surface px-2.5 py-1 rounded-full border border-border">December 29, 2025</span>
                  </div>
                  <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                    <li className="flex"><span className="h-1.5 w-1.5 rounded-full bg-primary mt-2 mr-2.5 shrink-0" />Completed Salesforce Agentforce Specialist certification requirements.</li>
                    <li className="flex"><span className="h-1.5 w-1.5 rounded-full bg-primary mt-2 mr-2.5 shrink-0" />Demonstrated understanding of Salesforce Agentforce tools and best practices.</li>
                    <li className="flex"><span className="h-1.5 w-1.5 rounded-full bg-primary mt-2 mr-2.5 shrink-0" />Certified through Salesforce Trailhead credential verification.</li>
                  </ul>
                </button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Download Original Certificate</DialogTitle>
                  <DialogDescription>Use the button below to download the original certificate file directly.</DialogDescription>
                </DialogHeader>
                <div className="mt-6 rounded-xl border border-border bg-surface p-6 text-sm text-muted-foreground">
                  The certificate file is only available as a direct download. No preview image is displayed here.
                </div>
                <DialogFooter>
                  <a
                    href="/salesforce-agentforce-specialist.pdf"
                    download="Salesforce-Agentforce-Specialist.pdf"
                    className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition"
                  >
                    Download Certificate
                  </a>
                  <DialogClose className="inline-flex items-center justify-center rounded-md border border-border bg-white px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-surface transition">
                    Close
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <Dialog>
              <DialogTrigger asChild>
                <button className="w-full text-left reveal rounded-xl bg-white border border-border p-6 shadow-soft hover:shadow-card transition">
                  <div className="flex flex-wrap justify-between items-start gap-2">
                    <div>
                      <h3 className="font-semibold">Certified Advanced Automation Professional</h3>
                      <p className="text-sm text-primary">Automation Anywhere</p>
                    </div>
                    <span className="text-xs text-muted-foreground bg-surface px-2.5 py-1 rounded-full border border-border">December 26, 2025</span>
                  </div>
                  <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                    <li className="flex"><span className="h-1.5 w-1.5 rounded-full bg-primary mt-2 mr-2.5 shrink-0" />Earned Advanced Automation Professional certification from Automation Anywhere.</li>
                    <li className="flex"><span className="h-1.5 w-1.5 rounded-full bg-primary mt-2 mr-2.5 shrink-0" />Demonstrated advanced RPA and automation development skills.</li>
                    <li className="flex"><span className="h-1.5 w-1.5 rounded-full bg-primary mt-2 mr-2.5 shrink-0" />Validated through Automation Anywhere certification credentialing.</li>
                  </ul>
                </button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Download Original Certificate</DialogTitle>
                  <DialogDescription>Use the button below to download the original certificate file directly.</DialogDescription>
                </DialogHeader>
                <div className="mt-6 rounded-xl border border-border bg-surface p-6 text-sm text-muted-foreground">
                  The certificate file is only available as a direct download. No preview image is displayed here.
                </div>
                <DialogFooter>
                  <a
                    href="/automation-anywhere-advanced-automation-professional.pdf"
                    download="Automation-Anywhere-Advanced-Automation-Professional.pdf"
                    className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition"
                  >
                    Download Certificate
                  </a>
                  <DialogClose className="inline-flex items-center justify-center rounded-md border border-border bg-white px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-surface transition">
                    Close
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
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
                  <p className="font-medium">B.Tech, Computer Science | K L H University</p>
                  <p className="text-muted-foreground">2024 — 2028</p>
                </li>
                <li>
                  <p className="font-medium">Higher Secondary | Sri Chaitanya Junior College</p>
                  <p className="text-muted-foreground">2022 — 2024 </p>
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
              <p className="flex items-center gap-2"><Mail className="h-4 w-4 text-muted-foreground" /><a className="inline-flex items-center gap-2 hover:text-primary" href="mailto:vishnuchethana.j@gmail.com">vishnuchethana.j@gmail.com</a></p>
              <p className="flex items-center gap-2"><Github className="h-4 w-4 text-muted-foreground" /><a className="inline-flex items-center gap-2 hover:text-primary" target="_blank" rel="noreferrer" href="https://github.com/vishnuchethanaj">GitHub</a></p>
              <p className="flex items-center gap-2"><Linkedin className="h-4 w-4 text-muted-foreground" /><a className="inline-flex items-center gap-2 hover:text-primary" target="_blank" rel="noreferrer" href="https://www.linkedin.com/in/vishnuchethanajogiparthi/">LinkedIn</a></p>
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
          <p>© VishnuChethanaj. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="https://github.com/vishnuchethanaj" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 hover:text-primary"><Github className="h-4 w-4" />GitHub</a>
            <a href="https://www.linkedin.com/in/vishnuchethanajogiparthi/" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 hover:text-primary"><Linkedin className="h-4 w-4" />LinkedIn</a>
            <a href="mailto:vishnuchethana.j@gmail.com" className="inline-flex items-center gap-2 hover:text-primary"><Mail className="h-4 w-4" />Email</a>
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
