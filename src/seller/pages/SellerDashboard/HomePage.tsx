import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { FormControl, MenuItem, Select, type SelectChangeEvent, Box, Button, Stack, Typography } from "@mui/material";
import TrendingUpRoundedIcon from "@mui/icons-material/TrendingUpRounded";
import ShoppingBagRoundedIcon from "@mui/icons-material/ShoppingBagRounded";
import ReplayRoundedIcon from "@mui/icons-material/ReplayRounded";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import AddBoxRoundedIcon from "@mui/icons-material/AddBoxRounded";
import AccountBalanceWalletRoundedIcon from "@mui/icons-material/AccountBalanceWalletRounded";
import LocalShippingRoundedIcon from "@mui/icons-material/LocalShippingRounded";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../store";
import { fetchSellerReport } from "../../../store/seller/sellerSlice";
import { getSellerToken } from "../../../utils/authToken";
import SellingChart from "./SellingChart";
import {
  SellerMetricCard,
  SellerPageIntro,
  SellerSection,
  formatSellerCurrency,
  sellerInputSx,
  sellerPrimaryButtonSx,
  sellerSecondaryButtonSx,
} from "../../theme/sellerUi";

const chartTypes = [
  { name: "Today", value: "today" },
  { name: "Last 7 days", value: "daily" },
  { name: "Last 12 months", value: "monthly" },
];

const HomePage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { sellers } = useAppSelector((store) => store);
  const jwt = useMemo(() => getSellerToken(), []);
  const [chartType, setChartType] = useState(chartTypes[1].value);

  const refreshReport = useCallback(() => {
    if (!jwt) return;
    dispatch(fetchSellerReport(jwt));
  }, [dispatch, jwt]);

  useEffect(() => {
    if (!jwt) return;

    refreshReport();
    const onFocus = () => refreshReport();
    const intervalId = window.setInterval(refreshReport, 30000);
    window.addEventListener("focus", onFocus);

    return () => {
      window.clearInterval(intervalId);
      window.removeEventListener("focus", onFocus);
    };
  }, [jwt, refreshReport]);

  const report = sellers.report;
  const totalOrders = Number(report?.totalOrders ?? report?.totalSales ?? 0);
  const cancellationRate = totalOrders > 0 ? Math.round((Number(report?.canceledOrders ?? 0) / totalOrders) * 100) : 0;
  const refundRate = totalOrders > 0 ? Math.round((Number(report?.totalRefunds ?? 0) / totalOrders) * 100) : 0;

  return (
    <Box>
      <SellerPageIntro
        eyebrow="Overview"
        title="Seller command center"
        description="Watch revenue, order flow, and payouts from one clean workspace. The cards below refresh automatically so you can spot changes without digging into each module."
        actions={
          <>
            <Button variant="outlined" onClick={() => navigate("/seller/settlements")} sx={sellerSecondaryButtonSx}>
              Settlements
            </Button>
            <Button variant="contained" startIcon={<AddBoxRoundedIcon />} onClick={() => navigate("/seller/add-product")} sx={sellerPrimaryButtonSx}>
              Add product
            </Button>
          </>
        }
      />

      <Box
        sx={{
          display: "grid",
          gap: 2,
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, minmax(0, 1fr))",
            xl: "repeat(4, minmax(0, 1fr))",
          },
        }}
      >
        <SellerMetricCard
          label="Revenue"
          value={formatSellerCurrency(report?.totalEarnings)}
          helper={`${formatSellerCurrency(report?.netEarnings)} net after taxes and fees`}
          tone="accent"
          icon={<TrendingUpRoundedIcon />}
        />
        <SellerMetricCard
          label="Orders"
          value={Number(totalOrders).toLocaleString("en-IN")}
          helper={`${Number(report?.totalSales ?? 0).toLocaleString("en-IN")} completed sales`}
          tone="info"
          icon={<ShoppingBagRoundedIcon />}
        />
        <SellerMetricCard
          label="Refunds"
          value={Number(report?.totalRefunds ?? 0).toLocaleString("en-IN")}
          helper={`${refundRate}% of tracked orders`}
          tone="warning"
          icon={<ReplayRoundedIcon />}
        />
        <SellerMetricCard
          label="Cancelled"
          value={Number(report?.canceledOrders ?? 0).toLocaleString("en-IN")}
          helper={`${cancellationRate}% cancellation rate`}
          tone="danger"
          icon={<CancelRoundedIcon />}
        />
      </Box>

      <Box
        sx={{
          display: "grid",
          gap: 2,
          mt: 2,
          gridTemplateColumns: { xs: "1fr", xl: "minmax(0, 1.75fr) minmax(320px, 0.95fr)" },
        }}
      >
        <SellerSection
          title="Sales analytics"
          description="Switch the time range to compare short-term movement against long-term trends."
          action={
            <FormControl size="small" sx={{ ...sellerInputSx, minWidth: 180 }}>
              <Select value={chartType} onChange={(event: SelectChangeEvent) => setChartType(event.target.value)}>
                {chartTypes.map((item) => (
                  <MenuItem key={item.value} value={item.value}>
                    {item.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          }
        >
          <Box sx={{ height: 360 }}>
            <SellingChart chartType={chartType} />
          </Box>
        </SellerSection>

        <SellerSection title="Operational snapshot" description="Quick reads for the next actions worth taking today.">
          <Stack spacing={1.6}>
            <SnapshotRow
              icon={<LocalShippingRoundedIcon sx={{ color: "#0E7490", fontSize: 18 }} />}
              label="Total transactions"
              value={Number(report?.totalTransactions ?? 0).toLocaleString("en-IN")}
              detail="Payments and transaction events recorded"
            />
            <SnapshotRow
              icon={<AccountBalanceWalletRoundedIcon sx={{ color: "#0F766E", fontSize: 18 }} />}
              label="Net earnings"
              value={formatSellerCurrency(report?.netEarnings)}
              detail={`${formatSellerCurrency(report?.totalTax)} tax tracked in report`}
            />
            <SnapshotRow
              icon={<ShoppingBagRoundedIcon sx={{ color: "#D97706", fontSize: 18 }} />}
              label="Average order value"
              value={formatSellerCurrency(totalOrders > 0 ? Number(report?.totalEarnings ?? 0) / totalOrders : 0)}
              detail="Based on current revenue and order volume"
            />
          </Stack>

          <Stack direction={{ xs: "column", sm: "row" }} spacing={1} sx={{ mt: 2 }}>
            <Button fullWidth variant="outlined" sx={sellerSecondaryButtonSx} onClick={() => navigate("/seller/orders")}>
              Review orders
            </Button>
            <Button fullWidth variant="outlined" sx={sellerSecondaryButtonSx} onClick={() => navigate("/seller/returns")}>
              Review returns
            </Button>
          </Stack>
        </SellerSection>
      </Box>
    </Box>
  );
};

const SnapshotRow = ({
  icon,
  label,
  value,
  detail,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  detail: string;
}) => (
  <Stack
    direction="row"
    spacing={1.4}
    alignItems="flex-start"
    sx={{
      p: 1.5,
      border: "1px solid #DCE8EC",
      borderRadius: "12px",
      bgcolor: "#F8FBFC",
    }}
  >
    <Box
      sx={{
        width: 38,
        height: 38,
        borderRadius: "10px",
        display: "grid",
        placeItems: "center",
        bgcolor: "#FFFFFF",
        border: "1px solid #DCE8EC",
        flexShrink: 0,
      }}
    >
      {icon}
    </Box>
    <Box sx={{ minWidth: 0 }}>
      <Typography sx={{ color: "#64748B", fontSize: ".8rem", fontWeight: 700 }}>{label}</Typography>
      <Typography sx={{ color: "#0F172A", fontSize: "1.05rem", fontWeight: 900, mt: 0.4 }}>{value}</Typography>
      <Typography sx={{ color: "#64748B", fontSize: ".82rem", mt: 0.5 }}>{detail}</Typography>
    </Box>
  </Stack>
);

export default HomePage;
