import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, Brain, Globe, Zap, Wrench, Battery, Settings2 as Settings, Pill, Wind, Coffee, Smartphone, Tablet, Laptop, Monitor, Chrome, Star } from "lucide-react"
import { Link } from "react-router-dom"
import { TopNav } from "@/components/layout/TopNav"

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      <TopNav />

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 bg-white">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h1 className="text-4xl md:text-6xl font-bold text-primary">
            Optimize Your Energy & Performance
          </h1>
          
          <div className="space-y-6">
            <p className="text-2xl font-semibold text-foreground">
              Clear your phone. Cancel your subscriptions.
            </p>
            <p className="text-xl text-primary font-medium">
              The Well-Charged is the only wellness platform you'll ever need - 
              <br />free or premium, we've got you covered.
            </p>
            <p className="text-lg text-muted-foreground">
              Access powerful tools and comprehensive guides to enhance your focus, energy, and overall well-being. 
              Join thousands of high performers who trust The Well-Charged.
            </p>
          </div>

          {/* Platform Availability */}
          <div className="bg-primary/5 p-6 rounded-2xl">
            <h3 className="text-lg font-semibold mb-4">Available Everywhere You Need It</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
              <Link to="/download/ios" className="flex items-center gap-2 p-3 rounded-lg hover:bg-primary/10 transition-colors">
                <Smartphone className="size-5 text-primary" />
                <span>iOS App</span>
              </Link>
              <Link to="/download/android" className="flex items-center gap-2 p-3 rounded-lg hover:bg-primary/10 transition-colors">
                <Smartphone className="size-5 text-primary" />
                <span>Android App</span>
              </Link>
              <Link to="/download/mac" className="flex items-center gap-2 p-3 rounded-lg hover:bg-primary/10 transition-colors">
                <Laptop className="size-5 text-primary" />
                <span>Mac App</span>
              </Link>
              <Link to="/download/windows" className="flex items-center gap-2 p-3 rounded-lg hover:bg-primary/10 transition-colors">
                <Monitor className="size-5 text-primary" />
                <span>Windows App</span>
              </Link>
              <Link to="/chrome-extension" className="flex items-center gap-2 p-3 rounded-lg hover:bg-primary/10 transition-colors">
                <Chrome className="size-5 text-primary" />
                <span>Chrome Extension</span>
              </Link>
              <Link to="/webapp" className="flex items-center gap-2 p-3 rounded-lg hover:bg-primary/10 transition-colors">
                <Globe className="size-5 text-primary" />
                <span>Web Tools</span>
              </Link>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link to="/auth">
              <Button size="lg" className="group">
                Get Started
                <ArrowRight className="size-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link to="/webapp">
              <Button size="lg" variant="outline">
                Launch Web App
                <Wrench className="size-4 ml-2" />
              </Button>
            </Link>
          </div>
          <div>
            <Link to="/why-us">
              <Button variant="ghost" size="lg" className="group">
                Why The Well-Charged?
                <ArrowRight className="size-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Celebrity Energy Recipes Section */}
      <section className="container mx-auto px-4 py-12 bg-primary/5 rounded-3xl my-8">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 text-primary">
            <Star className="size-6" />
            <h2 className="text-3xl font-bold">Celebrity Energy Recipes</h2>
          </div>
          <p className="text-lg text-muted-foreground">
            Discover energy optimization routines from world-class performers, experts, and leaders.
            Learn from their proven strategies and adapt them to your lifestyle.
          </p>
          <div className="flex justify-center">
            <Link to="/webapp/energy">
              <Button size="lg" className="group">
                Explore Celebrity Plans
                <ArrowRight className="size-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="bg-background border-2 border-primary/20">
            <CardHeader>
              <Brain className="size-8 text-primary mb-2" />
              <CardTitle>Cognitive Enhancement</CardTitle>
              <CardDescription>
                Science-backed tools and comprehensive guides for optimal mental performance
              </CardDescription>
            </CardHeader>
          </Card>
          <Card className="bg-background border-2 border-primary/20">
            <CardHeader>
              <Globe className="size-8 text-primary mb-2" />
              <CardTitle>Accessible Anywhere</CardTitle>
              <CardDescription>
                Use our tools directly in your browser - no downloads or installations needed
              </CardDescription>
            </CardHeader>
          </Card>
          <Card className="bg-background border-2 border-primary/20">
            <CardHeader>
              <Zap className="size-8 text-primary mb-2" />
              <CardTitle>Energy Management</CardTitle>
              <CardDescription>
                Optimize your energy levels with our guides and tracking tools
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* Tools Preview Section */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-center mb-12">Featured Tools & Guides</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              title: "White Noise Generator",
              description: "Enhance focus and productivity with customizable white noise",
              icon: Wind,
              path: "/webapp/tools/white-noise"
            },
            {
              title: "Supplement Guide",
              description: "Comprehensive guide to nootropics and cognitive enhancement",
              icon: Pill,
              path: "/webapp/tools/supplement-guide"
            },
            {
              title: "Caffeine Guide",
              description: "Optimize your caffeine intake for better energy and focus",
              icon: Coffee,
              path: "/webapp/tools/caffeine-guide"
            }
          ].map((tool) => (
            <Link key={tool.title} to={tool.path}>
              <Card className="h-full hover:shadow-lg transition-shadow border-2 border-primary/20">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-primary/10 rounded-full">
                      <tool.icon className="size-6 text-primary" />
                    </div>
                    <CardTitle className="text-xl">{tool.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {tool.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
        <div className="text-center mt-8">
          <Link to="/webapp/tools">
            <Button size="lg" variant="outline">
              View All Tools
              <ArrowRight className="size-4 ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <Battery className="size-6 text-primary" />
              <span className="text-xl font-semibold">The Well-Charged</span>
            </div>
            <div className="flex items-center gap-4">
              <Link to="/privacy">Privacy</Link>
              <Link to="/terms">Terms</Link>
              <Link to="/contact">Contact</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
