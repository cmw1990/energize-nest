
import { Link } from "react-router-dom"
import { ArrowRight, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header/Nav */}
      <header className="container mx-auto px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2 text-primary">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="4" y="4" width="16" height="16" rx="2" stroke="currentColor" strokeWidth="2"/>
            <path d="M12 7V13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <path d="M9 10L15 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <span className="font-semibold">The Well-Charged</span>
        </div>
        
        <div className="hidden md:flex items-center gap-6">
          <Link to="/tools" className="text-foreground/80 hover:text-primary transition-colors">
            Tools
          </Link>
          <Link to="/app" className="text-foreground/80 hover:text-primary transition-colors">
            Web App
          </Link>
          <Button className="bg-orange-500 hover:bg-orange-600 rounded-full text-white">
            Advertise
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-6 pt-12 pb-16 text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-primary mb-12 max-w-4xl mx-auto">
          Optimize Your Energy & Performance
        </h1>
        
        <p className="text-xl font-semibold text-foreground mb-3">
          Clear your phone. Cancel your subscriptions.
        </p>
        
        <p className="text-xl text-primary font-medium mb-3 max-w-3xl mx-auto">
          The Well-Charged is the only wellness platform you'll ever need - 
          <br className="hidden md:block" />free or premium, we've got you covered.
        </p>
        
        <p className="text-lg text-muted-foreground mb-12 max-w-3xl mx-auto">
          Access powerful tools and comprehensive guides to enhance your focus, energy, and overall well-being. 
          <br className="hidden md:block" />Join thousands of high performers who trust The Well-Charged.
        </p>
        
        {/* Platform Availability */}
        <div className="bg-primary/5 p-6 rounded-3xl max-w-3xl mx-auto mb-12">
          <h3 className="text-lg font-semibold mb-6">Available Everywhere You Need It</h3>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-2 p-3 rounded-lg hover:bg-primary/10 transition-colors">
              <svg className="h-6 w-6 text-primary" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="5" y="2" width="14" height="20" rx="2" stroke="currentColor" strokeWidth="2"/>
                <circle cx="12" cy="18" r="1" fill="currentColor"/>
              </svg>
              <span>iOS App</span>
            </div>
            
            <div className="flex items-center gap-2 p-3 rounded-lg hover:bg-primary/10 transition-colors">
              <svg className="h-6 w-6 text-primary" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="5" y="2" width="14" height="20" rx="2" stroke="currentColor" strokeWidth="2"/>
                <circle cx="12" cy="18" r="1" fill="currentColor"/>
              </svg>
              <span>Android App</span>
            </div>
            
            <div className="flex items-center gap-2 p-3 rounded-lg hover:bg-primary/10 transition-colors">
              <svg className="h-6 w-6 text-primary" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="3" y="4" width="18" height="12" rx="1" stroke="currentColor" strokeWidth="2"/>
                <path d="M8 16H16" stroke="currentColor" strokeWidth="2"/>
                <path d="M10 19H14" stroke="currentColor" strokeWidth="2"/>
              </svg>
              <span>Mac App</span>
            </div>
            
            <div className="flex items-center gap-2 p-3 rounded-lg hover:bg-primary/10 transition-colors">
              <svg className="h-6 w-6 text-primary" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="4" y="4" width="16" height="12" rx="1" stroke="currentColor" strokeWidth="2"/>
                <path d="M12 16V20" stroke="currentColor" strokeWidth="2"/>
                <path d="M8 20H16" stroke="currentColor" strokeWidth="2"/>
              </svg>
              <span>Windows App</span>
            </div>
            
            <div className="flex items-center gap-2 p-3 rounded-lg hover:bg-primary/10 transition-colors">
              <svg className="h-6 w-6 text-primary" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2"/>
              </svg>
              <span>Chrome Extension</span>
            </div>
            
            <div className="flex items-center gap-2 p-3 rounded-lg hover:bg-primary/10 transition-colors">
              <svg className="h-6 w-6 text-primary" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                <path d="M12 6V12L16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              <span>Web Tools</span>
            </div>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col md:flex-row gap-4 justify-center mb-6">
          <Button size="lg" className="bg-primary hover:bg-primary/90 rounded-full px-8 py-6 text-base">
            Get Started <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          
          <Link to="/app">
            <Button size="lg" variant="outline" className="rounded-full border-gray-300 px-8 py-6 text-base">
              <span className="flex items-center gap-2">
                Launch Web App 
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M7 17L17 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M7 7H17V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
            </Button>
          </Link>
        </div>

        <Link to="/why-us">
          <Button variant="ghost" size="lg" className="rounded-full text-base">
            Why The Well-Charged? <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </section>

      {/* Celebrity Energy Section */}
      <section className="container mx-auto px-6 py-12 text-center">
        <div className="flex items-center justify-center gap-2 text-primary mb-2">
          <Star className="h-6 w-6" />
          <h2 className="text-3xl font-bold">Celebrity Energy Recipes</h2>
        </div>
        
        <p className="text-lg text-muted-foreground mb-8 max-w-3xl mx-auto">
          Discover energy optimization routines from world-class performers, experts, and leaders. 
          Learn from their proven strategies and adapt them to your lifestyle.
        </p>
        
        <Button className="bg-primary hover:bg-primary/90 rounded-full px-8 py-6 text-base">
          Explore Celebrity Plans <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="rounded-3xl border border-gray-100 shadow-sm hover:shadow transition-all">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <svg className="h-12 w-12 text-primary mb-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                  <path d="M12 7V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M7 12H17" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                
                <h3 className="text-xl font-bold mb-2">Cognitive Enhancement</h3>
                <p className="text-muted-foreground">
                  Science-backed tools and comprehensive guides for optimal mental performance
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-3xl border border-gray-100 shadow-sm hover:shadow transition-all">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <svg className="h-12 w-12 text-primary mb-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                  <path d="M12 8L12 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M16 12L8 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                
                <h3 className="text-xl font-bold mb-2">Accessible Anywhere</h3>
                <p className="text-muted-foreground">
                  Use our tools directly in your browser - no downloads or installations needed
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-3xl border border-gray-100 shadow-sm hover:shadow transition-all">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <svg className="h-12 w-12 text-primary mb-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                
                <h3 className="text-xl font-bold mb-2">Energy Management</h3>
                <p className="text-muted-foreground">
                  Optimize your energy levels with our guides and tracking tools
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Featured Tools Section */}
      <section className="container mx-auto px-6 py-12">
        <h2 className="text-3xl font-bold text-center mb-12">Featured Tools & Guides</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="rounded-3xl border border-gray-100 shadow-sm hover:shadow transition-all">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <svg className="h-10 w-10 text-primary mb-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8 5.07026C9.17669 4.38958 10.5429 4 12 4C16.4183 4 20 7.58172 20 12C20 16.4183 16.4183 20 12 20C7.58172 20 4 16.4183 4 12C4 10.5429 4.38958 9.17669 5.07026 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M13.5 8L13.5 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M15.5 10L11.5 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                
                <h3 className="text-xl font-bold mb-2">White Noise Generator</h3>
                <p className="text-muted-foreground">
                  Enhance focus and productivity with customizable white noise
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-3xl border border-gray-100 shadow-sm hover:shadow transition-all">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <svg className="h-10 w-10 text-primary mb-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="2"/>
                  <path d="M12 8V16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M9 10L9 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M15 10L15 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                
                <h3 className="text-xl font-bold mb-2">Supplement Guide</h3>
                <p className="text-muted-foreground">
                  Comprehensive guide to nootropics and cognitive enhancement
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-3xl border border-gray-100 shadow-sm hover:shadow transition-all">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <svg className="h-10 w-10 text-primary mb-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17 8H18C19.1046 8 20 8.89543 20 10V16C20 17.1046 19.1046 18 18 18H6C4.89543 18 4 17.1046 4 16V10C4 8.89543 4.89543 8 6 8H7" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M12 8C12 5.79086 10.2091 4 8 4V8L12 8Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 8C12 5.79086 13.7909 4 16 4V8L12 8Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                
                <h3 className="text-xl font-bold mb-2">Caffeine Guide</h3>
                <p className="text-muted-foreground">
                  Optimize your caffeine intake for better energy and focus
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="flex justify-center">
          <Button variant="outline" size="lg" className="rounded-full border-gray-300 px-8 py-6 text-base">
            View All Tools <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-8">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center gap-2 text-primary mb-4 md:mb-0">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="4" y="4" width="16" height="16" rx="2" stroke="currentColor" strokeWidth="2"/>
              <path d="M12 7V13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <path d="M9 10L15 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <span className="font-semibold">The Well-Charged</span>
          </div>
          
          <div className="flex gap-8">
            <Link to="/privacy" className="text-muted-foreground hover:text-primary">
              Privacy
            </Link>
            <Link to="/terms" className="text-muted-foreground hover:text-primary">
              Terms
            </Link>
            <Link to="/contact" className="text-muted-foreground hover:text-primary">
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage
