import React from "react";
import {
  Atom, Zap, Code2, Wind, Layout, MoveHorizontal, Sparkles, Database,
  Terminal, Server, Cpu, Link as LinkIcon, Brain, FileText, Eye, Binary,
  Triangle, Cloud, Smile, BarChart3, GitBranch, Github
} from "lucide-react";

const techRows = [
  // Row 1: Frontend & Design
  [
    { icon: Atom, label: "React" },
    { icon: Zap, label: "Vite" },
    { icon: Code2, label: "TypeScript" },
    { icon: Wind, label: "Tailwind CSS" },
    { icon: Layout, label: "Shadcn UI" },
    { icon: MoveHorizontal, label: "Embla Carousel" },
    { icon: Sparkles, label: "Lucide React" },
    { icon: Database, label: "TanStack Query" },
  ],
  // Row 2: Intelligence & Backend
  [
    { icon: Terminal, label: "Python" },
    { icon: Server, label: "Flask" },
    { icon: Cpu, label: "Gemini" },
    { icon: LinkIcon, label: "LangChain" },
    { icon: Brain, label: "TensorFlow" },
    { icon: FileText, label: "PyPDF2" },
    { icon: Eye, label: "OpenCV" },
    { icon: Binary, label: "NumPy" },
  ],
  // Row 3: Infrastructure & DevTools
  [
    { icon: Database, label: "Supabase" },
    { icon: Triangle, label: "Vercel" },
    { icon: Cloud, label: "Render" },
    { icon: Smile, label: "Hugging Face" },
    { icon: BarChart3, label: "Vercel Analytics" },
    { icon: GitBranch, label: "Git" },
    { icon: Github, label: "GitHub" },
    { icon: Zap, label: "Production Ready" },
  ],
];

export function TechStackSection() {
  return (
    <section id="tech" className="relative py-24 bg-card/30 overflow-hidden">
      <div className="absolute inset-0 bg-noise" />

      <div className="container relative z-10 px-4">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Built with <span className="text-primary">Modern Tech</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            A robust, modern architecture powered by production-grade tools.
          </p>
        </div>

        {/* Triple Marquee */}
        <div className="space-y-8 max-w-6xl mx-auto py-4">
          {techRows.map((row, rowIndex) => (
            <div
              key={rowIndex}
              className="group flex overflow-hidden mask-fade-out select-none gap-8 py-2"
            >
              <div
                className={`flex flex-none gap-8 animate-marquee ${rowIndex % 2 === 1 ? "animate-marquee-reverse" : ""
                  }`}
                style={{ animationDuration: `${30 + rowIndex * 5}s` }}
              >
                {[...row, ...row, ...row].map((tech, i) => (
                  <div
                    key={`${tech.label}-${i}`}
                    className="flex items-center gap-3 rounded-xl border border-border bg-card/60 px-6 py-3 transition-all duration-300 hover:border-primary/40 hover:bg-surface-elevated"
                  >
                    <div className="text-primary">
                      <tech.icon className="h-5 w-5" />
                    </div>
                    <span className="font-medium whitespace-nowrap text-foreground/80">
                      {tech.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
