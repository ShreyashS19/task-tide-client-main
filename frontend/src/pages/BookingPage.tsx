import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X } from "lucide-react";

export default function BookingPage() {
  const navigate = useNavigate();
  const [bookingData, setBookingData] = useState({
    service: "",
    rate: "",
    location: "",
    providerName: "",
    providerId: 0,
    date: "",
    time: "",
  });

  // Load provider data from localStorage on component mount
  useEffect(() => {
    const savedBooking = localStorage.getItem('pendingBooking');
    if (savedBooking) {
      try {
        const data = JSON.parse(savedBooking);
        setBookingData({
          service: data.service || "Service",
          rate: data.rate || "₹0",
          location: data.location || "Not specified",
          providerName: data.providerName || "Provider",
          providerId: data.providerId || 0,
          date: data.date || "",
          time: data.time || "",
        });
      } catch (error) {
        console.error("Failed to parse booking data:", error);
      }
    } else {
      // If no booking data, redirect back
      navigate('/user-dashboard/search');
    }
  }, [navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!bookingData.date || !bookingData.time) {
      alert("Please select both date and time");
      return;
    }

    // Update localStorage with date and time
    const updatedBooking = {
      ...bookingData,
      date: bookingData.date,
      time: bookingData.time,
    };
    localStorage.setItem('pendingBooking', JSON.stringify(updatedBooking));
    
    // Navigate to payment page
    navigate('/payment');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 py-8">
      <Card className="w-full max-w-md relative">
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-2 top-2 z-10"
          onClick={() => navigate(-1)}
        >
          <X className="h-4 w-4" />
        </Button>

        <CardHeader className="pb-4">
          <CardTitle className="text-xl">Book {bookingData.service} Service</CardTitle>
          <p className="text-sm text-muted-foreground">
            Schedule an appointment with {bookingData.providerName}
          </p>
        </CardHeader>

        <CardContent className="pb-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <Label className="text-sm font-normal">Service:</Label>
                <span className="font-medium">{bookingData.service}</span>
              </div>
              <div className="flex justify-between items-center">
                <Label className="text-sm font-normal">Rate:</Label>
                <span className="font-medium">{bookingData.rate}</span>
              </div>
              <div className="flex justify-between items-center">
                <Label className="text-sm font-normal">Location:</Label>
                <span className="font-medium">{bookingData.location}</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="date" className="font-semibold">Select Date</Label>
              <Input
                id="date"
                type="date"
                value={bookingData.date}
                onChange={(e) => setBookingData({ ...bookingData, date: e.target.value })}
                min={new Date().toISOString().split("T")[0]}
                className="w-full"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="time" className="font-semibold">Select Time</Label>
              <Select
                value={bookingData.time}
                onValueChange={(value) => setBookingData({ ...bookingData, time: value })}
              >
                <SelectTrigger id="time" className="w-full">
                  <SelectValue placeholder="Choose time slot" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="09:00">09:00 AM</SelectItem>
                  <SelectItem value="10:00">10:00 AM</SelectItem>
                  <SelectItem value="11:00">11:00 AM</SelectItem>
                  <SelectItem value="12:00">12:00 PM</SelectItem>
                  <SelectItem value="14:00">02:00 PM</SelectItem>
                  <SelectItem value="15:00">03:00 PM</SelectItem>
                  <SelectItem value="16:00">04:00 PM</SelectItem>
                  <SelectItem value="17:00">05:00 PM</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="pt-2">
              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                Confirm Booking
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
