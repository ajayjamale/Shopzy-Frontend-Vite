import { Box, Modal, Radio, RadioGroup } from "@mui/material";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import CreditCardRoundedIcon from "@mui/icons-material/CreditCardRounded";
import { useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../Redux Toolkit/Store";
import { createOrder } from "../../../Redux Toolkit/Customer/OrderSlice";
import AddressCard from "./AddressCard";
import AddressForm from "./AddresssForm";
import PricingCard from "../Cart/PricingCard";

const paymentOptions = [
  { value: "RAZORPAY", label: "Razorpay", subtitle: "Cards, UPI, netbanking" },
];

const modalStyle = {
  position: "absolute" as const,
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  outline: "none",
};

const AddressPage = () => {
  const dispatch = useAppDispatch();
  const { user, orders } = useAppSelector((store) => store);

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [paymentGateway, setPaymentGateway] = useState("RAZORPAY");
  const [open, setOpen] = useState(false);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inFlightRef = useRef(false);

  const addresses = user.user?.addresses || [];

  const placeOrder = async (address: any) => {
    if (inFlightRef.current || placingOrder || orders.loading) return;

    setError(null);
    setPlacingOrder(true);
    inFlightRef.current = true;
    let shouldUnlock = true;

    try {
      const result = await dispatch(
        createOrder({
          paymentGateway,
          address,
          jwt: localStorage.getItem("jwt") || "",
        })
      ).unwrap();

      if (result?.payment_link_url) {
        shouldUnlock = false;
        window.location.assign(result.payment_link_url);
        return;
      }

      setError("Payment link was not received. Please try again.");
    } catch (err: any) {
      setError(typeof err === "string" ? err : "Could not create order");
    } finally {
      if (shouldUnlock) {
        setPlacingOrder(false);
        inFlightRef.current = false;
      }
    }
  };

  const isBusy = placingOrder || orders.loading;

  return (
    <div className="app-container py-7">
      <div className="mb-5">
        <p className="section-kicker mb-2">Checkout</p>
        <h1 style={{ fontSize: "clamp(1.7rem, 3vw, 2.3rem)" }}>Delivery & Payment</h1>
      </div>

      <div className="grid lg:grid-cols-[1fr_340px] gap-5 items-start">
        <section className="surface overflow-hidden" style={{ borderRadius: 18 }}>
          <div className="px-4 py-3 border-b border-[#E7EFF2] bg-[#F8FBFC] flex items-center justify-between gap-2 flex-wrap">
            <p className="text-sm font-semibold text-slate-800">Select delivery address</p>
            <button className="btn-secondary" onClick={() => setOpen(true)}>
              <AddRoundedIcon sx={{ fontSize: 16, mr: 0.5 }} />
              Add new
            </button>
          </div>

          {addresses.length ? (
            addresses.map((address, index) => (
              <AddressCard
                key={address.id || index}
                item={address}
                value={index}
                selectedValue={selectedIndex}
                handleChange={(event) => setSelectedIndex(Number(event.target.value))}
              />
            ))
          ) : (
            <div className="empty-state m-4">
              <p style={{ color: "#64748B" }}>No saved addresses. Add one to continue.</p>
            </div>
          )}

          <div className="p-4 border-t border-[#E7EFF2]">
            <p className="text-sm font-semibold text-slate-800 mb-3 flex items-center gap-2">
              <CreditCardRoundedIcon sx={{ fontSize: 18 }} />
              Payment method
            </p>
            <RadioGroup
              value={paymentGateway}
              onChange={(event) => setPaymentGateway(event.target.value)}
              className="grid gap-2"
            >
              {paymentOptions.map((option) => (
                <label
                  key={option.value}
                  className="border rounded-xl px-3 py-3 flex items-start gap-2 cursor-pointer"
                  style={{
                    borderColor: paymentGateway === option.value ? "#5CAEA6" : "#D6E4E8",
                    background: paymentGateway === option.value ? "#EAF7F5" : "#fff",
                  }}
                >
                  <Radio value={option.value} size="small" sx={{ color: "#0F766E", "&.Mui-checked": { color: "#0F766E" } }} />
                  <span>
                    <span className="block text-sm font-semibold text-slate-800">{option.label}</span>
                    <span className="block text-xs text-slate-500">{option.subtitle}</span>
                  </span>
                </label>
              ))}
            </RadioGroup>
          </div>
        </section>

        <aside className="surface overflow-hidden lg:sticky lg:top-28" style={{ borderRadius: 18 }}>
          <PricingCard />
          <div className="px-5 pb-5">
            <button
              className="btn-primary w-full"
              onClick={() => addresses[selectedIndex] && placeOrder(addresses[selectedIndex])}
              disabled={!addresses.length || isBusy}
            >
              {isBusy ? "Processing..." : "Place Order"}
            </button>
            {error && (
              <p className="text-xs text-rose-700 mt-2">{error}</p>
            )}
          </div>
        </aside>
      </div>

      <Modal open={open} onClose={() => setOpen(false)}>
        <Box sx={modalStyle}>
          <AddressForm
            paymentGateway={paymentGateway}
            handleClose={() => setOpen(false)}
            onAddressSaved={async (address) => {
              setOpen(false);
              await placeOrder(address);
            }}
          />
        </Box>
      </Modal>
    </div>
  );
};

export default AddressPage;
