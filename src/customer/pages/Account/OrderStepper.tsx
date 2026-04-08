import React, { useMemo } from "react";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import "./Profile.css";

interface Step {
  name: string;
  description: string;
  value: string;
}

interface OrderStepperProps {
  orderStatus?: string | null;
}

const ORDER_FLOW_STEPS: Step[] = [
  { name: "Order Placed", description: "Received", value: "PLACED" },
  { name: "Confirmed", description: "Warehouse", value: "CONFIRMED" },
  { name: "Shipped", description: "On the way", value: "SHIPPED" },
  { name: "Delivered", description: "Completed", value: "DELIVERED" },
];

const CANCELLED_FLOW_STEPS: Step[] = [
  { name: "Order Placed", description: "Received", value: "PLACED" },
  { name: "Cancelled", description: "Refund initiated", value: "CANCELLED" },
];

const RETURN_FLOW_STEPS: Step[] = [
  { name: "Order Placed", description: "Received", value: "PLACED" },
  { name: "Delivered", description: "Completed", value: "DELIVERED" },
  { name: "Return Requested", description: "Under review", value: "RETURN_REQUESTED" },
  { name: "Refund Initiated", description: "Processing", value: "REFUND_INITIATED" },
  { name: "Returned", description: "Refund completed", value: "RETURNED" },
];

const RETURN_FLOW_STATUSES = new Set(["RETURN_REQUESTED", "REFUND_INITIATED", "RETURNED"]);

const STATUS_ALIAS_MAP: Record<string, string> = {
  PENDING: "PLACED",
  ORDER_PLACED: "PLACED",
  ARRIVING: "SHIPPED",
  OUT_FOR_DELIVERY: "SHIPPED",
  REFUNDED: "RETURNED",
  RETURN_COMPLETED: "RETURNED",
};

const normalizeStatus = (status?: string | null): string => {
  const value = (status || "").toUpperCase().trim();
  if (!value) return "PLACED";
  return STATUS_ALIAS_MAP[value] || value;
};

const getStepsForStatus = (status: string) => {
  if (status === "CANCELLED") return CANCELLED_FLOW_STEPS;
  if (RETURN_FLOW_STATUSES.has(status)) return RETURN_FLOW_STEPS;
  return ORDER_FLOW_STEPS;
};

const OrderStepper: React.FC<OrderStepperProps> = ({ orderStatus }) => {
  const normalizedStatus = useMemo(() => normalizeStatus(orderStatus), [orderStatus]);
  const statusSteps = useMemo(() => getStepsForStatus(normalizedStatus), [normalizedStatus]);

  const currentIndex = useMemo(() => {
    if (normalizedStatus === "CANCELLED") return statusSteps.length - 1;
    const foundIndex = statusSteps.findIndex((step) => step.value === normalizedStatus);
    return foundIndex >= 0 ? foundIndex : 0;
  }, [normalizedStatus, statusSteps]);

  const fillPct = statusSteps.length > 1 ? (currentIndex / (statusSteps.length - 1)) * 100 : 0;
  const isCancelledFlow = normalizedStatus === "CANCELLED";

  return (
    <div
      className="amz-stepper"
      role="list"
      style={{ "--amz-step-count": statusSteps.length } as React.CSSProperties}
    >
      <div className="amz-stepper-track">
        <div
          className={`amz-stepper-fill ${isCancelledFlow ? "cancelled" : ""}`}
          style={{ width: `${fillPct}%` }}
        />
      </div>

      {statusSteps.map((step, index) => {
        const isDone = index < currentIndex;
        const isCurrent = index === currentIndex;
        const isCancelStep = step.value === "CANCELLED";

        return (
          <div
            key={step.value}
            className="amz-stepper-step"
            role="listitem"
            aria-current={isCurrent ? "step" : undefined}
          >
            <div
              className={`amz-stepper-circle ${
                isCancelStep ? "cancelled" : isDone ? "done" : isCurrent ? "current" : ""
              }`}
            >
              {isCancelStep ? (
                <CloseIcon style={{ fontSize: "0.875rem" }} />
              ) : isDone ? (
                <CheckIcon style={{ fontSize: "0.875rem" }} />
              ) : (
                <span>{index + 1}</span>
              )}
            </div>

            <div
              className={`amz-stepper-label ${
                isCancelStep ? "cancelled" : isDone || isCurrent ? "active" : ""
              }`}
            >
              {step.name}
              <span className="amz-stepper-label-sub">{step.description}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default OrderStepper;
