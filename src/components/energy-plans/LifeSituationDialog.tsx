
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Baby, Brain, Heart, Moon } from "lucide-react"

interface LifeSituationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentSituation: string | null;
  onUpdateSituation: (situation: string) => void;
}

export function LifeSituationDialog({
  open,
  onOpenChange,
  currentSituation,
  onUpdateSituation
}: LifeSituationDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Your Current Life Situation</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <RadioGroup 
            onValueChange={(value) => onUpdateSituation(value)}
            defaultValue={currentSituation || "regular"}
            className="gap-4"
          >
            <div className="flex items-center space-x-2 rounded-lg border p-4 hover:bg-accent cursor-pointer">
              <RadioGroupItem value="regular" id="regular" />
              <Label htmlFor="regular" className="flex-1 cursor-pointer">
                <div className="font-semibold flex items-center gap-2">
                  <Brain className="h-4 w-4" />
                  Regular Energy Management
                </div>
                <div className="text-sm text-muted-foreground">
                  Standard energy and focus optimization for everyday life
                </div>
              </Label>
            </div>

            <div className="flex items-center space-x-2 rounded-lg border p-4 hover:bg-accent cursor-pointer">
              <RadioGroupItem value="high_stress" id="high_stress" />
              <Label htmlFor="high_stress" className="flex-1 cursor-pointer">
                <div className="font-semibold flex items-center gap-2">
                  <Baby className="h-4 w-4" />
                  High Stress
                </div>
                <div className="text-sm text-muted-foreground">
                  Tailored energy plans and wellness support during high stress periods
                </div>
              </Label>
            </div>

            <div className="flex items-center space-x-2 rounded-lg border p-4 hover:bg-accent cursor-pointer">
              <RadioGroupItem value="low_energy" id="low_energy" />
              <Label htmlFor="low_energy" className="flex-1 cursor-pointer">
                <div className="font-semibold flex items-center gap-2">
                  <Heart className="h-4 w-4" />
                  Low Energy
                </div>
                <div className="text-sm text-muted-foreground">
                  Specialized support and energy management for periods of low energy
                </div>
              </Label>
            </div>

            <div className="flex items-center space-x-2 rounded-lg border p-4 hover:bg-accent cursor-pointer">
              <RadioGroupItem value="peak_performance" id="peak_performance" />
              <Label htmlFor="peak_performance" className="flex-1 cursor-pointer">
                <div className="font-semibold flex items-center gap-2">
                  <Moon className="h-4 w-4" />
                  Peak Performance
                </div>
                <div className="text-sm text-muted-foreground">
                  Energy optimization for maximum performance
                </div>
              </Label>
            </div>
          </RadioGroup>
        </div>
      </DialogContent>
    </Dialog>
  )
}
