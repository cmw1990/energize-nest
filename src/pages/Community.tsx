
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, MessageSquare, Calendar, Award } from "lucide-react";

export default function Community() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Community</h1>
      
      <Tabs defaultValue="discussions">
        <TabsList className="mb-4">
          <TabsTrigger value="discussions">
            <MessageSquare className="mr-2 h-4 w-4" />
            Discussions
          </TabsTrigger>
          <TabsTrigger value="events">
            <Calendar className="mr-2 h-4 w-4" />
            Events
          </TabsTrigger>
          <TabsTrigger value="groups">
            <Users className="mr-2 h-4 w-4" />
            Groups
          </TabsTrigger>
          <TabsTrigger value="achievements">
            <Award className="mr-2 h-4 w-4" />
            Achievements
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="discussions">
          <Card>
            <CardHeader>
              <CardTitle>Community Discussions</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Connect with others on their wellness journey. Share your experiences, 
                challenges, and successes.
              </p>
              <div className="mt-4 border rounded-md p-6 text-center">
                <p className="text-muted-foreground">
                  Join the conversation by starting a new topic or responding to an existing one.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="events">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Events</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Discover virtual and local events focused on wellness, motivation, and health.
              </p>
              <div className="mt-4 border rounded-md p-6 text-center">
                <p className="text-muted-foreground">
                  No events scheduled yet. Check back soon or create your own event.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="groups">
          <Card>
            <CardHeader>
              <CardTitle>Wellness Groups</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Join groups focused on specific wellness topics, challenges, or goals.
              </p>
              <div className="mt-4 border rounded-md p-6 text-center">
                <p className="text-muted-foreground">
                  Explore groups or create your own to connect with like-minded individuals.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="achievements">
          <Card>
            <CardHeader>
              <CardTitle>Community Achievements</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                See the top wellness achievements in our community and get inspired.
              </p>
              <div className="mt-4 border rounded-md p-6 text-center">
                <p className="text-muted-foreground">
                  Track your own progress and share your achievements with the community.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
