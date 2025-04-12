
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertTriangle, Info, Shield, CheckCircle, XCircle, Filter, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { motion } from "framer-motion";

interface SupplementLog {
  supplement_name: string;
  interaction_notes: string;
  created_at: string;
}

interface InteractionInfo {
  name1: string;
  name2: string;
  severity: 'high' | 'medium' | 'low' | 'beneficial';
  description: string;
  recommendation: string;
  reference_url?: string;
}

export function SupplementInteractions() {
  const { session } = useAuth();
  const [severity, setSeverity] = useState<string>("all");

  const { data: interactions, isLoading } = useQuery({
    queryKey: ['supplementInteractions', session?.user?.id],
    queryFn: async () => {
      const { data: logs, error } = await supabase
        .from('supplement_logs')
        .select('supplement_name, interaction_notes, created_at')
        .eq('user_id', session?.user?.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;

      // Fetch known interactions from the database
      const { data: knownInteractions, error: interactionsError } = await supabase
        .from('supplement_interactions')
        .select('*');
      
      if (interactionsError) throw interactionsError;

      // Group supplements taken together
      const today = new Date().toISOString().split('T')[0];
      const supplementsByDay = (logs as SupplementLog[]).reduce((acc: Record<string, Set<string>>, log) => {
        const day = log.created_at?.split('T')[0];
        if (!acc[day]) acc[day] = new Set();
        acc[day].add(log.supplement_name);
        return acc;
      }, {});

      // Find potential interactions
      const allInteractions: any[] = [];
      const knownInt = knownInteractions as InteractionInfo[];
      
      // Check for potential interactions among supplements taken on the same day
      for (const [day, supplements] of Object.entries(supplementsByDay)) {
        const supplementList = Array.from(supplements as Set<string>);
        
        if (supplementList.length > 1) {
          // Check all pairs of supplements
          for (let i = 0; i < supplementList.length; i++) {
            for (let j = i + 1; j < supplementList.length; j++) {
              const supp1 = supplementList[i];
              const supp2 = supplementList[j];
              
              // Check if we have knowledge about this interaction
              const interaction = knownInt.find(
                int => (int.name1 === supp1 && int.name2 === supp2) || 
                       (int.name1 === supp2 && int.name2 === supp1)
              );
              
              if (interaction) {
                allInteractions.push({
                  date: day,
                  supplements: [supp1, supp2],
                  severity: interaction.severity,
                  description: interaction.description,
                  recommendation: interaction.recommendation,
                  reference_url: interaction.reference_url
                });
              } else {
                // Unknown interaction
                allInteractions.push({
                  date: day,
                  supplements: [supp1, supp2],
                  severity: 'unknown',
                  description: "These supplements were taken together, but we don't have information about potential interactions.",
                  recommendation: "Consider researching potential interactions or consulting a healthcare professional.",
                });
              }
            }
          }
        }
      }

      return allInteractions;
    },
    enabled: !!session?.user?.id,
  });

  const filteredInteractions = interactions?.filter(interaction => 
    severity === "all" || interaction.severity === severity
  );

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'low':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'beneficial':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'unknown':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'high':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'medium':
        return <AlertTriangle className="h-5 w-5 text-orange-500" />;
      case 'low':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'beneficial':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'unknown':
        return <Info className="h-5 w-5 text-blue-500" />;
      default:
        return <Info className="h-5 w-5 text-gray-500" />;
    }
  };

  const getSeverityTitle = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'Severe Interaction Detected';
      case 'medium':
        return 'Moderate Interaction Detected';
      case 'low':
        return 'Minor Interaction Detected';
      case 'beneficial':
        return 'Beneficial Interaction';
      case 'unknown':
        return 'Unknown Interaction';
      default:
        return 'Supplement Interaction';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!filteredInteractions?.length) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center text-muted-foreground bg-muted/20 rounded-lg border border-dashed">
        <Shield className="h-12 w-12 text-muted-foreground mb-3 opacity-50" />
        <h3 className="font-medium mb-1">No supplement interactions detected</h3>
        <p className="text-sm max-w-md">
          Continue logging your supplements to monitor potential interactions. Remember to consult healthcare professionals before combining supplements.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Shield className="h-5 w-5 text-primary" />
          Supplement Interactions
        </h3>
        
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Tabs value={severity} onValueChange={setSeverity} className="w-[300px]">
            <TabsList className="grid grid-cols-5">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="high">
                <XCircle className="h-3 w-3 mr-1" />
                High
              </TabsTrigger>
              <TabsTrigger value="medium">
                <AlertTriangle className="h-3 w-3 mr-1" />
                Med
              </TabsTrigger>
              <TabsTrigger value="low">
                <Info className="h-3 w-3 mr-1" />
                Low
              </TabsTrigger>
              <TabsTrigger value="beneficial">
                <CheckCircle className="h-3 w-3 mr-1" />
                Good
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      <Accordion type="multiple" className="space-y-4">
        {filteredInteractions.map((interaction, index) => (
          <motion.div
            key={`${interaction.supplements.join('-')}-${interaction.date}-${index}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <AccordionItem value={`item-${index}`} className={`border rounded-lg ${getSeverityColor(interaction.severity)}`}>
              <AccordionTrigger className="px-4">
                <div className="flex items-center gap-2 text-left">
                  {getSeverityIcon(interaction.severity)}
                  <div>
                    <span className="font-medium">{getSeverityTitle(interaction.severity)}</span>
                    <div className="flex items-center gap-2 mt-1">
                      {interaction.supplements.map((supplement: string) => (
                        <Badge key={supplement} variant="outline" className="bg-white/50">
                          {supplement}
                        </Badge>
                      ))}
                      <span className="text-xs text-muted-foreground">
                        {new Date(interaction.date).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4">
                <div className="space-y-3">
                  <p className="text-sm">{interaction.description}</p>
                  
                  <div className="bg-white/50 rounded p-3 border border-current/10">
                    <h4 className="text-sm font-medium mb-1">Recommendation:</h4>
                    <p className="text-sm">{interaction.recommendation}</p>
                  </div>
                  
                  {interaction.reference_url && (
                    <div className="flex justify-end">
                      <HoverCard>
                        <HoverCardTrigger asChild>
                          <Button variant="link" size="sm" className="text-xs" asChild>
                            <a href={interaction.reference_url} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="h-3 w-3 mr-1" />
                              Learn more
                            </a>
                          </Button>
                        </HoverCardTrigger>
                        <HoverCardContent className="w-80">
                          <div className="flex justify-between space-x-4">
                            <div className="space-y-1">
                              <h4 className="text-sm font-semibold">External Resource</h4>
                              <p className="text-sm">
                                This link will take you to an external resource with more information about this supplement interaction.
                              </p>
                            </div>
                          </div>
                        </HoverCardContent>
                      </HoverCard>
                    </div>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>
          </motion.div>
        ))}
      </Accordion>
      
      <Card className="border-primary/10 shadow-md">
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <Info className="h-4 w-4 text-primary" />
            Disclaimer
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-muted-foreground">
            The interaction information provided is for educational purposes only and should not replace professional medical advice. 
            Always consult with a healthcare provider before starting any new supplement regimen, especially when combining multiple supplements.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
