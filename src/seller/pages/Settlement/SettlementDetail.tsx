import React, { useEffect } from "react";
import { Box, Button, LinearProgress, Stack, Typography } from "@mui/material";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import AccountBalanceWalletRoundedIcon from "@mui/icons-material/AccountBalanceWalletRounded";
import ReceiptLongRoundedIcon from "@mui/icons-material/ReceiptLongRounded";
import DescriptionRoundedIcon from "@mui/icons-material/DescriptionRounded";
import { useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../store";
import { fetchSettlementById, updateSettlementStatus } from "../../../store/seller/settlementSlice";
import type { SettlementStatus } from "../../../types/settlementTypes";
import { getSellerToken } from "../../../utils/authToken";
import {
  SellerEmptyState,
  SellerKeyValue,
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

const toneForStatus = (status: string) => {
  if (status === "COMPLETED") return "success" as const;
  if (status === "FAILED" || status === "CANCELLED") return "danger" as const;
  if (status === "PENDING" || status === "ON_HOLD") return "warning" as const;
  if (status === "PROCESSING" || status === "ELIGIBLE") return "info" as const;
  return "default" as const;
};

const statusActions: SettlementStatus[] = ["PENDING", "PROCESSING", "COMPLETED", "FAILED", "CANCELLED"];

const SettlementDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { settlement } = useAppSelector((state) => state);
  const jwt = getSellerToken();

  useEffect(() => {
    if (id && jwt) {
      dispatch(fetchSettlementById({ jwt, id: Number(id) }));
    }
  }, [dispatch, id, jwt]);

  const data = settlement.current;

  const handleStatus = (status: SettlementStatus) => {
    if (!data || !jwt) return;
    dispatch(updateSettlementStatus({ jwt, id: data.id, status }));
  };

  return (
    <Box>
      <SellerPageIntro
        eyebrow="Finance"
        title={`Settlement #${id}`}
        description="Detailed payout breakdown with status controls and deduction visibility."
        actions={
          <Button variant="outlined" startIcon={<ArrowBackRoundedIcon />} onClick={() => navigate(-1)} sx={sellerSecondaryButtonSx}>
            Back
          </Button>
        }
      />

      {settlement.loading && !data ? <LinearProgress sx={{ mb: 2 }} /> : null}

      {!data ? (
        <SellerEmptyState
          title="Settlement not available"
          description={settlement.error || "The requested settlement could not be loaded right now."}
        />
      ) : (
        <>
          <Box
            sx={{
              display: "grid",
              gap: 2,
              gridTemplateColumns: { xs: "1fr", md: "repeat(3, minmax(0, 1fr))" },
              mb: 2,
            }}
          >
            <SellerMetricCard
              label="Net amount"
              value={formatSellerCurrency(data.netSettlementAmount)}
              helper={`Status: ${humanizeSellerValue(data.settlementStatus)}`}
              tone="accent"
              icon={<AccountBalanceWalletRoundedIcon />}
            />
            <SellerMetricCard
              label="Gross amount"
              value={formatSellerCurrency(data.grossAmount)}
              helper="Pre-deduction payout value"
              tone="info"
              icon={<ReceiptLongRoundedIcon />}
            />
            <SellerMetricCard
              label="Settlement date"
              value={formatSellerDate(data.settlementDate || data.createdAt)}
              helper={data.paymentMethod || "Payment method not specified"}
              tone="default"
              icon={<DescriptionRoundedIcon />}
            />
          </Box>

          <Box
            sx={{
              display: "grid",
              gap: 2,
              gridTemplateColumns: { xs: "1fr", xl: "1.2fr 1fr" },
            }}
          >
            <SellerSection
              title="Settlement summary"
              description="Core identifiers, payout status, and order linkage."
              action={<SellerStatusChip label={humanizeSellerValue(data.settlementStatus)} tone={toneForStatus(data.settlementStatus)} />}
            >
              <SellerKeyValue label="Order" value={`#${data.orderId}`} />
              <SellerKeyValue label="Transaction" value={data.transactionId || "Not provided"} />
              <SellerKeyValue label="Payment method" value={data.paymentMethod || "Not provided"} />
              <SellerKeyValue label="Order reference" value={data.orderReference || "Not provided"} />
              <SellerKeyValue label="Created" value={formatSellerDate(data.createdAt)} />
            </SellerSection>

            <SellerSection title="Amount breakdown" description="How the payout was derived from the order amount.">
              <SellerKeyValue label="Gross amount" value={formatSellerCurrency(data.grossAmount)} />
              <SellerKeyValue label="Commission" value={formatSellerCurrency(data.commissionAmount)} />
              <SellerKeyValue label="Platform fee" value={formatSellerCurrency(data.platformFee)} />
              <SellerKeyValue label="Tax" value={formatSellerCurrency(data.taxAmount)} />
              <SellerKeyValue label="Net payable" value={formatSellerCurrency(data.netSettlementAmount)} />
            </SellerSection>

            <SellerSection title="Remarks" description="Settlement notes or admin comments captured for this payout.">
              <Typography sx={{ color: "#64748B" }}>{data.remarks || "No remarks added for this settlement."}</Typography>
            </SellerSection>

            <SellerSection title="Status actions" description="Move the settlement into the next operational state when needed.">
              <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
                {statusActions.map((status) => (
                  <Button
                    key={status}
                    variant={data.settlementStatus === status ? "contained" : "outlined"}
                    onClick={() => handleStatus(status)}
                    disabled={settlement.loading}
                    sx={data.settlementStatus === status ? sellerPrimaryButtonSx : sellerSecondaryButtonSx}
                  >
                    {humanizeSellerValue(status)}
                  </Button>
                ))}
              </Stack>
            </SellerSection>
          </Box>
        </>
      )}
    </Box>
  );
};

export default SettlementDetail;
