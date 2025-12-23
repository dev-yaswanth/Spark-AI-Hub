import React from "react";
import { Badge } from "@/components/ui/badge";
import { Code2, Cpu, Server, Rocket, Layout, Database, Globe, Zap, Search } from "lucide-react";

const techStack = [
  {
    icon: Cpu,
    label: "Intelligence",
    value: "Google Gemini",
  },
  {
    icon: Code2,
    label: "Orchestration",
    value: "LangChain",
  },
  {
    icon: Server,
    label: "Backend",
    value: "Flask (Python)",
  },
  {
    icon: Layout,
    label: "Frontend",
    value: "React & Vite",
  },
  {
    icon: Database,
    label: "Persistence",
    value: "Supabase",
  },
  {
    icon: Zap,
    label: "Styling",
    value: "Tailwind CSS",
  },
  {
    icon: Search,
    label: "Knowledge",
    value: "DuckDuckGo API",
  },
  {
    icon: Globe,
    label: "Deployment",
    value: "Vercel & Render",
  },
];

export function TechStackSection() {
  return (
    <section className="relative py-24 bg-card/30">
      <div className="absolute inset-0 bg-noise" />

      <div className="container relative z-10 px-4">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Built with <span className="text-primary">Modern Tech</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Enterprise-grade architecture designed for reliability, scalability, and performance.
          </p>
        </div>

        {/* Tech stack display */}
        <div className="flex flex-wrap justify-center gap-4 md:gap-8 max-w-4xl mx-auto">
          {techStack.map((tech) => (
            <div
              key={tech.label}
              className="group flex items-center gap-3 rounded-xl border border-border bg-card/80 px-6 py-4 transition-all duration-300 hover:border-primary/40 hover:bg-surface-elevated"
            >
              <div className="rounded-lg bg-primary/10 p-2.5 text-primary transition-all group-hover:bg-primary/20">
                <tech.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">
                  {tech.label}
                </p>
                <p className="font-semibold text-foreground">{tech.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Credibility badges */}
        <div className="flex flex-wrap justify-center gap-3 mt-12">
          <Badge variant="tech">Open Source Friendly</Badge>
          <Badge variant="tech">Production Ready</Badge>
          <Badge variant="tech">Scalable Architecture</Badge>
        </div>
      </div>
    </section>
  );
}
