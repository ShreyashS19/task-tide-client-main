import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon, Clock, MapPin, User as UserIcon, DollarSign, CheckCircle, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type Booking = {
  bookingId: number;
  userId: number;
  providerId: number;
  serviceType: string;
  bookingDate: string;   // ISO date from backend
  bookingTime: string;   // HH:mm:ss from backend
  status: "PENDING" | "ACCEPTED" | "REJECTED" | "COMPLETED" | "CANCELLED";
  createdAt?: string;
};

type LoginSession = {
  id: number;
  role: "USER" | "SERVICE_PROVIDER" | "ADMIN";
  fullName?: string;
  email?: string;
  mobile?: string;
};

const BACKEND_BASE = import.meta.env.VITE_API_BASE?.toString() || "http://localhost:8080";

const MyBookings = () => {
  const { toast } = useToast();

  const session: LoginSession | null = useMemo(() => {
    try {
      const raw = localStorage.getItem("userData");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }, []);

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);

  const getStatusBadge = (status: Booking["status"]) => {
    const map: Record<Booking["status"], { variant: "default" | "secondary" | "destructive" | "outline"; icon?: JSX.Element; label: string }> = {
      PENDING:   { variant: "secondary",  label: "Pending" },
      ACCEPTED:  { variant: "default",    label: "Accepted",  icon: <CheckCircle className="h-3 w-3 mr-1" /> },
      REJECTED:  { variant: "destructive",label: "Rejected",  icon: <XCircle className="h-3 w-3 mr-1" /> },
      COMPLETED: { variant: "outline",    label: "Completed", icon: <CheckCircle className="h-3 w-3 mr-1" /> },
      CANCELLED: { variant: "destructive",label: "Cancelled", icon: <XCircle className="h-3 w-3 mr-1" /> },
    };
    const cfg = map[status];
    return (
      <Badge variant={cfg.variant} className="flex items-center w-fit">
        {cfg.icon}{cfg.label}
      </Badge>
    );
  };

  const fetchBookings = async () => {
    try {
      if (!session?.id || session.role !== "USER") {
        toast({
          title: "Not logged in",
          description: "Please log in as a User to view bookings.",
          variant: "destructive",
        });
        return;
      }
      setLoading(true);
      const res = await fetch(`${BACKEND_BASE}/api/bookings/user/${session.id}`, {
        method: "GET",
        headers: { Accept: "application/json" },
        mode: "cors",
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || `Failed to load bookings (status ${res.status})`);
      }
      const data = (await res.json()) as Booking[];
      setBookings(data || []);
    } catch (e: any) {
      toast({ title: "Error", description: e?.message || "Could not load bookings", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  // Optional local cancel (does not call backend update; add PUT /api/bookings/{id}/status later)
  const handleCancel = (id: number) => {
    setBookings((prev) =>
      prev.map((b) => (b.bookingId === id ? { ...b, status: "CANCELLED" } as Booking : b))
    );
    toast({ title: "Booking Cancelled", description: "Your booking has been marked as cancelled." });
  };

  useEffect(() => {
    fetchBookings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const formatDate = (iso: string) => {
    try {
      const d = new Date(iso);
      if (!Number.isNaN(d.getTime())) {
        return d.toLocaleDateString(undefined, { weekday: "short", year: "numeric", month: "short", day: "numeric" });
      }
      return iso;
    } catch {
      return iso;
    }
  };

  const formatTime = (t: string) => {
    // Expect HH:mm or HH:mm:ss
    try {
      const [hh, mm] = t.split(":");
      const d = new Date();
      d.setHours(parseInt(hh, 10), parseInt(mm, 10), 0, 0);
      return d.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
    } catch {
      return t;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">My Bookings</h1>
        <p className="text-muted-foreground">Track and manage your service bookings</p>
      </div>

      {loading ? (
        <Card>
          <CardContent className="pt-6 text-center py-12">
            Loading bookings...
          </CardContent>
        </Card>
      ) : bookings.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center py-12">
            <CalendarIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No bookings yet</p>
            <p className="text-sm text-muted-foreground mt-2">Book a service to see your appointments here</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <Card key={booking.bookingId} className="hover:shadow-lg transition-all">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg">{booking.serviceType}</CardTitle>
                  {getStatusBadge(booking.status)}
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <UserIcon className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">Provider ID</p>
                        <p className="text-sm font-medium">{booking.providerId}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">Location</p>
                        <p className="text-sm font-medium">See provider card</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">Date</p>
                        <p className="text-sm font-medium">{formatDate(booking.bookingDate)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">Time</p>
                        <p className="text-sm font-medium">{formatTime(booking.bookingTime)}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {booking.status === "PENDING" && (
                  <div className="mt-4 pt-4 border-t border-border">
                    <Button variant="destructive" size="sm" onClick={() => handleCancel(booking.bookingId)}>
                      <XCircle className="h-4 w-4 mr-2" />
                      Cancel Booking
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBookings;
