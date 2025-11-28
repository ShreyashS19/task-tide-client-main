import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
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
import { ArrowLeft } from "lucide-react";

// Use your Stripe test publishable key
const stripePromise = loadStripe('pk_test_YOUR_PUBLISHABLE_KEY_HERE');

const cardElementOptions = {
  style: {
    base: {
      fontSize: '16px',
      color: '#424770',
      '::placeholder': {
        color: '#aab7c4',
      },
    },
    invalid: {
      color: '#9e2146',
    },
  },
};

function PaymentForm() {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [country, setCountry] = useState('India');
  const [saveInfo, setSaveInfo] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setLoading(true);

    try {
      const cardElement = elements.getElement(CardNumberElement);
      
      if (!cardElement) {
        throw new Error('Card element not found');
      }

      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
        billing_details: {
          name: name,
          email: email,
        },
      });

      if (error) {
        console.error(error);
        alert(error.message);
        setLoading(false);
        return;
      }

      console.log('Payment Method ID:', paymentMethod.id);
      localStorage.removeItem('pendingBooking');
      navigate('/payment-success');
      
    } catch (error: any) {
      console.error('Payment error:', error);
      alert(error.message || 'Payment failed');
      setLoading(false);
    }
  };

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
          <div className="mb-6">
            <div className="inline-block bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded mb-2">
              TEST MODE
            </div>
            <h2 className="text-2xl font-bold mb-2">Booking #1</h2>
            <p className="text-3xl font-bold">₹250.00</p>
            <p className="text-sm text-gray-500 mt-2">OR</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
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

            <div className="space-y-4">
              <Label>Payment method</Label>
              
              <div className="space-y-3">
                <Label className="text-sm font-medium">Card information</Label>
                <div className="border rounded-md p-3 bg-white">
                  <CardNumberElement options={cardElementOptions} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="border rounded-md p-3 bg-white">
                    <CardExpiryElement options={cardElementOptions} />
                  </div>
                  <div className="border rounded-md p-3 bg-white">
                    <CardCvcElement options={cardElementOptions} />
                  </div>
                </div>
              </div>

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

            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6 text-lg"
              disabled={!stripe || loading}
            >
              {loading ? 'Processing...' : 'Pay'}
            </Button>
          </form>

          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
            <p className="text-sm font-semibold text-blue-800 mb-2">Test Card Numbers:</p>
            <p className="text-xs text-blue-700">4242 4242 4242 4242 (Success)</p>
            <p className="text-xs text-blue-700 mt-1">Use any future date & any 3 digits for CVC</p>
          </div>

          <div className="mt-4 text-center text-xs text-gray-500">
            Powered by stripe | Terms | Privacy
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PaymentPage() {
  return (
    <Elements stripe={stripePromise}>
      <PaymentForm />
    </Elements>
  );
}
