import React from "react";
import { ToolPageLayout } from "@/components/ToolPageLayout";
import { BookOpen } from "lucide-react";

export default function KnowledgeAssistantPage() {
  return (
    <ToolPageLayout
      icon={BookOpen}
      title="RAG Knowledge Assistant"
      description="Retrieval-Augmented Generation system for accurate document-based Q&A and research."
      longDescription="The RAG Knowledge Assistant combines the power of large language models with your own documents to provide accurate, source-grounded answers. Upload your PDFs, documents, or knowledge bases, and ask questions in natural language. The system retrieves relevant context and generates precise answers with citations."
      features={[
        "Document upload support (PDF, TXT, DOCX)",
        "Semantic search across documents",
        "Source citation for answers",
        "Context-aware response generation",
        "Multi-document querying",
        "Conversation history tracking",
      ]}
      demoUrl="https://your-rag-assistant.streamlit.app"
      status="live"
    />
  );
}
