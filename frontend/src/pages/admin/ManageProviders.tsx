import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";

const ManageProviders = () => {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProviders = async () => {
      setLoading(true);
      const res = await fetch("/api/admin/providers");
      const data = await res.json();
      setProviders(data);
      setLoading(false);
    };
    fetchProviders();
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Manage Providers</h2>
      {loading ? (
        <div>Loading providers...</div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Service Type</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {providers.map(provider => (
              <TableRow key={provider.providerId}>
                <TableCell>{provider.fullName}</TableCell>
                <TableCell>{provider.email}</TableCell>
                <TableCell>{provider.serviceType}</TableCell>
                <TableCell>{provider.location}</TableCell>
                <TableCell>
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-sm">
                    Active
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default ManageProviders;
