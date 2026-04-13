import { useEffect, useState } from "react";
import { Box, Button, Stack, Typography } from "@mui/material";
import AccountBalanceWalletRoundedIcon from "@mui/icons-material/AccountBalanceWalletRounded";
import ReceiptLongRoundedIcon from "@mui/icons-material/ReceiptLongRounded";
import AutorenewRoundedIcon from "@mui/icons-material/AutorenewRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../store";
import { fetchSettlementSummary, fetchSettlements } from "../../../store/seller/settlementSlice";
import { getSellerToken } from "../../../utils/authToken";
import TransactionTable from "./TransactionTable";
import {
  SellerMetricCard,
  SellerPageIntro,
  SellerSection,
  SellerStatusChip,
  formatSellerCurrency,
  formatSellerDate,
  humanizeSellerValue,
  sellerPrimaryButtonSx,
  sellerSecondaryButtonSx,
} from "../../theme/sellerUi";

const tabs = ["Transactions", "Settlements"] as const;

type PaymentProps = {
  initialTab?: (typeof tabs)[number];
};

const Payment = ({ initialTab = "Transactions" }: PaymentProps) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { sellers, settlement } = useAppSelector((store) => store);
  const [tab, setTab] = useState<(typeof tabs)[number]>(initialTab);

  const jwt = getSellerToken();

  useEffect(() => {
    if (!jwt) return;
    dispatch(fetchSettlementSummary({ jwt, query: { size: 5 } }));
    dispatch(fetchSettlements({ jwt, query: { size: 5, sort: "settlementDate,desc" } }));
  }, [dispatch, jwt]);

  return (
    <Box>
      <SellerPageIntro
        eyebrow="Finance"
        title="Payments and settlements"
        description="Track incoming transaction activity and stay on top of payout status from one cleaner finance view."
        actions={
          <>
            <Button variant="outlined" onClick={() => navigate("/seller/transaction")} sx={sellerSecondaryButtonSx}>
              Full transactions
            </Button>
            <Button variant="contained" onClick={() => navigate("/seller/settlements")} sx={sellerPrimaryButtonSx}>
              Open settlements
            </Button>
          </>
        }
      />

      <Box
        sx={{
          display: "grid",
          gap: 2,
          gridTemplateColumns: { xs: "1fr", sm: "repeat(2, minmax(0, 1fr))", xl: "repeat(4, minmax(0, 1fr))" },
        }}
      >
        <SellerMetricCard
          label="Net earnings"
          value={formatSellerCurrency(settlement.summary?.totalNetAmount ?? sellers.report?.totalEarnings ?? 0)}
          helper="Best current estimate of payout value"
          tone="accent"
          icon={<AccountBalanceWalletRoundedIcon />}
        />
        <SellerMetricCard
          label="Pending settlements"
          value={String(settlement.summary?.pendingCount ?? 0)}
          helper="Awaiting payout processing"
          tone="warning"
          icon={<AutorenewRoundedIcon />}
        />
        <SellerMetricCard
          label="Completed settlements"
          value={String(settlement.summary?.completedCount ?? 0)}
          helper="Settlements already completed"
          tone="success"
          icon={<CheckCircleRoundedIcon />}
        />
        <SellerMetricCard
          label="Gross volume"
          value={formatSellerCurrency(settlement.summary?.totalGrossAmount ?? 0)}
          helper={`${formatSellerCurrency(settlement.summary?.totalCommission ?? 0)} commission tracked`}
          tone="info"
          icon={<ReceiptLongRoundedIcon />}
        />
      </Box>

      <SellerSection
        title="Finance workspace"
        description="Switch between transaction activity and recent settlement payouts."
        action={
          <Stack direction="row" spacing={1}>
            {tabs.map((item) => (
              <Button
                key={item}
                variant={item === tab ? "contained" : "outlined"}
                onClick={() => setTab(item)}
                sx={item === tab ? sellerPrimaryButtonSx : sellerSecondaryButtonSx}
              >
                {item}
              </Button>
            ))}
          </Stack>
        }
      >
        {tab === "Transactions" ? (
          <TransactionTable embedded />
        ) : (
          <Stack spacing={1.4}>
            {!settlement.loading && !(settlement.items || []).length ? (
              <Typography sx={{ color: "#64748B" }}>No settlement records yet.</Typography>
            ) : (
              (settlement.items || []).map((item) => (
                <Box
                  key={item.id}
                  sx={{
                    p: 1.8,
                    borderRadius: "12px",
                    border: "1px solid #DCE8EC",
                    bgcolor: "#F8FBFC",
                  }}
                >
                  <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" spacing={1.4}>
                    <Box>
                      <Typography sx={{ fontWeight: 800, color: "#0F172A" }}>Settlement #{item.id}</Typography>
                      <Typography sx={{ color: "#64748B", fontSize: ".82rem", mt: 0.4 }}>
                        Order #{item.orderId} • {formatSellerDate(item.settlementDate || item.createdAt)}
                      </Typography>
                    </Box>
                    <Stack spacing={0.8} alignItems={{ xs: "flex-start", sm: "flex-end" }}>
                      <Typography sx={{ fontWeight: 900, color: "#0F172A" }}>
                        {formatSellerCurrency(item.netSettlementAmount)}
                      </Typography>
                      <SellerStatusChip label={humanizeSellerValue(item.settlementStatus)} tone={item.settlementStatus === "COMPLETED" ? "success" : item.settlementStatus === "FAILED" || item.settlementStatus === "CANCELLED" ? "danger" : item.settlementStatus === "PENDING" ? "warning" : "info"} small />
                    </Stack>
                  </Stack>
                </Box>
              ))
            )}
          </Stack>
        )}
      </SellerSection>
    </Box>
  );
};

export default Payment;
