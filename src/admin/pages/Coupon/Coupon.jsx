import { useEffect } from 'react'
import { Box, Typography } from '@mui/material'
import LocalOfferRoundedIcon from '@mui/icons-material/LocalOfferRounded'
import CouponTable from './CouponTable'
import { useAppDispatch } from '../../../context/AppContext'
import { fetchAllCoupons } from '../../../store/admin/AdminCouponSlice'
const Coupon = () => {
  const dispatch = useAppDispatch()
  useEffect(() => {
    dispatch(fetchAllCoupons(localStorage.getItem('jwt') || ''))
  }, [dispatch])
  return (
    <Box className="grid gap-4">
      <Box className="surface p-5" sx={{ borderRadius: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
          <LocalOfferRoundedIcon sx={{ color: '#0F766E' }} />
          <Typography variant="h6" fontWeight={700}>
            Coupon Management
          </Typography>
        </Box>
      </Box>
      <CouponTable />
    </Box>
  )
}
export default Coupon
