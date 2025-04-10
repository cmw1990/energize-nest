
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { useToast } from "@/hooks/use-toast";
import { InsuranceClaim, InsuranceProvider } from "@/types/insurance";
import { Shield, CheckCircle, Clock, AlertCircle, Landmark, FileText, PlusCircle } from "lucide-react";

export default function InsuranceDashboard() {
  const { session } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");

  const { data: claims, isLoading: isLoadingClaims } = useQuery({
    queryKey: ["insurance-claims", session?.user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("insurance_claims")
        .select("*")
        .eq("professional_id", session?.user?.id)
        .order("submission_date", { ascending: false });

      if (error) throw error;
      return data as InsuranceClaim[];
    },
    enabled: !!session?.user?.id,
  });

  const { data: eligibilityChecks, isLoading: isLoadingChecks } = useQuery({
    queryKey: ["eligibility-checks", session?.user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("insurance_eligibility_checks")
        .select("*")
        .eq("professional_id", session?.user?.id)
        .order("verification_date", { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!session?.user?.id,
  });

  const { data: providers, isLoading: isLoadingProviders } = useQuery({
    queryKey: ["insurance-providers"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("insurance_providers")
        .select("*")
        .eq("is_active", true);

      if (error) throw error;
      return data as InsuranceProvider[];
    },
  });

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "approved":
        return <Badge variant="default" className="bg-green-500">Approved</Badge>;
      case "pending":
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200">Pending</Badge>;
      case "denied":
        return <Badge variant="destructive">Denied</Badge>;
      case "submitted":
        return <Badge variant="secondary">Submitted</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const pendingClaimsCount = claims?.filter(claim => claim.status.toLowerCase() === "pending").length || 0;
  const approvedClaimsCount = claims?.filter(claim => claim.status.toLowerCase() === "approved").length || 0;
  const deniedClaimsCount = claims?.filter(claim => claim.status.toLowerCase() === "denied").length || 0;

  const totalReimbursed = claims
    ?.filter(claim => claim.status.toLowerCase() === "approved")
    .reduce((sum, claim) => sum + claim.billed_amount, 0) || 0;

  const isLoading = isLoadingClaims || isLoadingChecks || isLoadingProviders;

  if (isLoading) {
    return <div className="p-8 text-center">Loading insurance dashboard...</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Insurance Dashboard</h1>
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            onClick={() => navigate("/insurance/verify")}
          >
            <CheckCircle className="mr-2 h-4 w-4" />
            Verify Coverage
          </Button>
          <Button 
            onClick={() => navigate("/insurance/submit-claim")}
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Submit Claim
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Claims</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{claims?.length || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending Claims</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{pendingClaimsCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Reimbursed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">${totalReimbursed.toFixed(2)}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="claims">Claims</TabsTrigger>
          <TabsTrigger value="providers">Insurance Providers</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="mr-2 h-5 w-5 text-yellow-500" />
                  Pending Claims
                </CardTitle>
                <CardDescription>Claims awaiting processing</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-2">{pendingClaimsCount}</div>
                <p className="text-sm text-muted-foreground">
                  {pendingClaimsCount > 0 
                    ? `You have ${pendingClaimsCount} claims awaiting processing.` 
                    : "No pending claims at the moment."}
                </p>
              </CardContent>
              {pendingClaimsCount > 0 && (
                <CardFooter>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => setActiveTab("claims")}
                  >
                    View Claims
                  </Button>
                </CardFooter>
              )}
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
                  Approved Claims
                </CardTitle>
                <CardDescription>Successfully processed claims</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-2">{approvedClaimsCount}</div>
                <p className="text-sm text-muted-foreground">
                  {approvedClaimsCount > 0 
                    ? `$${totalReimbursed.toFixed(2)} has been reimbursed.` 
                    : "No approved claims yet."}
                </p>
              </CardContent>
              {approvedClaimsCount > 0 && (
                <CardFooter>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => setActiveTab("claims")}
                  >
                    View Claims
                  </Button>
                </CardFooter>
              )}
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <AlertCircle className="mr-2 h-5 w-5 text-red-500" />
                  Denied Claims
                </CardTitle>
                <CardDescription>Claims that require attention</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-2">{deniedClaimsCount}</div>
                <p className="text-sm text-muted-foreground">
                  {deniedClaimsCount > 0 
                    ? `You have ${deniedClaimsCount} denied claims to review.` 
                    : "No denied claims at the moment."}
                </p>
              </CardContent>
              {deniedClaimsCount > 0 && (
                <CardFooter>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => setActiveTab("claims")}
                  >
                    Review Claims
                  </Button>
                </CardFooter>
              )}
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="claims">
          <Card>
            <CardHeader>
              <CardTitle>Insurance Claims</CardTitle>
              <CardDescription>
                Manage and track your submitted insurance claims
              </CardDescription>
            </CardHeader>
            <CardContent>
              {claims && claims.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-2 font-medium">Tracking #</th>
                        <th className="text-left py-3 px-2 font-medium">Date</th>
                        <th className="text-left py-3 px-2 font-medium">Amount</th>
                        <th className="text-left py-3 px-2 font-medium">Status</th>
                        <th className="text-right py-3 px-2 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {claims.map((claim) => (
                        <tr key={claim.id} className="border-b">
                          <td className="py-3 px-2">{claim.tracking_number || claim.claim_number}</td>
                          <td className="py-3 px-2">{new Date(claim.service_date).toLocaleDateString()}</td>
                          <td className="py-3 px-2">${claim.billed_amount.toFixed(2)}</td>
                          <td className="py-3 px-2">{getStatusBadge(claim.status)}</td>
                          <td className="py-3 px-2 text-right">
                            <Button variant="outline" size="sm">View Details</Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="font-medium text-lg mb-2">No claims found</h3>
                  <p className="text-muted-foreground mb-4">
                    You haven't submitted any insurance claims yet.
                  </p>
                  <Button 
                    onClick={() => navigate("/insurance/submit-claim")}
                  >
                    Submit Your First Claim
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="providers">
          <Card>
            <CardHeader>
              <CardTitle>Supported Insurance Providers</CardTitle>
              <CardDescription>
                Insurance companies we can process claims with
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {providers && providers.length > 0 ? (
                  providers.map((provider) => (
                    <Card key={provider.id}>
                      <CardHeader className="pb-2">
                        <CardTitle>{provider.name}</CardTitle>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <div className="space-y-2 text-sm text-muted-foreground">
                          <div className="flex items-center">
                            <span className="font-medium mr-2">Payer ID:</span>
                            <span>{provider.payer_id}</span>
                          </div>
                          <div className="flex items-center">
                            <span className="font-medium mr-2">Network:</span>
                            <span>{provider.provider_network?.join(", ")}</span>
                          </div>
                          <div className="flex items-center">
                            <span className="font-medium mr-2">Verification:</span>
                            <span>{provider.verification_method}</span>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button variant="outline" size="sm" className="w-full">
                          <Landmark className="mr-2 h-4 w-4" />
                          Verify Coverage
                        </Button>
                      </CardFooter>
                    </Card>
                  ))
                ) : (
                  <div className="col-span-full text-center py-8">
                    <Landmark className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="font-medium text-lg mb-2">No providers available</h3>
                    <p className="text-muted-foreground">
                      There are no insurance providers in the system yet.
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
