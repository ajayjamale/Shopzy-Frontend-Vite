import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  Avatar,
  Box,
  LinearProgress,
  MenuItem,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material'
import ShoppingBagRoundedIcon from '@mui/icons-material/ShoppingBagRounded'
import ReplayRoundedIcon from '@mui/icons-material/ReplayRounded'
import LocalShippingRoundedIcon from '@mui/icons-material/LocalShippingRounded'
import { useAppDispatch, useAppSelector } from '../../../context/AppContext'
import { fetchSellerOrders, updateOrderStatus } from '../../../store/seller/sellerOrderSlice'
import { OrderStatus } from '../../../types/orderTypes'
import { getSellerToken } from '../../../utils/authToken'
import {
  SellerEmptyState,
  SellerMetricCard,
  SellerPageIntro,
  SellerSection,
  SellerStatusChip,
  formatSellerCurrency,
  formatSellerDateTime,
  humanizeSellerValue,
  sellerInputSx,
  sellerTableCellSx,
  sellerTableHeadCellSx,
} from '../../theme/sellerUi'
const statusOptions = [
  OrderStatus.PENDING,
  OrderStatus.PLACED,
  OrderStatus.CONFIRMED,
  OrderStatus.SHIPPED,
  OrderStatus.DELIVERED,
  OrderStatus.CANCELLED,
]
const returnManagedStatuses = new Set([
  OrderStatus.RETURN_REQUESTED,
  OrderStatus.REFUND_INITIATED,
  OrderStatus.RETURNED,
])
const statusTone = (status) => {
  if (status === 'DELIVERED') return 'success'
  if (status === 'SHIPPED' || status === 'CONFIRMED' || status === 'PLACED') return 'info'
  if (status === 'PENDING') return 'warning'
  if (status === 'RETURN_REQUESTED' || status === 'REFUND_INITIATED' || status === 'RETURNED')
    return 'accent'
  if (status === 'CANCELLED') return 'danger'
  return 'default'
}
const OrderTable = () => {
  const dispatch = useAppDispatch()
  const { sellerOrder } = useAppSelector((state) => state)
  const jwt = useMemo(() => getSellerToken(), [])
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('ALL')
  const refreshOrders = useCallback(() => {
    if (!jwt) return
    dispatch(fetchSellerOrders(jwt))
  }, [dispatch, jwt])
  useEffect(() => {
    if (!jwt) return
    refreshOrders()
    const onFocus = () => refreshOrders()
    const intervalId = window.setInterval(refreshOrders, 30000)
    window.addEventListener('focus', onFocus)
    return () => {
      window.clearInterval(intervalId)
      window.removeEventListener('focus', onFocus)
    }
  }, [jwt, refreshOrders])
  const handleUpdate = (orderId, status) => {
    if (!jwt) return
    dispatch(
      updateOrderStatus({
        jwt,
        orderId,
        orderStatus: status,
      }),
    )
  }
  const orders = sellerOrder.orders ?? []
  const filteredOrders = useMemo(() => {
    const q = query.trim().toLowerCase()
    return orders.filter((order) => {
      const matchesFilter = filter === 'ALL' ? true : order.orderStatus === filter
      if (!matchesFilter) return false
      if (!q) return true
      return [
        order.id,
        order.orderId,
        order.shippingAddress?.name,
        order.shippingAddress?.city,
        order.shippingAddress?.state,
        order.orderStatus,
        ...order.orderItems.map((item) => item.product.title),
      ]
        .map((value) => String(value ?? '').toLowerCase())
        .some((value) => value.includes(q))
    })
  }, [filter, orders, query])
  const delivered = orders.filter((order) => order.orderStatus === 'DELIVERED').length
  const shipped = orders.filter((order) => order.orderStatus === 'SHIPPED').length
  const returnQueue = orders.filter((order) => returnManagedStatuses.has(order.orderStatus)).length
  const pending = orders.filter(
    (order) => order.orderStatus === 'PENDING' || order.orderStatus === 'PLACED',
  ).length
  return (
    <Box>
      <SellerPageIntro
        eyebrow="Sales"
        title="Order operations"
        description="Track current fulfillment, update shipment states, and keep the delivery pipeline moving without scanning through noisy rows."
      />

      <Box
        sx={{
          display: 'grid',
          gap: 2,
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, minmax(0, 1fr))',
            xl: 'repeat(4, minmax(0, 1fr))',
          },
        }}
      >
        <SellerMetricCard
          label="Total orders"
          value={orders.length.toLocaleString('en-IN')}
          helper="All seller-side order records"
          tone="accent"
          icon={<ShoppingBagRoundedIcon />}
        />
        <SellerMetricCard
          label="Pending queue"
          value={pending.toLocaleString('en-IN')}
          helper="Orders waiting for confirmation or dispatch"
          tone="warning"
          icon={<LocalShippingRoundedIcon />}
        />
        <SellerMetricCard
          label="Shipped"
          value={shipped.toLocaleString('en-IN')}
          helper="Orders in transit right now"
          tone="info"
          icon={<LocalShippingRoundedIcon />}
        />
        <SellerMetricCard
          label="Delivered / returns"
          value={`${delivered} / ${returnQueue}`}
          helper="Delivered orders and return-managed orders"
          tone="success"
          icon={<ReplayRoundedIcon />}
        />
      </Box>

      <Box sx={{ mt: 2 }}>
        <SellerSection
          title="Order queue"
          description="Filter by status or search by order id, buyer name, and product title."
          padded={false}
        >
          {sellerOrder.loading ? <LinearProgress /> : null}

          <Stack
            direction={{ xs: 'column', lg: 'row' }}
            spacing={1.5}
            sx={{ px: 2.4, py: 2, borderBottom: '1px solid #DCE8EC' }}
          >
            <TextField
              size="small"
              placeholder="Search orders, buyers, or products"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              sx={{ ...sellerInputSx, flex: 1, minWidth: 240 }}
            />
            <TextField
              select
              size="small"
              value={filter}
              onChange={(event) => setFilter(event.target.value)}
              sx={{ ...sellerInputSx, minWidth: 200 }}
            >
              <MenuItem value="ALL">All statuses</MenuItem>
              {[...statusOptions, 'RETURN_REQUESTED', 'REFUND_INITIATED', 'RETURNED'].map(
                (status) => (
                  <MenuItem key={status} value={status}>
                    {humanizeSellerValue(status)}
                  </MenuItem>
                ),
              )}
            </TextField>
          </Stack>

          {!filteredOrders.length && !sellerOrder.loading ? (
            <Box sx={{ p: 2.4 }}>
              <SellerEmptyState
                title="No orders found"
                description="Try clearing the filters or wait for new orders to sync into the seller panel."
              />
            </Box>
          ) : (
            <TableContainer>
              <Table sx={{ minWidth: 1080 }}>
                <TableHead>
                  <TableRow>
                    <TableCell sx={sellerTableHeadCellSx}>Order</TableCell>
                    <TableCell sx={sellerTableHeadCellSx}>Items</TableCell>
                    <TableCell sx={sellerTableHeadCellSx}>Customer</TableCell>
                    <TableCell sx={sellerTableHeadCellSx} align="right">
                      Value
                    </TableCell>
                    <TableCell sx={sellerTableHeadCellSx}>Status</TableCell>
                    <TableCell sx={sellerTableHeadCellSx}>Update</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredOrders.map((order) => (
                    <OrderRow key={order.id} order={order} onUpdate={handleUpdate} />
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </SellerSection>
      </Box>
    </Box>
  )
}
const OrderRow = ({ order, onUpdate }) => {
  const primaryItem = order.orderItems[0]
  const additionalItems = Math.max(order.orderItems.length - 1, 0)
  const manageReturns = returnManagedStatuses.has(order.orderStatus)
  return (
    <TableRow hover>
      <TableCell sx={sellerTableCellSx}>
        <Typography sx={{ fontWeight: 800 }}>#{order.id}</Typography>
        <Typography sx={{ fontSize: '.8rem', color: '#64748B', mt: 0.4 }}>
          {formatSellerDateTime(order.createdAt || order.orderDate)}
        </Typography>
      </TableCell>
      <TableCell sx={sellerTableCellSx}>
        <Stack direction="row" spacing={1.4} alignItems="center">
          <Avatar
            variant="rounded"
            src={primaryItem?.product.images?.[0]}
            alt={primaryItem?.product.title}
            sx={{ width: 52, height: 52, borderRadius: '12px', border: '1px solid #DCE8EC' }}
          />
          <Box sx={{ minWidth: 0 }}>
            <Typography sx={{ fontWeight: 800 }}>
              {primaryItem?.product.title || 'Order item'}
            </Typography>
            <Typography sx={{ fontSize: '.8rem', color: '#64748B', mt: 0.4 }}>
              Qty {primaryItem?.quantity ?? order.totalItem} • {primaryItem?.size || 'No size'}
            </Typography>
            {additionalItems > 0 ? (
              <Typography sx={{ fontSize: '.78rem', color: '#0F766E', mt: 0.5, fontWeight: 700 }}>
                +{additionalItems} more item{additionalItems > 1 ? 's' : ''}
              </Typography>
            ) : null}
          </Box>
        </Stack>
      </TableCell>
      <TableCell sx={sellerTableCellSx}>
        <Typography sx={{ fontWeight: 800 }}>
          {order.shippingAddress?.name || 'Customer'}
        </Typography>
        <Typography sx={{ fontSize: '.8rem', color: '#64748B', mt: 0.4 }}>
          {order.shippingAddress?.city}, {order.shippingAddress?.state}
        </Typography>
        <Typography sx={{ fontSize: '.8rem', color: '#64748B', mt: 0.2 }}>
          {order.shippingAddress?.mobile}
        </Typography>
      </TableCell>
      <TableCell sx={sellerTableCellSx} align="right">
        <Typography sx={{ fontWeight: 800 }}>
          {formatSellerCurrency(order.totalSellingPrice || primaryItem?.sellingPrice)}
        </Typography>
        <Typography sx={{ fontSize: '.8rem', color: '#64748B', mt: 0.4 }}>
          {order.totalItem} item{order.totalItem > 1 ? 's' : ''}
        </Typography>
      </TableCell>
      <TableCell sx={sellerTableCellSx}>
        <Stack spacing={0.8} alignItems="flex-start">
          <SellerStatusChip
            label={humanizeSellerValue(order.orderStatus)}
            tone={statusTone(order.orderStatus)}
            small
          />
          {manageReturns ? (
            <Typography sx={{ fontSize: '.76rem', color: '#64748B' }}>
              Managed in returns
            </Typography>
          ) : null}
        </Stack>
      </TableCell>
      <TableCell sx={sellerTableCellSx}>
        {manageReturns ? (
          <Typography sx={{ fontSize: '.82rem', color: '#64748B', fontWeight: 700 }}>
            Update from the returns queue
          </Typography>
        ) : (
          <Select
            size="small"
            value={order.orderStatus}
            onChange={(event) => onUpdate(order.id, event.target.value)}
            sx={{ ...sellerInputSx, minWidth: 170 }}
          >
            {statusOptions.map((status) => (
              <MenuItem key={status} value={status}>
                {humanizeSellerValue(status)}
              </MenuItem>
            ))}
          </Select>
        )}
      </TableCell>
    </TableRow>
  )
}
export default OrderTable
