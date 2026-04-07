import React, { useEffect, useState } from "react";
import {
  Box, Paper, Tab, Tabs, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Typography, InputBase, Chip
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { api } from "../../../Config/Api";
import type { Seller } from "../../../types/sellerTypes";
import type { User } from "../../../types/userTypes";
import { getAdminToken } from "../../../util/authToken";

const UserManagement: React.FC = () => {
  const [tab, setTab] = useState<"customers" | "sellers">("customers");
  const [customers, setCustomers] = useState<User[]>([]);
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [query, setQuery] = useState("");

  const fetchCustomers = async () => {
    const res = await api.get<User[]>("/admin/users", {
      headers: { Authorization: `Bearer ${getAdminToken()}` },
    });
    setCustomers(res.data);
  };

  const fetchSellers = async () => {
    const res = await api.get<Seller[]>("/admin/users/sellers", {
      headers: { Authorization: `Bearer ${getAdminToken()}` },
    });
    setSellers(res.data);
  };

  useEffect(() => {
    fetchCustomers();
    fetchSellers();
  }, []);

  const filteredCustomers = customers.filter((u) =>
    [u.fullName, u.email, u.mobile].some((f) => f?.toLowerCase().includes(query.toLowerCase()))
  );
  const filteredSellers = sellers.filter((u) =>
    [u.sellerName, u.email, u.mobile, u.accountStatus].some((f) => `${f}`.toLowerCase().includes(query.toLowerCase()))
  );
  const tableRows = tab === "customers" ? filteredCustomers : filteredSellers;

  return (
    <Box sx={{ p: 2, display: "grid", gap: 2 }}>
      <Typography variant="h5" fontWeight={700}>User Management</Typography>

      <Paper sx={{ p: 1.5, display: "flex", alignItems: "center", gap: 1 }}>
        <Tabs value={tab} onChange={(_, v) => setTab(v)}>
          <Tab label="Customers" value="customers" />
          <Tab label="Sellers" value="sellers" />
        </Tabs>
        <Box sx={{ ml: "auto", display: "flex", alignItems: "center", gap: 1, border: "1px solid #e0e0e0", borderRadius: 1, px: 1 }}>
          <SearchIcon fontSize="small" />
          <InputBase placeholder="Search users" value={query} onChange={(e) => setQuery(e.target.value)} />
        </Box>
      </Paper>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Mobile</TableCell>
              {tab === "sellers" && <TableCell>Status</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {tableRows.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{"fullName" in item ? item.fullName : item.sellerName}</TableCell>
                <TableCell>{item.email}</TableCell>
                <TableCell>{item.mobile}</TableCell>
                {tab === "sellers" && (
                  <TableCell>
                    <Chip
                      size="small"
                      label={"accountStatus" in item ? item.accountStatus : "N/A"}
                      color={"accountStatus" in item && item.accountStatus === "ACTIVE" ? "success" : "default"}
                    />
                  </TableCell>
                )}
              </TableRow>
            ))}
            {tableRows.length === 0 && (
              <TableRow>
                <TableCell colSpan={tab === "sellers" ? 4 : 3}>
                  <Typography align="center" py={2}>No users found.</Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default UserManagement;
