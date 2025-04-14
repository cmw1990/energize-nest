import React from 'react';
import { Card, CardContent, Alert, AlertDescription } from '@mui/material';
import cn from 'classnames';

const SleepAnalytics = ({ insights }) => {
  return (
    <div>
      <Card>
        <CardContent>
          {insights.map((insight, index) => (
            <Alert
              key={index}
              variant={insight.type === 'success' ? 'default' : insight.type as 'warning' | 'info'}
              className="mb-2"
            >
              <div className="flex items-center gap-2">
                {insight.icon}
                <AlertDescription>
                  {insight.text}
                </AlertDescription>
              </div>
            </Alert>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default SleepAnalytics;
