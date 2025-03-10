import React, { useState, useEffect } from 'react';
import { Session } from '@supabase/supabase-js';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardFooter,
  Button,
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger,
  Badge,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from './ui';
import { supabase } from '../api/supabase-client';
import { useToast } from '../hooks/use-toast';
import { 
  Book, 
  Lock, 
  Zap, 
  Snowflake, 
  Leaf, 
  Play, 
  AlarmClock, 
  HelpCircle, 
  Search,
  Heart,
  Cigarette,
  ThumbsUp,
  Coffee
} from 'lucide-react';

interface GuidesHubProps {
  session: Session | null;
}

interface Guide {
  id: string;
  title: string;
  description: string;
  type: 'article' | 'video' | 'pdf';
  category: string;
  thumbnail: string;
  tags: string[];
  premium: boolean;
  read_time?: string;
  view_count?: number;
  created_at: string;
}

// Helper function to conditionally join class names
const classNames = (...classes: (string | boolean | undefined)[]) => {
  return classes.filter(Boolean).join(' ');
};

export const GuidesHub: React.FC<GuidesHubProps> = ({ session }) => {
  const { toast } = useToast();
  const [guides, setGuides] = useState<Guide[]>([]);
  const [filteredGuides, setFilteredGuides] = useState<Guide[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('guides');

  // Mock guides data - in production, this would come from the database
  const mockGuides: Guide[] = [
    {
      id: '1',
      title: 'Getting Started with Your Quit Journey',
      description: 'A comprehensive guide for your first week of quitting smoking, with tips and strategies for success.',
      type: 'article',
      category: 'beginner',
      thumbnail: 'https://placehold.co/600x400',
      tags: ['beginner', 'first week', 'tips'],
      premium: false,
      read_time: '8 min',
      view_count: 1248,
      created_at: '2023-04-15T10:30:00Z'
    },
    {
      id: '2',
      title: 'Understanding Nicotine Withdrawal',
      description: 'Learn about the science behind withdrawal symptoms and how to manage them effectively.',
      type: 'article',
      category: 'health',
      thumbnail: 'https://placehold.co/600x400',
      tags: ['withdrawal', 'symptoms', 'science'],
      premium: false,
      read_time: '12 min',
      view_count: 965,
      created_at: '2023-05-20T14:45:00Z'
    },
    {
      id: '3',
      title: 'Guided Breathing Exercises for Cravings',
      description: 'Video tutorial for breathing techniques that help reduce cravings in moments of stress.',
      type: 'video',
      category: 'techniques',
      thumbnail: 'https://placehold.co/600x400',
      tags: ['breathing', 'cravings', 'stress'],
      premium: true,
      read_time: '15 min',
      view_count: 723,
      created_at: '2023-06-10T09:15:00Z'
    },
    {
      id: '4',
      title: 'The Benefits of Quitting Over Time',
      description: 'A timeline of health improvements after quitting smoking, from 20 minutes to 15 years.',
      type: 'article',
      category: 'health',
      thumbnail: 'https://placehold.co/600x400',
      tags: ['benefits', 'health', 'timeline'],
      premium: false,
      read_time: '6 min',
      view_count: 1632,
      created_at: '2023-03-05T16:20:00Z'
    },
    {
      id: '5',
      title: 'Advanced Strategies for Long-term Success',
      description: 'Proven techniques for maintaining your smoke-free lifestyle after the initial quitting phase.',
      type: 'pdf',
      category: 'advanced',
      thumbnail: 'https://placehold.co/600x400',
      tags: ['advanced', 'long-term', 'maintenance'],
      premium: true,
      read_time: '20 min',
      view_count: 547,
      created_at: '2023-07-12T11:30:00Z'
    },
    {
      id: '6',
      title: 'Nutrition Tips for Ex-Smokers',
      description: 'How to adjust your diet to maximize health benefits and minimize weight gain after quitting.',
      type: 'article',
      category: 'lifestyle',
      thumbnail: 'https://placehold.co/600x400',
      tags: ['nutrition', 'diet', 'weight', 'health'],
      premium: false,
      read_time: '10 min',
      view_count: 892,
      created_at: '2023-05-30T08:45:00Z'
    }
  ];

  useEffect(() => {
    // Simulate loading guides from database
    const loadGuides = async () => {
      setIsLoading(true);
      try {
        // In a real app, this would fetch from Supabase
        // const { data, error } = await supabase.from('guides').select('*');
        
        // Using mock data for now
        setTimeout(() => {
          setGuides(mockGuides);
          setFilteredGuides(mockGuides);
          setIsLoading(false);
        }, 800);
      } catch (error) {
        console.error('Error loading guides:', error);
        toast({
          title: 'Error',
          description: 'Failed to load guides. Please try again.',
          variant: 'destructive',
        });
        setIsLoading(false);
      }
    };

    loadGuides();
  }, [toast]);

  useEffect(() => {
    // Filter guides based on search term and category
    let filtered = [...guides];

    if (searchTerm) {
      filtered = filtered.filter(guide => 
        guide.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        guide.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        guide.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(guide => guide.category === selectedCategory);
    }

    setFilteredGuides(filtered);
  }, [searchTerm, selectedCategory, guides]);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'article':
        return <Book className="h-4 w-4" />;
      case 'video':
        return <Play className="h-4 w-4" />;
      case 'pdf':
        return <Book className="h-4 w-4" />;
      default:
        return <HelpCircle className="h-4 w-4" />;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'beginner':
        return <Zap className="h-4 w-4" />;
      case 'health':
        return <Heart className="h-4 w-4" />;
      case 'techniques':
        return <Snowflake className="h-4 w-4" />;
      case 'advanced':
        return <ThumbsUp className="h-4 w-4" />;
      case 'lifestyle':
        return <Coffee className="h-4 w-4" />;
      default:
        return <Leaf className="h-4 w-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'beginner':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'health':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'techniques':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'advanced':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      case 'lifestyle':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Guides & Resources</h1>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="guides">Guides</TabsTrigger>
          <TabsTrigger value="videos">Videos</TabsTrigger>
          <TabsTrigger value="tools">Tools</TabsTrigger>
        </TabsList>
        
        <TabsContent value="guides" className="space-y-4">
          <div className="flex flex-col gap-4 md:flex-row md:justify-between">
            <div className="md:max-w-sm">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
                <Input
                  type="search"
                  placeholder="Search guides..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="beginner">Beginner</SelectItem>
                <SelectItem value="health">Health</SelectItem>
                <SelectItem value="techniques">Techniques</SelectItem>
                <SelectItem value="advanced">Advanced</SelectItem>
                <SelectItem value="lifestyle">Lifestyle</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {isLoading ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="overflow-hidden">
                  <div className="h-48 bg-gray-200 dark:bg-gray-800 animate-pulse" />
                  <CardHeader className="animate-pulse">
                    <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/2"></div>
                  </CardHeader>
                  <CardContent className="animate-pulse">
                    <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-full mb-2"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-5/6"></div>
                  </CardContent>
                  <CardFooter className="animate-pulse">
                    <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded w-1/3"></div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : filteredGuides.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredGuides.map((guide) => (
                <Card key={guide.id} className="overflow-hidden h-full flex flex-col">
                  <div className="h-48 bg-gray-200 dark:bg-gray-800 relative">
                    {guide.thumbnail && (
                      <img 
                        src={guide.thumbnail} 
                        alt={guide.title} 
                        className="w-full h-full object-cover"
                      />
                    )}
                    {guide.premium && (
                      <div className="absolute top-2 right-2 bg-amber-500 text-white text-xs font-semibold px-2 py-1 rounded-full flex items-center gap-1">
                        <Lock className="h-3 w-3" />
                        Premium
                      </div>
                    )}
                    <div className="absolute bottom-2 left-2 flex gap-1">
                      <Badge className="bg-gray-800/70 hover:bg-gray-800/80 text-white">
                        {getTypeIcon(guide.type)}
                        <span className="ml-1">{guide.type}</span>
                      </Badge>
                    </div>
                  </div>
                  
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <Badge className={classNames("flex items-center gap-1", getCategoryColor(guide.category))}>
                        {getCategoryIcon(guide.category)}
                        {guide.category}
                      </Badge>
                      {guide.read_time && (
                        <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                          <AlarmClock className="h-3 w-3 mr-1" />
                          {guide.read_time}
                        </div>
                      )}
                    </div>
                    <CardTitle className="mt-2 text-lg">{guide.title}</CardTitle>
                    <CardDescription className="line-clamp-2 mt-2">
                      {guide.description}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="pb-2 flex-grow">
                    <div className="flex flex-wrap gap-1 mt-2">
                      {guide.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                  
                  <CardFooter className="pt-0">
                    <Button variant="outline" className="w-full">
                      Read Guide
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center p-12 border rounded-lg">
              <Book className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-medium">No guides found</h3>
              <p className="text-sm text-gray-500 mt-2">
                Try adjusting your search or filters to find what you're looking for.
              </p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="videos" className="space-y-4">
          <div className="text-center p-12 border rounded-lg">
            <Play className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-medium">Video Resources Coming Soon</h3>
            <p className="text-sm text-gray-500 mt-2">
              Our video library is currently under development. Check back soon!
            </p>
          </div>
        </TabsContent>
        
        <TabsContent value="tools" className="space-y-4">
          <div className="text-center p-12 border rounded-lg">
            <Cigarette className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-medium">Interactive Tools Coming Soon</h3>
            <p className="text-sm text-gray-500 mt-2">
              We're working on interactive tools to help with your quit journey.
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}; 