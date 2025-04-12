
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Edit3, Save, Trash, Plus, ListFilter } from 'lucide-react';

interface Note {
  id: string;
  title: string;
  content: string;
  category: string;
  createdAt: Date;
}

export const NotePad = () => {
  const [notes, setNotes] = useState<Note[]>([
    {
      id: '1',
      title: 'Energy Levels',
      content: 'Noticed higher energy after morning routine. Need to continue this pattern.',
      category: 'energy',
      createdAt: new Date()
    },
    {
      id: '2',
      title: 'Focus Techniques',
      content: 'The Pomodoro technique (25min focus, 5min break) worked well today.',
      category: 'focus',
      createdAt: new Date(Date.now() - 86400000)
    }
  ]);
  
  const [filter, setFilter] = useState('all');
  const [activeNote, setActiveNote] = useState<Note | null>(null);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  
  const handleNewNote = () => {
    const newNote: Note = {
      id: Date.now().toString(),
      title: 'Untitled Note',
      content: '',
      category: 'general',
      createdAt: new Date()
    };
    
    setNotes([newNote, ...notes]);
    setActiveNote(newNote);
    setEditingNote(newNote);
  };
  
  const handleSaveNote = () => {
    if (!editingNote) return;
    
    setNotes(notes.map(note => 
      note.id === editingNote.id ? editingNote : note
    ));
    
    setActiveNote(editingNote);
    setEditingNote(null);
  };
  
  const handleDeleteNote = (id: string) => {
    setNotes(notes.filter(note => note.id !== id));
    if (activeNote?.id === id) {
      setActiveNote(null);
      setEditingNote(null);
    }
  };
  
  const filteredNotes = filter === 'all' 
    ? notes 
    : notes.filter(note => note.category === filter);
    
  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium flex items-center justify-between">
          <span>Notes</span>
          <Button variant="outline" size="sm" onClick={handleNewNote}>
            <Plus className="h-4 w-4 mr-1" />
            New Note
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col flex-1 overflow-hidden">
        <div className="flex gap-2 mb-4">
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="energy">Energy</SelectItem>
              <SelectItem value="focus">Focus</SelectItem>
              <SelectItem value="mood">Mood</SelectItem>
              <SelectItem value="general">General</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="ghost" size="icon">
            <ListFilter className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="grid md:grid-cols-2 gap-4 h-full overflow-hidden">
          <div className="border rounded-lg overflow-y-auto p-1 max-h-[300px]">
            {filteredNotes.length > 0 ? (
              <div className="space-y-1">
                {filteredNotes.map(note => (
                  <div 
                    key={note.id}
                    className={`p-2 rounded cursor-pointer hover:bg-accent ${activeNote?.id === note.id ? 'bg-accent' : ''}`}
                    onClick={() => {
                      setActiveNote(note);
                      setEditingNote(null);
                    }}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-sm">{note.title}</h3>
                        <p className="text-xs text-muted-foreground line-clamp-1">
                          {note.content || "Empty note"}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-muted-foreground hover:text-destructive"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteNote(note.id);
                        }}
                      >
                        <Trash className="h-3 w-3" />
                      </Button>
                    </div>
                    <div className="flex justify-between items-center mt-1">
                      <span className="text-xs px-1.5 py-0.5 rounded bg-primary/10 text-primary">
                        {note.category}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(note.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground">
                No notes found
              </div>
            )}
          </div>
          
          <div className="border rounded-lg p-3 flex flex-col overflow-hidden">
            {activeNote ? (
              editingNote ? (
                <div className="space-y-3 h-full flex flex-col">
                  <Input
                    value={editingNote.title}
                    onChange={(e) => setEditingNote({...editingNote, title: e.target.value})}
                    placeholder="Note title"
                  />
                  
                  <Select 
                    value={editingNote.category}
                    onValueChange={(value) => setEditingNote({...editingNote, category: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="energy">Energy</SelectItem>
                      <SelectItem value="focus">Focus</SelectItem>
                      <SelectItem value="mood">Mood</SelectItem>
                      <SelectItem value="general">General</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Textarea
                    value={editingNote.content}
                    onChange={(e) => setEditingNote({...editingNote, content: e.target.value})}
                    placeholder="Write your note here..."
                    className="flex-1 min-h-0 resize-none"
                  />
                  
                  <div className="flex justify-end gap-2">
                    <Button 
                      variant="outline"
                      onClick={() => setEditingNote(null)}
                    >
                      Cancel
                    </Button>
                    <Button onClick={handleSaveNote}>
                      <Save className="h-4 w-4 mr-1" />
                      Save
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="h-full flex flex-col">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h2 className="text-lg font-medium">{activeNote.title}</h2>
                      <div className="flex items-center gap-2">
                        <span className="text-xs px-1.5 py-0.5 rounded bg-primary/10 text-primary">
                          {activeNote.category}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(activeNote.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={() => setEditingNote({...activeNote})}
                    >
                      <Edit3 className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto">
                    <p className="whitespace-pre-wrap">
                      {activeNote.content || <span className="text-muted-foreground italic">No content</span>}
                    </p>
                  </div>
                </div>
              )
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-muted-foreground">
                <p>Select a note or create a new one</p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-2"
                  onClick={handleNewNote}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  New Note
                </Button>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
