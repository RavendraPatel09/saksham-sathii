import React, { useState } from 'react';
import { Calendar as CalendarIcon, MapPin, Users, Accessibility, Ear, Video, CheckCircle2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export const Events = () => {
  const [filter, setFilter] = useState('All');

  const events = [
    {
      title: "Inclusive Job Fair 2026",
      date: "August 15, 2026",
      time: "10:00 AM - 4:00 PM",
      mode: "Offline",
      location: "Pragati Maidan, New Delhi",
      image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=60",
      seats: 120,
      tags: ["Wheelchair Accessible", "Sign-Language"],
      icon: Accessibility,
      price: "Free"
    },
    {
      title: "Accessibility Hackathon",
      date: "September 5, 2026",
      time: "9:00 AM - 9:00 PM",
      mode: "Online",
      location: "Virtual (Zoom)",
      image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&auto=format&fit=crop&q=60",
      seats: 500,
      tags: ["Live Captions", "Screen-Reader Friendly"],
      icon: Video,
      price: "Free"
    },
    {
      title: "Government Scholarship Camp",
      date: "October 10, 2026",
      time: "11:00 AM - 2:00 PM",
      mode: "Offline",
      location: "Community Center, Mumbai",
      image: "https://images.unsplash.com/photo-1577896851231-70ef18881754?w=800&auto=format&fit=crop&q=60",
      seats: 50,
      tags: ["Sign-Language", "Wheelchair Accessible"],
      icon: Ear,
      price: "Free"
    }
  ];

  const filters = ["All", "Online", "Offline", "Wheelchair Accessible", "Sign-Language", "Free"];

  const filteredEvents = events.filter(e => {
    if (filter === "All") return true;
    if (filter === "Online" || filter === "Offline") return e.mode === filter;
    if (filter === "Free") return e.price === "Free";
    return e.tags.includes(filter);
  });

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Events & Opportunities 🎉</h1>
        <p className="text-xl text-muted-foreground">Discover inclusive job fairs, hackathons, and workshops tailored for you.</p>
      </div>

      <div className="flex flex-wrap gap-2 mb-8">
        {filters.map(f => (
          <Button 
            key={f} 
            variant={filter === f ? 'default' : 'outline'}
            onClick={() => setFilter(f)}
            className="rounded-full"
          >
            {f}
          </Button>
        ))}
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEvents.map((event, i) => (
          <Card key={i} className="premium-card overflow-hidden flex flex-col">
            <div className="h-48 overflow-hidden relative">
              <img src={event.image} alt={event.title} className="w-full h-full object-cover transition-transform hover:scale-105" />
              <Badge className="absolute top-3 right-3 bg-white/90 text-black shadow-md backdrop-blur-md border-0">
                {event.mode}
              </Badge>
            </div>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl">{event.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 flex-1 pb-2">
              <div className="flex items-center text-sm text-muted-foreground">
                <CalendarIcon className="w-4 h-4 mr-2 text-primary" /> {event.date} • {event.time}
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <MapPin className="w-4 h-4 mr-2 text-primary" /> {event.location}
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <Users className="w-4 h-4 mr-2 text-primary" /> {event.seats} seats remaining
              </div>
              
              <div className="flex flex-wrap gap-2 pt-2">
                {event.tags.map((tag, j) => (
                  <Badge key={j} variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20">
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
            <CardFooter className="pt-2 flex gap-2">
              <Button className="flex-1 bg-gradient-to-r from-primary to-indigo-600">
                <CheckCircle2 className="w-4 h-4 mr-2" /> Register
              </Button>
              <Button variant="outline" className="flex-1">Save</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};
