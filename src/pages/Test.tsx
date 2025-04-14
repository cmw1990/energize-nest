
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/ui/data-table";

const Test = () => {
  const { toast } = useToast();
  const [testResults, setTestResults] = useState<{[key: string]: boolean}>({});
  const [testData, setTestData] = useState<any[]>([]);

  const runAllTests = async () => {
    await testSupabaseConnection();
    await testCrudOperations();
  };

  const testSupabaseConnection = async () => {
    try {
      // Test Supabase connection
      const { data, error } = await supabase.from('user_settings').select('count').limit(1);
      
      if (error) throw error;
      
      setTestResults(prev => ({ ...prev, connection: true }));
      
      toast({
        title: "Connection Test Successful",
        description: "Successfully connected to Supabase database!",
        variant: "default",
      });
    } catch (error) {
      setTestResults(prev => ({ ...prev, connection: false }));
      
      toast({
        title: "Connection Test Failed",
        description: error instanceof Error ? error.message : "Failed to connect to database",
        variant: "destructive",
      });
    }
  };

  const testCrudOperations = async () => {
    try {
      // Create a test record
      const testId = `test-${Date.now()}`;
      const createResult = await supabase
        .from('user_settings')
        .upsert({ 
          id: testId,
          user_id: 'test-user', 
          settings: { test: true },
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });

      if (createResult.error) throw new Error(`Create failed: ${createResult.error.message}`);
      setTestResults(prev => ({ ...prev, create: true }));

      // Read the test record
      const readResult = await supabase
        .from('user_settings')
        .select('*')
        .eq('id', testId)
        .single();

      if (readResult.error) throw new Error(`Read failed: ${readResult.error.message}`);
      setTestResults(prev => ({ ...prev, read: true }));

      // Update the test record
      const updateResult = await supabase
        .from('user_settings')
        .update({ 
          settings: { test: true, updated: true },
          updated_at: new Date().toISOString()
        })
        .eq('id', testId);

      if (updateResult.error) throw new Error(`Update failed: ${updateResult.error.message}`);
      setTestResults(prev => ({ ...prev, update: true }));

      // Fetch all to display
      const { data: allData } = await supabase
        .from('user_settings')
        .select('*')
        .limit(10);
        
      if (allData) {
        setTestData(allData);
      }

      // Delete the test record
      const deleteResult = await supabase
        .from('user_settings')
        .delete()
        .eq('id', testId);

      if (deleteResult.error) throw new Error(`Delete failed: ${deleteResult.error.message}`);
      setTestResults(prev => ({ ...prev, delete: true }));

      toast({
        title: "CRUD Test Successful",
        description: "All CRUD operations completed successfully!",
        variant: "default",
      });
    } catch (error) {
      console.error("CRUD test error:", error);
      
      toast({
        title: "CRUD Test Failed",
        description: error instanceof Error ? error.message : "CRUD operations failed",
        variant: "destructive",
      });
    }
  };

  const columns = [
    {
      accessorKey: "id",
      header: "ID",
    },
    {
      accessorKey: "user_id",
      header: "User ID",
    },
    {
      accessorKey: "created_at",
      header: "Created At",
      cell: ({ row }: { row: any }) => new Date(row.getValue("created_at")).toLocaleString(),
    },
    {
      accessorKey: "updated_at",
      header: "Updated At",
      cell: ({ row }: { row: any }) => new Date(row.getValue("updated_at")).toLocaleString(),
    },
  ];

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">System Test Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Database Connection</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center mb-4">
              <span>Supabase Connection:</span>
              {testResults.connection !== undefined && (
                <Badge variant={testResults.connection ? "default" : "destructive"}>
                  {testResults.connection ? "Connected" : "Failed"}
                </Badge>
              )}
            </div>
            <Button onClick={testSupabaseConnection} className="w-full">
              Test Connection
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>CRUD Operations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 mb-4">
              <div className="flex justify-between items-center">
                <span>Create:</span>
                {testResults.create !== undefined && (
                  <Badge variant={testResults.create ? "default" : "destructive"}>
                    {testResults.create ? "Success" : "Failed"}
                  </Badge>
                )}
              </div>
              <div className="flex justify-between items-center">
                <span>Read:</span>
                {testResults.read !== undefined && (
                  <Badge variant={testResults.read ? "default" : "destructive"}>
                    {testResults.read ? "Success" : "Failed"}
                  </Badge>
                )}
              </div>
              <div className="flex justify-between items-center">
                <span>Update:</span>
                {testResults.update !== undefined && (
                  <Badge variant={testResults.update ? "default" : "destructive"}>
                    {testResults.update ? "Success" : "Failed"}
                  </Badge>
                )}
              </div>
              <div className="flex justify-between items-center">
                <span>Delete:</span>
                {testResults.delete !== undefined && (
                  <Badge variant={testResults.delete ? "default" : "destructive"}>
                    {testResults.delete ? "Success" : "Failed"}
                  </Badge>
                )}
              </div>
            </div>
            <Button onClick={testCrudOperations} className="w-full">
              Test CRUD Operations
            </Button>
          </CardContent>
        </Card>
      </div>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Run All Tests</CardTitle>
        </CardHeader>
        <CardContent>
          <Button onClick={runAllTests} className="w-full" size="lg">
            Run All Tests
          </Button>
        </CardContent>
      </Card>
      
      {testData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Settings Data</CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable columns={columns} data={testData} />
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Test;
