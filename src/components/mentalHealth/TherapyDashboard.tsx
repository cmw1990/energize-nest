
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, MessageSquare, CreditCard, Users } from 'lucide-react';
import { useAuth } from '@/components/AuthProvider';
import { assertType } from '@/utils/typeSafeUtils';

type TherapyAppointment = {
  id: string;
  user_id: string;
  provider_id: string;
  appointment_date: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  notes: string | null;
  created_at: string;
  updated_at: string;
  providers: {
    name: string;
    specialty: string;
    verification_method: string;
  } | null;
};

export const TherapyDashboard = () => {
  const { session } = useAuth();
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');

  const { data: appointments, isLoading: loadingAppointments } = useQuery({
    queryKey: ['therapy_appointments', session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return [];
      
      const { data, error } = await supabase
        .from('therapy_appointments')
        .select(`
          *,
          providers (
            name,
            specialty,
            verification_method
          )
        `)
        .eq('user_id', session.user.id)
        .order('appointment_date', { ascending: true });
      
      if (error) {
        console.error('Error fetching therapy appointments:', error);
        return [];
      }
      
      return assertType<TherapyAppointment[]>(data || []);
    },
    enabled: !!session?.user?.id,
  });

  const upcomingAppointments = appointments?.filter(
    app => new Date(app.appointment_date) > new Date() && app.status === 'scheduled'
  ) || [];
  
  const pastAppointments = appointments?.filter(
    app => new Date(app.appointment_date) <= new Date() || app.status !== 'scheduled'
  ) || [];

  const formatAppointmentDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long',
      month: 'long', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatAppointmentTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const getNextAppointment = () => {
    if (!upcomingAppointments || upcomingAppointments.length === 0) return null;
    return upcomingAppointments[0];
  };

  const nextAppointment = getNextAppointment();

  return (
    <div className="space-y-6">
      <div className="space-y-0.5">
        <h2 className="text-2xl font-bold tracking-tight">Therapy Dashboard</h2>
        <p className="text-muted-foreground">
          View and manage your therapy appointments
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Appointments
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{appointments?.length || 0}</div>
            <p className="text-xs text-muted-foreground">
              {upcomingAppointments.length} upcoming
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Recent Sessions
            </CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pastAppointments.length}</div>
            <p className="text-xs text-muted-foreground">
              Over all time
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Next Appointment
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {nextAppointment ? formatAppointmentDate(nextAppointment.appointment_date) : 'None scheduled'}
            </div>
            <p className="text-xs text-muted-foreground">
              {nextAppointment ? formatAppointmentTime(nextAppointment.appointment_date) : 'Book an appointment'}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Provider
            </CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {nextAppointment && nextAppointment.providers ? nextAppointment.providers.name : 'N/A'}
            </div>
            <p className="text-xs text-muted-foreground">
              {nextAppointment && nextAppointment.providers ? nextAppointment.providers.specialty : 'No current provider'}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Appointments</CardTitle>
            <div className="flex space-x-2">
              <Button 
                variant={activeTab === 'upcoming' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setActiveTab('upcoming')}
              >
                Upcoming
              </Button>
              <Button 
                variant={activeTab === 'past' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setActiveTab('past')}
              >
                Past
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loadingAppointments ? (
            <p>Loading appointments...</p>
          ) : activeTab === 'upcoming' ? (
            upcomingAppointments.length > 0 ? (
              <div className="space-y-4">
                {upcomingAppointments.map((appointment) => (
                  <div key={appointment.id} className="flex justify-between p-4 border rounded-lg">
                    <div className="space-y-1">
                      <div className="font-medium">
                        {appointment.providers ? appointment.providers.name : 'Unknown Provider'}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {appointment.providers ? appointment.providers.specialty : 'Unknown Specialty'}
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Calendar className="mr-1 h-3 w-3" />
                        {formatAppointmentDate(appointment.appointment_date)}
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Clock className="mr-1 h-3 w-3" />
                        {formatAppointmentTime(appointment.appointment_date)}
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Button variant="outline" size="sm">Reschedule</Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">No upcoming appointments</p>
                <Button>Book an Appointment</Button>
              </div>
            )
          ) : (
            pastAppointments.length > 0 ? (
              <div className="space-y-4">
                {pastAppointments.map((appointment) => (
                  <div 
                    key={appointment.id} 
                    className={`flex justify-between p-4 border rounded-lg ${
                      appointment.status === 'cancelled' ? 'bg-muted/50' : ''
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center">
                        <span className="font-medium">
                          {appointment.providers ? appointment.providers.name : 'Unknown Provider'}
                        </span>
                        {appointment.status === 'cancelled' && (
                          <span className="ml-2 text-xs bg-destructive/10 text-destructive px-2 py-0.5 rounded">
                            Cancelled
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {appointment.providers ? appointment.providers.specialty : 'Unknown Specialty'}
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Calendar className="mr-1 h-3 w-3" />
                        {formatAppointmentDate(appointment.appointment_date)}
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Clock className="mr-1 h-3 w-3" />
                        {formatAppointmentTime(appointment.appointment_date)}
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Button variant="outline" size="sm">Notes</Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-8">No past appointments</p>
            )
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TherapyDashboard;
