import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { ConsultationSession } from "@/types/database";
import { useToast } from "@/hooks/use-toast";
import { safeArrayCast } from "@/utils/typeSafeUtils";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { UserRound, Calendar, Clock, MessageSquare, Video, Star, CheckCircle2, AlertCircle, BookOpen, Search } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { format, parseISO, isPast, addMinutes } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const ClientConsultationDashboard = () => {
  const { session } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<"upcoming" | "past" | "all">("upcoming");
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");

  const { data: consultations, isLoading } = useQuery({
    queryKey: ["client_consultations", session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return [];

      const { data, error } = await supabase
        .from("consultation_sessions")
        .select("*, professional:professionals(*)")
        .eq("client_id", session.user.id)
        .order("scheduled_start", { ascending: false });

      if (error) throw error;

      return data?.map(item => ({
        id: item.id,
        client_id: item.client_id,
        professional_id: item.professional_id,
        session_type: item.session_type || "",
        status: item.status || "",
        scheduled_start: item.scheduled_start,
        duration_minutes: item.duration_minutes,
        session_date: item.session_date,
        meeting_link: item.meeting_link || "",
        notes: item.notes || "",
        feedback_submitted: !!item.feedback_submitted,
        created_at: item.created_at,
        professional: {
          id: item.professional?.id || item.professional_id,
          full_name: item.professional?.full_name || "Unknown Professional",
          avatar_url: item.professional?.avatar_url || "",
        },
      })) || [];
    },
    enabled: !!session?.user?.id,
  });

  const getStatusBadge = (session: ConsultationSession) => {
    if (!session.scheduled_start) return null;

    const startTime = parseISO(session.scheduled_start);
    const endTime = addMinutes(startTime, session.duration_minutes);
    const now = new Date();

    if (session.status === "completed") {
      return <Badge className="bg-green-500">Completed</Badge>;
    } else if (session.status === "cancelled") {
      return <Badge variant="destructive">Cancelled</Badge>;
    } else if (now > endTime) {
      return <Badge variant="outline">Past</Badge>;
    } else if (now >= startTime && now <= endTime) {
      return <Badge className="bg-blue-500 animate-pulse">In Progress</Badge>;
    } else {
      return <Badge variant="secondary">Upcoming</Badge>;
    }
  };

  const filteredConsultations = () => {
    if (!consultations) return [];
    
    let filtered = consultations;
    
    if (activeTab === "upcoming") {
      filtered = consultations.filter(
        (session) => 
          !isPast(parseISO(session.scheduled_start)) && 
          session.status !== "cancelled" && 
          session.status !== "completed"
      );
    } else if (activeTab === "past") {
      filtered = consultations.filter(
        (session) => 
          isPast(addMinutes(parseISO(session.scheduled_start), session.duration_minutes)) || 
          session.status === "completed" || 
          session.status === "cancelled"
      );
    }
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        session => 
          session.professional.full_name.toLowerCase().includes(query) ||
          session.session_type.toLowerCase().includes(query) ||
          session.notes.toLowerCase().includes(query)
      );
    }
    
    if (typeFilter !== "all") {
      filtered = filtered.filter(session => session.session_type === typeFilter);
    }
    
    return filtered;
  };

  const joinSession = (meetingLink: string) => {
    if (!meetingLink) {
      toast({
        title: "No meeting link available",
        description: "Please contact your professional to provide a meeting link.",
        variant: "destructive",
      });
      return;
    }
    
    window.open(meetingLink, "_blank");
  };

  const submitFeedback = (sessionId: string) => {
    toast({
      title: "Feedback form",
      description: "Opening feedback form for your session.",
    });
  };

  const sessionTypes = consultations 
    ? ["all", ...new Set(consultations.map(s => s.session_type).filter(Boolean))]
    : ["all"];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Consultations</h1>
        </div>
        
        <Tabs defaultValue="upcoming">
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="past">Past</TabsTrigger>
            <TabsTrigger value="all">All</TabsTrigger>
          </TabsList>
          
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex items-center space-x-4">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-40" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </Tabs>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Consultations</h1>
        <Link to="/find-professional">
          <Button className="flex items-center gap-2">
            <UserRound size={16} />
            Book New Consultation
          </Button>
        </Link>
      </div>
      
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "upcoming" | "past" | "all")}>
        <TabsList className="grid w-full grid-cols-3 mb-4">
          <TabsTrigger value="upcoming" className="flex items-center gap-2">
            <Calendar size={16} />
            Upcoming
          </TabsTrigger>
          <TabsTrigger value="past" className="flex items-center gap-2">
            <Clock size={16} />
            Past
          </TabsTrigger>
          <TabsTrigger value="all">All</TabsTrigger>
        </TabsList>
        
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
            <Input
              placeholder="Search consultations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="Session Type" />
            </SelectTrigger>
            <SelectContent>
              {sessionTypes.map(type => (
                <SelectItem key={type} value={type}>
                  {type === "all" ? "All Types" : type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <TabsContent value={activeTab} className="mt-0">
          {filteredConsultations().length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <BookOpen size={48} className="text-muted-foreground mb-4" />
                <h3 className="text-xl font-medium mb-2">No consultations found</h3>
                <p className="text-muted-foreground text-center mb-6">
                  {searchQuery || typeFilter !== "all" 
                    ? "No consultations match your search criteria."
                    : activeTab === "upcoming" 
                      ? "You don't have any upcoming consultations scheduled."
                      : "You don't have any past consultations."}
                </p>
                {searchQuery || typeFilter !== "all" ? (
                  <Button variant="outline" onClick={() => {
                    setSearchQuery("");
                    setTypeFilter("all");
                  }}>
                    Clear Filters
                  </Button>
                ) : (
                  <Link to="/find-professional">
                    <Button>Book a Consultation</Button>
                  </Link>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredConsultations().map((session) => {
                const startTime = parseISO(session.scheduled_start);
                const isActive = !isPast(startTime) && 
                  isPast(addMinutes(startTime, -15)) && 
                  !isPast(addMinutes(startTime, session.duration_minutes)) &&
                  session.status !== "cancelled";
                  
                return (
                  <Card key={session.id} className={`overflow-hidden transition-all duration-300 ${isActive ? 'border-primary shadow-lg' : ''}`}>
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <Avatar className="h-12 w-12 border-2 border-primary/10">
                            <AvatarImage src={session.professional.avatar_url} />
                            <AvatarFallback className="bg-primary/10 text-primary">
                              {session.professional.full_name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-semibold text-lg">{session.professional.full_name}</h3>
                            <p className="text-sm text-muted-foreground flex items-center gap-1">
                              <span className="inline-block h-2 w-2 rounded-full bg-primary/60"></span>
                              {session.session_type}
                            </p>
                          </div>
                        </div>
                        {getStatusBadge(session)}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4 py-2">
                        <div className="flex items-center gap-2">
                          <Calendar size={16} className="text-muted-foreground" />
                          <span>{format(parseISO(session.scheduled_start), 'MMMM d, yyyy')}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock size={16} className="text-muted-foreground" />
                          <span>{format(parseISO(session.scheduled_start), 'h:mm a')} ({session.duration_minutes} min)</span>
                        </div>
                      </div>
                      
                      {session.notes && (
                        <div className="mt-2 border-l-2 border-primary/20 pl-3">
                          <p className="text-sm text-muted-foreground">{session.notes}</p>
                        </div>
                      )}
                    </CardContent>
                    <CardFooter className="flex flex-wrap md:flex-nowrap justify-between gap-2 border-t bg-muted/20 px-6 py-3">
                      {isActive ? (
                        <Button 
                          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 w-full md:w-auto"
                          onClick={() => joinSession(session.meeting_link)}
                        >
                          <Video size={16} />
                          Join Consultation
                        </Button>
                      ) : isPast(addMinutes(startTime, session.duration_minutes)) && !session.feedback_submitted ? (
                        <Button 
                          variant="outline" 
                          className="flex items-center gap-2 w-full md:w-auto"
                          onClick={() => submitFeedback(session.id)}
                        >
                          <Star size={16} />
                          Leave Feedback
                        </Button>
                      ) : (
                        <div className="hidden md:block" />
                      )}
                      
                      <div className="flex gap-2 w-full md:w-auto justify-end">
                        {session.status !== "cancelled" && !isPast(startTime) && (
                          <Button variant="ghost" className="text-destructive hover:text-destructive">
                            <AlertCircle size={16} className="mr-1" />
                            Cancel
                          </Button>
                        )}
                        <Link to={`/messages/${session.professional.id}`}>
                          <Button variant="outline" className="flex items-center gap-2">
                            <MessageSquare size={16} />
                            Message
                          </Button>
                        </Link>
                      </div>
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};
