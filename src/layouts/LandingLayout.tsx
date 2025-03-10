import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export default function LandingLayout() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold">
            EnergyNest
          </Link>
          <nav className="space-x-4">
            <Link to="/webapp">
              <Button>Open App</Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main>
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t mt-auto">
        <div className="container mx-auto px-4 py-6">
          <p className="text-center text-sm text-muted-foreground">
            {new Date().getFullYear()} EnergyNest. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
