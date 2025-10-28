import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Search, MapPin, Star, Clock, DollarSign, Calendar as CalendarIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

const SearchServices = () => {
  const { toast } = useToast();
  const [serviceType, setServiceType] = useState("");
  const [userLocation, setUserLocation] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedProvider, setSelectedProvider] = useState<number | null>(null);

  const mockProviders = [
    {
      id: 1,
      name: "John Smith",
      service: "Electrician",
      rating: 4.8,
      experience: "5 years",
      price: "$50/hour",
      available: true,
      location: "Downtown",
      completedJobs: 120,
      reviews: 45,
      description: "Licensed electrician with expertise in residential and commercial electrical work.",
    },
    {
      id: 2,
      name: "Sarah Johnson",
      service: "Plumber",
      rating: 4.9,
      experience: "7 years",
      price: "$60/hour",
      available: true,
      location: "Midtown",
      completedJobs: 200,
      reviews: 78,
      description: "Professional plumber specializing in emergency repairs and installations.",
    },
    {
      id: 3,
      name: "Mike Wilson",
      service: "Mechanic",
      rating: 4.7,
      experience: "10 years",
      price: "$70/hour",
      available: false,
      location: "Uptown",
      completedJobs: 350,
      reviews: 120,
      description: "Certified mechanic with extensive experience in all vehicle types.",
    },
    {
      id: 4,
      name: "Emily Davis",
      service: "Tutor",
      rating: 4.9,
      experience: "4 years",
      price: "$40/hour",
      available: true,
      location: "Downtown",
      completedJobs: 85,
      reviews: 32,
      description: "Experienced tutor in Mathematics, Science, and English for all grades.",
    },
  ];

  const autoDetectLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        () => {
          setUserLocation("Downtown"); // Simulated location
          toast({
            title: "Location detected",
            description: "Your location has been detected successfully",
          });
        },
        () => {
          toast({
            title: "Error",
            description: "Unable to detect location. Please enter manually.",
            variant: "destructive",
          });
        }
      );
    } else {
      toast({
        title: "Error",
        description: "Geolocation is not supported by your browser",
        variant: "destructive",
      });
    }
  };

  const handleBooking = (provider: typeof mockProviders[0]) => {
    if (!selectedDate || !selectedTime) {
      toast({
        title: "Error",
        description: "Please select both date and time",
        variant: "destructive",
      });
      return;
    }

    // Add booking to localStorage
    const bookings = JSON.parse(localStorage.getItem("userBookings") || "[]");
    const newBooking = {
      id: Date.now(),
      provider: provider.name,
      service: provider.service,
      date: selectedDate,
      time: selectedTime,
      status: "pending",
      price: provider.price,
      location: provider.location,
    };
    bookings.push(newBooking);
    localStorage.setItem("userBookings", JSON.stringify(bookings));

    toast({
      title: "Success!",
      description: `Booking request sent to ${provider.name}`,
    });

    setSelectedDate("");
    setSelectedTime("");
    setSelectedProvider(null);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Search Services</h1>
        <p className="text-muted-foreground">Find trusted service providers near you</p>
      </div>

      {/* Search Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Search Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Service Type</Label>
              <Select value={serviceType} onValueChange={setServiceType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select service type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Services</SelectItem>
                  <SelectItem value="electrician">Electrician</SelectItem>
                  <SelectItem value="plumber">Plumber</SelectItem>
                  <SelectItem value="mechanic">Mechanic</SelectItem>
                  <SelectItem value="tutor">Tutor</SelectItem>
                  <SelectItem value="cleaner">Cleaner</SelectItem>
                  <SelectItem value="carpenter">Carpenter</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Location</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="Enter your location"
                  value={userLocation}
                  onChange={(e) => setUserLocation(e.target.value)}
                />
                <Button type="button" variant="outline" onClick={autoDetectLocation}>
                  <MapPin className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
          <Button className="w-full sm:w-auto mt-4">
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>
        </CardContent>
      </Card>

      {/* Service Providers */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-foreground">Available Service Providers</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {mockProviders.map((provider) => (
            <Card key={provider.id} className="hover:shadow-lg transition-all">
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-lg text-foreground">{provider.name}</h3>
                      <p className="text-sm text-muted-foreground">{provider.service}</p>
                    </div>
                    <div className="flex items-center gap-1 bg-accent/10 px-2 py-1 rounded">
                      <Star className="h-4 w-4 text-accent fill-accent" />
                      <span className="text-sm font-medium">{provider.rating}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>{provider.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>{provider.experience} experience</span>
                    </div>
                    <div className="flex items-center gap-2 text-foreground font-semibold">
                      <DollarSign className="h-4 w-4" />
                      <span>{provider.price}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={provider.available ? "default" : "secondary"}>
                        {provider.available ? "Available" : "Unavailable"}
                      </Badge>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-border">
                    <p className="text-xs text-muted-foreground mb-2">{provider.description}</p>
                    <div className="flex gap-4 text-xs text-muted-foreground">
                      <span>{provider.completedJobs} jobs completed</span>
                      <span>{provider.reviews} reviews</span>
                    </div>
                  </div>

                  <Dialog open={selectedProvider === provider.id} onOpenChange={(open) => !open && setSelectedProvider(null)}>
                    <DialogTrigger asChild>
                      <Button 
                        className="w-full" 
                        disabled={!provider.available}
                        onClick={() => setSelectedProvider(provider.id)}
                      >
                        <CalendarIcon className="h-4 w-4 mr-2" />
                        Book Now
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Book {provider.service} Service</DialogTitle>
                        <DialogDescription>
                          Schedule an appointment with {provider.name}
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="p-4 bg-muted/50 rounded-lg space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Service:</span>
                            <span className="font-medium">{provider.service}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Rate:</span>
                            <span className="font-medium">{provider.price}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Location:</span>
                            <span className="font-medium">{provider.location}</span>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label>Select Date</Label>
                          <Input
                            type="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            min={new Date().toISOString().split('T')[0]}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Select Time</Label>
                          <Select value={selectedTime} onValueChange={setSelectedTime}>
                            <SelectTrigger>
                              <SelectValue placeholder="Choose time slot" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="09:00">09:00 AM</SelectItem>
                              <SelectItem value="10:00">10:00 AM</SelectItem>
                              <SelectItem value="11:00">11:00 AM</SelectItem>
                              <SelectItem value="14:00">02:00 PM</SelectItem>
                              <SelectItem value="15:00">03:00 PM</SelectItem>
                              <SelectItem value="16:00">04:00 PM</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <Button
                          className="w-full"
                          onClick={() => handleBooking(provider)}
                        >
                          Confirm Booking
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchServices;
