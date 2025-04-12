
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { format } from 'date-fns';
import { motion } from 'framer-motion';

export const DigitalClock = () => {
  const [time, setTime] = useState(new Date());
  
  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <Card>
      <CardContent className="p-6">
        <div className="text-center space-y-4">
          <motion.div
            className="text-4xl sm:text-5xl font-extralight"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {format(time, 'hh:mm:ss a')}
          </motion.div>
          
          <div className="font-medium text-lg text-muted-foreground">
            {format(time, 'EEEE, MMMM do, yyyy')}
          </div>
          
          <div className="grid grid-cols-3 gap-2 text-sm text-muted-foreground">
            <div className="text-center">
              <div className="text-primary font-semibold">Peak energy</div>
              <div>10:00 AM</div>
            </div>
            <div className="text-center">
              <div className="text-primary font-semibold">Focus time</div>
              <div>2:00 PM</div>
            </div>
            <div className="text-center">
              <div className="text-primary font-semibold">Wind down</div>
              <div>8:00 PM</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
