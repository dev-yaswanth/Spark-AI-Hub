import { ToolPageLayout } from "@/components/ToolPageLayout";
import { MessageSquare, Send, Loader2 } from "lucide-react";
import React, { useState, useRef, useEffect, KeyboardEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function ChatBotPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "Hey there! I'm S.P.A.R.K. — your Smart Personal Assistant for Real-time Knowledge. Ask me anything!"
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll to bottom when messages change
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) {
      return;
    }

    const userMessage = input.trim();
    setInput("");

    // Add user message to chat
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await fetch(`${API_URL}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: userMessage }),
      });

      const data = await response.json();

      if (data.success) {
        setMessages(prev => [...prev, { role: 'assistant', content: data.response }]);
      } else {
        throw new Error(data.error || 'Failed to get response');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to send message";
      const isQuotaError = errorMessage.includes("RESOURCE_EXHAUSTED") || errorMessage.includes("429");

      toast({
        title: isQuotaError ? "API Limit Reached" : "Error",
        description: isQuotaError
          ? "The free tier of Gemini has a temporary rate limit. Please wait a few seconds and try again."
          : "Make sure the backend server is running and try again.",
        variant: "destructive",
      });

      // Add error message to chat
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: isQuotaError
          ? "I've reached my temporary rate limit (free tier). Please wait a moment and then try asking again!"
          : "Sorry, I'm having trouble connecting to the server. Please check if the backend is running."
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <ToolPageLayout
      icon={MessageSquare}
      title="AI Chat Bot"
      description="Conversational assistant for real-time questions and insights powered by advanced language models."
      longDescription="Our AI Chat Bot leverages state-of-the-art large language models to provide intelligent, context-aware responses to your queries. Whether you need help with research, brainstorming ideas, answering questions, or just having a conversation, this tool delivers accurate and helpful responses in real-time."
      features={[
        "Natural language understanding",
        "Context-aware conversations",
        "Multi-turn dialogue support",
        "Real-time response generation",
        "Knowledge-based answers",
        "Customizable personality",
      ]}
      status="live"
    >
      <div className="mt-8">
        <Card className="h-[600px] flex flex-col">
          <CardContent className="flex-1 flex flex-col p-0">
            <ScrollArea className="flex-1 p-6" ref={scrollRef}>
              <div className="space-y-4">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg px-4 py-3 ${message.role === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                        }`}
                    >
                      <div className="text-xs font-semibold mb-1 opacity-70">
                        {message.role === 'user' ? 'You' : 'S.P.A.R.K.'}
                      </div>
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    </div>
                  </div>
                ))}

                {isLoading && (
                  <div className="flex justify-start">
                    <div className="max-w-[80%] rounded-lg px-4 py-3 bg-muted">
                      <div className="text-xs font-semibold mb-1 opacity-70">S.P.A.R.K.</div>
                      <div className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span className="text-sm">Thinking...</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            <div className="border-t p-4">
              <div className="flex gap-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  disabled={isLoading}
                  className="flex-1"
                />
                <Button
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading}
                  size="icon"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </ToolPageLayout>
  );
}
