import React from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Bell,
  Moon,
  Sun,
  Globe,
  Lock,
  User,
  Shield,
  Clock,
  Battery,
  Brain,
  Coffee,
  Dumbbell
} from 'lucide-react';

export const WebappSettings: React.FC = () => {
  const settingSections = [
    {
      title: "Account",
      icon: User,
      settings: [
        { 
          label: "Profile Information",
          type: "form",
          fields: [
            { name: "name", label: "Name", type: "text" },
            { name: "email", label: "Email", type: "email" },
            { name: "timezone", label: "Timezone", type: "select" }
          ]
        },
        { 
          label: "Subscription",
          type: "info",
          value: "Premium Plan",
          action: "Manage"
        },
        { 
          label: "Data Export",
          type: "button",
          action: "Export"
        }
      ]
    },
    {
      title: "Notifications",
      icon: Bell,
      settings: [
        { label: "Energy Reminders", type: "toggle", enabled: true },
        { label: "Focus Timer Alerts", type: "toggle", enabled: true },
        { label: "Sleep Schedule", type: "toggle", enabled: true },
        { label: "Exercise Reminders", type: "toggle", enabled: false }
      ]
    },
    {
      title: "Energy Tracking",
      icon: Battery,
      settings: [
        { label: "Auto-track Energy Levels", type: "toggle", enabled: true },
        { label: "Daily Energy Reports", type: "toggle", enabled: true },
        { label: "Energy Optimization Tips", type: "toggle", enabled: true }
      ]
    },
    {
      title: "Focus & Productivity",
      icon: Brain,
      settings: [
        { label: "Focus Session Duration", type: "select", options: ["25min", "45min", "60min"] },
        { label: "Break Reminders", type: "toggle", enabled: true },
        { label: "Focus Mode Settings", type: "link" }
      ]
    },
    {
      title: "Wellness",
      icon: Dumbbell,
      settings: [
        { label: "Exercise Tracking", type: "toggle", enabled: true },
        { label: "Nutrition Logging", type: "toggle", enabled: true },
        { label: "Sleep Analysis", type: "toggle", enabled: true },
        { label: "Mental Health Check-ins", type: "toggle", enabled: true }
      ]
    },
    {
      title: "Privacy & Security",
      icon: Shield,
      settings: [
        { label: "Two-Factor Authentication", type: "toggle", enabled: false },
        { label: "Data Sharing", type: "toggle", enabled: true },
        { label: "Privacy Settings", type: "link" }
      ]
    }
  ];

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">Settings</h1>
      
      <div className="grid gap-6">
        {settingSections.map((section, index) => {
          const Icon = section.icon;
          return (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon className="h-5 w-5 text-primary" />
                  {section.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {section.settings.map((setting, settingIndex) => (
                    <div key={settingIndex} className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>{setting.label}</Label>
                        {setting.type === 'form' && (
                          <div className="space-y-2 mt-2">
                            {setting.fields?.map((field, fieldIndex) => (
                              <div key={fieldIndex} className="space-y-1">
                                <Label>{field.label}</Label>
                                {field.type === 'select' ? (
                                  <Select>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select timezone" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="utc">UTC</SelectItem>
                                      <SelectItem value="est">EST</SelectItem>
                                      <SelectItem value="pst">PST</SelectItem>
                                    </SelectContent>
                                  </Select>
                                ) : (
                                  <Input type={field.type} placeholder={field.label} />
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      {setting.type === 'toggle' && (
                        <Switch checked={setting.enabled} />
                      )}
                      {setting.type === 'button' && (
                        <Button>{setting.action}</Button>
                      )}
                      {setting.type === 'select' && (
                        <Select>
                          <SelectTrigger className="w-32">
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            {setting.options?.map((option, optionIndex) => (
                              <SelectItem key={optionIndex} value={option.toLowerCase()}>
                                {option}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                      {setting.type === 'info' && (
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">{setting.value}</span>
                          <Button variant="outline" size="sm">{setting.action}</Button>
                        </div>
                      )}
                      {setting.type === 'link' && (
                        <Button variant="ghost">Configure →</Button>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
