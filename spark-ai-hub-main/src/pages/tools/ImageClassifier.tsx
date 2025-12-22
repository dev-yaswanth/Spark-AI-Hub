import { ToolPageLayout } from "@/components/ToolPageLayout";
import { ImageIcon, Upload, Loader2 } from "lucide-react";
import React, { useState, ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

interface Prediction {
  label: string;
  confidence: number;
}

export default function ImageClassifierPage() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      const fileType = selectedFile.name.split('.').pop()?.toLowerCase();

      if (!['jpg', 'jpeg', 'png'].includes(fileType || '')) {
        toast({
          title: "Invalid File Type",
          description: "Please upload a JPG, JPEG, or PNG image.",
          variant: "destructive",
        });
        return;
      }

      setFile(selectedFile);
      setPredictions([]); // Clear previous predictions

      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleClassify = async () => {
    if (!file) {
      toast({
        title: "No Image Selected",
        description: "Please upload an image first.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setPredictions([]);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000';
      const response = await fetch(`${API_URL}/api/image-classify`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setPredictions(data.predictions);
        toast({
          title: "Classification Complete",
          description: "Image has been classified successfully.",
        });
      } else {
        throw new Error(data.error || 'Failed to classify image');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to classify image";
      const isQuotaError = errorMessage.includes("RESOURCE_EXHAUSTED") || errorMessage.includes("429");

      toast({
        title: isQuotaError ? "API Limit Reached" : "Error",
        description: isQuotaError
          ? "The free tier of Gemini has a temporary rate limit. Please wait a few seconds and try again."
          : "Failed to classify image. Make sure the backend server is running.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ToolPageLayout
      icon={ImageIcon}
      title="AI Image Classifier"
      description="Upload an image and get intelligent classification results with confidence scores."
      longDescription="Our AI Image Classifier uses advanced computer vision models to analyze and categorize images with high accuracy. Simply upload an image and receive detailed classification results along with confidence scores. Perfect for content moderation, image organization, and automated tagging workflows."
      features={[
        "Multi-label classification",
        "Confidence score reporting",
        "Support for common image formats",
        "Fast processing times",
        "Detailed category breakdown",
        "Batch processing support",
      ]}
      status="live"
    >
      <div className="space-y-6 mt-8">
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="image-upload" className="text-base font-medium">
                  Upload Image (JPG, JPEG, or PNG)
                </Label>
                <div className="mt-2">
                  <Input
                    id="image-upload"
                    type="file"
                    accept=".jpg,.jpeg,.png"
                    onChange={handleFileChange}
                    className="cursor-pointer"
                  />
                </div>
              </div>

              {previewUrl && (
                <div className="mt-4">
                  <Label className="text-base font-medium mb-2 block">Preview</Label>
                  <div className="relative w-full max-w-md mx-auto">
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="w-full h-auto rounded-lg border border-border"
                    />
                  </div>
                </div>
              )}

              <Button
                onClick={handleClassify}
                disabled={!file || isLoading}
                className="w-full"
                size="lg"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Classifying...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Classify Image
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {predictions.length > 0 && (
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-xl font-semibold mb-4">Classification Results</h3>
              <div className="space-y-4">
                {predictions.map((prediction, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium capitalize">
                        {prediction.label.replace(/_/g, ' ')}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {prediction.confidence.toFixed(2)}%
                      </span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all duration-500"
                        style={{ width: `${prediction.confidence}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </ToolPageLayout>
  );
}
