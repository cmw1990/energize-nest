
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TopNav } from "@/components/layout/TopNav";
import { WebsiteBlocker } from "@/components/distraction/WebsiteBlocker";
import { AppBlocker } from "@/components/distraction/AppBlocker";
import { BlockingSchedule } from "@/components/distraction/BlockingSchedule";
import { BlockingStats } from "@/components/distraction/BlockingStats";
import { BlockingConfirmDialog } from "@/components/distraction/BlockingConfirmDialog";
import { Shield, ShieldAlert, ShieldCheck, Shield as ShieldIcon } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/components/AuthProvider";
import { useToast } from "@/hooks/use-toast";

const DistractionManager = () => {
  const { session } = useAuth();
  const { toast } = useToast();
  const [showBlockDialog, setShowBlockDialog] = useState(false);
  const [showAllowDialog, setShowAllowDialog] = useState(false);
  const [blockingAction, setBlockingAction] = useState<"block" | "allow">("block");

  useEffect(() => {
    if (session) {
      toast({
        title: "Distraction Manager Active",
        description: "Your personalized blocking rules are now active.",
      });
    }
  }, [session]);

  const handleBlockAll = () => {
    setBlockingAction("block");
    setShowBlockDialog(true);
  };

  const handleAllowAll = () => {
    setBlockingAction("allow");
    setShowAllowDialog(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <TopNav />
      <div className="container mx-auto p-4 space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-2">
                <ShieldIcon className="h-7 w-7 text-primary" />
                Distraction Manager
              </h1>
              <p className="text-muted-foreground mt-1">
                Create a focused environment by managing distractions
              </p>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="destructive" 
                onClick={handleBlockAll} 
                className="flex items-center gap-2"
              >
                <ShieldAlert className="h-4 w-4" />
                Block All
              </Button>
              <Button 
                variant="outline" 
                onClick={handleAllowAll}
                className="flex items-center gap-2"
              >
                <ShieldCheck className="h-4 w-4" />
                Allow All
              </Button>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <BlockingStats />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <WebsiteBlocker />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <AppBlocker />
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <BlockingSchedule />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Smart Blocking Features
              </CardTitle>
              <CardDescription>
                Advanced features to optimize your productivity
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <Card className="p-4 bg-blue-50 dark:bg-blue-900/20">
                <h3 className="font-semibold flex items-center gap-2">
                  <Shield className="h-4 w-4 text-blue-500" />
                  Adaptive Blocking
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Automatically adjusts blocking rules based on your productivity patterns
                </p>
              </Card>
              <Card className="p-4 bg-green-50 dark:bg-green-900/20">
                <h3 className="font-semibold flex items-center gap-2">
                  <Shield className="h-4 w-4 text-green-500" />
                  Focus Time Protection
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Extra blocking strictness during your scheduled focus sessions
                </p>
              </Card>
              <Card className="p-4 bg-purple-50 dark:bg-purple-900/20">
                <h3 className="font-semibold flex items-center gap-2">
                  <Shield className="h-4 w-4 text-purple-500" />
                  AI Pattern Recognition
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Identifies distraction patterns and suggests personalized blocking rules
                </p>
              </Card>
              <Card className="p-4 bg-amber-50 dark:bg-amber-900/20">
                <h3 className="font-semibold flex items-center gap-2">
                  <Shield className="h-4 w-4 text-amber-500" />
                  Scheduled Breaks
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Automatically allows access during scheduled break times
                </p>
              </Card>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <BlockingConfirmDialog
        open={showBlockDialog || showAllowDialog}
        onOpenChange={blockingAction === "block" ? setShowBlockDialog : setShowAllowDialog}
        action={blockingAction}
      />
    </div>
  );
};

export default DistractionManager;
