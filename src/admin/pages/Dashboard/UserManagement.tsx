import React, { useEffect, useState } from "react";
import {
  Box, Paper, Tab, Tabs, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Typography, InputBase
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { api } from "../../../config/Api";
import type { User } from "../../../types/userTypes";
import { getAdminToken } from "../../../utils/authToken";
import { useSearchParams } from "react-router-dom";
import SellersTable from "../sellers/SellersTable";

const DEFAULT_SELLER_STATUS = "PENDING_VERIFICATION";

const UserManagement: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [tab, setTab] = useState<"customers" | "sellers">(
    searchParams.get("tab") === "sellers" ? "sellers" : "customers"
  );
  const [customers, setCustomers] = useState<User[]>([]);
  const [query, setQuery] = useState("");

  const fetchCustomers = async () => {
    const res = await api.get<User[]>("/admin/users", {
      headers: { Authorization: `Bearer ${getAdminToken()}` },
    });
    setCustomers(res.data);
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  useEffect(() => {
    const incoming = searchParams.get("tab");
    if (incoming === "customers" || incoming === "sellers") {
      setTab(incoming);
      return;
    }
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set("tab", "customers");
    nextParams.delete("status");
    setSearchParams(nextParams, { replace: true });
  }, [searchParams, setSearchParams]);

  const filteredCustomers = customers.filter((u) =>
    [u.fullName, u.email, u.mobile].some((f) => f?.toLowerCase().includes(query.toLowerCase()))
  );

  return (
    <Box sx={{ p: 2, display: "grid", gap: 2 }}>
      <Typography variant="h5" fontWeight={700}>User & Seller Management</Typography>

      <Paper sx={{ p: 1.5, display: "flex", alignItems: "center", gap: 1 }}>
        <Tabs
          value={tab}
          onChange={(_, v: "customers" | "sellers") => {
            setTab(v);
            const nextParams = new URLSearchParams(searchParams);
            nextParams.set("tab", v);

            if (v === "sellers") {
              if (!nextParams.get("status")) {
                nextParams.set("status", DEFAULT_SELLER_STATUS);
              }
            } else {
              nextParams.delete("status");
            }

            setSearchParams(nextParams, { replace: true });
          }}
        >
          <Tab label="Customers" value="customers" />
          <Tab label="Seller Management" value="sellers" />
        </Tabs>

        {tab === "customers" && (
          <Box sx={{ ml: "auto", display: "flex", alignItems: "center", gap: 1, border: "1px solid #e0e0e0", borderRadius: 1, px: 1 }}>
            <SearchIcon fontSize="small" />
            <InputBase placeholder="Search customers" value={query} onChange={(e) => setQuery(e.target.value)} />
          </Box>
        )}
      </Paper>

      {tab === "customers" ? (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Mobile</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredCustomers.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.fullName}</TableCell>
                  <TableCell>{item.email}</TableCell>
                  <TableCell>{item.mobile}</TableCell>
                </TableRow>
              ))}
              {filteredCustomers.length === 0 && (
                <TableRow>
                  <TableCell colSpan={3}>
                    <Typography align="center" py={2}>No users found.</Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <SellersTable />
      )}
    </Box>
  );
};

export default UserManagement;
