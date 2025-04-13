import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Search,
  HelpCircle,
  Book,
  MessageSquare,
  Info,
  Send,
  Phone,
  Mail,
  PlayCircle,
  FileQuestion,
  FileText,
  ChevronRight,
  ArrowRight
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Help() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  const faqs = [
    {
      question: "How do I create an energy plan?",
      answer: "To create an energy plan, navigate to the Energy Plans section from the sidebar and click on the 'Create New Plan' button. Follow the guided process to set up your custom energy plan."
    },
    {
      question: "Can I track my sleep patterns?",
      answer: "Yes, you can track your sleep patterns in the Sleep section. Use the sleep tracking feature to log your sleep times, quality, and habits. The app will analyze your patterns and provide insights."
    },
    {
      question: "How do I use the focus timer?",
      answer: "Access the Focus section from the sidebar, then select the Focus Timer tool. Set your desired focus duration and breaks, then start the timer. The app will help you maintain focus and track your sessions."
    },
    {
      question: "Is my data secure and private?",
      answer: "Yes, we take data security and privacy seriously. All your personal data is encrypted and stored securely. You can control your privacy settings in the Settings section."
    },
    {
      question: "How do I connect a wearable device?",
      answer: "Go to Settings > Connections, then select 'Add Device'. Follow the instructions to connect your specific wearable device. We support a wide range of popular fitness trackers and smartwatches."
    },
    {
      question: "Can I export my data?",
      answer: "Yes, you can export your data in various formats. Navigate to Settings > Privacy > Data Management, then select 'Download Your Data' to export all your information."
    }
  ];

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    toast({
      title: "Search Results",
      description: `Showing results for "${searchQuery}"`,
    });
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    toast({
      title: "Message Sent",
      description: "We've received your message and will respond shortly.",
    });
    setContactForm({
      name: "",
      email: "",
      subject: "",
      message: ""
    });
  };

  const handleContactChange = (e) => {
    const { name, value } = e.target;
    setContactForm((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const clickElement = (selector: string) => {
    const element = document.querySelector(selector);
    if (element instanceof HTMLElement) {
      element.click();
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Help & Support</h1>
      
      <Card className="mb-6">
        <CardContent className="pt-6">
          <form onSubmit={handleSearchSubmit} className="relative">
            <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search for help topics..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button type="submit" className="absolute right-1 top-1">
              Search
            </Button>
          </form>
        </CardContent>
      </Card>
      
      <Tabs defaultValue="faq">
        <TabsList className="mb-4">
          <TabsTrigger value="faq">
            <HelpCircle className="mr-2 h-4 w-4" />
            FAQs
          </TabsTrigger>
          <TabsTrigger value="guides">
            <Book className="mr-2 h-4 w-4" />
            Guides
          </TabsTrigger>
          <TabsTrigger value="contact">
            <MessageSquare className="mr-2 h-4 w-4" />
            Contact Us
          </TabsTrigger>
          <TabsTrigger value="about">
            <Info className="mr-2 h-4 w-4" />
            About
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="faq">
          <Card>
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
              <CardDescription>
                Find answers to common questions about using the app
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {faqs.map((faq, index) => (
                  <details key={index} className="group">
                    <summary className="flex items-center justify-between cursor-pointer list-none font-medium p-3 border rounded-lg hover:bg-muted/50">
                      {faq.question}
                      <ChevronRight className="h-5 w-5 text-muted-foreground group-open:rotate-90 transition-transform" />
                    </summary>
                    <div className="pl-3 pr-3 pt-2 pb-3 text-muted-foreground">
                      {faq.answer}
                    </div>
                  </details>
                ))}
              </div>
              
              <div className="mt-6 text-center">
                <p className="text-muted-foreground mb-2">Still have questions?</p>
                <Button 
                  variant="outline" 
                  onClick={() => clickElement('button[value="contact"]')}
                >
                  Contact Support
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="guides">
          <Card>
            <CardHeader>
              <CardTitle>Guides & Tutorials</CardTitle>
              <CardDescription>
                Learn how to use all features of the application
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <PlayCircle className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium">Getting Started</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          Learn the basics of navigating and using the app
                        </p>
                        <div className="flex items-center mt-2 text-sm text-primary">
                          Watch video <ArrowRight className="ml-1 h-3 w-3" />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <FileText className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium">Energy Plans Guide</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          How to create and customize your energy plans
                        </p>
                        <div className="flex items-center mt-2 text-sm text-primary">
                          Read guide <ArrowRight className="ml-1 h-3 w-3" />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <FileText className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium">Sleep Tracking</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          How to track and analyze your sleep patterns
                        </p>
                        <div className="flex items-center mt-2 text-sm text-primary">
                          Read guide <ArrowRight className="ml-1 h-3 w-3" />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <PlayCircle className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium">Focus Techniques</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          Learn how to use the focus tools effectively
                        </p>
                        <div className="flex items-center mt-2 text-sm text-primary">
                          Watch video <ArrowRight className="ml-1 h-3 w-3" />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <FileQuestion className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium">Advanced Features</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          Discover advanced features and customizations
                        </p>
                        <div className="flex items-center mt-2 text-sm text-primary">
                          Read guide <ArrowRight className="ml-1 h-3 w-3" />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <FileQuestion className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium">Troubleshooting</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          Solutions to common issues and problems
                        </p>
                        <div className="flex items-center mt-2 text-sm text-primary">
                          Read guide <ArrowRight className="ml-1 h-3 w-3" />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="mt-6 p-4 bg-muted/30 rounded-lg text-center">
                <h3 className="font-medium">Need more help?</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Check out our full documentation for in-depth guides and resources
                </p>
                <Button>View Full Documentation</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="contact">
          <Card>
            <CardHeader>
              <CardTitle>Contact Support</CardTitle>
              <CardDescription>
                Get in touch with our support team for personalized help
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <h3 className="text-lg font-medium mb-4">Send us a message</h3>
                  <form onSubmit={handleContactSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <label htmlFor="name" className="text-sm font-medium">Name</label>
                      <Input 
                        id="name" 
                        name="name"
                        value={contactForm.name}
                        onChange={handleContactChange}
                        required 
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-medium">Email</label>
                      <Input 
                        id="email" 
                        name="email"
                        type="email"
                        value={contactForm.email}
                        onChange={handleContactChange}
                        required 
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="subject" className="text-sm font-medium">Subject</label>
                      <Input 
                        id="subject" 
                        name="subject"
                        value={contactForm.subject}
                        onChange={handleContactChange}
                        required 
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="message" className="text-sm font-medium">Message</label>
                      <Textarea 
                        id="message" 
                        name="message"
                        rows={5}
                        value={contactForm.message}
                        onChange={handleContactChange}
                        required 
                      />
                    </div>
                    
                    <Button type="submit" className="w-full">
                      <Send className="mr-2 h-4 w-4" />
                      Send Message
                    </Button>
                  </form>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-4">Contact Information</h3>
                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Mail className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium">Email Support</h4>
                        <p className="text-sm text-muted-foreground mb-1">
                          Response time: Within 24 hours
                        </p>
                        <a href="mailto:support@wellcharged.com" className="text-primary hover:underline">
                          support@wellcharged.com
                        </a>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-4">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Phone className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium">Phone Support</h4>
                        <p className="text-sm text-muted-foreground mb-1">
                          Available Monday-Friday, 9am-5pm EST
                        </p>
                        <a href="tel:+1-555-123-4567" className="text-primary hover:underline">
                          +1 (555) 123-4567
                        </a>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-4">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <MessageSquare className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium">Live Chat</h4>
                        <p className="text-sm text-muted-foreground mb-1">
                          Available 24/7 for quick assistance
                        </p>
                        <Button variant="outline" size="sm">
                          Start Live Chat
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-8 p-4 bg-muted/30 rounded-lg">
                    <h4 className="font-medium mb-2">Frequently Asked Questions</h4>
                    <p className="text-sm text-muted-foreground mb-2">
                      Check our FAQs for quick answers to common questions
                    </p>
                    <Button 
                      variant="link" 
                      className="p-0" 
                      onClick={() => clickElement('button[value="faq"]')}
                    >
                      View FAQs
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="about">
          <Card>
            <CardHeader>
              <CardTitle>About Well-Charged</CardTitle>
              <CardDescription>
                Learn more about our mission and application
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-2">Our Mission</h3>
                  <p className="text-muted-foreground">
                    Well-Charged is dedicated to helping individuals maximize their energy, focus, and overall wellness through scientifically-backed approaches and personalized solutions. We believe that everyone deserves to feel energized and productive throughout their day, and our comprehensive tools are designed to make that possible.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-2">The App</h3>
                  <p className="text-muted-foreground mb-4">
                    Our application combines cutting-edge technology with evidence-based wellness practices to provide a holistic approach to energy management and focus enhancement. From personalized energy plans to advanced sleep tracking, focus tools, and mental health support, Well-Charged offers everything you need to optimize your daily performance and well-being.
                  </p>
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="border rounded-lg p-4">
                      <div className="font-medium mb-1">Version</div>
                      <div className="text-sm text-muted-foreground">1.0.0</div>
                    </div>
                    <div className="border rounded-lg p-4">
                      <div className="font-medium mb-1">Last Updated</div>
                      <div className="text-sm text-muted-foreground">April 12, 2025</div>
                    </div>
                    <div className="border rounded-lg p-4">
                      <div className="font-medium mb-1">Platforms</div>
                      <div className="text-sm text-muted-foreground">Web, iOS, Android</div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-2">Our Team</h3>
                  <p className="text-muted-foreground mb-4">
                    Well-Charged was created by a team of experts in neuroscience, sleep science, productivity, and software development. Our multidisciplinary approach ensures that all aspects of energy management and focus are addressed with scientific rigor and practical application.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-2">Privacy & Security</h3>
                  <p className="text-muted-foreground mb-2">
                    We take your privacy and data security seriously. All data is encrypted and securely stored, and we never share your personal information with third parties without your explicit permission.
                  </p>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => navigate("/privacy")}>
                      Privacy Policy
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => navigate("/terms")}>
                      Terms of Service
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
