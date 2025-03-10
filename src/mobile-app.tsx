import React, { useState, useEffect } from 'react';
import { useNavigate, Routes, Route } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Grid } from "@/components/ui/grid";
import { 
  Home, 
  BarChart2, 
  Calendar, 
  User,
  Plus
} from 'lucide-react';

const AnimatedContainer = styled.div`
  animation: ${fadeInUp} 0.5s ease-out;
  animation-fill-mode: both;
  
  &:nth-of-type(1) { animation-delay: 0.1s; }
  &:nth-of-type(2) { animation-delay: 0.2s; }
  &:nth-of-type(3) { animation-delay: 0.3s; }
  &:nth-of-type(4) { animation-delay: 0.4s; }
`;

const PulseButton = styled(Button)`
  animation: ${pulseGlow} 2s infinite;
`;

const HomePage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [energyLevel, setEnergyLevel] = useState(85);
  const [focusStreak, setFocusStreak] = useState(5);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const doRefresh = (event: CustomEvent) => {
    setTimeout(() => {
      setEnergyLevel(prev => Math.min(100, prev + 5));
      event.detail.complete();
    }, 1500);
  };

  if (loading) {
    return (
      <ScrollArea>
        <div className="p-4 space-y-4">
          <div className="h-6 w-60 bg-gray-200 rounded" />
          <div className="h-12 w-96 bg-gray-200 rounded" />
          <div className="h-16 w-full bg-gray-200 rounded" />
        </div>
      </ScrollArea>
    );
  }

  return (
    <ScrollArea>
      <div className="p-4">
        <AnimatedContainer>
          <div className="flex items-center mb-4">
            <Avatar className="w-12 h-12">
              <img src="https://i.pravatar.cc/300" alt="profile" className="rounded-full" />
            </Avatar>
            <div className="ml-3">
              <h2 className="text-lg font-semibold">Hi, Sarah!</h2>
              <p className="text-sm text-gray-500">Let's boost your energy today 🚀</p>
            </div>
          </div>
        </AnimatedContainer>

        <AnimatedContainer>
          <div className="mb-4">
            <Card className="m-0">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold">Today's Energy</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between mb-1 text-sm">
                      <span>Mental Energy</span>
                      <span>{energyLevel}%</span>
                    </div>
                    <div className="h-2 bg-blue-500 rounded" style={{ width: `${energyLevel}%` }} />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1 text-sm">
                      <span>Physical Energy</span>
                      <span>78%</span>
                    </div>
                    <div className="h-2 bg-green-500 rounded" style={{ width: `78%` }} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </AnimatedContainer>

        <AnimatedContainer>
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-base font-semibold">Quick Actions</h3>
              <Badge className="h-6" color="primary">
                <Plus className="text-sm" />
                <span className="text-xs px-1">Streak: {focusStreak}</span>
              </Badge>
            </div>
            <Grid className="grid-cols-2 gap-3">
              <Card className="m-0">
                <CardContent className="text-center p-3">
                  <Plus className="text-2xl text-yellow-500 mb-1" />
                  <h4 className="text-sm font-medium">Focus Session</h4>
                  <p className="text-xs text-gray-500">25 min</p>
                </CardContent>
              </Card>
              <Card className="m-0">
                <CardContent className="text-center p-3">
                  <Plus className="text-2xl text-green-500 mb-1" />
                  <h4 className="text-sm font-medium">Energy Boost</h4>
                  <p className="text-xs text-gray-500">Quick exercise</p>
                </CardContent>
              </Card>
            </Grid>
          </div>
        </AnimatedContainer>

        <AnimatedContainer>
          <div>
            <h3 className="text-base font-semibold mb-2">Recent Activity</h3>
            <div className="rounded-xl overflow-hidden">
              <div className="p-4 border-b border-gray-200">
                <div className="flex justify-between mb-2">
                  <div className="flex items-center">
                    <Plus className="text-xl text-blue-500 mr-2" />
                    <div>
                      <h3 className="text-sm font-medium">Deep Focus Session</h3>
                      <p className="text-xs text-gray-500">Completed 25 min session</p>
                    </div>
                  </div>
                  <Badge color="success" className="text-xs">+10</Badge>
                </div>
              </div>
              <div className="p-4">
                <div className="flex justify-between mb-2">
                  <div className="flex items-center">
                    <Plus className="text-blue-500 mr-2" />
                    <div>
                      <h3>Energy Boost</h3>
                      <p className="text-sm text-gray-500">Quick meditation</p>
                    </div>
                  </div>
                  <Badge color="success">+5</Badge>
                </div>
              </div>
            </div>
          </div>
        </AnimatedContainer>

        <Button className="fixed bottom-4 right-4">
          <Plus />
        </Button>
      </div>
    </ScrollArea>
  );
};

const StatsPage: React.FC = () => {
  const [segment, setSegment] = useState('daily');
  
  return (
    <ScrollArea>
      <div className="p-4">
        <AnimatedContainer>
          <Tabs value={segment} onValueChange={setSegment}>
            <TabsList>
              <TabsTrigger value="daily">Daily</TabsTrigger>
              <TabsTrigger value="weekly">Weekly</TabsTrigger>
              <TabsTrigger value="monthly">Monthly</TabsTrigger>
            </TabsList>
          </Tabs>
        </AnimatedContainer>

        <AnimatedContainer>
          <Grid>
            <div className="col-span-6">
              <Card>
                <CardContent className="text-center">
                  <Plus className="text-4xl text-orange-500" />
                  <h2 className="text-2xl font-bold mt-2">1,250</h2>
                  <p className="text-sm text-gray-500">Energy Points</p>
                </CardContent>
              </Card>
            </div>
            <div className="col-span-6">
              <Card>
                <CardContent className="text-center">
                  <Plus className="text-4xl text-blue-500" />
                  <h2 className="text-2xl font-bold mt-2">3.5h</h2>
                  <p className="text-sm text-gray-500">Focus Time</p>
                </CardContent>
              </Card>
            </div>
          </Grid>
        </AnimatedContainer>

        <AnimatedContainer>
          <div className="mt-4">
            <h3 className="text-lg font-semibold px-4 mb-3">Activity Breakdown</h3>
            <div className="rounded-xl overflow-hidden">
              <div className="p-4 border-b border-gray-200">
                <div className="flex justify-between mb-2">
                  <div className="flex items-center">
                    <Plus className="text-xl text-primary mr-2" />
                    <div>
                      <h3>Exercise</h3>
                      <p>45 minutes</p>
                    </div>
                  </div>
                  <Badge color="primary" className="text-xs">30%</Badge>
                </div>
              </div>
              <div className="p-4 border-b border-gray-200">
                <div className="flex justify-between mb-2">
                  <div className="flex items-center">
                    <Plus className="text-purple mr-2" />
                    <div>
                      <h3>Sleep</h3>
                      <p>7.5 hours</p>
                    </div>
                  </div>
                  <Badge color="purple" className="text-xs">90%</Badge>
                </div>
              </div>
              <div className="p-4">
                <div className="flex justify-between mb-2">
                  <div className="flex items-center">
                    <Plus className="text-tertiary mr-2" />
                    <div>
                      <h3>Hydration</h3>
                      <p>2.5L / 3L</p>
                    </div>
                  </div>
                  <Badge color="tertiary" className="text-xs">80%</Badge>
                </div>
              </div>
            </div>
          </div>
        </AnimatedContainer>
      </div>
    </ScrollArea>
  );
};

const CalendarPage: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  
  return (
    <ScrollArea>
      <div className="p-4">
        <AnimatedContainer>
          <div className="bg-primary-50 dark:bg-primary-900 p-4 rounded-xl mb-4">
            <h2 className="text-xl font-semibold mb-2">Schedule</h2>
            <p className="text-gray-600 dark:text-gray-300">Plan your energy and focus sessions</p>
          </div>
        </AnimatedContainer>

        <AnimatedContainer>
          <div className="rounded-xl overflow-hidden">
            <div className="p-4 border-b border-gray-200">
              <div className="flex justify-between mb-2">
                <div className="flex items-center">
                  <Plus className="text-warning mr-2" />
                  <div>
                    <h2>Morning Routine</h2>
                    <p>7:00 AM - Exercise & Meditation</p>
                  </div>
                </div>
                <Plus className="text-xl" />
              </div>
            </div>
            <div className="p-4 border-b border-gray-200">
              <div className="flex justify-between mb-2">
                <div className="flex items-center">
                  <Plus className="text-success mr-2" />
                  <div>
                    <h2>Focus Block</h2>
                    <p>9:00 AM - Deep Work Session</p>
                  </div>
                </div>
                <Plus className="text-xl" />
              </div>
            </div>
            <div className="p-4">
              <div className="flex justify-between mb-2">
                <div className="flex items-center">
                  <Plus className="text-tertiary mr-2" />
                  <div>
                    <h2>Lunch Break</h2>
                    <p>12:30 PM - Energy Recharge</p>
                  </div>
                </div>
                <Plus className="text-xl" />
              </div>
            </div>
          </div>
        </AnimatedContainer>

        <Button className="fixed bottom-4 right-4">
          <Plus />
        </Button>
      </div>
    </ScrollArea>
  );
};

const ProfilePage: React.FC = () => (
  <ScrollArea>
    <div className="p-4">
      <AnimatedContainer>
        <div className="text-center mb-6">
          <Avatar className="w-24 h-24 mx-auto mb-4">
            <img src="https://i.pravatar.cc/300" alt="profile" />
          </Avatar>
          <h2 className="text-xl font-semibold">Sarah Johnson</h2>
          <p className="text-gray-500">Energy Level: Master</p>
        </div>
      </AnimatedContainer>

      <AnimatedContainer>
        <div className="rounded-xl overflow-hidden">
          <div className="p-4 border-b border-gray-200">
            <div className="flex justify-between mb-2">
              <div className="flex items-center">
                <Plus className="text-warning mr-2" />
                <div>
                  <h2>Achievements</h2>
                  <p>12 badges earned</p>
                </div>
              </div>
              <Badge color="warning" className="text-xs">3 New</Badge>
            </div>
          </div>
          <div className="p-4 border-b border-gray-200">
            <div className="flex justify-between mb-2">
              <div className="flex items-center">
                <Plus className="text-danger mr-2" />
                <div>
                  <h2>Energy Stats</h2>
                  <p>View detailed analytics</p>
                </div>
              </div>
              <Plus className="text-xl" />
            </div>
          </div>
          <div className="p-4">
            <div className="flex justify-between mb-2">
              <div className="flex items-center">
                <Plus className="text-medium mr-2" />
                <div>
                  <h2>Settings</h2>
                  <p>App preferences</p>
                </div>
              </div>
              <Plus className="text-xl" />
            </div>
          </div>
        </div>
      </AnimatedContainer>
    </div>
  </ScrollArea>
);

const MobileApp: React.FC = () => {
  return (
    <div>
      <Routes>
        <Route path="/home" element={<HomePage />} />
        <Route path="/stats" element={<StatsPage />} />
        <Route path="/calendar" element={<CalendarPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/" element={<Navigate to="/home" />} />
      </Routes>

      <div className="fixed bottom-0 left-0 right-0 flex justify-around p-4 border-t border-gray-200">
        <Button>
          <Home className="text-lg" />
          <span className="text-sm">Home</span>
        </Button>
        <Button>
          <BarChart2 className="text-lg" />
          <span className="text-sm">Stats</span>
        </Button>
        <Button>
          <Calendar className="text-lg" />
          <span className="text-sm">Calendar</span>
        </Button>
        <Button>
          <User className="text-lg" />
          <span className="text-sm">Profile</span>
        </Button>
      </div>
    </div>
  );
};

export default MobileApp;
