
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";

interface NicotineIntakeFormProps {
  onSubmit: (values: {
    nicotineType: string;
    productName?: string;
    amount: string;
    unit: string;
    energyImpact: number;
    moodImpact: number;
    cravingsBefore: number;
    urgeTriggers?: string;
    location?: string;
    notes?: string;
  }) => void;
  isSubmitting?: boolean;
}

export function NicotineIntakeForm({ onSubmit, isSubmitting = false }: NicotineIntakeFormProps) {
  const [values, setValues] = useState({
    nicotineType: "cigarette",
    productName: "",
    amount: "",
    unit: "cigarettes",
    energyImpact: 5,
    moodImpact: 5,
    cravingsBefore: 5,
    urgeTriggers: "",
    location: "",
    notes: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(values);
  };

  const handleNicotineTypeChange = (type: string) => {
    let unit = "cigarettes";
    switch (type) {
      case "cigarette":
        unit = "cigarettes";
        break;
      case "vape":
        unit = "puffs";
        break;
      case "snus":
      case "nicotine_pouch":
        unit = "pouches";
        break;
      case "gum":
        unit = "pieces";
        break;
      case "patch":
        unit = "patches";
        break;
      case "lozenge":
        unit = "lozenges";
        break;
      case "cigar":
        unit = "cigars";
        break;
      default:
        unit = "units";
    }

    setValues({
      ...values,
      nicotineType: type,
      unit,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Nicotine Type</Label>
          <Select
            value={values.nicotineType}
            onValueChange={handleNicotineTypeChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select nicotine type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="cigarette">Cigarettes</SelectItem>
              <SelectItem value="vape">Vape/E-cigarette</SelectItem>
              <SelectItem value="snus">Snus</SelectItem>
              <SelectItem value="nicotine_pouch">Nicotine Pouch</SelectItem>
              <SelectItem value="gum">Nicotine Gum</SelectItem>
              <SelectItem value="patch">Nicotine Patch</SelectItem>
              <SelectItem value="lozenge">Nicotine Lozenge</SelectItem>
              <SelectItem value="cigar">Cigar</SelectItem>
              <SelectItem value="pipe">Pipe</SelectItem>
              <SelectItem value="chew">Chewing Tobacco</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Product Name (Optional)</Label>
          <Input
            placeholder="e.g., Marlboro Light, Zyn, JUUL"
            value={values.productName}
            onChange={(e) => setValues({ ...values, productName: e.target.value })}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Amount</Label>
          <Input
            type="number"
            placeholder="Quantity"
            min="0"
            step="0.5"
            value={values.amount}
            onChange={(e) => setValues({ ...values, amount: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label>Unit</Label>
          <Input
            value={values.unit}
            onChange={(e) => setValues({ ...values, unit: e.target.value })}
            placeholder="e.g., cigarettes, puffs, etc."
          />
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between">
          <Label>Energy Impact</Label>
          <span className="text-sm text-muted-foreground">{values.energyImpact}/10</span>
        </div>
        <Slider
          min={1}
          max={10}
          step={1}
          value={[values.energyImpact]}
          onValueChange={(val) => setValues({ ...values, energyImpact: val[0] })}
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Energy decrease</span>
          <span>No change</span>
          <span>Energy boost</span>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between">
          <Label>Mood Impact</Label>
          <span className="text-sm text-muted-foreground">{values.moodImpact}/10</span>
        </div>
        <Slider
          min={1}
          max={10}
          step={1}
          value={[values.moodImpact]}
          onValueChange={(val) => setValues({ ...values, moodImpact: val[0] })}
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Mood worsened</span>
          <span>No change</span>
          <span>Mood improved</span>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between">
          <Label>Craving Intensity Before Use</Label>
          <span className="text-sm text-muted-foreground">{values.cravingsBefore}/10</span>
        </div>
        <Slider
          min={1}
          max={10}
          step={1}
          value={[values.cravingsBefore]}
          onValueChange={(val) => setValues({ ...values, cravingsBefore: val[0] })}
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Mild</span>
          <span>Moderate</span>
          <span>Intense</span>
        </div>
      </div>

      <div className="space-y-2">
        <Label>What Triggered Your Urge? (Optional, comma separated)</Label>
        <Input
          placeholder="e.g., Stress, After meal, Social situation"
          value={values.urgeTriggers}
          onChange={(e) => setValues({ ...values, urgeTriggers: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label>Location (Optional)</Label>
        <Input
          placeholder="e.g., Home, Work, Car"
          value={values.location}
          onChange={(e) => setValues({ ...values, location: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label>Notes (Optional)</Label>
        <Textarea
          placeholder="Any additional notes about this usage"
          value={values.notes}
          onChange={(e) => setValues({ ...values, notes: e.target.value })}
        />
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Logging..." : "Log Nicotine Use"}
      </Button>
    </form>
  );
}
