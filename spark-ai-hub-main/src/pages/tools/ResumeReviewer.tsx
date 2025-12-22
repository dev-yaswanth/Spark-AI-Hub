import { ToolPageLayout } from "@/components/ToolPageLayout";
import { FileText, Upload, Loader2 } from "lucide-react";
import React, { useState, ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

export default function ResumeReviewerPage() {
  const [file, setFile] = useState<File | null>(null);
  const [jobRole, setJobRole] = useState("");
  const [analysis, setAnalysis] = useState("");
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

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('jobRole', jobRole);

      const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000';
      const response = await fetch(`${API_URL}/api/resume-review`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setAnalysis(data.analysis);
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
      title="AI Resume Reviewer"
      description="ATS scoring, role-based feedback, and actionable improvement suggestions for your resume."
      longDescription="Optimize your resume with our AI-powered Resume Reviewer. This tool analyzes your resume against Applicant Tracking System (ATS) criteria, provides role-specific feedback, and offers actionable suggestions to improve your chances of landing interviews. Get professional-grade resume analysis instantly."
      features={[
        "ATS compatibility scoring",
        "Role-specific feedback",
        "Keyword optimization suggestions",
        "Format and structure analysis",
        "Actionable improvement tips",
        "Industry-specific recommendations",
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
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-xl font-semibold mb-4">Analysis Results</h3>
              <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap">
                {analysis}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </ToolPageLayout>
  );
}
