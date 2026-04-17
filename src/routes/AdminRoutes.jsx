import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Coupon from '../admin/pages/Coupon/Coupon'
import CouponForm from '../admin/pages/Coupon/CreateCouponForm'
import AdminAnalyticsDashboard from '../admin/pages/Dashboard/AdminAnalyticsDashboard'
import Deal from '../admin/pages/Home Page/Deal'
import AdminSettlementList from '../admin/pages/Settlement/AdminSettlementList'
import AdminSettlementDetail from '../admin/pages/Settlement/AdminSettlementDetail'
import HomeContentManager from '../admin/pages/Home Page/HomeContentManager'
import UserManagement from '../admin/pages/Dashboard/UserManagement'
import AdminReturns from '../admin/pages/Returns/AdminReturns'
const AdminRoutes = () => {
  return (
    <Routes>
      <Route index element={<AdminAnalyticsDashboard />} />
      <Route path="coupon" element={<Coupon />} />
      <Route path="add-coupon" element={<CouponForm />} />
      <Route path="home-content" element={<HomeContentManager />} />
      <Route path="home-grid" element={<Navigate to="/admin/home-content" replace />} />
      <Route path="electronics-category" element={<Navigate to="/admin/home-content" replace />} />
      <Route path="shop-by-category" element={<Navigate to="/admin/home-content" replace />} />
      <Route path="deals" element={<Deal />} />
      <Route path="daily-deals" element={<Deal />} />
      <Route path="daily-discounts" element={<Deal />} />
      <Route path="settlements" element={<AdminSettlementList />} />
      <Route path="settlements/:id" element={<AdminSettlementDetail />} />
      <Route path="returns" element={<AdminReturns />} />
      <Route path="users" element={<UserManagement />} />
      <Route path="*" element={<Navigate to="/admin" replace />} />
    </Routes>
  )
}
export default AdminRoutes
