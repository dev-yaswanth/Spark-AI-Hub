import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, ArrowRight, Zap, LucideIcon } from "lucide-react";

const Spark = ({ className, style }: { className?: string, style?: React.CSSProperties }) => (
  <div className={`absolute w-3 h-5 rounded-full border border-primary/20 flex items-start justify-center p-1 pointer-events-none ${className}`} style={style}>
    <div className="w-1 h-1 bg-primary rounded-full animate-pulse" />
  </div>
);

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-card" />
      <div className="absolute inset-0 bg-noise" />

      {/* Radial gradient glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[400px] h-[300px] bg-primary/10 rounded-full blur-2xl animate-float" />

      {/* Geometric Sparks */}
      <Spark className="top-[20%] left-[15%] rotate-12 opacity-40 animate-float" />
      <Spark className="top-[35%] right-[20%] -rotate-12 opacity-30 animate-float" style={{ animationDelay: '1.5s' }} />
      <Spark className="bottom-[30%] left-[25%] rotate-45 opacity-20 animate-float" style={{ animationDelay: '3s' }} />
      <Spark className="top-[60%] right-[10%] -rotate-45 opacity-25 animate-float" style={{ animationDelay: '0.5s' }} />

      {/* Content */}
      <div className="container relative z-10 px-4 py-20 text-center">
        {/* Logo / Brand */}
        <div className="animate-fade-up mb-6">
          <div className="inline-flex items-center gap-3 mb-2">
            <Sparkles className="h-10 w-10 text-primary glow-text" />
            <span className="text-5xl md:text-6xl font-bold tracking-tight">
              <span className="text-foreground">SP</span>
              <span className="text-primary glow-text">A</span>
              <span className="text-foreground">RK</span>
            </span>
          </div>
          <p className="text-sm text-muted-foreground tracking-widest uppercase">
            Smart Personal Assistant for Real-time Knowledge
          </p>
        </div>

        {/* Main headline */}
        <h1 className="animate-fade-up-delay-2 text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 max-w-4xl mx-auto leading-[1.1]">
          Smart AI Tools for{" "}
          <span className="gradient-text">Every Task</span>
        </h1>

        {/* Subheading */}
        <p className="animate-fade-up-delay-3 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
          A clean, efficient platform for advanced chat, document analysis, and visual intelligence.
          <span className="block mt-2 text-primary/80 italic">
            "Simple. Powerful. Intelligent."
          </span>
        </p>

        {/* CTAs */}
        <div className="animate-fade-up-delay-3 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button variant="hero" size="xl" className="group" asChild>
            <a href="#tools">
              Explore Tools
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </a>
          </Button>
          <Button variant="heroOutline" size="xl" asChild>
            <a href="#coming-soon">
              Coming Soon
            </a>
          </Button>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex items-start justify-center p-2">
            <div className="w-1.5 h-2.5 bg-primary rounded-full animate-pulse" />
          </div>
        </div>
      </div>
    </section>
  );
}
