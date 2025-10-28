import { useState } from "react";
import { useLocation } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { User, Wrench, Calendar, Star, CheckCircle, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ProviderDashboard = () => {
  const location = useLocation();
  const { toast } = useToast();
  const userData = JSON.parse(localStorage.getItem("userData") || "{}");

  const menuItems = [
    { label: "Profile", icon: <User className="h-5 w-5" />, path: "/provider-dashboard" },
    { label: "My Services", icon: <Wrench className="h-5 w-5" />, path: "/provider-dashboard/services" },
    { label: "Booking Requests", icon: <Calendar className="h-5 w-5" />, path: "/provider-dashboard/bookings" },
    { label: "Reviews", icon: <Star className="h-5 w-5" />, path: "/provider-dashboard/reviews" },
  ];

  const [bookings, setBookings] = useState([
    { id: 1, customer: "Alice Brown", service: "Electrician", date: "2025-02-01", time: "10:00 AM", status: "pending" },
    { id: 2, customer: "Bob Davis", service: "Electrician", date: "2025-02-03", time: "2:00 PM", status: "pending" },
    { id: 3, customer: "Carol White", service: "Electrician", date: "2025-01-28", time: "11:00 AM", status: "accepted" },
  ]);

  const handleAccept = (id: number) => {
    setBookings(bookings.map(b => b.id === id ? { ...b, status: "accepted" } : b));
    toast({
      title: "Success",
      description: "Booking request accepted",
    });
  };

  const handleReject = (id: number) => {
    setBookings(bookings.map(b => b.id === id ? { ...b, status: "rejected" } : b));
    toast({
      title: "Rejected",
      description: "Booking request rejected",
    });
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive"> = {
      pending: "secondary",
      accepted: "default",
      rejected: "destructive",
    };
    return <Badge variant={variants[status] || "default"}>{status}</Badge>;
  };

  return (
    <DashboardLayout
      title="Provider Dashboard"
      menuItems={menuItems}
      currentPath={location.pathname}
    >
      <div className="space-y-6">
        <div className="animate-fade-in">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Welcome, {userData.fullName || "Provider"}!
          </h1>
          <p className="text-muted-foreground">Manage your services and bookings</p>
        </div>

        {/* Stats Cards */}
        <div className="grid sm:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-primary">12</p>
                <p className="text-sm text-muted-foreground">Total Bookings</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-accent">8</p>
                <p className="text-sm text-muted-foreground">Completed</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-foreground">4.8</p>
                <p className="text-sm text-muted-foreground">Average Rating</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Booking Requests */}
        <Card>
          <CardHeader>
            <CardTitle>Booking Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {bookings.map((booking) => (
                <div
                  key={booking.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-border rounded-lg gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-foreground">{booking.customer}</h3>
                      {getStatusBadge(booking.status)}
                    </div>
                    <p className="text-sm text-muted-foreground">{booking.service}</p>
                    <p className="text-sm text-muted-foreground">
                      {booking.date} at {booking.time}
                    </p>
                  </div>
                  {booking.status === "pending" && (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleAccept(booking.id)}
                        className="flex-1 sm:flex-none"
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Accept
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleReject(booking.id)}
                        className="flex-1 sm:flex-none"
                      >
                        <XCircle className="h-4 w-4 mr-2" />
                        Reject
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default ProviderDashboard;
