import { useEffect, useMemo, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useLocation } from "react-router-dom";
import { User, Wrench, Calendar as CalendarIcon, Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type Provider = {
  providerId: number;
  fullName: string;
  email?: string;
  mobile?: string;
  serviceType?: string;
  experience?: number;
  price?: number | string;
  availability?: string;
  location?: string;
};

type Session = { id: number; role: "SERVICE_PROVIDER" | "USER" | "ADMIN" };

const BACKEND_BASE = import.meta.env.VITE_API_BASE?.toString() || "http://localhost:8080";

export default function MyServices() {
  const { toast } = useToast();
  const location = useLocation();

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

  const [form, setForm] = useState<Provider | null>(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);

  const loadProfile = async () => {
    try {
      if (!providerId) return;
      setLoading(true);
      const res = await fetch(`${BACKEND_BASE}/api/provider/profile/${providerId}`, { 
        headers: { Accept: "application/json" }, 
        mode: "cors" 
      });
      if (res.ok) {
        setForm(await res.json());
      } else {
        toast({ title: "Error", description: "Failed to load profile", variant: "destructive" });
      }
    } catch (e: any) {
      toast({ title: "Error", description: e?.message || "Failed to load profile", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const saveProfile = async () => {
    try {
      if (!providerId || !form) return;
      setSaving(true);
      const res = await fetch(`${BACKEND_BASE}/api/provider/profile/${providerId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        mode: "cors",
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "Failed to save");
      }
      setForm(await res.json());
      toast({ title: "Saved", description: "Profile updated successfully" });
    } catch (e: any) {
      toast({ title: "Error", description: e?.message || "Failed to save profile", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => { loadProfile(); /* eslint-disable-next-line */ }, [providerId]);

  return (
    <DashboardLayout title="Provider Dashboard" menuItems={menuItems} currentPath={location.pathname}>
      <Card>
        <CardHeader><CardTitle>My Services</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          {loading ? (
            <p className="text-muted-foreground text-center py-8">Loading…</p>
          ) : !form ? (
            <p className="text-muted-foreground text-center py-8">Profile not found</p>
          ) : (
            <>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Full Name</Label>
                  <Input value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input type="email" value={form.email || ""} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Mobile</Label>
                  <Input value={form.mobile || ""} onChange={(e) => setForm({ ...form, mobile: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Service Type</Label>
                  <Input value={form.serviceType || ""} onChange={(e) => setForm({ ...form, serviceType: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Experience (years)</Label>
                  <Input type="number" value={form.experience ?? 0} onChange={(e) => setForm({ ...form, experience: Number(e.target.value) })} />
                </div>
                <div className="space-y-2">
                  <Label>Price</Label>
                  <Input value={String(form.price ?? "")} onChange={(e) => setForm({ ...form, price: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Availability</Label>
                  <Input value={form.availability || ""} onChange={(e) => setForm({ ...form, availability: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Location</Label>
                  <Input value={form.location || ""} onChange={(e) => setForm({ ...form, location: e.target.value })} />
                </div>
              </div>
              <Button onClick={saveProfile} disabled={saving}>
                {saving ? "Saving…" : "Save Changes"}
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
