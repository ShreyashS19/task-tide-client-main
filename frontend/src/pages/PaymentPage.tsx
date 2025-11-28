import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, CreditCard } from "lucide-react";

export default function PaymentPage() {
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [name, setName] = useState('');
  const [country, setCountry] = useState('India');
  const [saveInfo, setSaveInfo] = useState(false);
  const [bookingInfo, setBookingInfo] = useState<any>(null);

  useEffect(() => {
    const booking = localStorage.getItem('pendingBooking');
    if (booking) {
      setBookingInfo(JSON.parse(booking));
    }
  }, []);

  // Format card number with spaces
  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\s/g, '');
    const formatted = cleaned.match(/.{1,4}/g)?.join(' ') || cleaned;
    return formatted.substring(0, 19); // Max 16 digits + 3 spaces
  };

  // Format expiry as MM/YY
  const formatExpiry = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      return cleaned.substring(0, 2) + '/' + cleaned.substring(2, 4);
    }
    return cleaned;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    // Validation
    if (!email || !cardNumber || !expiry || !cvc || !name) {
      alert('Please fill in all payment fields');
      return;
    }

    const cleanedCard = cardNumber.replace(/\s/g, '');
    
    // Validate card number (16 digits)
    if (cleanedCard.length !== 16) {
      alert('Card number must be 16 digits');
      return;
    }

    // Validate expiry format
    if (!/^\d{2}\/\d{2}$/.test(expiry)) {
      alert('Expiry must be in MM/YY format');
      return;
    }

    // Validate CVC (3 digits)
    if (cvc.length !== 3) {
      alert('CVC must be 3 digits');
      return;
    }

    setLoading(true);

    // Simulate payment processing delay
    setTimeout(() => {
      // For demo: Accept test card or any card ending in valid digits
      const isTestCard = cleanedCard === '4242424242424242';
      
      if (isTestCard || cleanedCard.length === 16) {
        // Success - clear booking and navigate
        localStorage.removeItem('pendingBooking');
        navigate('/payment-success');
      } else {
        alert('Payment failed. Please use test card: 4242 4242 4242 4242');
        setLoading(false);
      }
    }, 1500); // 1.5 second delay to simulate processing
  };

  // Calculate amount (half of the rate for demo)
  const amount = bookingInfo?.rate ? 
    parseFloat(bookingInfo.rate.replace('₹', '')) / 2 : 250;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Button
          variant="ghost"
          size="sm"
          className="mb-4"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        <div className="bg-white rounded-lg shadow-md p-6">
          {/* Booking Info */}
          <div className="mb-6">
            <div className="inline-block bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded mb-2">
              TEST MODE
            </div>
            <h2 className="text-2xl font-bold mb-2">Booking #1</h2>
            <p className="text-3xl font-bold">₹{amount.toFixed(2)}</p>
            <p className="text-sm text-gray-500 mt-2">OR</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* Payment Method */}
            <div className="space-y-4">
              <Label>Payment method</Label>
              
              {/* Card Information */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">Card information</Label>
                
                {/* Card Number */}
                <div className="relative">
                  <Input
                    type="text"
                    placeholder="1234 1234 1234 1234"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                    className="pr-10"
                    required
                  />
                  <CreditCard className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                </div>

                {/* Expiry and CVC */}
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    type="text"
                    placeholder="MM/YY"
                    value={expiry}
                    onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                    maxLength={5}
                    required
                  />
                  <Input
                    type="text"
                    placeholder="CVC"
                    value={cvc}
                    onChange={(e) => setCvc(e.target.value.replace(/\D/g, '').substring(0, 3))}
                    maxLength={3}
                    required
                  />
                </div>
              </div>

              {/* Cardholder Name */}
              <div className="space-y-2">
                <Label htmlFor="name">Cardholder name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Full name on card"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              {/* Country */}
              <div className="space-y-2">
                <Label htmlFor="country">Country or region</Label>
                <Select value={country} onValueChange={setCountry}>
                  <SelectTrigger id="country">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="India">India</SelectItem>
                    <SelectItem value="USA">United States</SelectItem>
                    <SelectItem value="UK">United Kingdom</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Save Information */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="save-info"
                checked={saveInfo}
                onCheckedChange={(checked) => setSaveInfo(checked as boolean)}
              />
              <label
                htmlFor="save-info"
                className="text-sm text-gray-600 cursor-pointer"
              >
                Save my information for faster checkout
              </label>
            </div>

            {/* Pay Button */}
            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6 text-lg"
              disabled={loading}
            >
              {loading ? 'Processing...' : 'Pay'}
            </Button>
          </form>

          {/* Test Card Info */}
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
            <p className="text-sm font-semibold text-blue-800 mb-2">Test Card Numbers:</p>
            <p className="text-xs text-blue-700">4242 4242 4242 4242 (Success)</p>
            <p className="text-xs text-blue-700 mt-1">Use any future date for expiry & any 3 digits for CVC</p>
          </div>

          <div className="mt-4 text-center text-xs text-gray-500">
            Powered by stripe | Terms | Privacy
          </div>
        </div>
      </div>
    </div>
  );
}
