import { useEffect } from 'react'
import { Box } from '@mui/material'
import CouponTable from './CouponTable'
import CreateCouponForm from './CreateCouponForm'
import { useAppDispatch } from '../../../context/AppContext'
import { fetchAllCoupons } from '../../../store/admin/AdminCouponSlice'
import { useSearchParams } from 'react-router-dom'
const views = {
  LIST: 'list',
  CREATE: 'create',
}
const Coupon = () => {
  const dispatch = useAppDispatch()
  const [searchParams] = useSearchParams()
  const viewFromQuery = searchParams.get('view') === views.CREATE ? views.CREATE : views.LIST
  useEffect(() => {
    dispatch(fetchAllCoupons(localStorage.getItem('jwt') || ''))
  }, [dispatch])
  return (
    <Box className="grid gap-4">
      {viewFromQuery === views.LIST ? (
        <CouponTable />
      ) : (
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <CreateCouponForm />
        </Box>
      )}
    </Box>
  )
}
export default Coupon
