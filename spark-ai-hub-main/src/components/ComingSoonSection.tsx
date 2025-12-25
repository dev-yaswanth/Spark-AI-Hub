import React from "react";
import { ToolCard } from "@/components/ToolCard";
import { BarChart3, Users, Database, Sparkles, Receipt } from "lucide-react";

const Spark = ({ className, style }: { className?: string, style?: React.CSSProperties }) => (
  <div className={`absolute w-3 h-5 rounded-full border border-primary/20 flex items-start justify-center p-1 pointer-events-none ${className}`} style={style}>
    <div className="w-1 h-1 bg-primary rounded-full animate-pulse" />
  </div>
);

const upcomingTools = [
  {
    icon: BarChart3,
    title: "Data Analyst",
    description: "Analyze and visualize your data automatically.",
    status: "comingSoon" as const,
  },
  {
    icon: Users,
    title: "Interview Coach",
    description: "Practice interviews and get helpful feedback.",
    status: "comingSoon" as const,
  },
  {
    icon: Database,
    title: "SQL Assistant",
    description: "Create and improve database queries easily.",
    status: "comingSoon" as const,
  },
  {
    icon: Receipt,
    title: "Bill Analyzer",
    description: "Scan your bills to save money and budget.",
    status: "comingSoon" as const,
  },
  {
    icon: Sparkles,
    title: "Advanced Tools",
    description: "We are constantly building new intelligent features.",
    status: "comingSoon" as const,
  },
];

export function ComingSoonSection() {
  return (
    <section id="coming-soon" className="relative py-24">
      <div className="absolute inset-0 bg-noise" />

      {/* Decorative gradient */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-primary/5 rounded-full blur-3xl" />

      {/* Decorative Sparks */}
      <Spark className="top-[25%] left-[10%] rotate-45 opacity-30 animate-float" />
      <Spark className="top-[15%] right-[10%] -rotate-45 opacity-30 animate-float" style={{ animationDelay: '1.5s' }} />
      <Spark className="bottom-[20%] right-[15%] rotate-12 opacity-20 animate-float" style={{ animationDelay: '4s' }} />

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
