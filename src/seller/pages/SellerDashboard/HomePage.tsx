import { useCallback, useEffect, useMemo, useState } from "react";
import { FormControl, MenuItem, Select, type SelectChangeEvent } from "@mui/material";
import TrendingUpRoundedIcon from "@mui/icons-material/TrendingUpRounded";
import ShoppingBagRoundedIcon from "@mui/icons-material/ShoppingBagRounded";
import ReplayRoundedIcon from "@mui/icons-material/ReplayRounded";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import { useAppDispatch, useAppSelector } from "../../../store";
import { fetchSellerReport } from "../../../store/seller/sellerSlice";
import { getSellerToken } from "../../../utils/authToken";
import SellingChart from "./SellingChart";

const chartTypes = [
  { name: "Today", value: "today" },
  { name: "Last 7 days", value: "daily" },
  { name: "Last 12 months", value: "monthly" },
];

const metricCards = [
  { key: "totalEarnings", label: "Revenue", icon: <TrendingUpRoundedIcon sx={{ color: "#0F766E" }} /> },
  { key: "totalSales", label: "Sales", icon: <ShoppingBagRoundedIcon sx={{ color: "#0F766E" }} /> },
  { key: "totalRefunds", label: "Refunds", icon: <ReplayRoundedIcon sx={{ color: "#0F766E" }} /> },
  { key: "canceledOrders", label: "Cancelled", icon: <CancelRoundedIcon sx={{ color: "#0F766E" }} /> },
];

const HomePage = () => {
  const dispatch = useAppDispatch();
  const { sellers } = useAppSelector((store) => store);
  const jwt = useMemo(() => getSellerToken(), []);
  const [chartType, setChartType] = useState(chartTypes[0].value);

  const refreshReport = useCallback(() => {
    if (!jwt) return;
    dispatch(fetchSellerReport(jwt));
  }, [jwt, dispatch]);

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

  return (
    <div className="grid gap-4">
      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {metricCards.map((card) => (
          <article key={card.key} className="surface p-4" style={{ borderRadius: 16 }}>
            <div className="flex items-center justify-between">
              <p className="text-xs uppercase tracking-[0.12em] text-slate-500 font-bold">{card.label}</p>
              {card.icon}
            </div>
            <p className="text-2xl font-bold text-slate-900 mt-3">
              {card.key === "totalEarnings"
                ? `Rs. ${Number((sellers.report as any)?.[card.key] || 0).toLocaleString("en-IN")}`
                : Number((sellers.report as any)?.[card.key] || 0).toLocaleString("en-IN")}
            </p>
          </article>
        ))}
      </div>

      <section className="surface p-5" style={{ borderRadius: 16 }}>
        <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
          <div>
            <p className="section-kicker mb-1">Performance</p>
            <h2 style={{ fontSize: "1.3rem" }}>Sales analytics</h2>
          </div>

          <FormControl size="small" sx={{ minWidth: 180 }}>
            <Select value={chartType} onChange={(event: SelectChangeEvent) => setChartType(event.target.value)}>
              {chartTypes.map((item) => (
                <MenuItem key={item.value} value={item.value}>{item.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>

        <div style={{ height: 360 }}>
          <SellingChart chartType={chartType} />
        </div>
      </section>
    </div>
  );
};

export default HomePage;
