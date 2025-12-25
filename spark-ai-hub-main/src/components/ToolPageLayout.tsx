import React from "react";
import { Navbar } from "@/components/Navbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ExternalLink, LucideIcon, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { TypewriterFeatures } from "@/components/TypewriterFeatures";

interface ToolPageLayoutProps {
  icon: LucideIcon;
  title: string;
  description: string;
  longDescription: string;
  features: string[];
  demoUrl?: string;
  status: "live" | "comingSoon";
  children?: React.ReactNode;
}

export function ToolPageLayout({
  icon: Icon,
  title,
  description,
  longDescription,
  features,
  demoUrl,
  status,
  children,
}: ToolPageLayoutProps) {
  const isLive = status === "live";

  return (
    <div className="min-h-screen bg-background">
      {/* Background elements */}
      <div className="fixed inset-0 bg-gradient-to-b from-background via-background to-card pointer-events-none" />
      <div className="fixed inset-0 bg-noise pointer-events-none" />
      <div className="fixed top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10">
        <Navbar />
        <div className="pt-20" /> {/* Spacer for fixed navbar */}

        {/* Main content */}
        <main className="container px-4 py-12">
          {/* Tool header */}
          <div className="max-w-4xl mx-auto mb-12">
            <div className="flex items-start gap-6 mb-6">
              <div className="rounded-xl bg-primary/10 p-4 text-primary glow-orange-sm">
                <Icon className="h-10 w-10" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                    {title}
                  </h1>
                  <Badge variant={isLive ? "live" : "comingSoon"}>
                    {isLive ? "Live" : "Coming Soon"}
                  </Badge>
                </div>
                <p className="text-lg text-muted-foreground">{description}</p>
              </div>
            </div>

            {/* Long description */}
            <p className="text-muted-foreground leading-relaxed mb-8">
              {longDescription}
            </p>

            {/* Features with Side-by-Side Typewriter Animation */}
            <div className="mb-12 p-6 rounded-2xl bg-card/40 border border-border/50 backdrop-blur-sm">
              <h2 className="text-xl font-bold mb-6 text-foreground flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                Capabilities
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <TypewriterFeatures
                    features={features.filter((_, i) => i % 2 === 0)}
                  />
                </div>
                <div className="space-y-2">
                  <TypewriterFeatures
                    features={features.filter((_, i) => i % 2 !== 0)}
                  />
                </div>
              </div>
            </div>

            {/* Demo link */}
            {demoUrl && isLive && (
              <Button variant="hero" size="lg" asChild>
                <a href={demoUrl} target="_blank" rel="noopener noreferrer">
                  Open Live Demo
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
            )}

            {/* Custom Tool Content (Children) */}
            {children}
          </div>

          {/* Demo embed */}
          {demoUrl && isLive && (
            <div className="max-w-6xl mx-auto">
              <h2 className="text-xl font-semibold mb-4 text-foreground">
                Live Demo
              </h2>
              <div className="rounded-xl border border-border bg-card overflow-hidden gradient-border">
                <div className="aspect-video w-full">
                  <iframe
                    src={demoUrl}
                    title={`${title} Demo`}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    loading="lazy"
                  />
                </div>
              </div>
              <p className="text-sm text-muted-foreground mt-4 text-center">
                Note: Demo loads from an external Streamlit server. It may take a moment to start.
              </p>
            </div>
          )}

          {/* Placeholder for coming soon */}
          {!isLive && (
            <div className="max-w-2xl mx-auto text-center py-16 px-4">
              <div className="rounded-xl border border-border bg-card/50 p-12">
                <Icon className="h-16 w-16 text-muted-foreground mx-auto mb-6" />
                <h2 className="text-2xl font-semibold text-foreground mb-4">
                  Coming Soon
                </h2>
                <p className="text-muted-foreground">
                  This tool is currently under development. Check back soon for updates!
                </p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
