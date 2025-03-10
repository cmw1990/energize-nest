import React from 'react';
import { Session } from '@supabase/supabase-js';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Headphones, Waves, Music, History, Heart } from 'lucide-react';

interface DashboardProps {
  session: Session | null;
}

export const Dashboard: React.FC<DashboardProps> = ({ session }) => {
  const basePath = '/hertz-box';
  
  const features = [
    {
      title: 'Binaural Beats',
      description: 'Different frequencies for each ear to induce specific brain states',
      icon: Headphones,
      href: `${basePath}/binaural-beats`,
      color: 'bg-purple-100 dark:bg-purple-900',
      textColor: 'text-purple-800 dark:text-purple-200'
    },
    {
      title: 'Isochronic Tones',
      description: 'Single tones that turn on and off rapidly to entrain the brain',
      icon: Waves,
      href: `${basePath}/isochronic-tones`,
      color: 'bg-blue-100 dark:bg-blue-900',
      textColor: 'text-blue-800 dark:text-blue-200'
    },
    {
      title: 'Solfeggio Frequencies',
      description: 'Ancient healing frequencies aligned with chakras and energy centers',
      icon: Music,
      href: `${basePath}/solfeggio-frequencies`,
      color: 'bg-indigo-100 dark:bg-indigo-900',
      textColor: 'text-indigo-800 dark:text-indigo-200'
    },
    {
      title: 'Favorites',
      description: 'Your saved and customized frequency presets',
      icon: Heart,
      href: `${basePath}/favorites`,
      color: 'bg-pink-100 dark:bg-pink-900',
      textColor: 'text-pink-800 dark:text-pink-200'
    }
  ];

  const recentlyPlayed = [
    { name: 'Deep Focus - Alpha Waves', duration: '30 min', type: 'Binaural Beat', frequency: '8-12 Hz' },
    { name: 'Sleep Aid - Delta Waves', duration: '45 min', type: 'Binaural Beat', frequency: '0.5-4 Hz' },
    { name: 'Stress Relief', duration: '20 min', type: 'Isochronic Tone', frequency: '7.83 Hz' }
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Welcome to The Hertz Box - your frequency therapy companion
          </p>
        </div>
      </div>

      {/* Features grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((feature, idx) => (
          <Card key={idx} className="overflow-hidden">
            <Link to={feature.href} className="block h-full">
              <CardHeader className={`${feature.color} ${feature.textColor}`}>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                  <feature.icon className="h-5 w-5" />
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {feature.description}
                </p>
              </CardContent>
            </Link>
          </Card>
        ))}
      </div>

      {/* Recently played section */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Recently Played</CardTitle>
            <History className="h-5 w-5 text-gray-500" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentlyPlayed.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between border-b last:border-0 pb-3 last:pb-0">
                <div>
                  <h3 className="font-medium">{item.name}</h3>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {item.type} · {item.frequency} · {item.duration}
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  Play
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
