import { ToolPageLayout } from "@/components/ToolPageLayout";
import { FileText, Upload, Loader2 } from "lucide-react";
import React, { useState, ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import ReactMarkdown from 'react-markdown';
import { Progress } from "@/components/ui/progress";

export default function ResumeReviewerPage() {
  const [file, setFile] = useState<File | null>(null);
  const [jobRole, setJobRole] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [analysis, setAnalysis] = useState("");
  const [atsScore, setAtsScore] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      const fileType = selectedFile.name.split('.').pop()?.toLowerCase();

      if (fileType !== 'pdf' && fileType !== 'txt') {
        toast({
          title: "Invalid File Type",
          description: "Please upload a PDF or TXT file.",
          variant: "destructive",
        });
        return;
      }

      setFile(selectedFile);
      setAnalysis(""); // Clear previous analysis
      setAtsScore(null);
    }
  };

  const handleAnalyze = async () => {
    if (!file) {
      toast({
        title: "No File Selected",
        description: "Please upload a resume file first.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setAnalysis("");
    setAtsScore(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('jobRole', jobRole);
      formData.append('jobDescription', jobDescription);

      const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000';
      const response = await fetch(`${API_URL}/api/resume-review`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setAnalysis(data.analysis);
        setAtsScore(data.ats_score);
        toast({
          title: "Analysis Complete",
          description: "Your resume has been analyzed successfully.",
        });
      } else {
        throw new Error(data.error || 'Failed to analyze resume');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to analyze resume";
      const isQuotaError = errorMessage.includes("RESOURCE_EXHAUSTED") || errorMessage.includes("429");

      toast({
        title: isQuotaError ? "API Limit Reached" : "Error",
        description: isQuotaError
          ? "The free tier of Gemini has a temporary rate limit. Please wait a few seconds and try again."
          : "Failed to analyze resume. Make sure the backend server is running.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ToolPageLayout
      icon={FileText}
      title="Resume Reviewer"
      description="Get clear feedback to improve your resume."
      longDescription="Upload your resume to get a simple score and clear tips. We help you find missing skills and fix formatting to help you land your next job."
      features={[
        "Score your resume",
        "Get career tips",
        "Find missing skills",
        "Optimize for employers",
        "Improve your formatting",
        "Polish your language",
      ]}
      status="live"
    >
      <div className="space-y-6 mt-8">
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="resume-upload" className="text-base font-medium">
                  Upload Resume (PDF or TXT)
                </Label>
                <div className="mt-2 flex items-center gap-4">
                  <Input
                    id="resume-upload"
                    type="file"
                    accept=".pdf,.txt"
                    onChange={handleFileChange}
                    className="cursor-pointer"
                  />
                  {file && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <FileText className="h-4 w-4" />
                      <span className="truncate max-w-[200px]">{file.name}</span>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="job-role" className="text-base font-medium">
                  Target Job Role (Optional)
                </Label>
                <Input
                  id="job-role"
                  type="text"
                  placeholder="e.g., Software Engineer, Data Scientist"
                  value={jobRole}
                  onChange={(e) => setJobRole(e.target.value)}
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="job-description" className="text-base font-medium">
                  Job Description (Optional)
                </Label>
                <Textarea
                  id="job-description"
                  placeholder="Paste the job description here for a tailored, brutally honest analysis..."
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  className="mt-2 min-h-[120px]"
                />
              </div>

              <Button
                onClick={handleAnalyze}
                disabled={!file || isLoading}
                className="w-full"
                size="lg"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Analyze Resume
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {analysis && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {atsScore !== null && (
              <Card className="border-primary/20 bg-primary/5">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-semibold flex items-center justify-between">
                    ATS Match Score
                    <span className={`text-2xl font-bold ${atsScore >= 70 ? 'text-green-500' : atsScore >= 40 ? 'text-orange-500' : 'text-red-500'}`}>
                      {atsScore}%
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Progress value={atsScore} className="h-3 grow-orange" />
                  <p className="text-xs text-muted-foreground mt-2">
                    This score represents how well your resume matches standard industry patterns and the target role.
                  </p>
                </CardContent>
              </Card>
            )}

            <Card className="shadow-lg">
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 mb-6 pb-2 border-b">
                  <FileText className="h-5 w-5 text-primary" />
                  <h3 className="text-xl font-bold text-foreground">Detailed Analysis</h3>
                </div>
                <div className="prose prose-sm prose-invert max-w-none prose-headings:text-foreground prose-strong:text-foreground/90 prose-p:text-foreground/80">
                  <ReactMarkdown>{analysis}</ReactMarkdown>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </ToolPageLayout>
  );
}
