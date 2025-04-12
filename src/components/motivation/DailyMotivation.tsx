
import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { Quote, Heart, Share2, RotateCcw } from "lucide-react";

export function DailyMotivation() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [refreshing, setRefreshing] = useState(false);

  const { data: quote, isLoading, refetch } = useQuery({
    queryKey: ['daily-motivation'],
    queryFn: async () => {
      // Check if we have a stored quote that's from today
      const storedQuote = localStorage.getItem('daily-motivation');
      if (storedQuote) {
        const parsed = JSON.parse(storedQuote);
        const isToday = new Date(parsed.date).toDateString() === new Date().toDateString();
        if (isToday) return parsed;
      }

      try {
        // Fetch a new quote from the ZenQuotes API
        const response = await fetch('https://zenquotes.io/api/random');
        const data = await response.json();
        
        const newQuote = {
          text: data[0]?.q || "Success is not final, failure is not fatal: It is the courage to continue that counts.",
          author: data[0]?.a || "Winston Churchill",
          date: new Date().toISOString(),
          likes: 0
        };
        
        // Store in local storage
        localStorage.setItem('daily-motivation', JSON.stringify(newQuote));
        
        return newQuote;
      } catch (error) {
        console.error('Error fetching quote:', error);
        
        // Return a fallback quote if API fails
        const fallbackQuotes = [
          {
            text: "Success is not final, failure is not fatal: It is the courage to continue that counts.",
            author: "Winston Churchill"
          },
          {
            text: "The greatest glory in living lies not in never falling, but in rising every time we fall.",
            author: "Nelson Mandela"
          },
          {
            text: "Your time is limited, don't waste it living someone else's life.",
            author: "Steve Jobs"
          },
          {
            text: "The way to get started is to quit talking and begin doing.",
            author: "Walt Disney"
          },
          {
            text: "If life were predictable it would cease to be life, and be without flavor.",
            author: "Eleanor Roosevelt"
          }
        ];
        
        const randomIndex = Math.floor(Math.random() * fallbackQuotes.length);
        const fallbackQuote = {
          ...fallbackQuotes[randomIndex],
          date: new Date().toISOString(),
          likes: 0
        };
        
        localStorage.setItem('daily-motivation', JSON.stringify(fallbackQuote));
        
        return fallbackQuote;
      }
    }
  });

  const likeMutation = useMutation({
    mutationFn: async () => {
      // Simulate API call for liking
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (quote) {
        const updatedQuote = { ...quote, likes: quote.likes + 1 };
        localStorage.setItem('daily-motivation', JSON.stringify(updatedQuote));
        return updatedQuote;
      }
      return quote;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['daily-motivation'], data);
      toast({
        title: "Quote liked!",
        description: "You've shown appreciation for this quote.",
      });
    }
  });

  const handleRefresh = async () => {
    setRefreshing(true);
    localStorage.removeItem('daily-motivation');
    await refetch();
    setRefreshing(false);
    toast({
      title: "New motivation loaded",
      description: "Find inspiration in today's new quote."
    });
  };

  const handleShare = () => {
    if (navigator.share && quote) {
      navigator.share({
        title: 'Daily Motivation',
        text: `"${quote.text}" - ${quote.author}`,
        url: window.location.href,
      })
        .then(() => toast({
          title: "Shared successfully!",
          description: "You've spread some motivation today.",
        }))
        .catch((error) => console.log('Error sharing:', error));
    } else {
      // Fallback for browsers that don't support the Web Share API
      navigator.clipboard.writeText(`"${quote?.text}" - ${quote?.author}`)
        .then(() => toast({
          title: "Copied to clipboard!",
          description: "Quote has been copied to your clipboard.",
        }))
        .catch(err => console.error('Failed to copy: ', err));
    }
  };

  return (
    <Card className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <Quote className="h-5 w-5 text-amber-500" />
          Daily Motivation
        </CardTitle>
      </CardHeader>
      <CardContent className="py-6">
        {isLoading || refreshing ? (
          <div className="space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-[80%]" />
            <Skeleton className="h-4 w-[40%] mt-4" />
          </div>
        ) : (
          <div className="space-y-4">
            <blockquote className="text-xl font-medium italic">
              "{quote?.text}"
            </blockquote>
            <p className="text-right text-sm text-muted-foreground">
              — {quote?.author}
            </p>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => likeMutation.mutate()}
          disabled={likeMutation.isPending}
          className="text-rose-500"
        >
          <Heart className="h-4 w-4 mr-1" />
          {quote?.likes || 0}
        </Button>
        <div className="flex gap-2">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={handleShare}
            className="text-blue-500"
          >
            <Share2 className="h-4 w-4 mr-1" />
            Share
          </Button>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={handleRefresh}
            disabled={refreshing}
            className="text-emerald-500"
          >
            <RotateCcw className={`h-4 w-4 mr-1 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
