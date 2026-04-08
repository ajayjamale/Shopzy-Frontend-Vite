import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../Redux Toolkit/Store";
import { fetchSettlementSummary, fetchSettlements } from "../../../Redux Toolkit/Seller/settlementSlice";
import { getSellerToken } from "../../../util/authToken";
import TransactionTable from "./TransactionTable";

const tabs = ["Transactions", "Settlements"] as const;

const Payment = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { sellers, settlement } = useAppSelector((store) => store);
  const [tab, setTab] = useState<(typeof tabs)[number]>("Transactions");

  const jwt = getSellerToken();

  useEffect(() => {
    if (!jwt) return;

    dispatch(fetchSettlementSummary({ jwt, query: { size: 5 } }));
    dispatch(fetchSettlements({ jwt, query: { size: 5, sort: "settlementDate,desc" } }));
  }, [jwt, dispatch]);

  return (
    <div className="grid gap-4">
      <div className="surface p-5" style={{ borderRadius: 16 }}>
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <p className="section-kicker mb-2">Finance</p>
            <h1 style={{ fontSize: "1.45rem" }}>Payments and settlements</h1>
            <p className="text-sm text-slate-500 mt-1">Track transactions and payout status.</p>
          </div>
          <button className="btn-secondary" onClick={() => navigate("/seller/settlements")}>Open settlements dashboard</button>
        </div>

        <div className="grid sm:grid-cols-3 gap-3 mt-5">
          <article className="surface-soft p-4" style={{ borderRadius: 12 }}>
            <p className="text-xs text-slate-500 uppercase tracking-[0.12em] font-bold">Net earnings</p>
            <p className="text-xl font-bold text-slate-900 mt-2">
              Rs. {Number(settlement.summary?.totalNetAmount ?? sellers.report?.totalEarnings ?? 0).toLocaleString("en-IN")}
            </p>
          </article>
          <article className="surface-soft p-4" style={{ borderRadius: 12 }}>
            <p className="text-xs text-slate-500 uppercase tracking-[0.12em] font-bold">Pending settlements</p>
            <p className="text-xl font-bold text-slate-900 mt-2">{settlement.summary?.pendingCount ?? 0}</p>
          </article>
          <article className="surface-soft p-4" style={{ borderRadius: 12 }}>
            <p className="text-xs text-slate-500 uppercase tracking-[0.12em] font-bold">Completed settlements</p>
            <p className="text-xl font-bold text-slate-900 mt-2">{settlement.summary?.completedCount ?? 0}</p>
          </article>
        </div>
      </div>

      <div className="surface p-4" style={{ borderRadius: 16 }}>
        <div className="flex gap-2 mb-4 flex-wrap">
          {tabs.map((item) => (
            <button
              key={item}
              onClick={() => setTab(item)}
              className={item === tab ? "btn-primary" : "btn-secondary"}
              style={{ height: 34 }}
            >
              {item}
            </button>
          ))}
        </div>

        {tab === "Transactions" ? (
          <TransactionTable />
        ) : (
          <div className="grid gap-2">
            {settlement.loading && <p className="text-sm text-slate-500">Loading settlements...</p>}
            {!settlement.loading && !(settlement.items || []).length && (
              <div className="empty-state">
                <p style={{ color: "#64748B" }}>No settlement records yet.</p>
              </div>
            )}
            {(settlement.items || []).map((item) => (
              <article key={item.id} className="surface-soft p-3" style={{ borderRadius: 12 }}>
                <div className="flex justify-between gap-3 flex-wrap">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">Settlement #{item.id}</p>
                    <p className="text-xs text-slate-500 mt-1">Order #{item.orderId}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-slate-900">Rs. {item.netSettlementAmount.toLocaleString("en-IN")}</p>
                    <p className="text-xs font-semibold text-emerald-700 mt-1">{item.settlementStatus}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Payment;
