"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertTriangle, CheckCircle2, Info, Shield } from "lucide-react";

interface RiskReportPanelProps {
  conversationId: Id<"conversations"> | null;
}

export function RiskReportPanel({ conversationId }: RiskReportPanelProps) {
  const conversation = useQuery(
    api.conversations.get,
    conversationId ? { conversationId } : "skip"
  );

  if (!conversationId) {
    return (
      <div className="h-full flex items-center justify-center p-4 text-center">
        <div className="text-sm text-muted-foreground">
          <Shield className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p>Select a conversation to view risk assessment</p>
        </div>
      </div>
    );
  }

  if (conversation === undefined) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-sm text-muted-foreground">Loading...</div>
      </div>
    );
  }

  const riskLevel = conversation.riskLevel || "low";
  const riskScore = conversation.riskScore || 0;

  const getRiskColor = (level: string) => {
    switch (level) {
      case "high":
        return "text-red-500";
      case "medium":
        return "text-yellow-500";
      case "low":
        return "text-green-500";
      default:
        return "text-muted-foreground";
    }
  };

  const getRiskIcon = (level: string) => {
    switch (level) {
      case "high":
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case "medium":
        return <Info className="h-5 w-5 text-yellow-500" />;
      case "low":
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      default:
        return <Shield className="h-5 w-5" />;
    }
  };

  return (
    <div className="h-full flex flex-col bg-muted/30 border-l border-border">
      <div className="p-4 border-b border-border">
        <h3 className="text-lg font-semibold mb-2">Risk Assessment</h3>
        <div className="flex items-center gap-2">
          {getRiskIcon(riskLevel)}
          <Badge
            variant={
              riskLevel === "high"
                ? "destructive"
                : riskLevel === "medium"
                ? "default"
                : "secondary"
            }
            className="text-sm"
          >
            {riskLevel.toUpperCase()}
          </Badge>
          <span className="text-sm text-muted-foreground">
            Score: {Math.round(riskScore * 100)}%
          </span>
        </div>
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {riskLevel === "high"
                  ? "This content shows significant risk indicators. Exercise caution."
                  : riskLevel === "medium"
                  ? "This content shows some risk indicators. Review carefully."
                  : "This content appears to be low risk. Continue with normal precautions."}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Key Findings</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Detailed analysis will appear here once the AI agent completes
                the investigation.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Recommended Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-muted-foreground space-y-2 list-disc list-inside">
                {riskLevel === "high" && (
                  <>
                    <li>Do not provide personal information</li>
                    <li>Do not click on any links</li>
                    <li>Report this to authorities if necessary</li>
                  </>
                )}
                {riskLevel === "medium" && (
                  <>
                    <li>Verify the source independently</li>
                    <li>Be cautious with any requests</li>
                    <li>Double-check before taking action</li>
                  </>
                )}
                {riskLevel === "low" && (
                  <>
                    <li>Continue with normal precautions</li>
                    <li>Stay vigilant</li>
                  </>
                )}
              </ul>
            </CardContent>
          </Card>
        </div>
      </ScrollArea>
    </div>
  );
}

