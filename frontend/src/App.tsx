import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import UserDashboard from "./pages/UserDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";

// Admin subpages
import ManageUsers from "./pages/admin/ManageUsers";
import ManageProviders from "./pages/admin/ManageProviders";
import BookingsOverview from "./pages/admin/BookingsOverview";
import ComplaintsList from "./pages/admin/ComplaintsList";

// Provider pages
import ProfileDashboard from "./pages/provider/ProfileDashboard";
import MyServices from "./pages/provider/MyServices";
import BookingRequests from "./pages/provider/BookingRequests";
import ProviderReviews from "./pages/provider/ProviderReviews";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/user-dashboard/*" element={<UserDashboard />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          {/* Admin sub-routes for dynamic data */}
          <Route path="/admin-dashboard/users" element={<ManageUsers />} />
          <Route path="/admin-dashboard/providers" element={<ManageProviders />} />
          <Route path="/admin-dashboard/bookings" element={<BookingsOverview />} />
          <Route path="/admin-dashboard/complaints" element={<ComplaintsList />} />
          {/* Provider Dashboard Routes */}
          <Route path="/provider-dashboard" element={<ProfileDashboard />} />
          <Route path="/provider-dashboard/services" element={<MyServices />} />
          <Route path="/provider-dashboard/bookings" element={<BookingRequests />} />
          <Route path="/provider-dashboard/reviews" element={<ProviderReviews />} />
          {/* Catch-all 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
