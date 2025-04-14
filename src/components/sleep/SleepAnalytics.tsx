// Take the complete previous implementation (up to line 594) and just update/replace the final section:

          {insights.map((insight, index) => (
            <Alert
              key={index}
              variant={insight.type === 'success' ? 'default' : insight.type as 'warning' | 'info'}
            >
              <div className={cn(
                'flex items-center gap-2',
                insight.type === 'success' && 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-700',
                insight.type === 'warning' && 'bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-700',
                insight.type === 'info' && 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-700'
              )}>
                {insight.icon}
                <AlertDescription className={cn(
                  'ml-2',
                  insight.type === 'success' && 'text-green-800 dark:text-green-300',
                  insight.type === 'warning' && 'text-yellow-800 dark:text-yellow-300',
                  insight.type === 'info' && 'text-blue-800 dark:text-blue-300'
                )}>
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
