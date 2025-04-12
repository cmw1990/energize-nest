import React from 'react';
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export const LandingHeader = () => {
  return (
    <header className="container mx-auto px-6 py-4 flex justify-between items-center border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <Link to="/" className="flex items-center gap-2 text-primary">
        {/* Using the same SVG as LandingPage */}
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="4" y="4" width="16" height="16" rx="2" stroke="currentColor" strokeWidth="2"/>
          <path d="M12 7V13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          <path d="M9 10L15 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
        <span className="font-semibold">The Well-Charged</span>
      </Link>

      {/* Consider adding mobile navigation (e.g., hamburger menu) if needed */}
      <div className="hidden md:flex items-center gap-6">
        {/* Link to the main tools directory page */}
        <Link to="/tools" className="text-foreground/80 hover:text-primary transition-colors">
          Tools
        </Link>
        {/* Link to the main authenticated web app */}
        <Link to="/app" className="text-foreground/80 hover:text-primary transition-colors">
          Web App
        </Link>
         {/* Link to the vendor advertising page */}
        <Link to="/vendor/ads">
            <Button className="bg-orange-500 hover:bg-orange-600 rounded-full text-white">
                Advertise
            </Button>
        </Link>
         {/* Add Sign In button for easy access */}
         <Link to="/auth">
            <Button variant="outline">
                Sign In
            </Button>
        </Link>
      </div>
       {/* Basic Mobile Menu Placeholder - Needs proper implementation */}
       <div className="md:hidden">
            {/* Add Hamburger Menu Button Here */}
            {/* Example: <Button variant="ghost" size="icon"> <Menu /> </Button> */}
            {/* Dropdown/Sheet content would include links */}
       </div>
    </header>
  );
};