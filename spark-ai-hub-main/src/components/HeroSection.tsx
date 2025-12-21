import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, ArrowRight, Zap } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-card" />
      <div className="absolute inset-0 bg-noise" />

      {/* Radial gradient glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[400px] h-[300px] bg-primary/10 rounded-full blur-2xl animate-float" />

      {/* Content */}
      <div className="container relative z-10 px-4 py-20 text-center">
        {/* Badge */}
        <div className="animate-fade-up mb-8">
          <Badge variant="tech" className="gap-2 px-4 py-2">
            <Zap className="h-3.5 w-3.5 text-primary" />
            Built with Python & AI
          </Badge>
        </div>

        {/* Logo / Brand */}
        <div className="animate-fade-up-delay-1 mb-6">
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
        <h1 className="animate-fade-up-delay-2 text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 max-w-4xl mx-auto">
          Automate Intelligence with{" "}
          <span className="gradient-text">Next-Gen AI</span>
        </h1>

        {/* Subheading */}
        <p className="animate-fade-up-delay-3 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
          A unified platform of smart AI tools for knowledge, productivity, and decision-making.
          <span className="block mt-2 text-primary/80 italic">
            "Igniting intelligence. Powering decisions."
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
