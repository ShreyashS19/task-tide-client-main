import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";

const BookingsOverview = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true);
      const res = await fetch("/api/admin/bookings");
      const data = await res.json();
      setBookings(data);
      setLoading(false);
    };
    fetchBookings();
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Booking Overview</h2>
      {loading ? (
        <div>Loading bookings...</div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Provider</TableHead>
              <TableHead>Service Type</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Time</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bookings.map(booking => (
              <TableRow key={booking.bookingId}>
                <TableCell>{booking.userId}</TableCell>
                <TableCell>{booking.providerId}</TableCell>
                <TableCell>{booking.serviceType}</TableCell>
                <TableCell>{booking.bookingDate}</TableCell>
                <TableCell>{booking.bookingTime}</TableCell>
                <TableCell>{booking.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default BookingsOverview;
