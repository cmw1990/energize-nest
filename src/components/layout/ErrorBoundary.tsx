
import React from "react";
import { Link } from "react-router-dom";
import { HomeIcon, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";

interface ErrorBoundaryProps {
  error?: Error;
  resetErrorBoundary?: () => void;
}

const ErrorBoundary = ({ error, resetErrorBoundary }: ErrorBoundaryProps) => {
  // Log the error to help with debugging
  if (error) {
    console.error("Error boundary caught an error:", error);
  }

  const handleRefresh = () => {
    if (resetErrorBoundary) {
      resetErrorBoundary();
    } else {
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Something went wrong</CardTitle>
          <CardDescription>
            We've encountered an unexpected error
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="p-4 bg-muted/50 rounded-md">
            <p className="text-sm font-mono break-all overflow-auto max-h-32">
              {error?.message || "An unknown error occurred."}
            </p>
          </div>
          
          {error?.stack && (
            <details className="text-xs">
              <summary className="cursor-pointer text-muted-foreground hover:text-foreground transition-colors">
                Technical details
              </summary>
              <pre className="mt-2 p-2 bg-muted/30 rounded-md overflow-auto max-h-48 text-[10px]">
                {error.stack}
              </pre>
            </details>
          )}
        </CardContent>

        <CardFooter className="flex flex-col sm:flex-row gap-3">
          <Button onClick={handleRefresh} className="w-full sm:w-auto flex items-center gap-2">
            <RefreshCw className="w-4 h-4" />
            Try Again
          </Button>
          <Button asChild variant="outline" className="w-full sm:w-auto">
            <Link to="/" className="flex items-center gap-2">
              <HomeIcon className="w-4 h-4" />
              Return Home
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ErrorBoundary;
