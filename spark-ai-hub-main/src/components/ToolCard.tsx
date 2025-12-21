import React from "react";
import { Badge } from "@/components/ui/badge";
import { LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";

interface ToolCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  status: "live" | "comingSoon";
  href?: string;
}

export function ToolCard({ icon: Icon, title, description, status, href }: ToolCardProps) {
  const isLive = status === "live";

  const CardContent = (
    <>
      {/* Icon container */}
      <div
        className={`mb-4 inline-flex rounded-lg p-3 transition-all duration-300 ${isLive
            ? "bg-primary/10 text-primary group-hover:bg-primary/20 group-hover:glow-orange-sm"
            : "bg-muted text-muted-foreground"
          }`}
      >
        <Icon className="h-6 w-6" />
      </div>

      {/* Content */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <h3
            className={`text-lg font-semibold transition-colors ${isLive ? "text-foreground group-hover:text-primary" : "text-muted-foreground"
              }`}
          >
            {title}
          </h3>
          <Badge variant={isLive ? "live" : "comingSoon"}>
            {isLive ? "Live" : "Coming Soon"}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
      </div>

      {/* Hover arrow for live tools */}
      {isLive && (
        <div className="absolute right-6 top-6 opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-1">
          <svg
            className="h-5 w-5 text-primary"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 8l4 4m0 0l-4 4m4-4H3"
            />
          </svg>
        </div>
      )}
    </>
  );

  const cardClasses = `group relative rounded-xl border bg-card p-6 transition-all duration-500 card-glow gradient-border ${isLive
      ? "border-border hover:border-primary/40 hover:bg-surface-elevated cursor-pointer"
      : "border-border/50 opacity-70"
    }`;

  if (isLive && href) {
    return (
      <Link to={href} className={cardClasses}>
        {CardContent}
      </Link>
    );
  }

  return <div className={cardClasses}>{CardContent}</div>;
}
