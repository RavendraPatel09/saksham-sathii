import React, { useState } from 'react';
import { Settings, Eye, Type, Activity, Volume2, Globe } from 'lucide-react';
import { useAccessibility } from '@/context/AccessibilityContext';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export const AccessibilitySwitcher = () => {
  const { prefs, updatePrefs } = useAccessibility();
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={
        <Button
          variant="outline"
          size="icon"
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg border-2 border-primary bg-background hover:bg-primary/10 z-50"
          aria-label="Accessibility Settings"
        >
          <Settings className="h-6 w-6 text-primary" />
        </Button>
      } />
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <Settings className="h-6 w-6 text-primary" />
            Accessibility Panel
          </DialogTitle>
          <DialogDescription>
            Customize your experience to suit your needs. Preferences are saved automatically.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <Label htmlFor="highContrast" className="text-base flex items-center gap-2">
                <Eye className="h-4 w-4" /> High Contrast Mode
              </Label>
              <span className="text-sm text-muted-foreground">Increases visibility of elements</span>
            </div>
            <Switch
              id="highContrast"
              checked={prefs.highContrast}
              onCheckedChange={(checked) => updatePrefs({ highContrast: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <Label htmlFor="largeText" className="text-base flex items-center gap-2">
                <Type className="h-4 w-4" /> Large Text
              </Label>
              <span className="text-sm text-muted-foreground">Increases base font size globally</span>
            </div>
            <Switch
              id="largeText"
              checked={prefs.largeText}
              onCheckedChange={(checked) => updatePrefs({ largeText: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <Label htmlFor="dyslexiaFont" className="text-base flex items-center gap-2">
                <Type className="h-4 w-4" /> Dyslexia-friendly Font
              </Label>
              <span className="text-sm text-muted-foreground">Uses OpenDyslexic font</span>
            </div>
            <Switch
              id="dyslexiaFont"
              checked={prefs.dyslexiaFont}
              onCheckedChange={(checked) => updatePrefs({ dyslexiaFont: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <Label htmlFor="reducedMotion" className="text-base flex items-center gap-2">
                <Activity className="h-4 w-4" /> Reduced Motion
              </Label>
              <span className="text-sm text-muted-foreground">Minimizes animations</span>
            </div>
            <Switch
              id="reducedMotion"
              checked={prefs.reducedMotion}
              onCheckedChange={(checked) => updatePrefs({ reducedMotion: checked })}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <Label htmlFor="screenReader" className="text-base flex items-center gap-2">
                <Volume2 className="h-4 w-4" /> Screen-reader Mode
              </Label>
              <span className="text-sm text-muted-foreground">Optimizes UI for screen readers</span>
            </div>
            <Switch
              id="screenReader"
              checked={false}
              onCheckedChange={() => {}}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label className="text-base flex items-center gap-2">
              <Globe className="h-4 w-4" /> Language Selector
            </Label>
            <Select value={prefs.language || "en"} onValueChange={(val) => updatePrefs({ language: val as string })}>
              <SelectTrigger>
                <SelectValue placeholder="Select Language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="hi">Hindi (हिंदी)</SelectItem>
                <SelectItem value="ta">Tamil (தமிழ்)</SelectItem>
                <SelectItem value="te">Telugu (తెలుగు)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
