import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Star, MessageSquare, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Review {
  id: number;
  provider: string;
  service: string;
  rating: number;
  comment: string;
  date: string;
}

const Reviews = () => {
  const { toast } = useToast();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [completedBookings, setCompletedBookings] = useState<any[]>([]);

  useEffect(() => {
    const storedReviews = JSON.parse(localStorage.getItem("userReviews") || "[]");
    setReviews(storedReviews);

    const bookings = JSON.parse(localStorage.getItem("userBookings") || "[]");
    const completed = bookings.filter((b: any) => b.status === "completed");
    setCompletedBookings(completed);
  }, []);

  const handleSubmitReview = () => {
    if (rating === 0) {
      toast({
        title: "Error",
        description: "Please select a rating",
        variant: "destructive",
      });
      return;
    }

    const newReview: Review = {
      id: Date.now(),
      provider: selectedBooking.provider,
      service: selectedBooking.service,
      rating,
      comment,
      date: new Date().toISOString(),
    };

    const updatedReviews = [...reviews, newReview];
    setReviews(updatedReviews);
    localStorage.setItem("userReviews", JSON.stringify(updatedReviews));

    toast({
      title: "Success!",
      description: "Review submitted successfully",
    });

    setSelectedBooking(null);
    setRating(0);
    setComment("");
  };

  const renderStars = (currentRating: number, interactive: boolean = false) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-5 w-5 ${
              star <= currentRating
                ? "fill-accent text-accent"
                : "text-muted-foreground"
            } ${interactive ? "cursor-pointer hover:scale-110 transition-transform" : ""}`}
            onClick={() => interactive && setRating(star)}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Reviews</h1>
          <p className="text-muted-foreground">Rate and review your completed services</p>
        </div>
        
        {completedBookings.length > 0 && (
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <MessageSquare className="h-4 w-4 mr-2" />
                Write Review
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Write a Review</DialogTitle>
                <DialogDescription>
                  Share your experience with the service provider
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Select Booking</Label>
                  <div className="space-y-2">
                    {completedBookings.map((booking) => (
                      <div
                        key={booking.id}
                        className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                          selectedBooking?.id === booking.id
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50"
                        }`}
                        onClick={() => setSelectedBooking(booking)}
                      >
                        <p className="font-medium">{booking.service}</p>
                        <p className="text-sm text-muted-foreground">{booking.provider}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {selectedBooking && (
                  <>
                    <div className="space-y-2">
                      <Label>Rating</Label>
                      {renderStars(rating, true)}
                    </div>

                    <div className="space-y-2">
                      <Label>Comment (Optional)</Label>
                      <Textarea
                        placeholder="Share your experience..."
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        rows={4}
                      />
                    </div>

                    <Button className="w-full" onClick={handleSubmitReview}>
                      Submit Review
                    </Button>
                  </>
                )}
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {reviews.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center py-12">
            <Star className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No reviews yet</p>
            <p className="text-sm text-muted-foreground mt-2">
              Complete a booking to leave a review
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <Card key={review.id} className="hover:shadow-lg transition-all">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{review.service}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">{review.provider}</p>
                  </div>
                  {renderStars(review.rating)}
                </div>
              </CardHeader>
              <CardContent>
                {review.comment && (
                  <p className="text-muted-foreground mb-3">{review.comment}</p>
                )}
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  <span>
                    {new Date(review.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Reviews;
