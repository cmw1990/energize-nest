import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ClipboardList, ShieldCheck, Bell } from "lucide-react";
import { InsuranceClaim, InsuranceProvider } from "@/types/insurance";
import { Link } from "react-router-dom";

export const InsuranceDashboard = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("claims");
  const [showNewVerificationModal, setShowNewVerificationModal] = useState(false);

  const { data: claims } = useQuery({
    queryKey: ['insurance-claims'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('insurance_claims')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        toast({
          title: "Error fetching claims",
          description: error.message,
          variant: "destructive",
        });
        return [];
      }
      return data as InsuranceClaim[];
    }
  });

  const { data: notifications } = useQuery({
    queryKey: ['insurance-notifications'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('insurance_notifications')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) {
        console.error('Error fetching notifications:', error);
        return [];
      }
      return data;
    }
  });

  const { data: providers } = useQuery({
    queryKey: ['insurance-providers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('insurance_providers')
        .select('*')
        .eq('is_active', true);

      if (error) {
        console.error('Error fetching providers:', error);
        return [];
      }
      return data as InsuranceProvider[];
    }
  });

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold">Insurance Dashboard</h1>
          <p className="text-muted-foreground">
            Manage your insurance claims and verifications
          </p>
        </div>
        <Button 
          variant="outline"
          onClick={() => setShowNewVerificationModal(true)}
          className="flex items-center gap-2"
        >
          <Shield className="h-4 w-4" />
          New Verification
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Claims</CardTitle>
            <ClipboardList className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {claims?.filter(claim => claim.status !== 'paid').length || 0}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Verified Providers</CardTitle>
            <ShieldCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{providers?.length || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Notifications</CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {notifications?.filter(n => !n.is_read).length || 0}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="claims">Claims</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="providers">Providers</TabsTrigger>
        </TabsList>

        <TabsContent value="claims" className="space-y-4">
          {claims?.map((claim) => (
            <Card key={claim.id}>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Claim #{claim.claim_number || claim.id.slice(0, 8)}</CardTitle>
                  <Badge variant={
                    claim.status === 'paid' ? 'default' :
                    claim.status === 'pending' ? 'secondary' :
                    claim.status === 'submitted' ? 'primary' :
                    'destructive'
                  }>
                    {claim.status}
                  </Badge>
                </div>
                <CardDescription>Submitted on {new Date(claim.created_at).toLocaleDateString()}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p><strong>Service Date:</strong> {new Date(claim.service_date).toLocaleDateString()}</p>
                  <p><strong>Billed Amount:</strong> ${claim.billed_amount}</p>
                  {claim.tracking_number && (
                    <p><strong>Tracking Number:</strong> {claim.tracking_number}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          {notifications?.map((notification) => (
            <Card key={notification.id}>
              <CardHeader>
                <CardTitle>{notification.title}</CardTitle>
                <CardDescription>{new Date(notification.created_at).toLocaleString()}</CardDescription>
              </CardHeader>
              <CardContent>
                <p>{notification.message}</p>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="providers" className="space-y-4">
          {providers?.map((provider) => (
            <Card key={provider.id} className="overflow-hidden">
              <CardHeader className="bg-primary/5 pb-2">
                <CardTitle className="text-lg">{provider.name}</CardTitle>
              </CardHeader>
              <CardContent className="pt-4 space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{provider.payer_id}</Badge>
                  {provider.is_active && <Badge variant="secondary">Active</Badge>}
                </div>
                <div className="text-xs text-muted-foreground">
                  Network: {provider.provider_network?.join(', ') || 'N/A'}
                </div>
                <div className="text-xs text-muted-foreground">
                  Verification: {provider.verification_method || 'Standard'}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
};
