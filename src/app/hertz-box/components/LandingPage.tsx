import React from 'react';
import { Session } from '@supabase/supabase-js';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { dbClient } from '@/lib/db-client';

interface LandingPageProps {
  session: Session | null;
}

export const LandingPage: React.FC<LandingPageProps> = ({ session }) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 to-indigo-900 text-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl tracking-tight font-extrabold sm:text-5xl md:text-6xl">
              <span className="block">Welcome to</span>
              <span className="block text-purple-400">The Hertz Box</span>
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base text-gray-300 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              Experience the power of sound frequencies. Binaural beats, isochronic tones, and solfeggio frequencies to enhance your mind, body, and spirit.
            </p>
            <div className="mt-10 flex justify-center gap-4">
              {session ? (
                <Link to="/hertz-box/dashboard">
                  <Button size="lg" className="bg-purple-600 hover:bg-purple-700">
                    Go to Dashboard
                  </Button>
                </Link>
              ) : (
                <>
                  <Button size="lg" className="bg-purple-600 hover:bg-purple-700" onClick={() => dbClient.auth.signIn({ provider: 'google' })}>
                    Get Started
                  </Button>
                  <Link to="/hertz-box/binaural-beats">
                    <Button variant="outline" size="lg" className="border-purple-600 text-purple-400 hover:bg-purple-600 hover:text-white">
                      Try it Free
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 bg-purple-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
              Unlock Your Full Potential
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-gray-300">
              The Hertz Box provides powerful sound technologies to enhance meditation, focus, creativity, and sleep.
            </p>
          </div>

          <div className="mt-20 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <Card className="bg-purple-900/80 border-purple-700">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Binaural Beats</h3>
                <p className="text-gray-300">
                  Experience different brain states with scientifically designed binaural beats for meditation, focus, relaxation, and more.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-purple-900/80 border-purple-700">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h10m-4 0v-6M7 5l0 0m5 0l0 0m5 0l0 0m-10 14l0 0m5 0l0 0m5 0l0 0" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Isochronic Tones</h3>
                <p className="text-gray-300">
                  Clean, distinct tones that turn on and off rapidly, creating a strong response in the brain without requiring headphones.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-purple-900/80 border-purple-700">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Solfeggio Frequencies</h3>
                <p className="text-gray-300">
                  Ancient sound healing frequencies that promote spiritual and emotional wellbeing across different energy centers.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
              How It Works
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-gray-300">
              Sound frequencies can induce specific brain states, helping with everything from focus to deep relaxation.
            </p>
          </div>

          <div className="mt-16">
            <div className="lg:grid lg:grid-cols-3 lg:gap-8">
              <div className="mt-10 lg:mt-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-purple-500 text-white mx-auto">
                  <span className="text-lg font-bold">1</span>
                </div>
                <div className="mt-5 text-center">
                  <h3 className="text-lg font-medium">Choose Your Experience</h3>
                  <p className="mt-2 text-gray-300">
                    Select from our library of binaural beats, isochronic tones, or solfeggio frequencies.
                  </p>
                </div>
              </div>
              <div className="mt-10 lg:mt-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-purple-500 text-white mx-auto">
                  <span className="text-lg font-bold">2</span>
                </div>
                <div className="mt-5 text-center">
                  <h3 className="text-lg font-medium">Customize Your Session</h3>
                  <p className="mt-2 text-gray-300">
                    Adjust frequency, duration, background sounds, and volume to your preference.
                  </p>
                </div>
              </div>
              <div className="mt-10 lg:mt-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-purple-500 text-white mx-auto">
                  <span className="text-lg font-bold">3</span>
                </div>
                <div className="mt-5 text-center">
                  <h3 className="text-lg font-medium">Experience the Benefits</h3>
                  <p className="mt-2 text-gray-300">
                    Listen with quality headphones for optimal results. Regular use leads to lasting benefits.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-purple-600">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
            <span className="block">Ready to experience the power of sound?</span>
            <span className="block text-purple-200">Start your journey today.</span>
          </h2>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
            {session ? (
              <Link to="/hertz-box/dashboard">
                <Button size="lg" className="bg-white text-purple-600 hover:bg-purple-50">
                  Go to Dashboard
                </Button>
              </Link>
            ) : (
              <Button size="lg" className="bg-white text-purple-600 hover:bg-purple-50" onClick={() => dbClient.auth.signIn({ provider: 'google' })}>
                Get Started
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
