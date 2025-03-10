import React, { useState, useEffect } from 'react';
import { Session } from '@supabase/supabase-js';
import { SupabaseClient } from '@supabase/supabase-js';
import { 
  Users, 
  Plus, 
  Search, 
  Filter
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface GroupsProps {
  session: Session | null;
  supabaseClient?: SupabaseClient;
}

interface CareGroup {
  id: string;
  name: string;
  description: string | null;
  is_public: boolean;
  created_at: string;
  created_by: string;
  updated_at: string;
  image_url: string | null;
  role?: string;
  member_count?: number;
  recent_activity?: string;
}

const Groups: React.FC<GroupsProps> = ({ session, supabaseClient }) => {
  // State variables
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  
  // State for groups
  const [myGroups, setMyGroups] = useState<CareGroup[]>([]);
  const [publicGroups, setPublicGroups] = useState<CareGroup[]>([]);
  
  // UI state
  const [activeTab, setActiveTab] = useState("my-groups");
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Load mock data
  useEffect(() => {
    const fetchGroups = async () => {
      setIsLoading(true);
      
      try {
        // Mock data for development
        const mockMyGroups: CareGroup[] = [
          {
            id: '1',
            name: 'Family Care Group',
            description: 'Coordinate care for our family members',
            is_public: false,
            created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
            created_by: '123',
            updated_at: new Date().toISOString(),
            image_url: null,
            role: 'admin',
            member_count: 5,
            recent_activity: 'New task added'
          },
          {
            id: '2',
            name: 'Healthcare Providers',
            description: 'Group for healthcare professionals',
            is_public: true,
            created_at: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
            created_by: '456',
            updated_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
            image_url: null,
            role: 'member',
            member_count: 12,
            recent_activity: 'New member joined'
          }
        ];
        
        const mockPublicGroups: CareGroup[] = [
          {
            id: '3',
            name: 'Community Support Network',
            description: 'Community-based caregiving support',
            is_public: true,
            created_at: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
            created_by: '789',
            updated_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            image_url: null,
            member_count: 28,
            recent_activity: 'New event scheduled'
          },
          {
            id: '4',
            name: 'Elder Care Specialists',
            description: 'Dedicated to elder care best practices',
            is_public: true,
            created_at: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000).toISOString(),
            created_by: '101',
            updated_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
            image_url: null,
            member_count: 15,
            recent_activity: 'New resource shared'
          }
        ];
        
        setMyGroups(mockMyGroups);
        setPublicGroups(mockPublicGroups);
      } catch (error) {
        console.error('Error fetching groups:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchGroups();
  }, [session, supabaseClient]);

  // Filter groups based on search query
  const filteredMyGroups = myGroups.filter(group => 
    group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (group.description && group.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );
  
  const filteredPublicGroups = publicGroups.filter(group => 
    group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (group.description && group.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading groups...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Care Groups</h1>
        <Button onClick={() => setShowCreateModal(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create Group
        </Button>
      </div>
      
      {/* Search and filter */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search groups..."
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center">
          <Filter className="text-gray-400 mr-2" size={18} />
          <select
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="all">All Groups</option>
            <option value="admin">Groups I Manage</option>
            <option value="member">Groups I'm In</option>
          </select>
        </div>
      </div>
      
      {/* Tabs */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              onClick={() => setActiveTab("my-groups")}
              className={`py-4 px-6 text-sm font-medium ${
                activeTab === "my-groups"
                  ? "border-b-2 border-blue-500 text-blue-600"
                  : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              My Groups
            </button>
            <button
              onClick={() => setActiveTab("discover")}
              className={`py-4 px-6 text-sm font-medium ${
                activeTab === "discover"
                  ? "border-b-2 border-blue-500 text-blue-600"
                  : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Discover Groups
            </button>
          </nav>
        </div>
      </div>
      
      {/* My Groups Tab */}
      {activeTab === "my-groups" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMyGroups.length > 0 ? (
            filteredMyGroups.map(group => (
              <Card key={group.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <CardTitle className="text-xl">{group.name}</CardTitle>
                  <div className="flex items-center text-sm text-gray-500">
                    <Users className="h-4 w-4 mr-1" />
                    <span>{group.member_count} members</span>
                    <span className="ml-auto text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                      {group.role}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm mb-3">{group.description}</p>
                  <div className="text-xs text-gray-500 mt-4">
                    <div>Recent: {group.recent_activity}</div>
                    <div>Created: {new Date(group.created_at).toLocaleDateString()}</div>
                  </div>
                  <Button 
                    className="w-full mt-4" 
                    variant="outline"
                  >
                    View Group
                  </Button>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-full text-center py-12 bg-gray-50 rounded-lg">
              <Users className="h-12 w-12 mx-auto text-gray-400 mb-3" />
              <h3 className="text-lg font-semibold text-gray-900">No Groups Found</h3>
              <p className="text-gray-500 mt-1">You haven't joined any care groups yet</p>
              <Button 
                className="mt-4" 
                onClick={() => setActiveTab("discover")}
              >
                Discover Groups
              </Button>
            </div>
          )}
        </div>
      )}
      
      {/* Discover Tab */}
      {activeTab === "discover" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPublicGroups.length > 0 ? (
            filteredPublicGroups.map(group => (
              <Card key={group.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <CardTitle className="text-xl">{group.name}</CardTitle>
                  <div className="flex items-center text-sm text-gray-500">
                    <Users className="h-4 w-4 mr-1" />
                    <span>{group.member_count} members</span>
                    <span className="ml-auto text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full">
                      Public
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm mb-3">{group.description}</p>
                  <div className="text-xs text-gray-500 mt-4">
                    <div>Recent: {group.recent_activity}</div>
                    <div>Created: {new Date(group.created_at).toLocaleDateString()}</div>
                  </div>
                  <Button 
                    className="w-full mt-4"
                  >
                    Join Group
                  </Button>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-full text-center py-12 bg-gray-50 rounded-lg">
              <Search className="h-12 w-12 mx-auto text-gray-400 mb-3" />
              <h3 className="text-lg font-semibold text-gray-900">No Public Groups Found</h3>
              <p className="text-gray-500 mt-1">Try adjusting your search criteria</p>
            </div>
          )}
        </div>
      )}
      
      {/* Create Group Modal would go here */}
    </div>
  );
};

export default Groups; 
