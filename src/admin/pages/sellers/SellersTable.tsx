import { useEffect, useState } from "react";
import {
  Box,
  Button,
  FormControl,
  Menu,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../../Redux Toolkit/Store";
import { fetchSellers, updateSellerAccountStatus } from "../../../Redux Toolkit/Seller/sellerSlice";
import { useSearchParams } from "react-router-dom";

const accountStatuses = [
  { status: "PENDING_VERIFICATION", title: "Pending Verification" },
  { status: "ACTIVE", title: "Active" },
  { status: "SUSPENDED", title: "Suspended" },
  { status: "DEACTIVATED", title: "Deactivated" },
  { status: "BANNED", title: "Banned" },
  { status: "CLOSED", title: "Closed" },
];
const DEFAULT_STATUS = "PENDING_VERIFICATION";

const isValidSellerStatus = (status: string | null): status is string =>
  Boolean(status && accountStatuses.some((item) => item.status === status));

const SellersTable = () => {
  const dispatch = useAppDispatch();
  const { sellers } = useAppSelector((store) => store);
  const [searchParams, setSearchParams] = useSearchParams();
  const statusFromQuery = searchParams.get("status");

  const [accountStatus, setAccountStatus] = useState(
    isValidSellerStatus(statusFromQuery) ? statusFromQuery : DEFAULT_STATUS
  );
  const [anchorEl, setAnchorEl] = useState<{ [key: number]: HTMLElement | null }>({});

  useEffect(() => {
    if (!isValidSellerStatus(statusFromQuery)) {
      return;
    }

    if (statusFromQuery !== accountStatus) {
      setAccountStatus(statusFromQuery);
    }
  }, [accountStatus, statusFromQuery]);

  useEffect(() => {
    dispatch(fetchSellers(accountStatus));
  }, [accountStatus, dispatch]);

  const handleStatusFilterChange = (nextStatus: string) => {
    setAccountStatus(nextStatus);
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set("tab", "sellers");
    nextParams.set("status", nextStatus);
    setSearchParams(nextParams, { replace: true });
  };

  const openMenu = (event: React.MouseEvent<HTMLButtonElement>, sellerId: number) => {
    setAnchorEl((prev) => ({ ...prev, [sellerId]: event.currentTarget }));
  };

  const closeMenu = (sellerId: number) => {
    setAnchorEl((prev) => ({ ...prev, [sellerId]: null }));
  };

  return (
    <Box className="grid gap-4">
      <Box className="surface p-4" sx={{ borderRadius: 4 }}>
        <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
          Seller Management
        </Typography>
        <FormControl size="small" sx={{ minWidth: 220 }}>
          <Select value={accountStatus} onChange={(event) => handleStatusFilterChange(event.target.value)}>
            {accountStatuses.map((status) => (
              <MenuItem key={status.status} value={status.status}>{status.title}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Seller</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Mobile</TableCell>
              <TableCell>GSTIN</TableCell>
              <TableCell>Business</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sellers.sellers?.map((seller) => (
              <TableRow key={seller.id} hover>
                <TableCell>{seller.sellerName}</TableCell>
                <TableCell>{seller.email}</TableCell>
                <TableCell>{seller.mobile}</TableCell>
                <TableCell>{seller.gstin}</TableCell>
                <TableCell>{seller.businessDetails?.businessName}</TableCell>
                <TableCell>{seller.accountStatus}</TableCell>
                <TableCell align="right">
                  <Button size="small" onClick={(event) => openMenu(event, seller.id || 1)}>
                    Change status
                  </Button>
                  <Menu
                    anchorEl={anchorEl[seller.id || 1]}
                    open={Boolean(anchorEl[seller.id || 1])}
                    onClose={() => closeMenu(seller.id || 1)}
                  >
                    {accountStatuses.map((status) => (
                      <MenuItem
                        key={status.status}
                        onClick={() => {
                          dispatch(updateSellerAccountStatus({ id: seller.id || 1, status: status.status }))
                            .finally(() => dispatch(fetchSellers(accountStatus)));
                          closeMenu(seller.id || 1);
                        }}
                      >
                        {status.title}
                      </MenuItem>
                    ))}
                  </Menu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default SellersTable;
