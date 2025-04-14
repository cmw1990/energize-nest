import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"; // Added CardFooter
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { PlusCircle, Trash2, Edit, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';

// Placeholder affirmations - replace with Supabase fetch later
const predefinedAffirmations = [
  "I am capable and strong.",
  "I embrace challenges as opportunities for growth.",
  "I radiate positivity and attract good things.",
  "I am worthy of love and happiness.",
  "I trust my intuition and make wise decisions.",
  "I am resilient and can overcome any obstacle.",
  "I choose peace and let go of negativity.",
  "I am grateful for the abundance in my life.",
  "I believe in my abilities and potential.",
  "Every day, I am getting better and better."
];

// TODO: Add Supabase integration for user affirmations
// interface UserAffirmation { id: string; user_id: string; text: string; created_at: string; }

export const Affirmations = () => {
  const { toast } = useToast();
  const [affirmations, setAffirmations] = useState<string[]>(predefinedAffirmations);
  const [currentAffirmationIndex, setCurrentAffirmationIndex] = useState(0);
  const [newAffirmation, setNewAffirmation] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);

  const showNextAffirmation = () => {
    setCurrentAffirmationIndex((prevIndex) => (prevIndex + 1) % affirmations.length);
  };

  const handleAddAffirmation = () => {
    if (newAffirmation.trim()) {
      // TODO: Replace with mutation to save to Supabase
      setAffirmations([...affirmations, newAffirmation.trim()]);
      setNewAffirmation("");
      setShowAddForm(false);
      toast({ title: "Affirmation Added", description: "Your custom affirmation is saved." });
    } else {
      toast({ title: "Error", description: "Affirmation cannot be empty.", variant: "destructive" });
    }
  };

  const handleDeleteAffirmation = (indexToDelete: number) => {
     // TODO: Add mutation to delete from Supabase
     setAffirmations(affirmations.filter((_, index) => index !== indexToDelete));
     // Adjust index if the deleted one was currently shown or before it
     if (currentAffirmationIndex >= indexToDelete && currentAffirmationIndex > 0) {
       setCurrentAffirmationIndex(currentAffirmationIndex - 1);
     } else if (affirmations.length === 1) { // Reset if it was the last one
        setCurrentAffirmationIndex(0);
     }
     toast({ title: "Affirmation Deleted" });
  };


  const cardVariants = {
    enter: {
      opacity: 0,
      y: 20,
      scale: 0.95,
    },
    center: {
      zIndex: 1,
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.4,
        ease: [0.4, 0.0, 0.2, 1] // Custom ease for smooth transition
      }
    },
    exit: {
      zIndex: 0,
      opacity: 0,
      y: -20,
      scale: 0.95,
      transition: {
        duration: 0.3,
        ease: [0.4, 0.0, 0.2, 1]
      }
    }
  };


  return (
    <div className="space-y-6">
      <Card className="overflow-hidden shadow-lg border-primary/10 bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 dark:from-purple-900/20 dark:via-pink-900/10 dark:to-rose-900/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-primary" />
            Daily Affirmation
          </CardTitle>
          <CardDescription>Focus on positive self-talk.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center min-h-[150px] relative">
          <AnimatePresence initial={false} mode="wait">
            <motion.p
              key={currentAffirmationIndex}
              variants={cardVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="text-xl md:text-2xl font-semibold text-center text-primary px-4"
            >
              {affirmations[currentAffirmationIndex] || "Start by adding your own affirmations!"}
            </motion.p>
          </AnimatePresence>
        </CardContent>
        <CardFooter className="justify-center">
          <Button onClick={showNextAffirmation} disabled={affirmations.length <= 1}>
            Next Affirmation
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Your Affirmations</span>
            <Button variant="ghost" size="sm" onClick={() => setShowAddForm(!showAddForm)}>
              <PlusCircle className="h-4 w-4 mr-2" />
              {showAddForm ? 'Cancel' : 'Add New'}
            </Button>
          </CardTitle>
          <CardDescription>Manage your personal affirmations.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {showAddForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-2 border p-4 rounded-md"
            >
              <Label htmlFor="new-affirmation">New Affirmation Text</Label>
              <Textarea
                id="new-affirmation"
                value={newAffirmation}
                onChange={(e) => setNewAffirmation(e.target.value)}
                placeholder="e.g., I am calm and centered."
              />
              <Button onClick={handleAddAffirmation} size="sm">Save Affirmation</Button>
            </motion.div>
          )}

          <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
            {affirmations.length > 0 ? affirmations.map((affirmation, index) => (
              <motion.div
                key={index} // Use index as key for now, replace with ID from DB later
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex items-center justify-between p-3 bg-muted/50 rounded-md"
              >
                <p className="text-sm">{affirmation}</p>
                {/* Add Edit button later if needed */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-muted-foreground hover:text-destructive"
                  onClick={() => handleDeleteAffirmation(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </motion.div>
            )) : (
              <p className="text-sm text-muted-foreground text-center py-4">No custom affirmations added yet.</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Affirmations;