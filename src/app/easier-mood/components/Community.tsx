import React, { useState } from 'react';
import { Session } from '@supabase/supabase-js';
import { 
  Users, 
  MessageSquare, 
  Heart, 
  Send, 
  ThumbsUp,
  Calendar,
  User,
  Search,
  Filter
} from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../../../components/ui/card';
import { Input } from '../../../components/ui/input';
import { Textarea } from '../../../components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '../../../components/ui/avatar';
import { Badge } from '../../../components/ui/badge';
import { Separator } from '../../../components/ui/separator';
import { supabase } from '../../../integrations/supabase/client';

interface CommunityProps {
  session: Session | null;
}

interface Post {
  id: string;
  author: {
    name: string;
    avatar: string;
    initials: string;
  };
  content: string;
  date: string;
  likes: number;
  comments: number;
  tags: string[];
  isLiked: boolean;
}

interface Comment {
  id: string;
  postId: string;
  author: {
    name: string;
    avatar: string;
    initials: string;
  };
  content: string;
  date: string;
  likes: number;
  isLiked: boolean;
}

export const Community: React.FC<CommunityProps> = ({ session }) => {
  const [activeTab, setActiveTab] = useState('feed');
  const [searchTerm, setSearchTerm] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [commentText, setCommentText] = useState('');
  
  // Mock community posts
  const [posts, setPosts] = useState<Post[]>([
    {
      id: '1',
      author: {
        name: 'Alex Johnson',
        avatar: '',
        initials: 'AJ'
      },
      content: 'Just completed a 30-day mindfulness challenge and I feel so much more centered. Has anyone else tried something similar?',
      date: '2 hours ago',
      likes: 24,
      comments: 5,
      tags: ['mindfulness', 'challenge', 'meditation'],
      isLiked: false
    },
    {
      id: '2',
      author: {
        name: 'Sam Taylor',
        avatar: '',
        initials: 'ST'
      },
      content: 'Having a tough day with anxiety. Any tips for quick grounding techniques I can use at work?',
      date: '5 hours ago',
      likes: 18,
      comments: 12,
      tags: ['anxiety', 'grounding', 'work'],
      isLiked: true
    },
    {
      id: '3',
      author: {
        name: 'Jordan Lee',
        avatar: '',
        initials: 'JL'
      },
      content: 'I\'ve been using the mood tracker for a month now and it\'s amazing to see the patterns. Turns out my mood dips significantly when I don\'t get enough sleep!',
      date: '1 day ago',
      likes: 42,
      comments: 8,
      tags: ['sleep', 'patterns', 'insights'],
      isLiked: false
    }
  ]);
  
  // Mock comments
  const [comments, setComments] = useState<Comment[]>([
    {
      id: '1',
      postId: '2',
      author: {
        name: 'Morgan Chen',
        avatar: '',
        initials: 'MC'
      },
      content: 'I find that the 5-4-3-2-1 technique works well for me. Focus on 5 things you can see, 4 things you can touch, 3 things you can hear, 2 things you can smell, and 1 thing you can taste.',
      date: '4 hours ago',
      likes: 8,
      isLiked: true
    },
    {
      id: '2',
      postId: '2',
      author: {
        name: 'Taylor Smith',
        avatar: '',
        initials: 'TS'
      },
      content: 'Deep breathing works for me. 4 counts in, hold for 4, out for 6. You can do it discreetly at your desk.',
      date: '4 hours ago',
      likes: 5,
      isLiked: false
    },
    {
      id: '3',
      postId: '2',
      author: {
        name: 'Jamie Wilson',
        avatar: '',
        initials: 'JW'
      },
      content: 'I keep a small stress ball in my desk drawer. Sometimes just having something to fidget with helps redirect the anxious energy.',
      date: '3 hours ago',
      likes: 3,
      isLiked: false
    }
  ]);
  
  const filteredPosts = posts.filter(post => {
    if (!searchTerm) return true;
    
    const searchLower = searchTerm.toLowerCase();
    return (
      post.content.toLowerCase().includes(searchLower) ||
      post.author.name.toLowerCase().includes(searchLower) ||
      post.tags.some(tag => tag.toLowerCase().includes(searchLower))
    );
  });
  
  const handleLikePost = (postId: string) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        const newIsLiked = !post.isLiked;
        return {
          ...post,
          likes: newIsLiked ? post.likes + 1 : post.likes - 1,
          isLiked: newIsLiked
        };
      }
      return post;
    }));
  };
  
  const handleLikeComment = (commentId: string) => {
    setComments(comments.map(comment => {
      if (comment.id === commentId) {
        const newIsLiked = !comment.isLiked;
        return {
          ...comment,
          likes: newIsLiked ? comment.likes + 1 : comment.likes - 1,
          isLiked: newIsLiked
        };
      }
      return comment;
    }));
  };
  
  const handleSubmitPost = async () => {
    if (!newPostContent.trim()) return;
    
    setIsSubmitting(true);
    
    try {
      // Extract hashtags from content
      const tags = newPostContent.match(/#(\w+)/g)?.map(tag => tag.substring(1)) || [];
      
      // In a real app, we would save to Supabase
      // const { data, error } = await supabase
      //   .from('community_posts')
      //   .insert({
      //     user_id: session?.user.id,
      //     content: newPostContent,
      //     tags,
      //     created_at: new Date().toISOString()
      //   });
      
      // For demo purposes, just add to local state
      const newPost: Post = {
        id: Date.now().toString(),
        author: {
          name: session?.user?.user_metadata?.name || 'You',
          avatar: '',
          initials: 'YO'
        },
        content: newPostContent,
        date: 'Just now',
        likes: 0,
        comments: 0,
        tags,
        isLiked: false
      };
      
      setPosts([newPost, ...posts]);
      setNewPostContent('');
      
    } catch (error) {
      console.error('Error creating post:', error);
      // Show error message
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleSubmitComment = async () => {
    if (!commentText.trim() || !selectedPost) return;
    
    setIsSubmitting(true);
    
    try {
      // In a real app, we would save to Supabase
      // const { data, error } = await supabase
      //   .from('community_comments')
      //   .insert({
      //     user_id: session?.user.id,
      //     post_id: selectedPost.id,
      //     content: commentText,
      //     created_at: new Date().toISOString()
      //   });
      
      // For demo purposes, just add to local state
      const newComment: Comment = {
        id: Date.now().toString(),
        postId: selectedPost.id,
        author: {
          name: session?.user?.user_metadata?.name || 'You',
          avatar: '',
          initials: 'YO'
        },
        content: commentText,
        date: 'Just now',
        likes: 0,
        isLiked: false
      };
      
      setComments([...comments, newComment]);
      
      // Update comment count on post
      setPosts(posts.map(post => 
        post.id === selectedPost.id
          ? { ...post, comments: post.comments + 1 }
          : post
      ));
      
      setCommentText('');
      
    } catch (error) {
      console.error('Error creating comment:', error);
      // Show error message
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const getPostComments = (postId: string) => {
    return comments.filter(comment => comment.postId === postId);
  };
  
  return (
    <div className="space-y-6 py-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Community</h1>
      </div>
      
      <Tabs defaultValue="feed" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-2 w-full max-w-md mb-6">
          <TabsTrigger value="feed">Community Feed</TabsTrigger>
          <TabsTrigger value="support">Support Groups</TabsTrigger>
        </TabsList>
        
        <TabsContent value="feed">
          <div className="space-y-6">
            {/* New Post Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Share with the community</CardTitle>
                <CardDescription>
                  Post your thoughts, questions, or insights
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex space-x-3">
                  <Avatar>
                    <AvatarFallback>
                      {session?.user?.user_metadata?.name?.[0] || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <Textarea
                      placeholder="What's on your mind? Use #hashtags for topics"
                      value={newPostContent}
                      onChange={(e) => setNewPostContent(e.target.value)}
                      rows={3}
                    />
                    <div className="flex justify-end mt-2">
                      <Button 
                        onClick={handleSubmitPost}
                        disabled={!newPostContent.trim() || isSubmitting}
                      >
                        <Send className="mr-2 h-4 w-4" />
                        Post
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Search and Filter */}
            <div className="flex">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search posts..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button variant="outline" className="ml-2">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </div>
            
            {/* Posts Feed */}
            <div className="space-y-4">
              {filteredPosts.length > 0 ? (
                filteredPosts.map((post) => (
                  <Card key={post.id} className="overflow-hidden">
                    <CardHeader className="p-4 pb-2">
                      <div className="flex items-start">
                        <Avatar className="mr-3">
                          <AvatarImage src={post.author.avatar} />
                          <AvatarFallback>{post.author.initials}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{post.author.name}</div>
                          <div className="text-xs text-muted-foreground flex items-center">
                            <Calendar className="h-3 w-3 mr-1" />
                            {post.date}
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-4 pt-2">
                      <p className="whitespace-pre-line">{post.content}</p>
                      {post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-3">
                          {post.tags.map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              #{tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </CardContent>
                    <CardFooter className="p-4 pt-0 flex justify-between">
                      <div className="flex space-x-4">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="flex items-center space-x-1"
                          onClick={() => handleLikePost(post.id)}
                        >
                          <Heart 
                            className={`h-4 w-4 ${post.isLiked ? 'fill-red-500 text-red-500' : ''}`} 
                          />
                          <span>{post.likes}</span>
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="flex items-center space-x-1"
                          onClick={() => setSelectedPost(post)}
                        >
                          <MessageSquare className="h-4 w-4" />
                          <span>{post.comments}</span>
                        </Button>
                      </div>
                    </CardFooter>
                    
                    {/* Comments Section */}
                    {selectedPost?.id === post.id && (
                      <div className="px-4 pb-4">
                        <Separator className="mb-4" />
                        <div className="space-y-4">
                          {getPostComments(post.id).map((comment) => (
                            <div key={comment.id} className="flex space-x-3">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={comment.author.avatar} />
                                <AvatarFallback>{comment.author.initials}</AvatarFallback>
                              </Avatar>
                              <div className="flex-1 space-y-1">
                                <div className="bg-muted p-3 rounded-md">
                                  <div className="flex justify-between">
                                    <span className="font-medium text-sm">{comment.author.name}</span>
                                    <span className="text-xs text-muted-foreground">{comment.date}</span>
                                  </div>
                                  <p className="text-sm mt-1">{comment.content}</p>
                                </div>
                                <div className="flex items-center">
                                  <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    className="h-6 px-2"
                                    onClick={() => handleLikeComment(comment.id)}
                                  >
                                    <ThumbsUp 
                                      className={`h-3 w-3 mr-1 ${comment.isLiked ? 'fill-primary text-primary' : ''}`} 
                                    />
                                    <span className="text-xs">{comment.likes}</span>
                                  </Button>
                                </div>
                              </div>
                            </div>
                          ))}
                          
                          {/* New Comment Input */}
                          <div className="flex space-x-3 mt-4">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback>
                                {session?.user?.user_metadata?.name?.[0] || 'U'}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 flex space-x-2">
                              <Input
                                placeholder="Write a comment..."
                                value={commentText}
                                onChange={(e) => setCommentText(e.target.value)}
                              />
                              <Button 
                                size="sm"
                                onClick={handleSubmitComment}
                                disabled={!commentText.trim() || isSubmitting}
                              >
                                <Send className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </Card>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Users className="h-12 w-12 mx-auto mb-3 opacity-20" />
                  <p>No posts found.</p>
                  <p className="text-sm">Be the first to share with the community!</p>
                </div>
              )}
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="support">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Support Groups
              </CardTitle>
              <CardDescription>
                Connect with others in supportive group discussions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                {[
                  {
                    title: 'Anxiety Support',
                    description: 'Share experiences and coping strategies for anxiety',
                    members: 342,
                    posts: 1.2
                  },
                  {
                    title: 'Mindfulness Practice',
                    description: 'Daily mindfulness exercises and discussions',
                    members: 528,
                    posts: 3.4
                  },
                  {
                    title: 'Stress Management',
                    description: 'Techniques and support for managing daily stress',
                    members: 416,
                    posts: 2.7
                  },
                  {
                    title: 'Sleep Improvement',
                    description: 'Tips and support for better sleep habits',
                    members: 289,
                    posts: 1.8
                  }
                ].map((group, index) => (
                  <Card key={index}>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">{group.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <p className="text-sm text-muted-foreground">{group.description}</p>
                      <div className="flex items-center mt-2 text-sm text-muted-foreground">
                        <User className="h-4 w-4 mr-1" />
                        <span>{group.members} members</span>
                        <span className="mx-2">•</span>
                        <MessageSquare className="h-4 w-4 mr-1" />
                        <span>{group.posts}k posts</span>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" className="w-full">
                        Join Group
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
              <div className="mt-6 text-center">
                <p className="text-muted-foreground mb-2">Don't see a group that fits your needs?</p>
                <Button>
                  Create a New Group
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}; 