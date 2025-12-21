import React, { useState, ChangeEvent, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Send, Mail, User, MessageSquare, Github, Linkedin } from "lucide-react";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100, "Name must be less than 100 characters"),
  email: z.string().trim().email("Please enter a valid email").max(255, "Email must be less than 255 characters"),
  message: z.string().trim().min(1, "Message is required").max(1000, "Message must be less than 1000 characters"),
});

type ContactFormData = z.infer<typeof contactSchema>;

export function ContactSection() {
  const { toast } = useToast();
  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    message: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof ContactFormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value as string }));

    // Clear error when user starts typing
    if (errors[name as keyof ContactFormData]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const result = contactSchema.safeParse(formData);

    if (!result.success) {
      const fieldErrors: Partial<Record<keyof ContactFormData, string>> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as keyof ContactFormData] = err.message;
        }
      });
      setErrors(fieldErrors);
      setIsSubmitting(false);
      return;
    }

    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await fetch(`${API_URL}/api/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Message Sent!",
          description: "Thank you for reaching out. Your message has been saved.",
        });
        setFormData({ name: "", email: "", message: "" });
      } else {
        throw new Error(data.error || 'Failed to send message');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to send message. Is the backend running?",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="relative py-24">
      <div className="absolute inset-0 bg-noise" />

      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[400px] bg-primary/5 rounded-full blur-3xl" />

      <div className="container relative z-10 px-4">
        {/* Section header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Get in <span className="text-primary">Touch</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Have questions or want to collaborate? Send us a message or reach out through social media.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-5xl mx-auto items-start">
          {/* Contact Info Column */}
          <div className="space-y-8 animate-in fade-in slide-in-from-left duration-700">
            <div>
              <h3 className="text-2xl font-semibold mb-4 text-foreground">Yaswanth Katikala (Yash)</h3>
              <p className="text-muted-foreground mb-6">
                Passionate AI developer and creator of SPARK Hub. I'm always open to new opportunities, collaborations, and conversations about the future of AI.
              </p>
            </div>

            <div className="space-y-4">
              <a
                href="mailto:katikalayaswanth@gmail.com"
                className="flex items-center gap-4 group transition-colors hover:text-primary"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 transition-colors group-hover:bg-primary/20">
                  <Mail className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Email</div>
                  <div className="text-foreground">katikalayaswanth@gmail.com</div>
                </div>
              </a>

              <a
                href="https://github.com/dev-yaswanth"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 group transition-colors hover:text-primary"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 transition-colors group-hover:bg-primary/20">
                  <Github className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">GitHub</div>
                  <div className="text-foreground">dev-yaswanth</div>
                </div>
              </a>

              <a
                href="https://www.linkedin.com/in/yaswanth-katikala/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 group transition-colors hover:text-primary"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 transition-colors group-hover:bg-primary/20">
                  <Linkedin className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">LinkedIn</div>
                  <div className="text-foreground">yaswanth-katikala</div>
                </div>
              </a>
            </div>
          </div>

          {/* Contact form Column */}
          <div className="bg-card/50 backdrop-blur-sm border border-border p-6 rounded-2xl shadow-xl animate-in fade-in slide-in-from-right duration-700">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name field */}
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium text-foreground flex items-center gap-2">
                  <User className="h-4 w-4 text-primary" />
                  Name
                </label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your name"
                  className="bg-background/50 border-border focus:border-primary"
                  aria-invalid={!!errors.name}
                />
                {errors.name && (
                  <p className="text-sm text-destructive">{errors.name}</p>
                )}
              </div>

              {/* Email field */}
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-foreground flex items-center gap-2">
                  <Mail className="h-4 w-4 text-primary" />
                  Email
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your@email.com"
                  className="bg-background/50 border-border focus:border-primary"
                  aria-invalid={!!errors.email}
                />
                {errors.email && (
                  <p className="text-sm text-destructive">{errors.email}</p>
                )}
              </div>

              {/* Message field */}
              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-medium text-foreground flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-primary" />
                  Message
                </label>
                <Textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="How can we help you?"
                  rows={5}
                  className="bg-background/50 border-border focus:border-primary resize-none"
                  aria-invalid={!!errors.message}
                />
                {errors.message && (
                  <p className="text-sm text-destructive">{errors.message}</p>
                )}
              </div>

              {/* Submit button */}
              <Button
                type="submit"
                variant="hero"
                size="lg"
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  "Sending..."
                ) : (
                  <>
                    Send Message
                    <Send className="h-4 w-4" />
                  </>
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
