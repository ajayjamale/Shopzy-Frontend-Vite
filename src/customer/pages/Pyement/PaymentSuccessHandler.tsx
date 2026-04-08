import { useEffect, useRef } from "react";
import ErrorOutlineRoundedIcon from "@mui/icons-material/ErrorOutlineRounded";
import { useLocation, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../Redux Toolkit/Store";
import { clearCart } from "../../../Redux Toolkit/Customer/CartSlice";
import { paymentSuccess } from "../../../Redux Toolkit/Customer/OrderSlice";

const PaymentSuccessHandler = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { loading, paymentConfirmed, error } = useAppSelector((store) => store.orders);
  const sentRef = useRef(false);

  const search = new URLSearchParams(location.search);
  const paymentId = search.get("razorpay_payment_id");
  const paymentLinkId = search.get("razorpay_payment_link_id") || "";

  useEffect(() => {
    if (!paymentId || sentRef.current) return;

    sentRef.current = true;
    dispatch(
      paymentSuccess({
        paymentId,
        paymentLinkId,
        jwt: localStorage.getItem("jwt") || "",
      })
    );
  }, [paymentId, paymentLinkId, dispatch]);

  useEffect(() => {
    if (paymentConfirmed) {
      dispatch(clearCart());
      navigate("/order-placed", {
        replace: true,
        state: {
          paymentId: paymentId || undefined,
        },
      });
    }
  }, [paymentConfirmed, dispatch, navigate, paymentId]);

  if (loading) {
    return (
      <div className="app-container py-16 flex justify-center">
        <div className="surface p-10 text-center" style={{ borderRadius: 20, maxWidth: 460 }}>
          <p className="text-sm text-slate-500">Confirming your payment...</p>
        </div>
      </div>
    );
  }

  if (error && !paymentConfirmed) {
    return (
      <div className="app-container py-16 flex justify-center">
        <div className="surface p-10 text-center" style={{ borderRadius: 20, maxWidth: 500 }}>
          <ErrorOutlineRoundedIcon sx={{ fontSize: 54, color: "#BE123C" }} />
          <h2 style={{ fontSize: "1.5rem", marginTop: 12 }}>Payment verification failed</h2>
          <p className="text-sm text-slate-500 mt-2">{error}</p>
          <div className="mt-5">
            <button className="btn-primary" onClick={() => navigate("/")}>Back to home</button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default PaymentSuccessHandler;
