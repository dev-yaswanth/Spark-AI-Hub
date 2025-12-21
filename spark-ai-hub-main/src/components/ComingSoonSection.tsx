import React from "react";
import { ToolCard } from "@/components/ToolCard";
import { BarChart3, Users, Database, Sparkles } from "lucide-react";

const upcomingTools = [
  {
    icon: BarChart3,
    title: "AI Data Analyst",
    description: "Automated data analysis, visualization, and insights generation from your datasets.",
    status: "comingSoon" as const,
  },
  {
    icon: Users,
    title: "AI Interview Coach",
    description: "Practice interviews with AI feedback on communication, confidence, and content.",
    status: "comingSoon" as const,
  },
  {
    icon: Database,
    title: "AI SQL Assistant",
    description: "Natural language to SQL conversion with query optimization suggestions.",
    status: "comingSoon" as const,
  },
  {
    icon: Sparkles,
    title: "More AI Tools",
    description: "We're constantly building new tools. Stay tuned for exciting additions.",
    status: "comingSoon" as const,
  },
];

export function ComingSoonSection() {
  return (
    <section id="coming-soon" className="relative py-24">
      <div className="absolute inset-0 bg-noise" />

      {/* Decorative gradient */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-primary/5 rounded-full blur-3xl" />

      <div className="container relative z-10 px-4">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="text-muted-foreground">Coming</span>{" "}
            <span className="text-primary">Soon</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            More intelligent tools are in development. These upcoming features will expand the platform's capabilities.
          </p>
        </div>

        {/* Tools grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 max-w-6xl mx-auto">
          {upcomingTools.map((tool) => (
            <ToolCard
              key={tool.title}
              icon={tool.icon}
              title={tool.title}
              description={tool.description}
              status={tool.status}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
