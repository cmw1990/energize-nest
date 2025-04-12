
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Search, Star, StarHalf } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

type TeaLog = {
  id: string;
  user_id: string;
  tea_name: string;
  tea_type: string;
  brewing_method: string;
  steep_time: number;
  steep_temperature: number;
  amount?: string;
  notes?: string;
  rating: number;
  created_at: string;
  country_of_origin?: string;
  vendor?: string;
};

export function TeaHistoryTab() {
  const { session } = useAuth();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");

  const { data: teaHistory, isLoading, error, refetch } = useQuery({
    queryKey: ["tea-history", session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return [];
      
      const { data, error } = await supabase
        .from("tea_logs")
        .select("*")
        .eq("user_id", session.user.id)
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data as TeaLog[];
    },
    enabled: !!session?.user?.id,
  });

  const deleteTea = async (id: string) => {
    try {
      const { error } = await supabase
        .from("tea_logs")
        .delete()
        .eq("id", id);
      
      if (error) throw error;
      
      toast({
        title: "Tea log deleted",
        description: "The tea log has been successfully deleted.",
      });
      
      refetch();
    } catch (error) {
      console.error("Error deleting tea log:", error);
      toast({
        title: "Error",
        description: "Failed to delete the tea log.",
        variant: "destructive",
      });
    }
  };

  const getTeaTypeColor = (type: string) => {
    switch (type) {
      case 'black': return 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300';
      case 'green': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'white': return 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300';
      case 'oolong': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
      case 'yellow': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'puerh': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'herbal': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      case 'rooibos': return 'bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-300';
      case 'mate': return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300';
      case 'chai': return 'bg-brown-100 text-brown-800 dark:bg-brown-900 dark:text-brown-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric'
    });
  };

  const filteredTea = teaHistory?.filter(tea => 
    tea.tea_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tea.tea_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (tea.vendor && tea.vendor.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (tea.country_of_origin && tea.country_of_origin.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const renderRatingStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    return (
      <div className="flex items-center">
        {[...Array(fullStars)].map((_, i) => (
          <Star key={`full-${i}`} className="h-4 w-4 fill-primary text-primary" />
        ))}
        {hasHalfStar && <StarHalf className="h-4 w-4 fill-primary text-primary" />}
        <span className="ml-1 text-xs text-muted-foreground">({rating})</span>
      </div>
    );
  };

  if (isLoading) {
    return <div className="text-center p-8">Loading tea history...</div>;
  }

  if (error) {
    return <div className="text-center p-8 text-destructive">Error loading tea history: {(error as Error).message}</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tea History</CardTitle>
        <div className="flex items-center space-x-2 mt-2">
          <Search className="h-5 w-5 text-muted-foreground" />
          <Input 
            placeholder="Search tea logs..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-md"
          />
        </div>
      </CardHeader>
      <CardContent>
        {filteredTea && filteredTea.length > 0 ? (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tea</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Brewing</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTea.map((tea) => (
                  <TableRow key={tea.id}>
                    <TableCell className="font-medium">
                      <div>
                        {tea.tea_name}
                        {tea.vendor && (
                          <div className="text-xs text-muted-foreground mt-1">
                            {tea.vendor}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={getTeaTypeColor(tea.tea_type)}>
                        {tea.tea_type}
                      </Badge>
                      {tea.country_of_origin && (
                        <div className="text-xs text-muted-foreground mt-1">
                          {tea.country_of_origin}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <div>
                        {tea.brewing_method.replace('_', ' ')}
                        <div className="text-xs text-muted-foreground mt-1">
                          {tea.steep_time} min at {tea.steep_temperature}°C
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {renderRatingStars(tea.rating)}
                    </TableCell>
                    <TableCell>
                      {formatDate(tea.created_at)}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => deleteTea(tea.id)}>
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center p-8 border rounded-lg bg-muted/20">
            <p className="text-muted-foreground mb-2">No tea logs found.</p>
            <p className="text-sm text-muted-foreground">
              Start logging your tea sessions to build up your history.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
