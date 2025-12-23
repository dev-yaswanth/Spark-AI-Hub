import React from "react";
import { ToolCard } from "@/components/ToolCard";
import { MessageSquare, FileText, ImageIcon, BookOpen } from "lucide-react";

const Spark = ({ className, style }: { className?: string, style?: React.CSSProperties }) => (
  <div className={`absolute w-3 h-5 rounded-full border border-primary/20 flex items-start justify-center p-1 pointer-events-none ${className}`} style={style}>
    <div className="w-1 h-1 bg-primary rounded-full animate-pulse" />
  </div>
);

const liveTools = [
  {
    icon: MessageSquare,
    title: "AI Chat Assistant",
    description: "Ask S.P.A.R.K. anything! Get answers, coding help, or just have a friendly chat in real-time.",
    status: "live" as const,
    href: "/tools/chatbot",
  },
  {
    icon: FileText,
    title: "AI Resume Reviewer",
    description: "Get honest feedback on your resume. We show you your ATS score and exactly how to fix your resume for your dream job.",
    status: "live" as const,
    href: "/tools/resume-reviewer",
  },
  {
    icon: ImageIcon,
    title: "AI Image Identifier",
    description: "Need to know what's in a photo? Upload it and let S.P.A.R.K. identify objects and themes for you instantly.",
    status: "live" as const,
    href: "/tools/image-classifier",
  },
  {
    icon: BookOpen,
    title: "Smart Document Chat",
    description: "Upload your PDFs or documents and chat with them. S.P.A.R.K. reads your files and answers any questions you have.",
    status: "live" as const,
    href: "/tools/knowledge-assistant",
  },
];

export function ToolsSection() {
  return (
    <section id="tools" className="relative py-24 bg-card/50">
      <div className="absolute inset-0 bg-noise" />

      {/* Decorative Sparks */}
      <Spark className="top-[15%] left-[5%] -rotate-12 opacity-20 animate-float" />
      <Spark className="bottom-[15%] right-[5%] rotate-12 opacity-20 animate-float" style={{ animationDelay: '2s' }} />

      <div className="container relative z-10 px-4">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Powerful <span className="text-primary">AI Tools</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Production-ready tools designed for real-world applications. Each tool is crafted for accuracy, speed, and practical utility.
          </p>
        </div>

        {/* Tools grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2 max-w-4xl mx-auto">
          {liveTools.map((tool) => (
            <ToolCard
              key={tool.title}
              icon={tool.icon}
              title={tool.title}
              description={tool.description}
              status={tool.status}
              href={tool.href}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
