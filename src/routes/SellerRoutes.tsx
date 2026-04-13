import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import HomePage from '../seller/pages/SellerDashboard/HomePage'
import Products from '../seller/pages/Products/Products'
import ProductForm from '../seller/pages/Products/AddProductForm'
import Orders from '../seller/pages/Orders/Orders'
import Profile from '../seller/pages/Account/Profile'
import Payment from '../seller/pages/Payment/Payment'
import TransactionTable from '../seller/pages/Payment/TransactionTable'
import Invetory from '../seller/pages/Invetory/Invetory'
import UpdateProductForm from '../seller/pages/Products/UpdateProductForm'
import SettlementPage from '../seller/pages/Settlement/SettlementPage'
import SettlementDetail from '../seller/pages/Settlement/SettlementDetail'
import SellerReturns from '../seller/pages/Returns/SellerReturns'

const SellerRoutes = () => {
  return (
         <Routes>
        <Route index element={<HomePage />} />
        <Route path='products' element={<Products />} />
        <Route path='add-product' element={<ProductForm />} />
        <Route path='update-product/:productId' element={<UpdateProductForm />} />
        <Route path='orders' element={<Orders />} />
        <Route path='invetory' element={<Navigate to="/seller/inventory" replace />} />
        <Route path='inventory' element={<Invetory />} />
        <Route path='account' element={<Profile />} />
        <Route path='payment' element={<Payment />} />
        <Route path='transaction' element={<TransactionTable/>} />
        <Route path='returns' element={<SellerReturns/>} />
        <Route path='settlements' element={<SettlementPage/>} />
        <Route path='settlements/:id' element={<SettlementDetail />} />
        <Route path='*' element={<Navigate to="/seller" replace />} />
       </Routes>
  )
}

export default SellerRoutes
