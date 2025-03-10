import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export const PropertyPanel = () => {
  return (
    <Card className="h-full rounded-none border-0">
      <CardHeader>
        <CardTitle>Properties</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="path">Path</Label>
            <Input id="path" placeholder="/your/route/path" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="component">Component</Label>
            <Input id="component" placeholder="YourComponent" />
          </div>
          <Button className="w-full">Apply Changes</Button>
        </div>
      </CardContent>
    </Card>
  );
};
