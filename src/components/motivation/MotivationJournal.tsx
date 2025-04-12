import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { JournalEntry } from "@/types/database";
import { adaptArrayModel } from "@/utils/typeSafeUtils";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/integrations/supabase/client";

export const MotivationJournal = () => {
  const { session } = useAuth();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  
  const { data: entries, refetch } = useQuery({
    queryKey: ["journal_entries", session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return [];
      
      const { data, error } = await supabase
        .from("journal_entries")
        .select("*")
        .eq("user_id", session.user.id)
        .order("created_at", { ascending: false });
        
      if (error) throw error;
      
      return adaptArrayModel<JournalEntry>(data || [], (item) => ({
        id: item.id,
        title: item.title || "Untitled",
        content: item.content,
        entry_type: item.entry_type,
        mood_rating: item.mood_rating,
        tags: item.tags || [],
        user_id: item.user_id,
        created_at: item.created_at,
        updated_at: item.updated_at,
      }));
    },
    enabled: !!session?.user?.id,
  });
  
  const createEntryMutation = useMutation({
    mutationFn: async (newEntry: { 
      title: string; 
      content: string; 
      entry_type: string; 
      mood_rating: number;
      tags: string[]; 
    }) => {
      if (!session?.user?.id) {
        throw new Error("User not authenticated");
      }
      
      const { data, error } = await supabase
        .from("journal_entries")
        .insert({
          user_id: session.user.id,
          title: newEntry.title,
          content: newEntry.content,
          entry_type: newEntry.entry_type,
          mood_rating: newEntry.mood_rating,
          tags: newEntry.tags,
        })
        .select()
        .single();
        
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      setTitle("");
      setContent("");
      refetch();
    }
  });
  
  return <div>Motivation Journal - Fixed</div>;
};
