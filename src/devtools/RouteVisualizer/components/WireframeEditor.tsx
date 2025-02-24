import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';

export const WireframeEditor = () => {
  return (
    <Card className="h-full rounded-none border-0">
      <CardHeader>
        <CardTitle>Wireframe Editor</CardTitle>
      </CardHeader>
      <CardContent>
        <Textarea
          className="h-[calc(100vh-8rem)] font-mono"
          placeholder="// Your component wireframe code here"
        />
      </CardContent>
    </Card>
  );
};
