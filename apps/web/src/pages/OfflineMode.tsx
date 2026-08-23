import React from 'react';
import { Wifi, WifiOff, Download, HardDrive, FileText, Briefcase, PlayCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useOffline } from '@/context/OfflineContext';

export const OfflineMode = () => {
  const { isOffline, setIsOffline, syncStatus, lastSynced, simulateSync } = useOffline();

  const offlineItems = [
    { title: "Frontend Development Course", type: "Course", icon: PlayCircle, size: "125 MB" },
    { title: "React Interview Questions", type: "Saved", icon: FileText, size: "2.4 MB" },
    { title: "Software Engineer - Microsoft", type: "Job", icon: Briefcase, size: "1.1 MB" },
    { title: "My Master Resume", type: "Resume", icon: FileText, size: "4.5 MB" }
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className={`p-3 rounded-full ${isOffline ? 'bg-orange-500/20' : 'bg-emerald-500/20'}`}>
            {isOffline ? <WifiOff className="w-8 h-8 text-orange-500" /> : <Wifi className="w-8 h-8 text-emerald-500" />}
          </div>
          <div>
            <h1 className="text-3xl font-bold">Offline & Connectivity</h1>
            <p className="text-muted-foreground">Manage your offline downloads and sync status.</p>
          </div>
        </div>
        <div className="flex items-center gap-3 bg-muted/50 p-2 rounded-xl border">
          <span className="text-sm font-medium ml-2">Offline Mode</span>
          <input 
            type="checkbox" 
            className="toggle toggle-primary"
            checked={isOffline}
            onChange={(e) => setIsOffline(e.target.checked)}
          />
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <Card className="premium-card col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="w-5 h-5 text-primary" /> Downloaded Content
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {offlineItems.map((item, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 p-2 rounded-md">
                    <item.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm">{item.title}</h4>
                    <p className="text-xs text-muted-foreground">{item.type} • {item.size}</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="text-destructive hover:bg-destructive/10">Remove</Button>
              </div>
            ))}
            <Button variant="outline" className="w-full mt-2" disabled={isOffline}>
              <Download className="w-4 h-4 mr-2" /> Download More Content
            </Button>
          </CardContent>
        </Card>

        <Card className="premium-card h-fit">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HardDrive className="w-5 h-5 text-primary" /> Storage & Sync
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="font-medium">Local Storage</span>
                <span className="text-muted-foreground">133 MB / 500 MB</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-primary h-2 rounded-full" style={{ width: '25%' }}></div>
              </div>
            </div>

            <div className="p-4 bg-primary/5 rounded-xl border border-primary/10 space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="font-semibold">Sync Status</span>
                {syncStatus === 'synced' && <span className="text-emerald-500 font-bold">Up to date</span>}
                {syncStatus === 'syncing' && <span className="text-primary font-bold animate-pulse">Syncing...</span>}
                {syncStatus === 'offline' && <span className="text-orange-500 font-bold">Paused (Offline)</span>}
              </div>
              <p className="text-xs text-muted-foreground">Last synced: {lastSynced ? new Date(lastSynced).toLocaleString() : 'Never'}</p>
              <Button 
                size="sm" 
                className="w-full bg-gradient-to-r from-primary to-indigo-600" 
                disabled={isOffline || syncStatus === 'syncing'}
                onClick={simulateSync}
              >
                Sync Now
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
