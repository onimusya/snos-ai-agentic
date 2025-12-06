"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import Link from "next/link";

export default function TestConnectionPage() {
  // Test query to check if Convex is connected
  const currentUser = useQuery(api.authQueries.getCurrentUser);
  const isAdmin = useQuery(api.authQueries.isAdmin);

  const connectionStatus = currentUser !== undefined ? "connected" : "loading";
  const hasError = currentUser === undefined && isAdmin === undefined;

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Convex Connection Test</h1>
          <Link href="/">
            <Button variant="outline">Back to Home</Button>
          </Link>
        </div>

        {/* Connection Status */}
        <Card>
          <CardHeader>
            <CardTitle>Connection Status</CardTitle>
            <CardDescription>
              Testing connection to Convex backend
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              {connectionStatus === "loading" && (
                <>
                  <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                  <span className="text-muted-foreground">Connecting to Convex...</span>
                </>
              )}
              {connectionStatus === "connected" && (
                <>
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <span className="text-green-500 font-medium">Connected to Convex!</span>
                </>
              )}
              {hasError && (
                <>
                  <XCircle className="h-5 w-5 text-red-500" />
                  <span className="text-red-500 font-medium">Connection Error</span>
                </>
              )}
            </div>

            {/* Environment Check */}
            <div className="pt-4 border-t">
              <h3 className="font-semibold mb-2">Environment Configuration</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">Convex URL:</span>
                  <code className="px-2 py-1 bg-muted rounded text-xs">
                    {process.env.NEXT_PUBLIC_CONVEX_URL || "Not set"}
                  </code>
                  {process.env.NEXT_PUBLIC_CONVEX_URL ? (
                    <Badge variant="outline" className="text-green-600">
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      Set
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-red-600">
                      <XCircle className="h-3 w-3 mr-1" />
                      Missing
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Query Results */}
        <Card>
          <CardHeader>
            <CardTitle>Query Results</CardTitle>
            <CardDescription>
              Testing Convex queries
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Current User Query */}
            <div>
              <h3 className="font-semibold mb-2">Current User Query</h3>
              <div className="p-4 bg-muted rounded-md">
                {currentUser === undefined ? (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Loading...</span>
                  </div>
                ) : currentUser === null ? (
                  <div className="space-y-2">
                    <Badge variant="outline">Not Authenticated</Badge>
                    <p className="text-sm text-muted-foreground">
                      This is expected if you haven't logged in yet. The query is working correctly!
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Badge variant="outline" className="bg-green-50 text-green-700">
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      Query Successful
                    </Badge>
                    <div className="text-sm space-y-1">
                      <p><strong>User ID:</strong> {currentUser._id}</p>
                      <p><strong>Email:</strong> {currentUser.email}</p>
                      <p><strong>Role:</strong> {currentUser.role}</p>
                      <p><strong>Plan:</strong> {currentUser.subscriptionPlan}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Is Admin Query */}
            <div>
              <h3 className="font-semibold mb-2">Is Admin Query</h3>
              <div className="p-4 bg-muted rounded-md">
                {isAdmin === undefined ? (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Loading...</span>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Badge variant="outline" className="bg-green-50 text-green-700">
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      Query Successful
                    </Badge>
                    <p className="text-sm">
                      <strong>Is Admin:</strong> {isAdmin ? "Yes" : "No"}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card>
          <CardHeader>
            <CardTitle>Testing Instructions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div>
              <h4 className="font-semibold mb-1">✅ If you see "Connected to Convex!":</h4>
              <p className="text-muted-foreground">
                Your frontend is successfully connected to the backend! The queries are working correctly.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-1">❌ If you see "Connection Error":</h4>
              <ol className="list-decimal list-inside space-y-1 text-muted-foreground ml-2">
                <li>Make sure the backend is running: <code className="bg-muted px-1 rounded">cd backend && npx convex dev</code></li>
                <li>Check that <code className="bg-muted px-1 rounded">NEXT_PUBLIC_CONVEX_URL</code> is set in <code className="bg-muted px-1 rounded">frontend/.env.local</code></li>
                <li>Verify the Convex URL matches the one from your backend deployment</li>
                <li>Restart the frontend dev server after updating .env.local</li>
              </ol>
            </div>
            <div>
              <h4 className="font-semibold mb-1">ℹ️ About the "Not Authenticated" result:</h4>
              <p className="text-muted-foreground">
                This is normal! It means the query is working, but you haven't logged in yet. 
                Once you implement authentication, logged-in users will see their user data here.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

