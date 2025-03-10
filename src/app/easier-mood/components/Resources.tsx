import React, { useState } from 'react';
import { Session } from '@supabase/supabase-js';
import { 
  BookOpen, 
  Video, 
  Headphones, 
  FileText, 
  Search,
  ExternalLink,
  Download,
  Bookmark,
  Star
} from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../../../components/ui/card';
import { Input } from '../../../components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/tabs';
import { Badge } from '../../../components/ui/badge';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../components/ui/select';

interface ResourcesProps {
  session: Session | null;
}

interface Resource {
  id: string;
  title: string;
  description: string;
  type: 'article' | 'video' | 'audio' | 'pdf';
  url: string;
  thumbnail?: string;
  tags: string[];
  rating: number;
  isSaved: boolean;
}

export const Resources: React.FC<ResourcesProps> = ({ session }) => {
  const [activeTab, setActiveTab] = useState('articles');
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  
  // Mock resources
  const [resources, setResources] = useState<Resource[]>([
    {
      id: '1',
      title: 'Understanding Your Emotions: A Beginner\'s Guide',
      description: 'Learn the basics of emotional intelligence and how to identify your feelings more accurately.',
      type: 'article',
      url: '#',
      thumbnail: '/images/emotions-guide.webp',
      tags: ['emotional-intelligence', 'self-awareness', 'beginners'],
      rating: 4.7,
      isSaved: true
    },
    {
      id: '2',
      title: '10-Minute Guided Meditation for Anxiety Relief',
      description: 'A short guided meditation practice to help calm anxiety and center your thoughts.',
      type: 'audio',
      url: '#',
      thumbnail: '/images/meditation-audio.webp',
      tags: ['meditation', 'anxiety', 'quick-practice'],
      rating: 4.9,
      isSaved: false
    },
    {
      id: '3',
      title: 'The Science of Mood: How Your Brain Creates Emotions',
      description: 'An in-depth look at the neuroscience behind emotions and mood regulation.',
      type: 'video',
      url: '#',
      thumbnail: '/images/mood-science.webp',
      tags: ['neuroscience', 'mood', 'education'],
      rating: 4.5,
      isSaved: false
    },
    {
      id: '4',
      title: 'Cognitive Behavioral Therapy Workbook',
      description: 'A comprehensive workbook with exercises to help challenge negative thought patterns.',
      type: 'pdf',
      url: '#',
      thumbnail: '/images/cbt-workbook.webp',
      tags: ['cbt', 'workbook', 'exercises'],
      rating: 4.8,
      isSaved: true
    },
    {
      id: '5',
      title: 'Journaling Techniques for Emotional Processing',
      description: 'Learn effective journaling methods to process difficult emotions and gain insights.',
      type: 'article',
      url: '#',
      thumbnail: '/images/journaling.webp',
      tags: ['journaling', 'emotional-processing', 'techniques'],
      rating: 4.6,
      isSaved: false
    },
    {
      id: '6',
      title: 'Understanding and Managing Anger',
      description: 'A video guide on recognizing anger triggers and developing healthy coping mechanisms.',
      type: 'video',
      url: '#',
      thumbnail: '/images/anger-management.webp',
      tags: ['anger', 'coping-skills', 'emotional-regulation'],
      rating: 4.4,
      isSaved: false
    }
  ]);
  
  const getResourceIcon = (type: Resource['type']) => {
    switch (type) {
      case 'article':
        return <FileText className="h-5 w-5" />;
      case 'video':
        return <Video className="h-5 w-5" />;
      case 'audio':
        return <Headphones className="h-5 w-5" />;
      case 'pdf':
        return <BookOpen className="h-5 w-5" />;
      default:
        return <FileText className="h-5 w-5" />;
    }
  };
  
  const getResourceTypeLabel = (type: Resource['type']) => {
    switch (type) {
      case 'article':
        return 'Article';
      case 'video':
        return 'Video';
      case 'audio':
        return 'Audio';
      case 'pdf':
        return 'PDF';
      default:
        return 'Resource';
    }
  };
  
  const filteredResources = resources.filter(resource => {
    // Filter by search term
    const matchesSearch = !searchTerm || 
      resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    // Filter by category
    const matchesCategory = categoryFilter === 'all' || resource.type === categoryFilter;
    
    // Filter by tab
    const matchesTab = (
      (activeTab === 'articles' && resource.type === 'article') ||
      (activeTab === 'videos' && resource.type === 'video') ||
      (activeTab === 'audio' && resource.type === 'audio') ||
      (activeTab === 'downloads' && resource.type === 'pdf') ||
      (activeTab === 'saved' && resource.isSaved)
    );
    
    return matchesSearch && matchesCategory && matchesTab;
  });
  
  const handleToggleSave = (id: string) => {
    setResources(resources.map(resource => 
      resource.id === id
        ? { ...resource, isSaved: !resource.isSaved }
        : resource
    ));
  };
  
  return (
    <div className="space-y-6 py-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Resources</h1>
      </div>
      
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search resources..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="w-full md:w-48">
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="article">Articles</SelectItem>
              <SelectItem value="video">Videos</SelectItem>
              <SelectItem value="audio">Audio</SelectItem>
              <SelectItem value="pdf">PDFs</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <Tabs defaultValue="articles" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-5 w-full">
          <TabsTrigger value="articles">
            <FileText className="h-4 w-4 mr-2" />
            Articles
          </TabsTrigger>
          <TabsTrigger value="videos">
            <Video className="h-4 w-4 mr-2" />
            Videos
          </TabsTrigger>
          <TabsTrigger value="audio">
            <Headphones className="h-4 w-4 mr-2" />
            Audio
          </TabsTrigger>
          <TabsTrigger value="downloads">
            <Download className="h-4 w-4 mr-2" />
            Downloads
          </TabsTrigger>
          <TabsTrigger value="saved">
            <Bookmark className="h-4 w-4 mr-2" />
            Saved
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="articles">
          <ResourceList 
            resources={filteredResources} 
            onToggleSave={handleToggleSave} 
            emptyMessage="No articles found matching your criteria."
            getResourceIcon={getResourceIcon}
            getResourceTypeLabel={getResourceTypeLabel}
          />
        </TabsContent>
        
        <TabsContent value="videos">
          <ResourceList 
            resources={filteredResources} 
            onToggleSave={handleToggleSave} 
            emptyMessage="No videos found matching your criteria."
            getResourceIcon={getResourceIcon}
            getResourceTypeLabel={getResourceTypeLabel}
          />
        </TabsContent>
        
        <TabsContent value="audio">
          <ResourceList 
            resources={filteredResources} 
            onToggleSave={handleToggleSave} 
            emptyMessage="No audio resources found matching your criteria."
            getResourceIcon={getResourceIcon}
            getResourceTypeLabel={getResourceTypeLabel}
          />
        </TabsContent>
        
        <TabsContent value="downloads">
          <ResourceList 
            resources={filteredResources} 
            onToggleSave={handleToggleSave} 
            emptyMessage="No downloadable resources found matching your criteria."
            getResourceIcon={getResourceIcon}
            getResourceTypeLabel={getResourceTypeLabel}
          />
        </TabsContent>
        
        <TabsContent value="saved">
          <ResourceList 
            resources={filteredResources} 
            onToggleSave={handleToggleSave} 
            emptyMessage="No saved resources found. Save resources to access them quickly later."
            getResourceIcon={getResourceIcon}
            getResourceTypeLabel={getResourceTypeLabel}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

interface ResourceListProps {
  resources: Resource[];
  onToggleSave: (id: string) => void;
  emptyMessage: string;
  getResourceIcon: (type: Resource['type']) => React.ReactNode;
  getResourceTypeLabel: (type: Resource['type']) => string;
}

const ResourceList: React.FC<ResourceListProps> = ({ 
  resources, 
  onToggleSave, 
  emptyMessage,
  getResourceIcon,
  getResourceTypeLabel
}) => {
  if (resources.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <BookOpen className="h-12 w-12 mx-auto mb-3 opacity-20" />
        <p>{emptyMessage}</p>
      </div>
    );
  }
  
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mt-4">
      {resources.map((resource) => (
        <Card key={resource.id} className="overflow-hidden flex flex-col">
          <div className="relative h-40 bg-muted">
            <img
              src={resource.thumbnail || `https://via.placeholder.com/400x200?text=${resource.type}`}
              alt={resource.title}
              className="object-cover w-full h-full"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = `https://via.placeholder.com/400x200?text=${resource.type}`;
              }}
            />
            <div 
              className="absolute top-2 left-2 flex items-center gap-1 bg-gray-200 text-gray-800 px-2 py-0.5 rounded-full text-xs font-medium"
            >
              {getResourceIcon(resource.type)}
              {getResourceTypeLabel(resource.type)}
            </div>
          </div>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg line-clamp-2">{resource.title}</CardTitle>
            <div className="flex items-center text-sm text-muted-foreground">
              <div className="flex items-center">
                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 mr-1" />
                <span>{resource.rating.toFixed(1)}</span>
              </div>
              <div className="flex ml-auto">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onToggleSave(resource.id)}
                  className="h-8 w-8"
                >
                  <Bookmark 
                    className={`h-4 w-4 ${resource.isSaved ? 'fill-primary text-primary' : ''}`} 
                  />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pb-2 flex-grow">
            <p className="text-sm text-muted-foreground line-clamp-3">
              {resource.description}
            </p>
            {resource.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-3">
                {resource.tags.map((tag) => (
                  <div 
                    key={tag} 
                    className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold"
                  >
                    {tag.replace(/-/g, ' ')}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button 
              variant="outline" 
              className="w-full flex items-center justify-center"
              asChild
            >
              <a href={resource.url} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4 mr-2" />
                {resource.type === 'pdf' ? 'Download' : 'View'} {getResourceTypeLabel(resource.type)}
              </a>
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}; 