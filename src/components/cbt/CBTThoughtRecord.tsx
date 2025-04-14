
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";
import { AIAssistant } from "@/components/AIAssistant";
import { Brain, ThumbsUp, ThumbsDown, Lightbulb, Pencil, Trash, Check, X, Plus, CalendarIcon } from "lucide-react";
import { format, parseISO } from "date-fns";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

interface ThoughtRecord {
  id: string;
  user_id: string;
  situation: string;
  emotions: string[];
  emotion_intensities: number[];
  automatic_thoughts: string;
  thinking_errors: string[];
  balanced_thoughts: string;
  outcome_emotions: string[];
  outcome_intensities: number[];
  created_at: string;
  updated_at: string;
}

const emptyThoughtRecord: Omit<ThoughtRecord, "id" | "user_id" | "created_at" | "updated_at"> = {
  situation: "",
  emotions: ["Anxious"],
  emotion_intensities: [70],
  automatic_thoughts: "",
  thinking_errors: [],
  balanced_thoughts: "",
  outcome_emotions: ["Anxious"],
  outcome_intensities: [0],
};

const emotionOptions = [
  "Anxious", "Sad", "Angry", "Guilty", "Ashamed", 
  "Frustrated", "Helpless", "Overwhelmed", "Jealous", 
  "Embarrassed", "Hurt", "Confused", "Fearful", 
  "Disappointed", "Lonely", "Stressed", "Worried"
];

const thinkingErrorOptions = [
  "All-or-nothing thinking",
  "Overgeneralization",
  "Mental filtering",
  "Discounting the positive",
  "Jumping to conclusions",
  "Magnification or minimization",
  "Emotional reasoning",
  "Should statements",
  "Labeling",
  "Personalization and blame"
];

export function CBTThoughtRecord() {
  const { session } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [step, setStep] = useState(0);
  const [editingRecord, setEditingRecord] = useState<ThoughtRecord | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [date, setDate] = useState<Date | undefined>(new Date());
  
  // Form state
  const [thoughtRecord, setThoughtRecord] = useState<Omit<ThoughtRecord, "id" | "user_id" | "created_at" | "updated_at">>(emptyThoughtRecord);
  
  // Queries
  const { data: thoughtRecords, isLoading } = useQuery({
    queryKey: ["thought-records", session?.user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("thought_records")
        .select("*")
        .eq("user_id", session?.user?.id)
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data as ThoughtRecord[];
    },
    enabled: !!session?.user?.id
  });
  
  // Mutations
  const createThoughtRecord = useMutation({
    mutationFn: async (record: Omit<ThoughtRecord, "id" | "user_id" | "created_at" | "updated_at">) => {
      const { data, error } = await supabase
        .from("thought_records")
        .insert([{
          user_id: session?.user?.id,
          ...record
        }])
        .select();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["thought-records"] });
      toast({
        title: "Thought record created",
        description: "Your thought record has been saved successfully."
      });
      resetForm();
    },
    onError: (error) => {
      toast({
        title: "Error creating thought record",
        description: "Please try again.",
        variant: "destructive"
      });
      console.error("Error creating thought record:", error);
    }
  });
  
  const updateThoughtRecord = useMutation({
    mutationFn: async (record: ThoughtRecord) => {
      const { error } = await supabase
        .from("thought_records")
        .update({
          situation: record.situation,
          emotions: record.emotions,
          emotion_intensities: record.emotion_intensities,
          automatic_thoughts: record.automatic_thoughts,
          thinking_errors: record.thinking_errors,
          balanced_thoughts: record.balanced_thoughts,
          outcome_emotions: record.outcome_emotions,
          outcome_intensities: record.outcome_intensities,
          updated_at: new Date().toISOString()
        })
        .eq("id", record.id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["thought-records"] });
      toast({
        title: "Thought record updated",
        description: "Your thought record has been updated successfully."
      });
      resetForm();
    },
    onError: (error) => {
      toast({
        title: "Error updating thought record",
        description: "Please try again.",
        variant: "destructive"
      });
      console.error("Error updating thought record:", error);
    }
  });
  
  const deleteThoughtRecord = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("thought_records")
        .delete()
        .eq("id", id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["thought-records"] });
      toast({
        title: "Thought record deleted",
        description: "Your thought record has been deleted."
      });
    },
    onError: (error) => {
      toast({
        title: "Error deleting thought record",
        description: "Please try again.",
        variant: "destructive"
      });
      console.error("Error deleting thought record:", error);
    }
  });
  
  // Helpers
  const resetForm = () => {
    setThoughtRecord(emptyThoughtRecord);
    setIsAdding(false);
    setIsEditing(false);
    setEditingRecord(null);
    setStep(0);
  };
  
  const handleEditRecord = (record: ThoughtRecord) => {
    setEditingRecord(record);
    setThoughtRecord({
      situation: record.situation,
      emotions: record.emotions,
      emotion_intensities: record.emotion_intensities,
      automatic_thoughts: record.automatic_thoughts,
      thinking_errors: record.thinking_errors,
      balanced_thoughts: record.balanced_thoughts,
      outcome_emotions: record.outcome_emotions,
      outcome_intensities: record.outcome_intensities,
    });
    setIsEditing(true);
    setIsAdding(true);
    setStep(0);
  };
  
  const handleSubmitForm = () => {
    if (isEditing && editingRecord) {
      updateThoughtRecord.mutate({
        ...editingRecord,
        ...thoughtRecord
      });
    } else {
      createThoughtRecord.mutate(thoughtRecord);
    }
  };
  
  const handleAddEmotion = () => {
    setThoughtRecord({
      ...thoughtRecord,
      emotions: [...thoughtRecord.emotions, "Anxious"],
      emotion_intensities: [...thoughtRecord.emotion_intensities, 50]
    });
  };
  
  const handleRemoveEmotion = (index: number) => {
    setThoughtRecord({
      ...thoughtRecord,
      emotions: thoughtRecord.emotions.filter((_, i) => i !== index),
      emotion_intensities: thoughtRecord.emotion_intensities.filter((_, i) => i !== index)
    });
  };
  
  const handleAddOutcomeEmotion = () => {
    setThoughtRecord({
      ...thoughtRecord,
      outcome_emotions: [...thoughtRecord.outcome_emotions, "Anxious"],
      outcome_intensities: [...thoughtRecord.outcome_intensities, 0]
    });
  };
  
  const handleRemoveOutcomeEmotion = (index: number) => {
    setThoughtRecord({
      ...thoughtRecord,
      outcome_emotions: thoughtRecord.outcome_emotions.filter((_, i) => i !== index),
      outcome_intensities: thoughtRecord.outcome_intensities.filter((_, i) => i !== index)
    });
  };
  
  const updateEmotionValue = (index: number, field: string, value: string | number) => {
    setThoughtRecord({
      ...thoughtRecord,
      [field]: thoughtRecord[field as keyof typeof thoughtRecord].map((item: string | number, i: number) => {
        if (i === index) {
          return value;
        }
        return item;
      }) as any
    });
  };
  
  const toggleThinkingError = (error: string) => {
    if (thoughtRecord.thinking_errors.includes(error)) {
      setThoughtRecord({
        ...thoughtRecord,
        thinking_errors: thoughtRecord.thinking_errors.filter(e => e !== error)
      });
    } else {
      setThoughtRecord({
        ...thoughtRecord,
        thinking_errors: [...thoughtRecord.thinking_errors, error]
      });
    }
  };
  
  // Step validation logic
  const canMoveToNextStep = () => {
    switch (step) {
      case 0:
        return !!thoughtRecord.situation;
      case 1:
        return thoughtRecord.emotions.length > 0 && thoughtRecord.emotion_intensities.length > 0;
      case 2:
        return !!thoughtRecord.automatic_thoughts;
      case 3:
        return thoughtRecord.thinking_errors.length > 0;
      case 4:
        return !!thoughtRecord.balanced_thoughts;
      default:
        return true;
    }
  };
  
  // Render
  return (
    <div className="space-y-6">
      {/* Thought record entry form */}
      {isAdding ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>{isEditing ? "Edit Thought Record" : "New Thought Record"}</span>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={resetForm}
              >
                <X className="h-4 w-4" />
              </Button>
            </CardTitle>
            <CardDescription>
              Step {step + 1} of 6: {
                step === 0 ? "Describe the situation" :
                step === 1 ? "Identify emotions" :
                step === 2 ? "Identify automatic thoughts" :
                step === 3 ? "Identify thinking errors" :
                step === 4 ? "Develop balanced thoughts" :
                "Review outcome"
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Step 1: Situation */}
            {step === 0 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="situation">What happened? When? Where? Who was involved?</Label>
                  <Textarea
                    id="situation"
                    rows={4}
                    placeholder="Describe the situation that triggered your emotional response..."
                    value={thoughtRecord.situation}
                    onChange={(e) => setThoughtRecord({ ...thoughtRecord, situation: e.target.value })}
                  />
                </div>
                
                <div className="flex items-center gap-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-[240px] justify-start text-left font-normal",
                          !date && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            )}
            
            {/* Step 2: Emotions */}
            {step === 1 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>What emotions did you feel? How intense were they?</Label>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={handleAddEmotion}
                      disabled={thoughtRecord.emotions.length >= 5}
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add Emotion
                    </Button>
                  </div>
                  
                  <div className="space-y-3">
                    {thoughtRecord.emotions.map((emotion, index) => (
                      <div key={index} className="grid grid-cols-12 gap-2 items-center">
                        <div className="col-span-5">
                          <Select
                            value={emotion}
                            onValueChange={(value) => updateEmotionValue(index, "emotions", value)}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {emotionOptions.map((option) => (
                                <SelectItem key={option} value={option}>
                                  {option}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="col-span-6">
                          <div className="flex items-center gap-2">
                            <Input
                              type="range"
                              min="0"
                              max="100"
                              value={thoughtRecord.emotion_intensities[index]}
                              onChange={(e) => updateEmotionValue(index, "emotion_intensities", parseInt(e.target.value))}
                              className="h-2"
                            />
                            <span className="text-sm font-medium w-8">
                              {thoughtRecord.emotion_intensities[index]}%
                            </span>
                          </div>
                        </div>
                        
                        <div className="col-span-1 flex justify-end">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveEmotion(index)}
                            disabled={thoughtRecord.emotions.length <= 1}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            
            {/* Step 3: Automatic Thoughts */}
            {step === 2 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="automatic-thoughts">
                    What thoughts went through your mind in this situation?
                  </Label>
                  <Textarea
                    id="automatic-thoughts"
                    rows={5}
                    placeholder="What was I thinking? What was going through my mind? What did this situation mean to me?"
                    value={thoughtRecord.automatic_thoughts}
                    onChange={(e) => setThoughtRecord({ ...thoughtRecord, automatic_thoughts: e.target.value })}
                  />
                </div>
              </div>
            )}
            
            {/* Step 4: Thinking Errors */}
            {step === 3 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>
                    What thinking errors might be present in your thoughts?
                  </Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {thinkingErrorOptions.map((error) => (
                      <div 
                        key={error}
                        className={cn(
                          "p-3 rounded-md border-2 cursor-pointer transition-colors flex items-center gap-2",
                          thoughtRecord.thinking_errors.includes(error) 
                            ? "border-primary bg-primary/10" 
                            : "border-muted hover:border-muted-foreground"
                        )}
                        onClick={() => toggleThinkingError(error)}
                      >
                        <div className={cn(
                          "w-4 h-4 rounded-full border-2 flex items-center justify-center",
                          thoughtRecord.thinking_errors.includes(error) 
                            ? "border-primary text-primary" 
                            : "border-muted-foreground"
                        )}>
                          {thoughtRecord.thinking_errors.includes(error) && (
                            <Check className="h-3 w-3" />
                          )}
                        </div>
                        <span className="text-sm">{error}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            
            {/* Step 5: Balanced Thoughts */}
            {step === 4 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="balanced-thoughts">
                    Create a more balanced perspective
                  </Label>
                  <Textarea
                    id="balanced-thoughts"
                    rows={5}
                    placeholder="What's a more balanced way to think about this situation? What evidence supports or contradicts my thoughts?"
                    value={thoughtRecord.balanced_thoughts}
                    onChange={(e) => setThoughtRecord({ ...thoughtRecord, balanced_thoughts: e.target.value })}
                  />
                </div>
                
                <AIAssistant
                  type="cbt_helper"
                  data={{
                    situation: thoughtRecord.situation,
                    emotions: thoughtRecord.emotions,
                    automaticThoughts: thoughtRecord.automatic_thoughts,
                    thinkingErrors: thoughtRecord.thinking_errors
                  }}
                />
              </div>
            )}
            
            {/* Step 6: Outcome */}
            {step === 5 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>How do you feel now after finding balanced thoughts?</Label>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={handleAddOutcomeEmotion}
                      disabled={thoughtRecord.outcome_emotions.length >= 5}
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add Emotion
                    </Button>
                  </div>
                  
                  <div className="space-y-3">
                    {thoughtRecord.outcome_emotions.map((emotion, index) => (
                      <div key={index} className="grid grid-cols-12 gap-2 items-center">
                        <div className="col-span-5">
                          <Select
                            value={emotion}
                            onValueChange={(value) => updateEmotionValue(index, "outcome_emotions", value)}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {emotionOptions.map((option) => (
                                <SelectItem key={option} value={option}>
                                  {option}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="col-span-6">
                          <div className="flex items-center gap-2">
                            <Input
                              type="range"
                              min="0"
                              max="100"
                              value={thoughtRecord.outcome_intensities[index]}
                              onChange={(e) => updateEmotionValue(index, "outcome_intensities", parseInt(e.target.value))}
                              className="h-2"
                            />
                            <span className="text-sm font-medium w-8">
                              {thoughtRecord.outcome_intensities[index]}%
                            </span>
                          </div>
                        </div>
                        
                        <div className="col-span-1 flex justify-end">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveOutcomeEmotion(index)}
                            disabled={thoughtRecord.outcome_emotions.length <= 1}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="p-4 bg-muted rounded-lg">
                  <h3 className="font-medium mb-2">Review Your Work</h3>
                  <div className="space-y-3 text-sm">
                    <div>
                      <p className="font-medium">Situation:</p>
                      <p>{thoughtRecord.situation}</p>
                    </div>
                    <div>
                      <p className="font-medium">Initial Emotions:</p>
                      <div className="flex flex-wrap gap-2">
                        {thoughtRecord.emotions.map((emotion, index) => (
                          <div key={index} className="px-2 py-1 bg-primary/10 rounded text-xs">
                            {emotion} ({thoughtRecord.emotion_intensities[index]}%)
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="font-medium">Automatic Thoughts:</p>
                      <p>{thoughtRecord.automatic_thoughts}</p>
                    </div>
                    <div>
                      <p className="font-medium">Thinking Errors:</p>
                      <div className="flex flex-wrap gap-1">
                        {thoughtRecord.thinking_errors.map((error, index) => (
                          <div key={index} className="px-2 py-1 bg-primary/10 rounded text-xs">
                            {error}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="font-medium">Balanced Thoughts:</p>
                      <p>{thoughtRecord.balanced_thoughts}</p>
                    </div>
                    <div>
                      <p className="font-medium">Outcome Emotions:</p>
                      <div className="flex flex-wrap gap-2">
                        {thoughtRecord.outcome_emotions.map((emotion, index) => (
                          <div key={index} className="px-2 py-1 bg-primary/10 rounded text-xs">
                            {emotion} ({thoughtRecord.outcome_intensities[index]}%)
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button 
              variant="outline" 
              onClick={() => setStep(Math.max(0, step - 1))}
              disabled={step === 0}
            >
              Previous
            </Button>
            
            {step < 5 ? (
              <Button 
                onClick={() => setStep(step + 1)}
                disabled={!canMoveToNextStep()}
              >
                Next
              </Button>
            ) : (
              <Button 
                onClick={handleSubmitForm}
                disabled={!canMoveToNextStep()}
              >
                Save Record
              </Button>
            )}
          </CardFooter>
        </Card>
      ) : (
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Your Thought Records</h2>
          <Button 
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            New Record
          </Button>
        </div>
      )}

      {/* Thought records list */}
      {!isAdding && (
        <div className="space-y-4">
          {isLoading ? (
            <div className="text-center p-4">Loading your thought records...</div>
          ) : !thoughtRecords?.length ? (
            <Card>
              <CardContent className="p-8 text-center space-y-4">
                <Brain className="h-12 w-12 mx-auto text-muted-foreground" />
                <h3 className="text-xl font-medium">No thought records yet</h3>
                <p className="text-muted-foreground">
                  Start challenging unhelpful thoughts by creating your first thought record.
                </p>
                <Button 
                  onClick={() => setIsAdding(true)} 
                  className="mt-2"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Record
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {thoughtRecords.map((record) => (
                <Card key={record.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">
                          {record.situation.length > 60 
                            ? `${record.situation.substring(0, 60)}...` 
                            : record.situation}
                        </CardTitle>
                        <CardDescription>
                          {format(parseISO(record.created_at), "MMMM d, yyyy")}
                        </CardDescription>
                      </div>
                      <div className="flex gap-1">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleEditRecord(record)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => {
                            if (confirm("Are you sure you want to delete this thought record?")) {
                              deleteThoughtRecord.mutate(record.id);
                            }
                          }}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-4">
                    <div className="space-y-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-sm font-medium">Emotions:</span>
                        {record.emotions.map((emotion, index) => (
                          <div key={index} className="px-2 py-1 bg-primary/10 rounded text-xs">
                            {emotion} ({record.emotion_intensities[index]}%)
                          </div>
                        ))}
                      </div>
                      
                      <Separator />
                      
                      <div className="space-y-1">
                        <span className="text-sm font-medium">Automatic thoughts:</span>
                        <p className="text-sm text-muted-foreground">
                          {record.automatic_thoughts.length > 100 
                            ? `${record.automatic_thoughts.substring(0, 100)}...` 
                            : record.automatic_thoughts}
                        </p>
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-1">
                        <span className="text-sm font-medium mr-1">Thinking errors:</span>
                        {record.thinking_errors.map((error, index) => (
                          <div key={index} className="px-2 py-1 bg-muted rounded text-xs">
                            {error}
                          </div>
                        ))}
                      </div>
                      
                      <Separator />
                      
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-sm font-medium">Outcome:</span>
                        {record.outcome_emotions.map((emotion, index) => (
                          <div key={index} className="px-2 py-1 bg-primary/10 rounded text-xs">
                            {emotion} ({record.outcome_intensities[index]}%)
                          </div>
                        ))}
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm">
                        {Math.max(...record.emotion_intensities) - Math.max(...record.outcome_intensities) > 20 ? (
                          <div className="flex items-center gap-1 text-green-600">
                            <ThumbsUp className="h-4 w-4" />
                            <span>Significant improvement</span>
                          </div>
                        ) : Math.max(...record.emotion_intensities) - Math.max(...record.outcome_intensities) > 0 ? (
                          <div className="flex items-center gap-1 text-blue-600">
                            <Lightbulb className="h-4 w-4" />
                            <span>Some improvement</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1 text-amber-600">
                            <ThumbsDown className="h-4 w-4" />
                            <span>No improvement yet</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
