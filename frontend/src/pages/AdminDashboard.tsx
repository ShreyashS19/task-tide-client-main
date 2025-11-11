import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import DashboardLayout from "../components/DashboardLayout";
import { Card, CardContent } from "../components/ui/card";
import { TrendingUp, Users, Wrench, Calendar, AlertCircle } from "lucide-react";

const AdminDashboard = () => {
  const location = useLocation();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProviders: 0,
    totalBookings: 0,
    activeComplaints: 0,
  });
  const [loading, setLoading] = useState(true);

  // Fetch stats from backend
  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const [usersRes, providersRes, bookingsRes, complaintsRes] = await Promise.all([
          fetch("/api/admin/users"),
          fetch("/api/admin/providers"),
          fetch("/api/admin/bookings"),
          fetch("/api/admin/complaints"),
        ]);
        const users = await usersRes.json();
        const providers = await providersRes.json();
        const bookings = await bookingsRes.json();
        const complaints = await complaintsRes.json();
        setStats({
          totalUsers: users.length,
          totalProviders: providers.length,
          totalBookings: bookings.length,
          activeComplaints: complaints.filter(c => c.status === "OPEN" || c.status === "Active").length,
        });
      } catch (error) {
        // You may want to add error UI/toast here
        setStats({
          totalUsers: 0,
          totalProviders: 0,
          totalBookings: 0,
          activeComplaints: 0,
        });
      }
      setLoading(false);
    };
    fetchStats();
  }, []);

  const menuItems = [
    { label: "Dashboard", icon: <TrendingUp className="h-5 w-5" />, path: "admin-dashboard" },
    { label: "Manage Users", icon: <Users className="h-5 w-5" />, path: "admin-dashboard/users" },
    { label: "Manage Providers", icon: <Wrench className="h-5 w-5" />, path: "admin-dashboard/providers" },
    { label: "Booking Overview", icon: <Calendar className="h-5 w-5" />, path: "admin-dashboard/bookings" },
    { label: "Complaints", icon: <AlertCircle className="h-5 w-5" />, path: "admin-dashboard/complaints" },
  ];

  return (
    <DashboardLayout title="Admin Dashboard" menuItems={menuItems} currentPath={location.pathname}>
      <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
      <p className="text-muted-foreground mb-6">Manage your platform effectively</p>
      {loading ? (
        <div>Loading overall stats...</div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6 flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{stats.totalUsers}</p>
                <p className="text-sm text-muted-foreground">Total Users</p>
              </div>
              <Users className="h-8 w-8 text-primary" />
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{stats.totalProviders}</p>
                <p className="text-sm text-muted-foreground">Service Providers</p>
              </div>
              <Wrench className="h-8 w-8 text-accent" />
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{stats.totalBookings}</p>
                <p className="text-sm text-muted-foreground">Total Bookings</p>
              </div>
              <Calendar className="h-8 w-8 text-primary" />
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{stats.activeComplaints}</p>
                <p className="text-sm text-muted-foreground">Active Complaints</p>
              </div>
              <AlertCircle className="h-8 w-8 text-destructive" />
            </CardContent>
          </Card>
        </div>
      )}
    </DashboardLayout>
  );
};

export default AdminDashboard;
