import { useEffect } from 'react'
import { Box } from '@mui/material'
import { useSearchParams } from 'react-router-dom'
import DealsTable from './DealsTable'
import CreateDealForm from './CreateDealForm'
import { useAppDispatch } from '../../../context/AppContext'
import { getAllDailyDiscounts } from '../../../store/admin/DealSlice'
const views = {
  LIST: 'list',
  CREATE: 'create',
}
const Deal = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const dispatch = useAppDispatch()
  const viewFromQuery = searchParams.get('view') === views.CREATE ? views.CREATE : views.LIST
  useEffect(() => {
    dispatch(getAllDailyDiscounts())
  }, [dispatch])
  return (
    <Box
      sx={{
        backgroundColor: '#F3F7F8',
        minHeight: '100vh',
        p: {
          xs: 1.5,
          md: 2.5,
        },
      }}
    >
      <Box>
        {viewFromQuery === views.LIST && <DealsTable />}
        {viewFromQuery === views.CREATE && (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              pt: 2,
            }}
          >
            <CreateDealForm
              onSuccess={() => {
                const nextParams = new URLSearchParams(searchParams)
                nextParams.delete('view')
                setSearchParams(nextParams, { replace: true })
                dispatch(getAllDailyDiscounts())
              }}
            />
          </Box>
        )}
      </Box>
    </Box>
  )
}
export default Deal
