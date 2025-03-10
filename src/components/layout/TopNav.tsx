import { Battery, LogIn, TrendingUp, Wrench, Laptop } from "lucide-react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { useNavigate, useLocation } from "react-router-dom"
import { AuthButton } from "@/components/auth/AuthButton"

export const TopNav = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const showDesktopSwitch = location.pathname === "/"

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      {/* First Row */}
      <div className="container mx-auto p-4 flex justify-between items-center border-b">
        <Link to="/" className="flex items-center gap-2">
          <Battery className="size-6 text-primary" />
          <span className="text-xl font-semibold">The Well-Charged</span>
        </Link>
        <div className="flex items-center gap-4">
          {showDesktopSwitch && (
            <div className="flex items-center gap-2 border rounded-lg p-2 bg-background/80">
              <Label htmlFor="desktop-mode" className="text-sm">Desktop Mode</Label>
              <Switch
                id="desktop-mode"
                onCheckedChange={(checked) => {
                  if (checked) {
                    navigate('/desktop')
                  }
                }}
              />
            </div>
          )}
          <AuthButton />
        </div>
      </div>

      {/* Second Row */}
      <div className="container mx-auto px-4 py-2 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Link to="/tools">
            <Button variant="ghost" size="sm" className="text-sm">
              <Wrench className="size-4 mr-2" />
              Tools
            </Button>
          </Link>
          <Link to="/webapp">
            <Button variant="ghost" size="sm" className="text-sm">
              <Laptop className="size-4 mr-2" />
              Web App
            </Button>
          </Link>
        </div>
        <Link to="/vendor/ads">
          <Button 
            variant="outline" 
            size="sm"
            className="bg-orange-500 hover:bg-orange-600 text-white border-none shadow-sm"
          >
            <TrendingUp className="size-4 mr-2" />
            Advertise
          </Button>
        </Link>
      </div>
    </nav>
  )
}
