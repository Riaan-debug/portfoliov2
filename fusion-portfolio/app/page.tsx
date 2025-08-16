"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  Code2,
  Download,
  Github,
  Linkedin,
  Mail,
  Moon,
  Sun,
  Zap,
  Gauge,
  Star,
  ExternalLink,
  Smartphone,
  Server,
  Database,
  ShieldCheck,
  Sparkles,
  Layers,
  Cpu,
} from "lucide-react";

/**
 * Fusion Portfolio — a single‑file React component you can drop into a Next.js page or CRA.
 * Style: TailwindCSS (no extra UI libs). Animations: Framer Motion. Icons: lucide-react.
 * 
 * Design influences:
 * - DHH (Rails): opinionated simplicity, obvious defaults, readable typography
 * - Adrian Holovaty (Django): clear structure, pragmatic summaries, emphasis on reusability
 * - Addy Osmani: performance first — lazy images, reduced motion, code‑split friendly
 * - Sarah Drasner: tasteful motion, micro‑interactions, SVG flourishes
 * - John Resig: progressive enhancement, accessible interactions
 * - Gergely Orosz: outcome‑oriented copy; metrics over buzzwords
 * 
 * How to use:
 * 1) Next.js (recommended): create app/(or pages)/page.tsx, paste this file's default export.
 * 2) Ensure Tailwind is configured. Minimal instructions: https://tailwindcss.com/docs/guides/nextjs
 * 3) Install deps: npm i framer-motion lucide-react
 * 4) Replace the DATA section below with your details, links, and project screenshots.
 * 5) Hook up the "Download PDF CV" to your static PDF (public/Riaan_van_Rhyn_CV.pdf).
 */

// ====== DATA (edit me) ======================================================
const ME = {
  name: "Riaan van Rhyn",
  title: "Full‑Stack Web Developer",
  location: "Gauteng, South Africa",
  email: "riaan.vanrhyn@example.com",
  github: "https://github.com/Riaan-debug",
  linkedin: "https://www.linkedin.com/in/riaan-van-rhyn/",
  pdf: "/Riaan_van_Rhyn_CV.pdf", // put your CV into /public and keep this path
  blurb:
    "I'm a teacher transitioning to web development, passionate about building accessible web apps. I completed a full-stack web development course with HyperionDev and I'm eager to bring my problem-solving skills and dedication to a development team.",
  metrics: [
    { label: "Projects built", value: "5+" },
    { label: "Learning commitment", value: "100%" },
    { label: "Career transition", value: "In progress" },
  ],
  stacks: {
    frontend: ["React", "Next.js", "TypeScript", "TailwindCSS"],
    backend: ["Node.js", "Express", "JavaScript"],
    data: ["MongoDB", "SQLite"],
    tooling: ["Git", "VS Code", "Cursor", "HyperionDev"],
  },
};

const PROJECTS: Array<{
  name: string;
  description: string;
  outcomes: string[];
  tech: string[];
  href?: string;
  repo?: string;
  image?: string; // /public paths recommended
}> = [
  {
    name: "Learning Portfolio",
    description:
      "My first capstone project with HyperionDev - a personal portfolio built with vanilla web technologies to showcase my initial web development skills.",
    outcomes: [
      "Responsive design with CSS Grid and Flexbox",
      "Interactive elements with vanilla JavaScript",
      "Clean, semantic HTML structure",
    ],
    tech: ["HTML", "CSS", "JavaScript"],
    href: "",
    repo: "https://github.com/Riaan-debug/First-Portfolio",
    image: "/images/riaan-van-rhyn-portfolio-screenshot.png",
  },
  {
    name: "Fitness Gear Web Store",
    description:
      "A modern e-commerce web store demo built with React, Redux, and React-Bootstrap. Features user authentication, shopping cart management, and payment processing. This was my first and only deployment experience, successfully getting the site live on Render.",
    outcomes: [
      "Full-stack React application with Redux state management",
      "User authentication and shopping cart functionality",
      "Responsive design with modern UI/UX principles",
    ],
    tech: ["React", "Redux", "JavaScript", "React-Bootstrap"],
    href: "https://web-store-0anw.onrender.com/",
    repo: "https://github.com/Riaan-debug/Web-Store",
    image: "/images/fitness-store-screenshot.png",
  },
  {
    name: "Vibez - iTunes Search App",
    description:
      "A modern music search application built with TypeScript and vanilla web technologies. Features iTunes API integration, search functionality, and a favorites system with a sleek dark theme UI.",
    outcomes: [
      "Full-stack development with client-server architecture",
      "TypeScript implementation for type safety",
      "API integration and data management",
      "Modern dark theme UI with responsive design",
    ],
    tech: ["TypeScript", "CSS", "JavaScript", "HTML"],
    href: "",
    repo: "https://github.com/Riaan-debug/vibez-capstone",
    image: "/images/vibez-app-screenshot.png",
  },
];

// ====== UTILITIES ===========================================================
function classNames(...xs: Array<string | false | undefined>) {
  return xs.filter(Boolean).join(" ");
}

// Map technology names to logo files
function getLogoPath(tech: string): string | null {
  const logoMap: Record<string, string> = {
    'React': '/logos/react.svg',
    'Next.js': '/logos/nextjs.svg',
    'TypeScript': '/logos/typescript.svg',
    'TailwindCSS': '/logos/tailwindcss.svg',
    'Node.js': '/logos/nodejs.svg',
    'Express': '/logos/express.svg',
    'JavaScript': '/logos/javascript.svg',
    'MongoDB': '/logos/mongodb.svg',
    'SQLite': '/logos/sqlite.svg',
    'Git': '/logos/git.svg',
  };
  
  return logoMap[tech] || null;
}

// Simple prefers-reduced-motion hook
function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  useEffect(() => {
    if (!mounted) return;
    const m = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(m.matches);
    const onChange = () => setReduced(m.matches);
    m.addEventListener?.("change", onChange);
    return () => m.removeEventListener?.("change", onChange);
  }, [mounted]);
  
  return mounted ? reduced : false;
}

// ====== COMPONENTS ==========================================================
const Section: React.FC<{ id?: string; title: string; icon?: React.ReactNode; className?: string; children: React.ReactNode }> = ({ id, title, icon, className, children }) => (
  <section id={id} className={classNames("max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14", className)}>
    <div className="flex items-center gap-3 mb-8">
      <div className="p-2 rounded-xl bg-gradient-to-br from-zinc-100 to-zinc-200 dark:from-zinc-800 dark:to-zinc-700 border border-zinc-200/60 dark:border-zinc-700/60">
        {icon}
      </div>
      <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">{title}</h2>
    </div>
    {children}
  </section>
);

const Pill: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span className="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium border border-zinc-200 dark:border-zinc-700 bg-white/70 dark:bg-zinc-900/50 backdrop-blur">
    {children}
  </span>
);

const Metric: React.FC<{ label: string; value: string }>
= ({ label, value }) => (
  <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 p-4 bg-white/60 dark:bg-zinc-900/40">
    <div className="text-2xl font-semibold">{value}</div>
    <div className="text-xs opacity-70">{label}</div>
  </div>
);

const ProjectCard: React.FC<{ p: (typeof PROJECTS)[number] }>
= ({ p }) => (
  <motion.article
    initial={{ opacity: 0, y: 8 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.2 }}
    transition={{ duration: 0.4 }}
    className="group grid grid-cols-1 md:grid-cols-5 gap-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-4 hover:shadow-md bg-white/70 dark:bg-zinc-900/40"
  >
    <div className="md:col-span-2 rounded-xl overflow-hidden border border-zinc-200/60 dark:border-zinc-700/60 bg-zinc-100 dark:bg-zinc-800 aspect-video">
      {p.image ? (
        <img loading="lazy" src={p.image} alt={p.name} className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full grid place-items-center text-zinc-400">no image</div>
      )}
    </div>
    <div className="md:col-span-3 flex flex-col gap-3">
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-lg font-semibold tracking-tight">{p.name}</h3>
        <div className="flex gap-2">
          {p.href && (
            <a aria-label="Live demo" href={p.href} target="_blank" rel="noreferrer" className="p-2 rounded-lg border hover:bg-zinc-50 dark:hover:bg-zinc-800">
              <ExternalLink className="w-4 h-4" />
            </a>
          )}
          {p.repo && (
            <a aria-label="Repository" href={p.repo} target="_blank" rel="noreferrer" className="p-2 rounded-lg border hover:bg-zinc-50 dark:hover:bg-zinc-800">
              <Github className="w-4 h-4" />
            </a>
          )}
        </div>
      </div>
      <p className="text-sm opacity-80">{p.description}</p>
      <ul className="text-sm list-disc pl-5 space-y-1">
        {p.outcomes.map((o, i) => (
          <li key={i}>{o}</li>
        ))}
      </ul>
      <div className="flex flex-wrap gap-2 pt-2">
        {p.tech.map((t) => (
          <Pill key={t}>{t}</Pill>
        ))}
      </div>
    </div>
  </motion.article>
);

// ====== MAIN COMPONENT ======================================================
export default function PortfolioFusion() {
  const [dark, setDark] = useState<boolean | null>(null);
  const [mounted, setMounted] = useState(false);
  const reducedMotion = useReducedMotion();

  // Move useMemo before any conditional returns to follow Rules of Hooks
  const heroVariants = useMemo(
    () => ({
      hidden: { opacity: 0, y: reducedMotion ? 0 : 10 },
      show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    }),
    [reducedMotion]
  );

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // initial theme - only run on client
  useEffect(() => {
    if (!mounted) return;
    const preferredDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    setDark(preferredDark);
  }, [mounted]);

  useEffect(() => {
    if (dark === null || !mounted) return;
    document.documentElement.classList.toggle("dark", dark);
  }, [dark, mounted]);

  // Don't render theme-dependent content until mounted
  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-zinc-50 via-white to-zinc-100 text-zinc-900">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-10">
          <div className="animate-pulse">
            <div className="h-8 bg-zinc-200 rounded w-48 mb-4"></div>
            <div className="h-4 bg-zinc-200 rounded w-32 mb-2"></div>
            <div className="h-4 bg-zinc-200 rounded w-64"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 via-white to-zinc-100 dark:from-zinc-950 dark:via-zinc-950 dark:to-zinc-900 text-zinc-900 dark:text-zinc-50">
      {/* NAV */}
      <header className="sticky top-0 z-40 backdrop-blur border-b border-zinc-200/60 dark:border-zinc-800/60 bg-white/60 dark:bg-zinc-950/40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          <a href="#home" className="font-semibold tracking-tight">{ME.name}</a>
          <nav className="hidden sm:flex items-center gap-6 text-sm">
            <a href="#projects" className="hover:underline">Projects</a>
            <a href="#skills" className="hover:underline">Tech Stack</a>
            <a href="#principles" className="hover:underline">Principles</a>
            <a href="#contact" className="hover:underline">Contact</a>
          </nav>
          <div className="flex items-center gap-2">
            <a href={ME.pdf} className="hidden sm:inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border hover:bg-zinc-50 dark:hover:bg-zinc-800 text-sm" download>
              <Download className="w-4 h-4" /> <span>Download PDF</span>
            </a>
            <button aria-label="Toggle theme" className="p-2 rounded-xl border hover:bg-zinc-50 dark:hover:bg-zinc-800" onClick={() => setDark((d) => !d)}>
              {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </header>

      {/* HERO */}
      <motion.section
        id="home"
        variants={heroVariants}
        initial="hidden"
        animate="show"
        className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-10"
      >
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <div className="inline-flex items-center gap-2 text-xs text-zinc-600 dark:text-zinc-400">
              <span className="inline-flex h-2 w-2 rounded-full bg-green-500" aria-hidden />
              Available for freelance & roles
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight mt-3">
              {ME.name}
            </h1>
            <p className="text-lg mt-2 opacity-80">{ME.title} • {ME.location}</p>
            <p className="mt-5 max-w-prose leading-relaxed">
              {ME.blurb}
            </p>
            <div className="flex flex-wrap gap-3 mt-6">
              <a href={ME.github} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border hover:bg-zinc-50 dark:hover:bg-zinc-800">
                <Github className="w-4 h-4"/> GitHub
              </a>
              <a href={ME.linkedin} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border hover:bg-zinc-50 dark:hover:bg-zinc-800">
                <Linkedin className="w-4 h-4"/> LinkedIn
              </a>
              <a href={`mailto:${ME.email}`} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border hover:bg-zinc-50 dark:hover:bg-zinc-800">
                <Mail className="w-4 h-4"/> Email me
              </a>
            </div>
            <div className="grid grid-cols-3 gap-3 mt-6">
              {ME.metrics.map((m) => (
                <Metric key={m.label} label={m.label} value={m.value} />
              ))}
            </div>
          </div>
          {/* QR / Preview */}
          <div className="relative">
            <div className="absolute -inset-4 -z-10 bg-gradient-to-tr from-fuchsia-300/30 to-sky-300/30 dark:from-fuchsia-500/10 dark:to-sky-500/10 rounded-3xl blur-2xl" aria-hidden />
            <div className="rounded-3xl border border-zinc-200 dark:border-zinc-800 p-6 bg-white/70 dark:bg-zinc-900/40">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="text-sm font-medium">Scan for full portfolio</div>
                  <div className="text-xs opacity-70">Add this QR to your PDF CV</div>
                </div>
                {/* Placeholder QR (swap src with a generated QR from your prod URL) */}
                <div className="p-2 rounded-xl border bg-white dark:bg-zinc-900">
                  <img src="/logos/qr-placeholder.svg" alt="QR code" className="w-28 h-28" loading="lazy" />
                </div>
              </div>
              <div className="mt-6 grid grid-cols-3 gap-3 text-center">
                <div className="rounded-xl border p-3">
                  <Smartphone className="w-4 h-4 mx-auto mb-1" />
                  <div className="text-xs">Responsive</div>
                </div>
                <div className="rounded-xl border p-3">
                  <Gauge className="w-4 h-4 mx-auto mb-1" />
                  <div className="text-xs">Fast LCP</div>
                </div>
                <div className="rounded-xl border p-3">
                  <ShieldCheck className="w-4 h-4 mx-auto mb-1" />
                  <div className="text-xs">A11y‑first</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

              {/* SKILLS */}
        <Section id="skills" title="Tech Stack" icon={<Layers className="w-5 h-5" />}> 
          <div className="space-y-8">
            {/* Frontend */}
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Code2 className="w-5 h-5" />
                Frontend
              </h3>
              <div className="flex flex-wrap gap-3">
                <a href="https://react.dev/" target="_blank" rel="noopener noreferrer">
                  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
                </a>
                <a href="https://nextjs.org/" target="_blank" rel="noopener noreferrer">
                  <img src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js" />
                </a>
                <a href="https://www.typescriptlang.org/" target="_blank" rel="noopener noreferrer">
                  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
                </a>
                <a href="https://tailwindcss.com/" target="_blank" rel="noopener noreferrer">
                  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="TailwindCSS" />
                </a>
              </div>
            </div>

            {/* Backend */}
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Server className="w-5 h-5" />
                Backend
              </h3>
              <div className="flex flex-wrap gap-3">
                <a href="https://nodejs.org/" target="_blank" rel="noopener noreferrer">
                  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js" />
                </a>
                <a href="https://expressjs.com/" target="_blank" rel="noopener noreferrer">
                  <img src="https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express" />
                </a>
                <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript" target="_blank" rel="noopener noreferrer">
                  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript" />
                </a>
              </div>
            </div>

            {/* Data */}
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Database className="w-5 h-5" />
                Data
              </h3>
              <div className="flex flex-wrap gap-3">
                <a href="https://www.mongodb.com/" target="_blank" rel="noopener noreferrer">
                  <img src="https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
                </a>
                <a href="https://www.sqlite.org/" target="_blank" rel="noopener noreferrer">
                  <img src="https://img.shields.io/badge/SQLite-07405E?style=for-the-badge&logo=sqlite&logoColor=white" alt="SQLite" />
                </a>
              </div>
            </div>

            {/* Tooling */}
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Cpu className="w-5 h-5" />
                Tooling
              </h3>
              <div className="flex flex-wrap gap-3">
                <a href="https://git-scm.com/" target="_blank" rel="noopener noreferrer">
                  <img src="https://img.shields.io/badge/Git-F05032?style=for-the-badge&logo=git&logoColor=white" alt="Git" />
                </a>
                <a href="https://code.visualstudio.com/" target="_blank" rel="noopener noreferrer">
                  <img src="https://img.shields.io/badge/VS%20Code-0078d7?style=for-the-badge&logo=visual-studio-code&logoColor=white" alt="VS Code" />
                </a>
                <a href="https://www.cursor.com/" target="_blank" rel="noopener noreferrer">
                  <img src="https://img.shields.io/badge/Cursor-000000?style=for-the-badge&logo=cursor&logoColor=white" alt="Cursor" />
                </a>
              </div>
            </div>

            {/* Code Hosting */}
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Github className="w-5 h-5" />
                Code Hosting
              </h3>
              <div className="flex flex-wrap gap-3">
                <a href="https://github.com/" target="_blank" rel="noopener noreferrer">
                  <img src="https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white" alt="GitHub" />
                </a>
                <a href="https://codeberg.org/" target="_blank" rel="noopener noreferrer">
                  <img src="https://img.shields.io/badge/Codeberg-2185D0?style=for-the-badge&logo=codeberg&logoColor=white" alt="Codeberg" />
                </a>
              </div>
            </div>
          </div>
        </Section>

      {/* PROJECTS */}
      <Section id="projects" title="Selected Projects" icon={<Zap className="w-5 h-5" />}> 
        <div className="grid gap-5">
          {PROJECTS.map((p) => (
            <ProjectCard p={p} key={p.name} />
          ))}
        </div>
      </Section>

      {/* PERSONAL INTERESTS */}
      <Section id="interests" title="Personal Interests" icon={<Zap className="w-5 h-5" />}>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="rounded-2xl border p-6 bg-white/70 dark:bg-zinc-900/40">
            <h3 className="font-medium mb-3">Hobbies & Activities</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                <span className="text-sm">Cycling - Exploring new routes and staying active</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <span className="text-sm">Jogging - Building endurance and clearing my mind</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                <span className="text-sm">Gaming - Problem-solving and strategic thinking</span>
              </div>
            </div>
          </div>
          <div className="rounded-2xl border p-6 bg-white/70 dark:bg-zinc-900/40">
            <h3 className="font-medium mb-3">Learning & Growth</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                <span className="text-sm">Pet projects with Cursor - Experimenting with new ideas</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                <span className="text-sm">Building new projects - Eager to learn and grow</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-indigo-500 rounded-full"></span>
                <span className="text-sm">Continuous learning - Always seeking new challenges</span>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* PRINCIPLES */}
      <Section id="principles" title="Principles & Influences" icon={<Star className="w-5 h-5" />}> 
        <ul className="grid md:grid-cols-2 gap-4 list-none">
          <Principle title="Sensible defaults (Rails/DHH)">
            Prefer convention over configuration. Start with boring technology, add complexity only when outcomes demand it.
          </Principle>
          <Principle title="Pragmatic structure (Django/Holovaty)">
            Clear separation of concerns, reusable modules, tests where they de‑risk value.
          </Principle>
          <Principle title="Performance budgets (Addy Osmani)">
            Ship light. Measure LCP/CLS/TBT. Optimize images, split bundles, respect reduced motion.
          </Principle>
          <Principle title="Tasteful motion (Sarah Drasner)">
            Animate with purpose and accessibility, micro‑interactions that guide—not distract.
          </Principle>
          <Principle title="Progressive enhancement (John Resig)">
            Core content works without JS; enhance when available for richer UX.
          </Principle>
          <Principle title="Outcomes over adjectives (Gergely Orosz)">
            Communicate with metrics, user impact, and trade‑offs—not buzzwords.
          </Principle>
        </ul>
      </Section>

      {/* CONTACT */}
      <Section id="contact" title="Contact" icon={<Mail className="w-5 h-5" />}> 
        <div className="grid md:grid-cols-2 gap-6">
          <div className="rounded-2xl border p-6 bg-white/70 dark:bg-zinc-900/40">
            <h3 className="font-medium mb-2">Let’s build something</h3>
            <p className="text-sm opacity-80 mb-4">
              Prefer email? I usually reply within 24 hours.
            </p>
            <a href={`mailto:${ME.email}`} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border hover:bg-zinc-50 dark:hover:bg-zinc-800">
              <Mail className="w-4 h-4" /> {ME.email}
            </a>
          </div>
          <form
            className="rounded-2xl border p-6 bg-white/70 dark:bg-zinc-900/40 grid gap-3"
            onSubmit={(e) => {
              e.preventDefault();
              alert("Thanks! Swap this for your form handler (e.g., Vercel Forms, Formspree, or API route).");
            }}
          >
            <label className="text-sm">Name
              <input required className="mt-1 w-full px-3 py-2 rounded-xl border bg-white/70 dark:bg-zinc-950" placeholder="Your name" />
            </label>
            <label className="text-sm">Email
              <input type="email" required className="mt-1 w-full px-3 py-2 rounded-xl border bg-white/70 dark:bg-zinc-950" placeholder="you@example.com" />
            </label>
            <label className="text-sm">Message
              <textarea required className="mt-1 w-full px-3 py-2 rounded-xl border bg-white/70 dark:bg-zinc-950" rows={4} placeholder="Tell me about your project…" />
            </label>
            <button type="submit" className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl border hover:bg-zinc-50 dark:hover:bg-zinc-800">
              Send <ArrowUpRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </Section>

      {/* FOOTER */}
      <footer className="border-t border-zinc-200/60 dark:border-zinc-800/60 py-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="opacity-70">© {new Date().getFullYear()} {ME.name}. Built with Next.js + Tailwind.</div>
          <div className="flex items-center gap-3">
            <a href={ME.github} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 hover:underline">
              <Github className="w-4 h-4" /> GitHub
            </a>
            <a href={ME.linkedin} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 hover:underline">
              <Linkedin className="w-4 h-4" /> LinkedIn
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

// ====== SMALL SUB‑COMPONENTS ===============================================
const SkillBlock: React.FC<{ title: string; items: string[]; icon?: React.ReactNode }> = ({ title, items, icon }) => {
  // Map technology names to their official websites
  const getTechLink = (tech: string): string => {
    const linkMap: Record<string, string> = {
      'React': 'https://react.dev/',
      'Next.js': 'https://nextjs.org/',
      'TypeScript': 'https://www.typescriptlang.org/',
      'TailwindCSS': 'https://tailwindcss.com/',
      'Node.js': 'https://nodejs.org/',
      'Express': 'https://expressjs.com/',
      'JavaScript': 'https://developer.mozilla.org/en-US/docs/Web/JavaScript',
      'MongoDB': 'https://www.mongodb.com/',
      'SQLite': 'https://www.sqlite.org/',
      'Git': 'https://git-scm.com/',
      'VS Code': 'https://code.visualstudio.com/',
      'Cursor': 'https://www.cursor.com/',
      'HyperionDev': 'https://www.hyperiondev.com/',
    };
    return linkMap[tech] || '#';
  };

  return (
    <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 p-5 bg-white/70 dark:bg-zinc-900/40">
      <div className="flex items-center gap-2 mb-3">
        {icon}
        <h3 className="font-medium">{title}</h3>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {items.map((item) => {
          const logoPath = getLogoPath(item);
          const techLink = getTechLink(item);
          return (
            <a
              key={item}
              href={techLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 p-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white/50 dark:bg-zinc-800/50 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors cursor-pointer"
            >
              {logoPath ? (
                <img src={logoPath} alt={`${item} logo`} className="w-5 h-5" />
              ) : (
                <div className="w-5 h-5 rounded bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center">
                  <span className="text-xs font-mono text-zinc-500">{item.charAt(0)}</span>
                </div>
              )}
              <span className="text-sm font-medium">{item}</span>
            </a>
          );
        })}
      </div>
    </div>
  );
};

const Principle: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <li className="rounded-2xl border border-zinc-200 dark:border-zinc-800 p-5 bg-white/70 dark:bg-zinc-900/40">
    <div className="font-medium mb-2">{title}</div>
    <p className="text-sm opacity-80">{children}</p>
  </li>
);
