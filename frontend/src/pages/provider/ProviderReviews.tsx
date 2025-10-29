import { useEffect, useMemo, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLocation } from "react-router-dom";
import { User, Wrench, Calendar as CalendarIcon, Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type Review = {
  reviewId: number;
  bookingId: number;
  userId: number;
  providerId: number;
  rating: number;
  comment?: string;
  createdAt?: string;
};

type Session = { id: number; role: "SERVICE_PROVIDER" | "USER" | "ADMIN" };

const BACKEND_BASE = import.meta.env.VITE_API_BASE?.toString() || "http://localhost:8080";

export default function ProviderReviews() {
  const location = useLocation();
  const { toast } = useToast();

  const session: Session | null = useMemo(() => {
    try { const raw = localStorage.getItem("userData"); return raw ? JSON.parse(raw) : null; } catch { return null; }
  }, []);
  const providerId = session?.id;

  const menuItems = [
    { label: "Profile", icon: <User className="h-5 w-5" />, path: "/provider-dashboard" },
    { label: "My Services", icon: <Wrench className="h-5 w-5" />, path: "/provider-dashboard/services" },
    { label: "Booking Requests", icon: <CalendarIcon className="h-5 w-5" />, path: "/provider-dashboard/bookings" },
    { label: "Reviews", icon: <Star className="h-5 w-5" />, path: "/provider-dashboard/reviews" },
  ];

  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    try {
      if (!providerId) return;
      setLoading(true);
      const res = await fetch(`${BACKEND_BASE}/api/provider/reviews/${providerId}`, { 
        headers: { Accept: "application/json" }, 
        mode: "cors" 
      });
      if (!res.ok) throw new Error(`Failed to load (status ${res.status})`);
      setReviews(await res.json());
    } catch (e: any) {
      toast({ title: "Error", description: e?.message || "Failed to load reviews", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [providerId]);

  return (
    <DashboardLayout title="Provider Dashboard" menuItems={menuItems} currentPath={location.pathname}>
      <Card>
        <CardHeader><CardTitle>Reviews</CardTitle></CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Loading…</div>
          ) : reviews.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">No reviews yet.</div>
          ) : (
            <div className="space-y-4">
              {reviews.map((r) => (
                <div key={r.reviewId} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className={`h-4 w-4 ${i < r.rating ? "fill-accent text-accent" : "text-muted-foreground"}`} />
                      ))}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {r.createdAt ? new Date(r.createdAt).toLocaleDateString() : ""}
                    </span>
                  </div>
                  {r.comment && <p className="text-sm mt-2">{r.comment}</p>}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
