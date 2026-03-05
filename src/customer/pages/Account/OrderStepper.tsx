import React, { useEffect, useState } from "react";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import "./Profile.css";

interface Step { name: string; description: string; value: string; }

const steps: Step[] = [
  { name: "Order Placed", description: "Received",       value: "PLACED"    },
  { name: "Confirmed",    description: "Warehouse",      value: "CONFIRMED" },
  { name: "Shipped",      description: "On the way",     value: "SHIPPED"   },
  { name: "Out for Delivery", description: "Arriving",   value: "ARRIVING"  },
  { name: "Delivered",    description: "Completed",      value: "DELIVERED" },
];

const cancelledSteps: Step[] = [
  { name: "Order Placed", description: "Received",       value: "PLACED"    },
  { name: "Cancelled",    description: "Refund initiated", value: "CANCELLED" },
];

const OrderStepper: React.FC<{ orderStatus: string }> = ({ orderStatus }) => {
  const [statusSteps, setStatusSteps] = useState<Step[]>(steps);
  const [currentIndex, setCurrentIndex] = useState(0);
  const isCancelled = orderStatus === "CANCELLED";

  useEffect(() => {
    if (isCancelled) {
      setStatusSteps(cancelledSteps);
      setCurrentIndex(1);
    } else {
      setStatusSteps(steps);
      const idx = steps.findIndex((s) => s.value === orderStatus);
      setCurrentIndex(idx >= 0 ? idx : 0);
    }
  }, [orderStatus]);

  const fillPct = statusSteps.length > 1
    ? (currentIndex / (statusSteps.length - 1)) * 100
    : 0;

  return (
    <div className="amz-stepper">
      {/* Track */}
      <div className="amz-stepper-track">
        <div
          className={`amz-stepper-fill ${isCancelled ? "cancelled" : ""}`}
          style={{ width: `${fillPct}%` }}
        />
      </div>

      {statusSteps.map((step, index) => {
        const isDone      = index < currentIndex;
        const isCurrent   = index === currentIndex;
        const isCancelStep = step.value === "CANCELLED";

        return (
          <div key={index} className="amz-stepper-step">
            <div
              className={`amz-stepper-circle ${
                isCancelStep ? "cancelled"
                : isDone     ? "done"
                : isCurrent  ? "current"
                : ""
              }`}
            >
              {isCancelStep ? <CloseIcon style={{ fontSize: "0.875rem" }} />
               : (isDone || isCurrent) ? <CheckIcon style={{ fontSize: "0.875rem" }} />
               : <span>{index + 1}</span>}
            </div>
            <div
              className={`amz-stepper-label ${
                isCancelStep ? "cancelled"
                : (isDone || isCurrent) ? "active"
                : ""
              }`}
            >
              {step.name}
              <br />
              <span style={{ fontWeight: "normal", opacity: 0.7 }}>{step.description}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default OrderStepper;