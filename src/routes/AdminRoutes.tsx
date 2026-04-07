import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import SellersTable from "../admin/pages/sellers/SellersTable";
import Coupon from "../admin/pages/Coupon/Coupon";
import CouponForm from "../admin/pages/Coupon/CreateCouponForm";
import GridTable from "../admin/pages/Home Page/GridTable";
import ElectronicsTable from "../admin/pages/Home Page/ElectronicsTable";
import ShopByCategoryTable from "../admin/pages/Home Page/ShopByCategoryTable";
import Deal from "../admin/pages/Home Page/Deal";
import AdminSettlementList from "../admin/pages/Settlement/AdminSettlementList";
import AdminSettlementDetail from "../admin/pages/Settlement/AdminSettlementDetail";
import HomeContentManager from "../admin/pages/Home Page/HomeContentManager";
import UserManagement from "../admin/pages/Dashboard/UserManagement";
import AdminReturns from "../admin/pages/Returns/AdminReturns";

const AdminRoutes = () => {
  return (
    <Routes>
      <Route index element={<SellersTable />} />
      <Route path="coupon" element={<Coupon />} />
      <Route path="add-coupon" element={<CouponForm />} />
      <Route path="home-grid" element={<GridTable />} />
      <Route path="electronics-category" element={<ElectronicsTable />} />
      <Route path="shop-by-category" element={<ShopByCategoryTable />} />
      <Route path="deals" element={<Deal />} />
      <Route path="home-content" element={<HomeContentManager />} />
      <Route path="settlements" element={<AdminSettlementList />} />
      <Route path="settlements/:id" element={<AdminSettlementDetail />} />
      <Route path="returns" element={<AdminReturns />} />
      <Route path="users" element={<UserManagement />} />
      <Route path="*" element={<Navigate to="/admin" replace />} />
    </Routes>
  );
};

export default AdminRoutes;
