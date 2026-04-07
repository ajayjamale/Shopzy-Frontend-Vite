import React, { useEffect } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useAppDispatch, useAppSelector } from "../../../Redux Toolkit/Store";
import { fetchRevenueChart } from "../../../Redux Toolkit/Seller/revenueChartSlice";
import { Skeleton } from "@mui/material";

const SellingChart = ({ chartType }: { chartType: string }) => {
  const dispatch = useAppDispatch();
  const { revenueChart } = useAppSelector((store) => store);

  useEffect(() => {
    if (chartType) {
      dispatch(fetchRevenueChart({ type: chartType }));
    }
  }, [chartType, dispatch]);

  if (revenueChart.loading) {
    return <Skeleton variant="rounded" height="100%" />;
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart
        data={revenueChart.chart || []}
        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
      >
        <defs>
          <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#ff9900" stopOpacity={0.4} />
            <stop offset="95%" stopColor="#ff9900" stopOpacity={0.05} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis dataKey="date" stroke="#94a3b8" />
        <YAxis dataKey={"revenue"} stroke="#94a3b8" />
        <Tooltip formatter={(v: number) => [`₹${v?.toLocaleString("en-IN")}`, "Revenue"]} />
        <Area type="monotone" dataKey="revenue" stroke="#f59e0b" fill="url(#rev)" strokeWidth={2} />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default SellingChart;
