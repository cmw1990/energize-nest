import React, { useState } from 'react';
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LandingHeader } from "@/components/layout/LandingHeader"; // Changed import
import { ToolAnalyticsWrapper } from "@/components/tools/ToolAnalyticsWrapper";
import { Stethoscope, UserCheck, Search, Filter, SortAsc } from "lucide-react";
import { useNavigate } from "react-router-dom";

type SortOption = "rating" | "experience" | "price" | "reviews";

// Re-using the expert types list from the original component
const expertTypes = [
    { value: "mental_health", label: "Mental Health Therapist" },
    { value: "nutrition", label: "Nutritionist" },
    { value: "supplements", label: "Supplement Expert" },
    { value: "fatigue", label: "Fatigue Specialist" },
    { value: "adhd", label: "ADHD Expert" },
    { value: "memory", label: "Memory Specialist" },
    { value: "brain_exercise", label: "Brain Exercise Expert" },
    { value: "dementia", label: "Dementia Specialist" },
    { value: "sleep", label: "Sleep Expert" },
    { value: "anxiety", label: "Anxiety Specialist" },
    { value: "depression", label: "Depression Specialist" },
    { value: "stress", label: "Stress Management Expert" },
    { value: "cognitive_health", label: "Cognitive Health Expert" },
    { value: "mindfulness", label: "Mindfulness Coach" },
    { value: "holistic_health", label: "Holistic Health Expert" },
    { value: "behavioral_therapy", label: "Behavioral Therapist" },
    { value: "energy_management", label: "Energy Management Specialist" },
    { value: "focus_training", label: "Focus Training Expert" },
    { value: "cognitive_rehabilitation", label: "Cognitive Rehabilitation Specialist" },
    { value: "neuroplasticity", label: "Neuroplasticity Expert" }
];

// Define the structure for professional data (adjust based on actual table schema)
interface Professional {
    id: string;
    full_name: string;
    title: string;
    avatar_url?: string;
    specialties: string[];
    bio?: string;
    years_experience: number;
    rating: number;
    reviews_count: number;
    consultation_fee: number;
    is_available: boolean;
}

export default function FindProfessional() {
  const [specialty, setSpecialty] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("rating");
  const navigate = useNavigate();

  const { data: professionals, isLoading } = useQuery<Professional[]>({
    queryKey: ['visitor-professionals', specialty, searchQuery, sortBy],
    queryFn: async () => {
      // Assuming the table name is 'mental_health_professionals'
      // Adjust table name and columns if different (e.g., 'care8_providers')
      let query = supabase
        .from('mental_health_professionals') // Adjust table name if needed
        .select('id, full_name, title, avatar_url, specialties, bio, years_experience, rating, reviews_count, consultation_fee, is_available')
        .eq('is_available', true);

      if (specialty) {
        query = query.contains('specialties', [specialty]);
      }

      if (searchQuery) {
        query = query.or(`full_name.ilike.%${searchQuery}%,bio.ilike.%${searchQuery}%,title.ilike.%${searchQuery}%`);
      }

      switch (sortBy) {
        case "rating":
          query = query.order('rating', { ascending: false, nullsFirst: false });
          break;
        case "experience":
          query = query.order('years_experience', { ascending: false, nullsFirst: false });
          break;
        case "price":
          query = query.order('consultation_fee', { ascending: true, nullsFirst: false });
          break;
        case "reviews":
          query = query.order('reviews_count', { ascending: false, nullsFirst: false });
          break;
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching professionals:", error);
        throw new Error("Failed to fetch professionals");
      }
      return data || [];
    }
  });

  const handleBookClick = () => {
    // Redirect visitor to login/signup page, potentially passing redirect info
    navigate('/auth?redirect=/app/mental-health'); // Redirect to the authenticated booking area after login
  };

  return (
    <ToolAnalyticsWrapper toolName="find-professional" toolType="directory">
        <div className="min-h-screen bg-background">
            <LandingHeader /> {/* Changed from TopNav */}
            <div className="container mx-auto p-4 space-y-6">
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <UserCheck className="h-6 w-6 text-primary" />
                            <CardTitle>Find a Wellness Professional</CardTitle>
                        </div>
                        <CardDescription>
                            Browse our directory of therapists, dietitians, and wellness experts.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search by name, title, or bio..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                            <div className="flex gap-4 md:w-auto">
                                <Select value={specialty} onValueChange={setSpecialty}>
                                    <SelectTrigger className="flex-1 md:w-48">
                                        <Filter className="h-4 w-4 mr-2" />
                                        <SelectValue placeholder="Specialty" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="">All Specialties</SelectItem>
                                        {expertTypes.map((type) => (
                                        <SelectItem key={type.value} value={type.value}>
                                            {type.label}
                                        </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortOption)}>
                                    <SelectTrigger className="flex-1 md:w-48">
                                        <SortAsc className="h-4 w-4 mr-2" />
                                        <SelectValue placeholder="Sort by" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="rating">Highest Rated</SelectItem>
                                        <SelectItem value="experience">Most Experienced</SelectItem>
                                        <SelectItem value="price">Lowest Price</SelectItem>
                                        <SelectItem value="reviews">Most Reviews</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {isLoading ? (
                                [...Array(6)].map((_, i) => (
                                    <Card key={i} className="animate-pulse">
                                        <CardHeader><div className="h-6 bg-muted rounded w-3/4"></div></CardHeader>
                                        <CardContent className="space-y-4">
                                            <div className="h-4 bg-muted rounded w-full"></div>
                                            <div className="h-4 bg-muted rounded w-5/6"></div>
                                            <div className="h-10 bg-muted rounded w-full mt-4"></div>
                                        </CardContent>
                                    </Card>
                                ))
                            ) : professionals && professionals.length > 0 ? (
                                professionals.map((professional) => (
                                <Card key={professional.id} className="hover:shadow-lg transition-shadow flex flex-col">
                                    <CardHeader>
                                    <div className="flex items-center gap-4">
                                        <img
                                            src={professional.avatar_url || '/placeholder.svg'} // Use placeholder if no avatar
                                            alt={professional.full_name}
                                            className="w-16 h-16 rounded-full object-cover border"
                                        />
                                        <div>
                                        <CardTitle>{professional.full_name}</CardTitle>
                                        <p className="text-sm text-muted-foreground">{professional.title}</p>
                                        </div>
                                    </div>
                                    </CardHeader>
                                    <CardContent className="space-y-3 flex-grow">
                                        <div>
                                            <p className="text-xs font-medium mb-1 text-muted-foreground">Specialties:</p>
                                            <div className="flex flex-wrap gap-1">
                                            {professional.specialties?.slice(0, 3).map((spec, index) => (
                                                <span
                                                key={index}
                                                className="px-2 py-0.5 text-xs rounded-full bg-primary/10 text-primary font-medium"
                                                >
                                                {expertTypes.find(t => t.value === spec)?.label || spec}
                                                </span>
                                            ))}
                                            {professional.specialties?.length > 3 && <span className="text-xs text-muted-foreground">...</span>}
                                            </div>
                                        </div>
                                        {professional.bio && (
                                            <div>
                                                <p className="text-xs font-medium mb-1 text-muted-foreground">About:</p>
                                                <p className="text-sm text-muted-foreground line-clamp-2">
                                                    {professional.bio}
                                                </p>
                                            </div>
                                        )}
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">Experience: {professional.years_experience} yrs</span>
                                            <span className="text-muted-foreground">⭐ {professional.rating?.toFixed(1)} ({professional.reviews_count})</span>
                                        </div>
                                        <div className="text-lg font-semibold text-right">
                                            ${professional.consultation_fee}/session
                                        </div>
                                    </CardContent>
                                    <div className="p-4 pt-0">
                                        <Button className="w-full" onClick={handleBookClick}>
                                            Book Consultation (Login Required)
                                        </Button>
                                    </div>
                                </Card>
                                ))
                            ) : (
                                <p className="col-span-full text-center text-muted-foreground py-10">
                                    No professionals found matching your criteria.
                                </p>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    </ToolAnalyticsWrapper>
  );
}