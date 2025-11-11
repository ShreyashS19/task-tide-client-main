import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      const res = await fetch("/api/admin/users");
      const data = await res.json();
      setUsers(data);
      setLoading(false);
    };
    fetchUsers();
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Manage Users</h2>
      {loading ? (
        <div>Loading users...</div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map(user => (
              <TableRow key={user.userId}>
                <TableCell>{user.fullName}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role}</TableCell>
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

export default ManageUsers;
