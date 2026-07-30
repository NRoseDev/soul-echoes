import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export default function Journal() {
  const [reflection, setReflection] = useState('');
  const [savedEntries, setSavedEntries] = useState<string[]>([]);
  const [articulationPrompt, setArticulationPrompt] = useState('How can you clearly articulate your core vision today?');

  const handleSave = () => {
    if (!reflection.trim()) return;
    setSavedEntries([reflection, ...savedEntries]);
    setReflection('');
  };

  const prompts = [
    'How can you clearly articulate your core vision today?',
    'What boundary do you need to set to protect your creative energy?',
    'Describe your ideal state of flow and how to access it right now.'
  ];

  const nextPrompt = () => {
    const currentIndex = prompts.indexOf(articulationPrompt);
    const nextIndex = (currentIndex + 1) % prompts.length;
    setArticulationPrompt(prompts[nextIndex]);
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Soul Echoes Reflection Journal</h1>
        <p className="text-muted-foreground">
          Capture your daily thoughts, reflections, and articulation training notes.
        </p>
      </div>

      <Card className="border-primary/20 bg-primary/5">
        <CardHeader>
          <CardTitle className="text-lg">Articulation Training Module</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="font-medium text-foreground">{articulationPrompt}</p>
          <Button variant="outline" size="sm" onClick={nextPrompt}>
            New Prompt
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>New Reflection Entry</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea 
            placeholder="Write your reflection or articulation practice notes here..." 
            value={reflection} 
            onChange={(e) => setReflection(e.target.value)}
            rows={5}
          />
          <Button onClick={handleSave}>Save Entry</Button>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Previous Entries</h2>
        {savedEntries.length === 0 ? (
          <p className="text-muted-foreground italic">No journal entries saved yet.</p>
        ) : (
          savedEntries.map((entry, index) => (
            <Card key={index}>
              <CardContent className="p-4 whitespace-pre-wrap">{entry}</CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
