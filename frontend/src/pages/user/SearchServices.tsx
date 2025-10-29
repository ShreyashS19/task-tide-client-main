import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Search as SearchIcon, MapPin, Star, Clock, DollarSign, Calendar as CalendarIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

type Provider = {
  providerId: number;
  fullName: string;
  serviceType: string;
  experience?: number;
  price?: number | string;
  availability?: string;
  location?: string;
};

type LoginSession = {
  id: number;
  role: "USER" | "SERVICE_PROVIDER" | "ADMIN";
  fullName?: string;
  email?: string;
  mobile?: string;
  redirectUrl?: string;
};

const BACKEND_BASE = import.meta.env.VITE_API_BASE?.toString() || "http://localhost:8080";

const SearchServices = () => {
  const { toast } = useToast();

  // Filters
  const [serviceType, setServiceType] = useState("");
  const [userLocation, setUserLocation] = useState("");

  // Data
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(false);

  // Booking state
  const [selectedProviderId, setSelectedProviderId] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");

  // Session
  const session: LoginSession | null = useMemo(() => {
    try {
      const raw = localStorage.getItem("userData");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }, []);

  const selectedProvider = useMemo(
    () => providers.find((p) => p.providerId === selectedProviderId) || null,
    [selectedProviderId, providers]
  );

  const autoDetectLocation = () => {
    if (!navigator.geolocation) {
      toast({
        title: "Error",
        description: "Geolocation is not supported by your browser",
        variant: "destructive",
      });
      return;
    }
    navigator.geolocation.getCurrentPosition(
      () => {
        // Demo: use a simple placeholder city
        setUserLocation("Downtown");
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
  };

  const fetchProviders = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (serviceType && serviceType !== "all") params.append("type", serviceType);
      if (userLocation) params.append("location", userLocation);

      const res = await fetch(`${BACKEND_BASE}/api/provider/search?${params.toString()}`, {
        method: "GET",
        headers: { Accept: "application/json" },
        mode: "cors",
      });

      if (!res.ok) {
        const errBody = await res.json().catch(() => ({}));
        throw new Error(errBody.message || `Search failed with status ${res.status}`);
      }

      const data = (await res.json()) as Provider[];
      setProviders(
        (data || []).map((p) => ({
          providerId: p.providerId,
          fullName: p.fullName,
          serviceType: p.serviceType,
          experience: p.experience,
          price: p.price,
          availability: p.availability,
          location: p.location,
        }))
      );
    } catch (e: any) {
      toast({
        title: "Error",
        description: e?.message || "Failed to fetch providers",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearchClick = async () => {
    await fetchProviders();
  };

  const handleBooking = async () => {
    try {
      if (!session?.id || session.role !== "USER") {
        toast({
          title: "Not logged in",
          description: "Please log in as a User to book a service.",
          variant: "destructive",
        });
        return;
      }
      if (!selectedProvider) {
        toast({ title: "Error", description: "No provider selected", variant: "destructive" });
        return;
      }
      if (!selectedDate || !selectedTime) {
        toast({
          title: "Error",
          description: "Please select both date and time",
          variant: "destructive",
        });
        return;
      }

      // Format time to HH:mm:ss if user picked HH:mm
      const time = /^\d{2}:\d{2}$/.test(selectedTime) ? `${selectedTime}:00` : selectedTime;

      const payload = {
        userId: session.id,
        providerId: selectedProvider.providerId,
        serviceType: selectedProvider.serviceType || serviceType || "Service",
        bookingDate: selectedDate, // yyyy-MM-dd
        bookingTime: time, // HH:mm:ss
      };

      const res = await fetch(`${BACKEND_BASE}/api/bookings`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        mode: "cors",
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errBody = await res.json().catch(() => ({}));
        throw new Error(errBody.message || `Booking failed with status ${res.status}`);
      }

      await res.json(); // booking object (unused here)
      toast({
        title: "Success!",
        description: `Booking created with ${selectedProvider.fullName}`,
      });

      // Reset dialog state
      setSelectedDate("");
      setSelectedTime("");
      setSelectedProviderId(null);
    } catch (e: any) {
      toast({
        title: "Error",
        description: e?.message || "Failed to create booking",
        variant: "destructive",
      });
    }
  };

  // Optional: auto-load providers once
  useEffect(() => {
    // Initial fetch: show all or by default filters
    fetchProviders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
          <Button className="w-full sm:w-auto mt-4" onClick={handleSearchClick} disabled={loading}>
            <SearchIcon className="h-4 w-4 mr-2" />
            {loading ? "Searching..." : "Search"}
          </Button>
        </CardContent>
      </Card>

      {/* Service Providers */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-foreground">Available Service Providers</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {providers.map((provider) => (
            <Card key={provider.providerId} className="hover:shadow-lg transition-all">
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-lg text-foreground">{provider.fullName}</h3>
                      <p className="text-sm text-muted-foreground">{provider.serviceType}</p>
                    </div>
                    <div className="flex items-center gap-1 bg-accent/10 px-2 py-1 rounded">
                      <Star className="h-4 w-4 text-accent fill-accent" />
                      <span className="text-sm font-medium">{/* rating placeholder */}4.5</span>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>{provider.location || "-"}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>{provider.experience ?? 0} years</span>
                    </div>
                    <div className="flex items-center gap-2 text-foreground font-semibold">
                      <DollarSign className="h-4 w-4" />
                      <span>
                        {typeof provider.price === "number" ? `₹${provider.price}` : provider.price ?? "₹0"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={(provider.availability || "").toLowerCase().includes("unavail") ? "secondary" : "default"}>
                        {provider.availability ?? "Available"}
                      </Badge>
                    </div>
                  </div>

                  <Dialog
                    open={selectedProviderId === provider.providerId}
                    onOpenChange={(open) => !open && setSelectedProviderId(null)}
                  >
                    <DialogTrigger asChild>
                      <Button
                        className="w-full"
                        onClick={() => setSelectedProviderId(provider.providerId)}
                      >
                        <CalendarIcon className="h-4 w-4 mr-2" />
                        Book Now
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Book {provider.serviceType} Service</DialogTitle>
                        <DialogDescription>Schedule an appointment with {provider.fullName}</DialogDescription>
                      </DialogHeader>

                      <div className="space-y-4">
                        <div className="p-4 bg-muted/50 rounded-lg space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Service:</span>
                            <span className="font-medium">{provider.serviceType}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Rate:</span>
                            <span className="font-medium">
                              {typeof provider.price === "number" ? `₹${provider.price}` : provider.price ?? "₹0"}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Location:</span>
                            <span className="font-medium">{provider.location || "-"}</span>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label>Select Date</Label>
                          <Input
                            type="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            min={new Date().toISOString().split("T")[0]}
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

                        <Button className="w-full" onClick={handleBooking}>
                          Confirm Booking
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>
          ))}

          {!loading && providers.length === 0 && (
            <div className="col-span-full text-center text-muted-foreground py-12">
              No providers found. Adjust filters and search again.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchServices;
