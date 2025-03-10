import React, { useState, useEffect } from 'react';
import { Session } from '@supabase/supabase-js';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  Book, 
  Lock, 
  Zap, 
  Snowflake, 
  LineChart, 
  Hand, 
  Hash, 
  Hourglass, 
  Clock, 
  Star, 
  CheckCircle, 
  BarChart, 
  Calendar,
  ThumbsUp,
  Video,
  FileText,
  Crown
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { QuittingMethod } from '../db/schema';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface GuidesHubProps {
  session: Session | null;
}

interface Guide {
  id: string;
  title: string;
  method: QuittingMethod;
  content_preview: string;
  content_full: string;
  is_premium: boolean;
  author: string;
  published_date: string;
  categories: string[];
  featured_image_url: string;
  video_url?: string;
}

// Method icons mapping
const methodIcons: Record<QuittingMethod, React.ReactNode> = {
  cold_turkey: <Snowflake className="h-5 w-5" />,
  gradual_reduction: <LineChart className="h-5 w-5" />,
  nicotine_replacement: <Hand className="h-5 w-5" />,
  scheduled_reduction: <Calendar className="h-5 w-5" />,
  cut_triggers: <Hash className="h-5 w-5" />,
  delay_technique: <Hourglass className="h-5 w-5" />
};

// Method names for display
const methodNames: Record<QuittingMethod, string> = {
  cold_turkey: "Cold Turkey",
  gradual_reduction: "Gradual Reduction",
  nicotine_replacement: "Nicotine Replacement",
  scheduled_reduction: "Scheduled Reduction",
  cut_triggers: "Cut Triggers",
  delay_technique: "Delay Technique"
};

// Sample guides data (would come from database in production)
const SAMPLE_GUIDES: Guide[] = [
  {
    id: '1',
    title: 'Mastering the Cold Turkey Method',
    method: 'cold_turkey',
    content_preview: 'Learn how to prepare mentally and physically for quitting all at once. This guide covers essential strategies for managing intense withdrawal symptoms and staying committed to your goal.',
    content_full: '# Mastering the Cold Turkey Method\n\nThe cold turkey method is often considered the most challenging but potentially most rewarding approach to quitting smoking...[Full content would be much longer with sections on preparation, withdrawal management, etc.]',
    is_premium: false,
    author: 'Dr. Emma Reynolds',
    published_date: '2023-05-15',
    categories: ['beginner', 'mental preparation', 'withdrawal'],
    featured_image_url: '/images/guides/cold-turkey.jpg'
  },
  {
    id: '2',
    title: 'The Science of Gradual Reduction',
    method: 'gradual_reduction',
    content_preview: 'Understand the science behind gradually reducing your nicotine intake and how to create an effective reduction schedule that minimizes withdrawal symptoms.',
    content_full: '# The Science of Gradual Reduction\n\nGradual reduction works by slowly decreasing the body\'s dependence on nicotine...[Full content with detailed reduction schedules and scientific explanations]',
    is_premium: true,
    author: 'Prof. James Chen, PhD',
    published_date: '2023-06-22',
    categories: ['scientific', 'reduction schedule', 'moderate'],
    featured_image_url: '/images/guides/gradual-reduction.jpg'
  },
  {
    id: '3',
    title: 'Effective Nicotine Replacement Therapy',
    method: 'nicotine_replacement',
    content_preview: 'A comprehensive guide to using patches, gum, lozenges, and other NRT products effectively to quit smoking while managing cravings.',
    content_full: '# Effective Nicotine Replacement Therapy\n\nNicotine replacement therapy (NRT) can significantly increase your chances of quitting successfully...[Full content with product comparisons and usage guidance]',
    is_premium: true,
    author: 'Dr. Sarah Johnson',
    published_date: '2023-07-10',
    categories: ['NRT', 'products', 'intermediate'],
    featured_image_url: '/images/guides/nrt.jpg',
    video_url: 'https://example.com/videos/nrt-guide.mp4'
  },
  {
    id: '4',
    title: 'The Delay Technique: Mastering Procrastination',
    method: 'delay_technique',
    content_preview: 'Learn how to progressively delay your first and subsequent cigarettes each day until cravings diminish and smoking is eliminated from your routine.',
    content_full: '# The Delay Technique: Mastering Procrastination\n\nThe delay technique is perfect for those who find it difficult to quit all at once...[Full content with delay schedules and distraction techniques]',
    is_premium: false,
    author: 'Michael Peterson',
    published_date: '2023-08-05',
    categories: ['beginner', 'gentle approach', 'psychology'],
    featured_image_url: '/images/guides/delay-technique.jpg'
  },
  {
    id: '5',
    title: 'Identifying and Eliminating Smoking Triggers',
    method: 'cut_triggers',
    content_preview: 'A systematic approach to identifying your personal smoking triggers and developing strategies to eliminate them one by one.',
    content_full: '# Identifying and Eliminating Smoking Triggers\n\nEach person has unique triggers that prompt them to smoke...[Full content with trigger identification worksheets and elimination strategies]',
    is_premium: true,
    author: 'Dr. Lisa Zhang',
    published_date: '2023-09-12',
    categories: ['triggers', 'psychology', 'intermediate'],
    featured_image_url: '/images/guides/triggers.jpg'
  },
  {
    id: '6',
    title: 'Advanced Energy Management During Withdrawal',
    method: 'cold_turkey',
    content_preview: 'Specialized techniques for maintaining energy levels during the challenging withdrawal period of cold turkey quitting.',
    content_full: '# Advanced Energy Management During Withdrawal\n\nOne of the biggest challenges during cold turkey quitting is managing energy levels...[Full content with nutrition, exercise, and sleep strategies]',
    is_premium: true,
    author: 'Jennifer Moss, RN',
    published_date: '2023-10-01',
    categories: ['energy', 'advanced', 'nutrition'],
    featured_image_url: '/images/guides/energy-management.jpg'
  }
];

export const GuidesHub: React.FC<GuidesHubProps> = ({ session }) => {
  const { toast } = useToast();
  const [guides, setGuides] = useState<Guide[]>(SAMPLE_GUIDES);
  const [filteredGuides, setFilteredGuides] = useState<Guide[]>(SAMPLE_GUIDES);
  const [selectedMethod, setSelectedMethod] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isPremiumMember, setIsPremiumMember] = useState(false);
  const [selectedGuide, setSelectedGuide] = useState<Guide | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    // In a real app, you would fetch guides from your database
    // and check if the user is a premium member
    const checkPremiumStatus = async () => {
      if (session?.user) {
        try {
          // This would be an actual database call in production
          // const { data, error } = await supabase
          //   .from('user_subscriptions')
          //   .select('is_premium')
          //   .eq('user_id', session.user.id)
          //   .single();
          
          // if (error) throw error;
          // setIsPremiumMember(data?.is_premium || false);
          
          // For demo purposes, we'll set it to false
          setIsPremiumMember(false);
        } catch (error) {
          console.error('Error checking premium status:', error);
          toast({
            title: 'Error',
            description: 'Failed to check premium membership status',
            variant: 'destructive'
          });
        }
      }
    };
    
    checkPremiumStatus();
  }, [session, toast]);
  
  useEffect(() => {
    // Filter guides based on method and search query
    let filtered = guides;
    
    if (selectedMethod !== 'all') {
      filtered = filtered.filter(guide => guide.method === selectedMethod);
    }
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(guide => 
        guide.title.toLowerCase().includes(query) || 
        guide.content_preview.toLowerCase().includes(query) ||
        guide.categories.some(cat => cat.toLowerCase().includes(query))
      );
    }
    
    setFilteredGuides(filtered);
  }, [guides, selectedMethod, searchQuery]);
  
  const handleUpgradeClick = () => {
    toast({
      title: 'Upgrade to Premium',
      description: 'This would navigate to the subscription page in a production app',
    });
    // Navigate to subscription page in production
  };
  
  const handleGuideSelect = (guide: Guide) => {
    setSelectedGuide(guide);
    setShowPreview(true);
  };
  
  const handleBackToList = () => {
    setSelectedGuide(null);
    setShowPreview(false);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Book className="h-6 w-6 text-indigo-600" />
            Comprehensive Quitting Guides
          </CardTitle>
          <CardDescription>
            Expert advice and step-by-step instructions for every quitting method
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Premium membership banner */}
          {!isPremiumMember && (
            <div className="mb-6 p-4 bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/30 dark:to-yellow-900/30 border border-amber-200 dark:border-amber-800 rounded-lg">
              <div className="flex items-start gap-4">
                <div className="bg-amber-100 dark:bg-amber-800 p-2 rounded-full">
                  <Crown className="h-6 w-6 text-amber-600 dark:text-amber-300" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-amber-800 dark:text-amber-300">Unlock Premium Guides</h3>
                  <p className="text-amber-700 dark:text-amber-400 text-sm mb-3">
                    Upgrade to access our full library of expert guides, video tutorials, and personalized quitting plans.
                  </p>
                  <Button 
                    variant="default" 
                    size="sm" 
                    className="bg-amber-600 hover:bg-amber-700 text-white"
                    onClick={handleUpgradeClick}
                  >
                    Upgrade to Premium
                  </Button>
                </div>
              </div>
            </div>
          )}
          
          {/* If viewing a specific guide */}
          {showPreview && selectedGuide ? (
            <div className="space-y-6">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleBackToList}
                className="mb-4"
              >
                ← Back to all guides
              </Button>
              
              <div className="flex items-center gap-2 mb-2">
                {methodIcons[selectedGuide.method as QuittingMethod]}
                <Badge variant="outline">
                  {methodNames[selectedGuide.method as QuittingMethod]}
                </Badge>
                {selectedGuide.is_premium && (
                  <Badge className="ml-auto bg-amber-500 text-white">
                    <Crown className="h-3 w-3 mr-1" />
                    Premium
                  </Badge>
                )}
              </div>
              
              <h2 className="text-2xl font-bold">{selectedGuide.title}</h2>
              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-4">
                <span>By {selectedGuide.author}</span>
                <span className="mx-2">•</span>
                <span>Published {new Date(selectedGuide.published_date).toLocaleDateString()}</span>
              </div>
              
              {selectedGuide.featured_image_url && (
                <div className="rounded-lg overflow-hidden h-48 bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-6">
                  <div className="text-gray-400 dark:text-gray-600">
                    [Featured Image: {selectedGuide.title}]
                  </div>
                </div>
              )}
              
              <div className="prose dark:prose-invert max-w-none">
                {selectedGuide.is_premium && !isPremiumMember ? (
                  <div>
                    <p className="font-medium">{selectedGuide.content_preview}</p>
                    <div className="mt-8 p-6 border border-amber-200 dark:border-amber-800 rounded-lg bg-amber-50 dark:bg-amber-900/20 text-center">
                      <Lock className="h-10 w-10 mx-auto text-amber-500 mb-4" />
                      <h3 className="text-lg font-semibold text-amber-800 dark:text-amber-300 mb-2">
                        Premium Content Locked
                      </h3>
                      <p className="text-amber-700 dark:text-amber-400 mb-4">
                        Upgrade to access this complete guide and all our premium content.
                      </p>
                      <Button 
                        onClick={handleUpgradeClick}
                        className="bg-amber-600 hover:bg-amber-700 text-white"
                      >
                        Upgrade to Premium
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div>
                    {/* Would use a markdown renderer in production */}
                    <p className="font-medium">{selectedGuide.content_preview}</p>
                    <div className="mt-4">
                      {selectedGuide.is_premium ? (
                        <div className="space-y-4">
                          <h3 className="text-xl font-semibold">Full Premium Content</h3>
                          <p>{selectedGuide.content_full.split('\n').slice(2).join('\n')}</p>
                          
                          {selectedGuide.video_url && (
                            <div className="mt-8">
                              <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
                                <Video className="h-5 w-5 text-indigo-600" />
                                Video Tutorial
                              </h3>
                              <div className="bg-gray-100 dark:bg-gray-800 h-64 rounded-lg flex items-center justify-center">
                                <div className="text-gray-400 dark:text-gray-600 flex flex-col items-center gap-2">
                                  <Video className="h-10 w-10" />
                                  [Video Content: {selectedGuide.title}]
                                </div>
                              </div>
                            </div>
                          )}
                          
                          <div className="mt-8">
                            <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
                              <FileText className="h-5 w-5 text-indigo-600" />
                              Downloadable Resources
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <Button variant="outline" className="justify-start">
                                <FileText className="h-4 w-4 mr-2" />
                                Step-by-Step Worksheet
                              </Button>
                              <Button variant="outline" className="justify-start">
                                <FileText className="h-4 w-4 mr-2" />
                                Tracking Calendar
                              </Button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <p>{selectedGuide.content_full.split('\n').slice(2).join('\n')}</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* Guide listing view */
            <div>
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="flex-1">
                  <Label htmlFor="search-guides" className="sr-only">Search guides</Label>
                  <Input
                    id="search-guides"
                    placeholder="Search guides..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full"
                  />
                </div>
                <div className="w-full sm:w-1/3">
                  <Label htmlFor="method-filter" className="sr-only">Filter by method</Label>
                  <Select value={selectedMethod} onValueChange={setSelectedMethod}>
                    <SelectTrigger id="method-filter">
                      <SelectValue placeholder="All methods" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All methods</SelectItem>
                      <SelectItem value="cold_turkey">Cold Turkey</SelectItem>
                      <SelectItem value="gradual_reduction">Gradual Reduction</SelectItem>
                      <SelectItem value="nicotine_replacement">Nicotine Replacement</SelectItem>
                      <SelectItem value="scheduled_reduction">Scheduled Reduction</SelectItem>
                      <SelectItem value="cut_triggers">Cut Triggers</SelectItem>
                      <SelectItem value="delay_technique">Delay Technique</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <Tabs defaultValue="all" className="mb-6">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="all">All Guides</TabsTrigger>
                  <TabsTrigger value="free">Free Guides</TabsTrigger>
                  <TabsTrigger value="premium">Premium Guides</TabsTrigger>
                </TabsList>
                
                <TabsContent value="all" className="mt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredGuides.map((guide) => (
                      <GuideCard 
                        key={guide.id}
                        guide={guide}
                        isPremiumMember={isPremiumMember}
                        onSelect={() => handleGuideSelect(guide)}
                      />
                    ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="free" className="mt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredGuides
                      .filter(guide => !guide.is_premium)
                      .map((guide) => (
                        <GuideCard 
                          key={guide.id}
                          guide={guide}
                          isPremiumMember={isPremiumMember}
                          onSelect={() => handleGuideSelect(guide)}
                        />
                      ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="premium" className="mt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredGuides
                      .filter(guide => guide.is_premium)
                      .map((guide) => (
                        <GuideCard 
                          key={guide.id}
                          guide={guide}
                          isPremiumMember={isPremiumMember}
                          onSelect={() => handleGuideSelect(guide)}
                        />
                      ))}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

// Guide Card Component
interface GuideCardProps {
  guide: Guide;
  isPremiumMember: boolean;
  onSelect: () => void;
}

const GuideCard: React.FC<GuideCardProps> = ({ guide, isPremiumMember, onSelect }) => {
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer" onClick={onSelect}>
      <div className="h-3 bg-gradient-to-r from-indigo-500 to-blue-600"></div>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 mt-1">
            {methodIcons[guide.method as QuittingMethod]}
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <Badge variant="outline" className="text-xs">
                {methodNames[guide.method as QuittingMethod]}
              </Badge>
              {guide.is_premium && (
                <Badge className="bg-amber-500 text-white text-xs">
                  <Crown className="h-3 w-3 mr-1" />
                  Premium
                </Badge>
              )}
            </div>
            <h3 className="font-semibold line-clamp-2 mb-2">{guide.title}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3 mb-3">
              {guide.content_preview}
            </p>
            <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
              <span>By {guide.author}</span>
              <span>{new Date(guide.published_date).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-0 pb-4 px-4">
        <Button 
          variant={guide.is_premium && !isPremiumMember ? "outline" : "default"} 
          size="sm" 
          className="w-full"
        >
          {guide.is_premium && !isPremiumMember ? (
            <div className="flex items-center justify-center gap-1">
              <Lock className="h-3 w-3" />
              Unlock Premium
            </div>
          ) : (
            "Read Guide"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}; 