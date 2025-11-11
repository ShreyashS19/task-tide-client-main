import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";

const ComplaintsList = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchComplaints = async () => {
      setLoading(true);
      const res = await fetch("/api/admin/complaints");
      const data = await res.json();
      setComplaints(data);
      setLoading(false);
    };
    fetchComplaints();
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Complaints</h2>
      {loading ? (
        <div>Loading complaints...</div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Complaint ID</TableHead>
              <TableHead>User ID</TableHead>
              <TableHead>Provider ID</TableHead>
              <TableHead>Message</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Response</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {complaints.map(c => (
              <TableRow key={c.complaintId}>
                <TableCell>{c.complaintId}</TableCell>
                <TableCell>{c.userId}</TableCell>
                <TableCell>{c.providerId || "-"}</TableCell>
                <TableCell>{c.message}</TableCell>
                <TableCell>{c.status}</TableCell>
                <TableCell>{c.response || "-"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default ComplaintsList;
