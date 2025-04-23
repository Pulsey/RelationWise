"use client";

import { useState } from "react";
import { generateRelationshipAdvice } from "@/ai/flows/generate-relationship-advice";
import { detectCrisisLanguage } from "@/ai/flows/detect-crisis-language";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from "lucide-react";
import { Toaster } from "@/components/ui/toaster";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

export default function Home() {
  const [scenario, setScenario] = useState("");
  const [advice, setAdvice] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast()

  const handleAdviceGeneration = async () => {
    setLoading(true);
    setAdvice(null);

    const isCrisis = await detectCrisisLanguage({ text: scenario });

    if (isCrisis.isCrisis) {
      toast({
        title: "Possible crisis detected",
        description:
          "It seems like you might be going through a difficult time. Please call 14416 for immediate help.",
      });
      setLoading(false);
      return;
    }

    try {
      const generatedAdvice = await generateRelationshipAdvice({ scenario });
      setAdvice(generatedAdvice.advice);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-screen py-12 bg-secondary">
      <Toaster />
      <Card className="w-full max-w-3xl p-4 space-y-4">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-primary">RelationWise</CardTitle>
          <CardDescription>
            Get solid relationship advice tailored to your situation.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Textarea
              placeholder="Describe your relationship scenario..."
              value={scenario}
              onChange={(e) => setScenario(e.target.value)}
              rows={4}
              className="shadow-sm focus-visible:ring-primary"
            />
            <Button
              onClick={handleAdviceGeneration}
              disabled={loading || !scenario}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:ring-primary"
            >
              {loading ? "Generating Advice..." : "Get Advice"}
            </Button>
          </div>

          {advice && (
            <div className="space-y-2">
              <Alert>
                <Info className="h-4 w-4" />
                <AlertTitle>Advice:</AlertTitle>
                <AlertDescription>{advice}</AlertDescription>
              </Alert>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

