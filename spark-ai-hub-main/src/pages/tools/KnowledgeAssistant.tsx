import React from "react";
import { ToolPageLayout } from "@/components/ToolPageLayout";
import { BookOpen } from "lucide-react";

export default function KnowledgeAssistantPage() {
  return (
    <ToolPageLayout
      icon={BookOpen}
      title="Document Assistant (Beta)"
      description="Chat with your documents to find information."
      longDescription="Upload your documents to ask questions and find facts in seconds. Our assistant reads through your files so you don't have to."
      features={[
        "Read long documents",
        "Ask questions about PDFs",
        "Find specific facts",
        "Save time on research",
        "Summarize reports",
        "Instant data lookup",
      ]}
      demoUrl="https://your-rag-assistant.streamlit.app"
      status="live"
    />
  );
}
