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
  Zap,
  Star,
  ExternalLink,
  Server,
  Database,
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

// ====== HELPER FUNCTIONS ===================================================
const isMobileDevice = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
         window.innerWidth <= 768 ||
         'ontouchstart' in window ||
         navigator.maxTouchPoints > 0;
};

const handlePDFDownload = (pdfPath: string, fileName: string) => {
  console.log('PDF download requested:', { pdfPath, fileName, isMobile: isMobileDevice() });
  
  if (isMobileDevice()) {
    console.log('Mobile device detected, attempting PDF download');
    
    // Try to fetch the PDF and create a blob URL for better mobile compatibility
    fetch(pdfPath)
      .then(response => {
        console.log('PDF fetch response:', response.status, response.statusText);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.blob();
      })
      .then(blob => {
        console.log('PDF blob created, size:', blob.size);
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        console.log('PDF download initiated via blob');
      })
      .catch(error => {
        console.error('Error downloading PDF:', error);
        // Fallback to opening in new tab
        console.log('Falling back to opening PDF in new tab');
        window.open(pdfPath, '_blank');
      });
  } else {
    console.log('Desktop device, using download attribute');
    // For desktop, let the download attribute handle it
  }
};

// ====== DATA (edit me) ======================================================
const ME = {
  name: "Riaan van Rhyn",
  title: "Full‑Stack Web Developer",
  location: "Gauteng, South Africa",
  email: "vanrhynriaan85@gmail.com",
  github: "https://github.com/Riaan-debug",
  linkedin: "https://www.linkedin.com/in/riaan-van-rhyn",
  pdf: "/Riaan_van_Rhyn_CV.pdf", // put your CV into /public and keep this path
  blurb:
    "I'm a teacher transitioning to web development, passionate about building accessible web apps. I completed a full-stack web development course with HyperionDev and I'm eager to bring my problem-solving skills and dedication to a development team.",
  metrics: [
    { label: "Projects built", value: "5+" },
    { label: "Learning commitment", value: "100%" },
    { label: "Career transition", value: "Now" },
  ],
  stacks: {
    frontend: ["React", "Next.js", "TypeScript", "TailwindCSS"],
    backend: ["Node.js", "Express", "JavaScript", "Laravel", "PHP"],
    data: ["MongoDB", "SQLite", "MySQL"],
    tooling: ["Git", "VS Code", "Cursor", "HyperionDev", "Laravel Herd"],
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
    repo: "https://github.com/Riaan-debug/vibez-capstone",
    image: "/images/vibez-app-screenshot.png",
  },
  {
    name: "Interactive Analytics Dashboard",
    description:
      "Professional analytics dashboard showcasing advanced React patterns, data visualization, and modern UI/UX. Built for portfolio demonstration with enterprise-grade features and clean code architecture.",
    outcomes: [
      "Advanced React patterns and component architecture",
      "Comprehensive data visualization and analytics",
      "Enterprise-grade security measures and middleware",
      "Dark/light mode toggle with professional UI design",
      "Export functionality (Excel, CSV, JSON formats)",
    ],
    tech: ["React", "JavaScript", "CSS", "Vite", "Tailwind CSS"],
    href: "https://interactive-dashboard-mu.vercel.app/",
    repo: "https://github.com/Riaan-debug/interactive-dashboard",
    image: "/images/interactive-dashboard-screenshot.png",
  },

];

// ====== UTILITIES ===========================================================
function classNames(...xs: Array<string | false | undefined>) {
  return xs.filter(Boolean).join(" ");
}

// Security: Validate and sanitize URLs
function validateUrl(url: string): string | null {
  try {
    // Only allow HTTPS URLs and relative paths
    if (url.startsWith('https://') || url.startsWith('/') || url.startsWith('#')) {
      return url;
    }
    // Block potentially dangerous protocols
    if (url.startsWith('javascript:') || url.startsWith('data:') || url.startsWith('vbscript:')) {
      console.warn('Blocked potentially dangerous URL:', url);
      return null;
    }
    return null;
  } catch {
    return null;
  }
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
    'Laravel': '/logos/laravel.svg',
    'PHP': '/logos/php.svg',
    'MongoDB': '/logos/mongodb.svg',
    'SQLite': '/logos/sqlite.svg',
    'MySQL': '/logos/mysql.svg',
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
  <motion.section 
    id={id} 
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.1 }}
    transition={{ duration: 0.6 }}
    className={classNames("max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14", className)}
  >
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="flex items-center gap-3 mb-8"
    >
      <motion.div 
        whileHover={{ 
          scale: 1.1,
          rotate: 5,
          transition: { duration: 0.2 }
        }}
        className="p-2 rounded-xl bg-gradient-to-br from-zinc-800 to-zinc-700 border border-zinc-700/60"
      >
        {icon}
      </motion.div>
      <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">{title}</h2>
    </motion.div>
    {children}
  </motion.section>
);

const Pill: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <motion.span 
    whileHover={{ 
      scale: 1.05,
      y: -1,
      transition: { duration: 0.2 }
    }}
    className="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium border border-zinc-700 bg-zinc-900/50 backdrop-blur hover:bg-zinc-800 cursor-pointer transition-colors"
  >
    {children}
  </motion.span>
);

const Metric: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <motion.div 
    whileHover={{ 
      scale: 1.05,
      y: -2,
      transition: { duration: 0.2 }
    }}
    className="rounded-2xl border border-zinc-800 p-4 bg-zinc-900/40 hover:bg-zinc-900/60 cursor-pointer transition-colors"
  >
    <div className="text-2xl font-semibold">{value}</div>
    <div className="text-xs opacity-70">{label}</div>
  </motion.div>
);

const ProjectCard: React.FC<{ p: (typeof PROJECTS)[number] }>
= ({ p }) => (
  <motion.article
    initial={{ opacity: 0, y: 20, scale: 0.95 }}
    whileInView={{ opacity: 1, y: 0, scale: 1 }}
    viewport={{ once: true, amount: 0.2 }}
    whileHover={{ 
      y: -4, 
      scale: 1.02,
      transition: { duration: 0.2 }
    }}
    transition={{ 
      duration: 0.5,
      type: "spring",
      stiffness: 100
    }}
    className="group grid grid-cols-1 md:grid-cols-5 gap-4 rounded-2xl border border-zinc-800 p-4 hover:shadow-lg bg-zinc-900/40 transition-all duration-300"
  >
    <div className="md:col-span-2 rounded-xl overflow-hidden border border-zinc-700/60 bg-zinc-800 aspect-video">
      {p.image ? (
        <img 
          loading="lazy" 
          src={p.image} 
          alt={`${p.name} project screenshot`}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
            target.nextElementSibling?.classList.remove('hidden');
          }}
        />
      ) : (
        <div className="w-full h-full grid place-items-center text-zinc-400">no image</div>
      )}
      {p.image && (
        <div className="hidden w-full h-full grid place-items-center text-zinc-400 bg-zinc-800">
          <div className="text-center">
            <div className="text-2xl mb-2">📱</div>
            <div className="text-xs">Project Preview</div>
          </div>
        </div>
      )}
    </div>
    <div className="md:col-span-3 flex flex-col gap-3">
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-lg font-semibold tracking-tight">{p.name}</h3>
        <div className="flex gap-2">
          {p.href && (
            <a aria-label="Live demo" href={p.href} target="_blank" rel="noreferrer" className="p-2 rounded-lg border hover:bg-zinc-800">
              <ExternalLink className="w-4 h-4" />
            </a>
          )}
          {p.repo && (
            <a aria-label="Repository" href={p.repo} target="_blank" rel="noreferrer" className="p-2 rounded-lg border hover:bg-zinc-800">
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
  const [mounted, setMounted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [pageViews, setPageViews] = useState(0);

  // Move useMemo before any conditional returns to follow Rules of Hooks
  const heroVariants = useMemo(
    () => ({
      hidden: { opacity: 0, y: 10 },
      show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    }),
    []
  );

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Analytics and performance monitoring
  useEffect(() => {
    if (!mounted) return;
    
    // Increment page view counter
    const currentViews = parseInt(localStorage.getItem('portfolio-views') || '0') + 1;
    localStorage.setItem('portfolio-views', currentViews.toString());
    setPageViews(currentViews);
    
    // Performance monitoring
    if ('performance' in window) {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'navigation') {
            const navEntry = entry as PerformanceNavigationTiming;
            console.log('Page Load Performance:', {
              domContentLoaded: navEntry.domContentLoadedEventEnd - navEntry.domContentLoadedEventStart,
              loadComplete: navEntry.loadEventEnd - navEntry.loadEventStart,
              totalTime: navEntry.loadEventEnd - navEntry.fetchStart
            });
          }
        }
      });
      
      observer.observe({ entryTypes: ['navigation'] });
      
      return () => observer.disconnect();
    }
  }, [mounted]);

  // Form handling
  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormStatus('submitting');
    
    try {
      // Basic validation
      if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
        throw new Error('Please fill in all fields');
      }
      
      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        throw new Error('Please enter a valid email address');
      }
      
      // Send to API endpoint
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to send message');
      }
      
      setFormStatus('success');
      setFormData({ name: '', email: '', message: '' });
      
      // Reset success status after 5 seconds
      setTimeout(() => setFormStatus('idle'), 5000);
      
    } catch (error) {
      setFormStatus('error');
      console.error('Form submission error:', error);
      
      // Reset error status after 5 seconds
      setTimeout(() => setFormStatus('idle'), 5000);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Don't render until mounted
  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-950 to-zinc-900 text-zinc-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-10">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            {/* Header skeleton */}
            <div className="flex items-center justify-between">
              <div className="h-8 bg-zinc-800 rounded w-48 animate-pulse"></div>
              <div className="h-8 bg-zinc-800 rounded w-32 animate-pulse"></div>
            </div>
            
            {/* Hero skeleton */}
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="h-12 bg-zinc-800 rounded w-3/4 animate-pulse"></div>
                <div className="h-6 bg-zinc-800 rounded w-1/2 animate-pulse"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-zinc-800 rounded w-full animate-pulse"></div>
                  <div className="h-4 bg-zinc-800 rounded w-5/6 animate-pulse"></div>
                  <div className="h-4 bg-zinc-800 rounded w-4/6 animate-pulse"></div>
                </div>
                <div className="flex gap-3">
                  <div className="h-10 bg-zinc-800 rounded w-24 animate-pulse"></div>
                  <div className="h-10 bg-zinc-800 rounded w-24 animate-pulse"></div>
                </div>
              </div>
              <div className="h-64 bg-zinc-800 rounded-xl animate-pulse"></div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-950 to-zinc-900 text-zinc-50">
      {/* NAV */}
      <header className="sticky top-0 z-40 backdrop-blur border-b border-zinc-800/60 bg-zinc-950/40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          <motion.a 
            href="#home" 
            className="font-semibold tracking-tight cursor-pointer"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            {ME.name}
          </motion.a>
          <nav className="hidden sm:flex items-center gap-6 text-sm">
            {[
              { href: "#projects", label: "Projects" },
              { href: "#skills", label: "Tech Stack" },
              { href: "#principles", label: "Principles" },
              { href: "#contact", label: "Contact" }
            ].map((link) => (
              <motion.a
                key={link.href}
                href={link.href}
                className="relative cursor-pointer"
                whileHover={{ y: -2 }}
                transition={{ duration: 0.2 }}
              >
                {link.label}
                <motion.div
                  className="absolute -bottom-1 left-0 right-0 h-0.5 bg-zinc-100"
                  initial={{ scaleX: 0 }}
                  whileHover={{ scaleX: 1 }}
                  transition={{ duration: 0.2 }}
                />
              </motion.a>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <a 
              href={ME.pdf} 
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border hover:bg-zinc-800 text-sm transition-colors" 
              download="Riaan_van_Rhyn_CV.pdf"
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => {
                if (isMobileDevice()) {
                  e.preventDefault();
                  handlePDFDownload(ME.pdf, 'Riaan_van_Rhyn_CV.pdf');
                }
              }}
            >
              <Download className="w-4 h-4" /> 
              <span className="hidden sm:inline">Download PDF</span>
              <span className="sm:hidden">CV</span>
            </a>
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
            <div className="inline-flex items-center gap-2 text-xs text-zinc-400">
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
              {[
                { href: ME.github, icon: <Github className="w-4 h-4" />, label: "GitHub" },
                { href: ME.linkedin, icon: <Linkedin className="w-4 h-4" />, label: "LinkedIn" },
                { href: `mailto:${ME.email}`, icon: <Mail className="w-4 h-4" />, label: "Email me" },
                { href: ME.pdf, icon: <Download className="w-4 h-4" />, label: "Download CV", isDownload: true, isMobile: true }
              ].map((button, index) => (
                <motion.a
                  key={button.label}
                  href={button.href}
                  target={button.label !== "Email me" ? "_blank" : undefined}
                  rel={button.label !== "Email me" ? "noreferrer" : undefined}
                  download={button.isDownload ? "Riaan_van_Rhyn_CV.pdf" : undefined}
                  onClick={button.isMobile ? (e) => {
                    if (isMobileDevice()) {
                      e.preventDefault();
                      handlePDFDownload(button.href, 'Riaan_van_Rhyn_CV.pdf');
                    }
                  } : undefined}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border hover:bg-zinc-800 cursor-pointer"
                  whileHover={{ 
                    scale: 1.05,
                    y: -2,
                    transition: { duration: 0.2 }
                  }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ 
                    duration: 0.5, 
                    delay: 0.3 + index * 0.1,
                    type: "spring",
                    stiffness: 100
                  }}
                >
                  {button.icon} {button.label}
                </motion.a>
              ))}
            </div>
            <motion.div 
              className="grid grid-cols-3 gap-3 mt-6"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: {},
                visible: {
                  transition: {
                    staggerChildren: 0.1
                  }
                }
              }}
            >
              {ME.metrics.map((m, index) => (
                <motion.div
                  key={m.label}
                  variants={{
                    hidden: { opacity: 0, scale: 0.8 },
                    visible: { opacity: 1, scale: 1 }
                  }}
                  transition={{ duration: 0.4, type: "spring", stiffness: 100 }}
                >
                  <Metric label={m.label} value={m.value} />
                </motion.div>
              ))}
            </motion.div>
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
                <a href="https://laravel.com/" target="_blank" rel="noopener noreferrer">
                  <img src="https://img.shields.io/badge/Laravel-FF2D20?style=for-the-badge&logo=laravel&logoColor=white" alt="Laravel" />
                </a>
                <a href="https://herd.laravel.com/" target="_blank" rel="noopener noreferrer">
                  <img src="https://img.shields.io/badge/Laravel_Herd-FF2D20?style=for-the-badge&logo=laravel&logoColor=white" alt="Laravel Herd" />
                </a>
                <a href="https://www.php.net/" target="_blank" rel="noopener noreferrer">
                  <img src="https://img.shields.io/badge/PHP-777BB4?style=for-the-badge&logo=php&logoColor=white" alt="PHP" />
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
                <a href="https://www.mysql.com/" target="_blank" rel="noopener noreferrer">
                  <img src="https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white" alt="MySQL" />
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
        <motion.div 
          className="grid gap-5"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.2
              }
            }
          }}
        >
          {PROJECTS.map((p, index) => (
            <motion.div
              key={p.name}
              variants={{
                hidden: { opacity: 0, y: 20, scale: 0.95 },
                visible: { opacity: 1, y: 0, scale: 1 }
              }}
              transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
            >
              <ProjectCard p={p} />
            </motion.div>
          ))}
        </motion.div>
      </Section>

      {/* PERSONAL INTERESTS */}
      <Section id="interests" title="Personal Interests" icon={<Zap className="w-5 h-5" />}>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="rounded-2xl border p-6 bg-zinc-900/40">
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
          <div className="rounded-2xl border p-6 bg-zinc-900/40">
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
          <div className="rounded-2xl border p-6 bg-zinc-900/40">
            <h3 className="font-medium mb-2">Let’s build something</h3>
            <p className="text-sm opacity-80 mb-4">
              Prefer email? I usually reply within 24 hours.
            </p>
            <a href={`mailto:${ME.email}`} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border hover:bg-zinc-800">
              <Mail className="w-4 h-4" /> {ME.email}
            </a>
          </div>
          <form
            className="rounded-2xl border p-6 bg-zinc-900/40 grid gap-3"
            onSubmit={handleFormSubmit}
          >
                          <label className="text-sm">Name
                <input 
                  required 
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="mt-1 w-full px-3 py-2 rounded-xl border bg-zinc-950 focus:outline-none focus:ring-2 focus:ring-zinc-600 focus:border-transparent" 
                  placeholder="Your name" 
                />
              </label>
              <label className="text-sm">Email
                <input 
                  type="email" 
                  required 
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="mt-1 w-full px-3 py-2 rounded-xl border bg-zinc-950 focus:outline-none focus:ring-2 focus:ring-zinc-600 focus:border-transparent" 
                  placeholder="you@example.com" 
                />
              </label>
              <label className="text-sm">Message
                <textarea 
                  required 
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  className="mt-1 w-full px-3 py-2 rounded-xl border bg-zinc-950 focus:outline-none focus:ring-2 focus:ring-zinc-600 focus:border-transparent" 
                  rows={4} 
                  placeholder="Tell me about your project…" 
                />
              </label>
              
              {/* Form Status Messages */}
              {formStatus === 'success' && (
                <div className="p-3 rounded-lg bg-green-900/20 border border-green-700/30 text-green-300 text-sm">
                  ✅ Message sent successfully! I'll get back to you soon.
                </div>
              )}
              
              {formStatus === 'error' && (
                <div className="p-3 rounded-lg bg-red-900/20 border border-red-700/30 text-red-300 text-sm">
                  ❌ Something went wrong. Please try again or email me directly.
                </div>
              )}
              
              <button 
                type="submit" 
                disabled={formStatus === 'submitting'}
                className={`inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl border transition-all duration-200 ${
                  formStatus === 'submitting' 
                    ? 'opacity-50 cursor-not-allowed' 
                    : 'hover:bg-zinc-800 hover:scale-105'
                }`}
              >
                {formStatus === 'submitting' ? (
                  <>
                    <div className="w-4 h-4 border-2 border-zinc-400 border-t-transparent rounded-full animate-spin"></div>
                    Sending...
                  </>
                ) : (
                  <>
                    Send <ArrowUpRight className="w-4 h-4" />
                  </>
                )}
              </button>
          </form>
        </div>
      </Section>

      {/* FOOTER */}
      <footer className="border-t border-zinc-800/60 py-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="opacity-70">© {new Date().getFullYear()} {ME.name}. Built with Next.js + Tailwind.</div>
          <div className="text-xs opacity-50">
            {pageViews > 0 && `Viewed ${pageViews} time${pageViews === 1 ? '' : 's'}`}
          </div>
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
    const link = linkMap[tech] || '#';
    // Security: Validate the URL before returning
    return validateUrl(link) || '#';
  };

  return (
            <div className="rounded-2xl border border-zinc-800 p-5 bg-zinc-900/40">
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
              className="flex items-center gap-2 p-2 rounded-lg border border-zinc-700 bg-zinc-800/50 hover:bg-zinc-700 transition-colors cursor-pointer"
              onClick={(e) => {
                // Security: Additional validation on click
                if (!validateUrl(techLink)) {
                  e.preventDefault();
                  console.warn('Blocked potentially dangerous link click:', techLink);
                }
              }}
            >
              {logoPath ? (
                <img src={logoPath} alt={`${item} logo`} className="w-5 h-5" />
              ) : (
                <div className="w-5 h-5 rounded bg-zinc-700 flex items-center justify-center">
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
          <li className="rounded-2xl border border-zinc-800 p-5 bg-zinc-900/40">
    <div className="font-medium mb-2">{title}</div>
    <p className="text-sm opacity-80">{children}</p>
  </li>
);
