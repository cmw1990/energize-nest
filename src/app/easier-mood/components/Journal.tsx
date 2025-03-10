import React, { useState } from 'react';
import { Session } from '@supabase/supabase-js';
import { 
  BookOpen, 
  Calendar, 
  Edit, 
  Save, 
  Trash2, 
  Plus,
  Search,
  Tag,
  Filter
} from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../../../components/ui/card';
import { Input } from '../../../components/ui/input';
import { Textarea } from '../../../components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/tabs';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../../../components/ui/dialog';
import { Label } from '../../../components/ui/label';
import { Badge } from '../../../components/ui/badge';
import { supabase } from '../../../integrations/supabase/client';

interface JournalProps {
  session: Session | null;
}

interface JournalEntry {
  id: string;
  title: string;
  content: string;
  date: string;
  tags: string[];
}

export const Journal: React.FC<JournalProps> = ({ session }) => {
  const [activeTab, setActiveTab] = useState('entries');
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [entryTitle, setEntryTitle] = useState('');
  const [entryContent, setEntryContent] = useState('');
  const [entryTags, setEntryTags] = useState('');
  const [editingEntryId, setEditingEntryId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Mock journal entries
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([
    {
      id: '1',
      title: 'Finding Balance',
      content: 'Today I practiced mindfulness for 20 minutes and noticed a significant improvement in my focus throughout the day. I need to make this a daily habit.',
      date: '2023-06-15',
      tags: ['mindfulness', 'focus', 'habits']
    },
    {
      id: '2',
      title: 'Challenging Conversation',
      content: 'Had a difficult conversation with my colleague today. I was nervous at first, but it went better than expected. I expressed my concerns clearly and listened to their perspective.',
      date: '2023-06-12',
      tags: ['work', 'communication', 'growth']
    },
    {
      id: '3',
      title: 'Weekend Reflection',
      content: 'Spent the weekend in nature and felt a deep sense of peace. I need to prioritize these kinds of experiences more often as they really help reset my mental state.',
      date: '2023-06-10',
      tags: ['nature', 'peace', 'reflection']
    }
  ]);
  
  const filteredEntries = journalEntries.filter(entry => {
    if (!searchTerm) return true;
    
    const searchLower = searchTerm.toLowerCase();
    return (
      entry.title.toLowerCase().includes(searchLower) ||
      entry.content.toLowerCase().includes(searchLower) ||
      entry.tags.some(tag => tag.toLowerCase().includes(searchLower))
    );
  });
  
  const handleCreateEntry = () => {
    setEntryTitle('');
    setEntryContent('');
    setEntryTags('');
    setEditingEntryId(null);
    setIsDialogOpen(true);
  };
  
  const handleEditEntry = (entry: JournalEntry) => {
    setEntryTitle(entry.title);
    setEntryContent(entry.content);
    setEntryTags(entry.tags.join(', '));
    setEditingEntryId(entry.id);
    setIsDialogOpen(true);
  };
  
  const handleDeleteEntry = (id: string) => {
    // In a real app, we would delete from Supabase
    // const { error } = await supabase
    //   .from('journal_entries')
    //   .delete()
    //   .eq('id', id)
    //   .eq('user_id', session?.user.id);
    
    // For demo purposes, just remove from local state
    setJournalEntries(journalEntries.filter(entry => entry.id !== id));
  };
  
  const handleSubmitEntry = async () => {
    if (!entryTitle.trim() || !entryContent.trim()) return;
    
    setIsSubmitting(true);
    
    try {
      const tags = entryTags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);
      
      if (editingEntryId) {
        // In a real app, we would update in Supabase
        // const { error } = await supabase
        //   .from('journal_entries')
        //   .update({
        //     title: entryTitle,
        //     content: entryContent,
        //     tags,
        //     updated_at: new Date().toISOString()
        //   })
        //   .eq('id', editingEntryId)
        //   .eq('user_id', session?.user.id);
        
        // For demo purposes, just update local state
        setJournalEntries(journalEntries.map(entry => 
          entry.id === editingEntryId
            ? { ...entry, title: entryTitle, content: entryContent, tags }
            : entry
        ));
      } else {
        // In a real app, we would insert into Supabase
        // const { data, error } = await supabase
        //   .from('journal_entries')
        //   .insert({
        //     user_id: session?.user.id,
        //     title: entryTitle,
        //     content: entryContent,
        //     tags,
        //     created_at: new Date().toISOString()
        //   });
        
        // For demo purposes, just add to local state
        const newEntry: JournalEntry = {
          id: Date.now().toString(),
          title: entryTitle,
          content: entryContent,
          date: new Date().toLocaleDateString(),
          tags
        };
        
        setJournalEntries([newEntry, ...journalEntries]);
      }
      
      setIsDialogOpen(false);
      setEntryTitle('');
      setEntryContent('');
      setEntryTags('');
      setEditingEntryId(null);
      
    } catch (error) {
      console.error('Error saving journal entry:', error);
      // Show error message
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const promptIdeas = [
    "What made you smile today?",
    "Describe a challenge you overcame recently.",
    "What are you grateful for right now?",
    "How did you practice self-care today?",
    "What's something you're looking forward to?",
    "Reflect on a recent interaction that affected you.",
    "What's something you learned recently?",
    "Describe your current emotional state and what might be influencing it."
  ];
  
  return (
    <div className="space-y-6 py-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Journal</h1>
        <Button onClick={handleCreateEntry}>
          <Plus className="mr-2 h-4 w-4" />
          New Entry
        </Button>
      </div>
      
      <Tabs defaultValue="entries" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-2 w-full max-w-md mb-6">
          <TabsTrigger value="entries">My Journal</TabsTrigger>
          <TabsTrigger value="prompts">Writing Prompts</TabsTrigger>
        </TabsList>
        
        <TabsContent value="entries">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Journal Entries
              </CardTitle>
              <CardDescription>
                Record your thoughts, feelings, and experiences
              </CardDescription>
              <div className="flex mt-2">
                <div className="relative flex-1">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search entries..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Button variant="outline" className="ml-2">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredEntries.length > 0 ? (
                  filteredEntries.map((entry) => (
                    <Card key={entry.id} className="overflow-hidden">
                      <CardHeader className="p-4 pb-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-lg">{entry.title}</CardTitle>
                            <CardDescription className="flex items-center mt-1">
                              <Calendar className="h-3 w-3 mr-1" />
                              {entry.date}
                            </CardDescription>
                          </div>
                          <div className="flex space-x-1">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => handleEditEntry(entry)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => handleDeleteEntry(entry.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="p-4 pt-2">
                        <p className="text-sm whitespace-pre-line">
                          {entry.content.length > 200 
                            ? `${entry.content.substring(0, 200)}...` 
                            : entry.content
                          }
                        </p>
                        {entry.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-3">
                            {entry.tags.map((tag) => (
                              <Badge key={tag} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <BookOpen className="h-12 w-12 mx-auto mb-3 opacity-20" />
                    <p>No journal entries found.</p>
                    <p className="text-sm">Start writing to record your thoughts and feelings.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="prompts">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Edit className="h-5 w-5" />
                Writing Prompts
              </CardTitle>
              <CardDescription>
                Inspiration to help you start journaling
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                {promptIdeas.map((prompt, index) => (
                  <Card key={index} className="overflow-hidden">
                    <CardContent className="p-4">
                      <p className="font-medium">{prompt}</p>
                    </CardContent>
                    <CardFooter className="p-4 pt-0 flex justify-end">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => {
                          setEntryTitle(`Reflection: ${prompt.split('?')[0]}?`);
                          setEntryContent('');
                          setEntryTags('reflection');
                          setEditingEntryId(null);
                          setIsDialogOpen(true);
                        }}
                      >
                        Write about this
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {editingEntryId ? 'Edit Journal Entry' : 'New Journal Entry'}
            </DialogTitle>
            <DialogDescription>
              Express your thoughts, feelings, and experiences.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="Give your entry a title"
                value={entryTitle}
                onChange={(e) => setEntryTitle(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                placeholder="What's on your mind?"
                value={entryContent}
                onChange={(e) => setEntryContent(e.target.value)}
                rows={10}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tags" className="flex items-center">
                <Tag className="h-4 w-4 mr-2" />
                Tags (comma separated)
              </Label>
              <Input
                id="tags"
                placeholder="e.g. reflection, gratitude, work"
                value={entryTags}
                onChange={(e) => setEntryTags(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSubmitEntry}
              disabled={!entryTitle.trim() || !entryContent.trim() || isSubmitting}
            >
              <Save className="mr-2 h-4 w-4" />
              {editingEntryId ? 'Update Entry' : 'Save Entry'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Helper component for the arrow icon
const ArrowRight = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M5 12h14M12 5l7 7-7 7" />
  </svg>
); 