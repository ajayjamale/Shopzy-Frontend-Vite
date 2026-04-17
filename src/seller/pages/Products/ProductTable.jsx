import { useEffect, useMemo, useState } from 'react'
import {
  Avatar,
  Box,
  Button,
  LinearProgress,
  MenuItem,
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
import AddBoxRoundedIcon from '@mui/icons-material/AddBoxRounded'
import Inventory2RoundedIcon from '@mui/icons-material/Inventory2Rounded'
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded'
import SellRoundedIcon from '@mui/icons-material/SellRounded'
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded'
import TuneRoundedIcon from '@mui/icons-material/TuneRounded'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../../store'
import { fetchSellerProducts, updateProductStock } from '../../../store/seller/sellerProductSlice'
import { getSellerToken } from '../../../utils/authToken'
import {
  SellerEmptyState,
  SellerMetricCard,
  SellerPageIntro,
  SellerSection,
  SellerStatusChip,
  formatSellerCurrency,
  humanizeSellerValue,
  sellerInputSx,
  sellerPrimaryButtonSx,
  sellerSecondaryButtonSx,
  sellerTableCellSx,
  sellerTableHeadCellSx,
} from '../../theme/sellerUi'
const ProductTable = ({ variant = 'products' }) => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { sellerProduct } = useAppSelector((store) => store)
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('all')
  useEffect(() => {
    dispatch(fetchSellerProducts(getSellerToken()))
  }, [dispatch])
  const products = sellerProduct.products || []
  const filteredProducts = useMemo(() => {
    const q = query.trim().toLowerCase()
    return products.filter((item) => {
      const matchesQuery =
        !q ||
        item.title?.toLowerCase().includes(q) ||
        item.color?.toLowerCase().includes(q) ||
        item.category?.name?.toLowerCase().includes(q)
      if (!matchesQuery) return false
      if (filter === 'live') return item.in_stock
      if (filter === 'inactive') return !item.in_stock
      if (filter === 'low') return item.quantity <= 5
      return true
    })
  }, [filter, products, query])
  const summary = useMemo(() => {
    const inStockProducts = products.filter((item) => item.in_stock)
    const outOfStockProducts = products.filter((item) => !item.in_stock)
    const lowStockProducts = products.filter((item) => item.quantity <= 5)
    const totalUnits = products.reduce((sum, item) => sum + Number(item.quantity || 0), 0)
    const catalogValue = products.reduce(
      (sum, item) => sum + Number(item.sellingPrice || 0) * Number(item.quantity || 0),
      0,
    )
    const averageDiscount = products.length
      ? Math.round(
          products.reduce((sum, item) => sum + Number(item.discountPercent || 0), 0) /
            products.length,
        )
      : 0
    return {
      inStockProducts,
      outOfStockProducts,
      lowStockProducts,
      totalUnits,
      catalogValue,
      averageDiscount,
    }
  }, [products])
  const cards =
    variant === 'inventory'
      ? [
          {
            label: 'Available products',
            value: summary.inStockProducts.length.toLocaleString('en-IN'),
            helper: `${summary.totalUnits.toLocaleString('en-IN')} units across the catalog`,
            tone: 'success',
            icon: <Inventory2RoundedIcon />,
          },
          {
            label: 'Low stock',
            value: summary.lowStockProducts.length.toLocaleString('en-IN'),
            helper: 'Products with five units or fewer',
            tone: 'warning',
            icon: <WarningAmberRoundedIcon />,
          },
          {
            label: 'Out of stock',
            value: summary.outOfStockProducts.length.toLocaleString('en-IN'),
            helper: 'Listings currently hidden from purchase',
            tone: 'danger',
            icon: <TuneRoundedIcon />,
          },
          {
            label: 'Catalog value',
            value: formatSellerCurrency(summary.catalogValue),
            helper: 'Current sell-side inventory value',
            tone: 'accent',
            icon: <SellRoundedIcon />,
          },
        ]
      : [
          {
            label: 'Live listings',
            value: summary.inStockProducts.length.toLocaleString('en-IN'),
            helper: `${products.length.toLocaleString('en-IN')} total products in catalog`,
            tone: 'accent',
            icon: <Inventory2RoundedIcon />,
          },
          {
            label: 'Catalog value',
            value: formatSellerCurrency(summary.catalogValue),
            helper: 'Based on selling price and inventory quantity',
            tone: 'info',
            icon: <SellRoundedIcon />,
          },
          {
            label: 'Average discount',
            value: `${summary.averageDiscount}%`,
            helper: 'Average markdown across active listings',
            tone: 'success',
            icon: <TuneRoundedIcon />,
          },
          {
            label: 'Attention needed',
            value: summary.lowStockProducts.length.toLocaleString('en-IN'),
            helper: 'Products that may stock out soon',
            tone: 'warning',
            icon: <WarningAmberRoundedIcon />,
          },
        ]
  return (
    <Box>
      <SellerPageIntro
        eyebrow={variant === 'inventory' ? 'Inventory' : 'Catalog'}
        title={variant === 'inventory' ? 'Inventory health' : 'Product listings'}
        description={
          variant === 'inventory'
            ? 'Monitor stock depth, identify low-stock items, and toggle listing availability without leaving the seller workspace.'
            : 'Keep your product catalog clean, current, and ready for new sales. Search, filter, and jump into editing from one place.'
        }
        actions={
          <>
            <Button
              variant="outlined"
              startIcon={<RefreshRoundedIcon />}
              onClick={() => dispatch(fetchSellerProducts(getSellerToken()))}
              sx={sellerSecondaryButtonSx}
            >
              Refresh
            </Button>
            <Button
              variant="contained"
              startIcon={<AddBoxRoundedIcon />}
              onClick={() => navigate('/seller/add-product')}
              sx={sellerPrimaryButtonSx}
            >
              Add product
            </Button>
          </>
        }
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
        {cards.map((card) => (
          <SellerMetricCard key={card.label} {...card} />
        ))}
      </Box>

      <Box sx={{ mt: 2 }}>
        <SellerSection
          title={variant === 'inventory' ? 'Inventory table' : 'Catalog table'}
          description="Use the filters to narrow listings by status and jump straight into edits when something needs attention."
          padded={false}
        >
          {sellerProduct.loading ? <LinearProgress /> : null}

          <Stack
            direction={{ xs: 'column', lg: 'row' }}
            spacing={1.5}
            sx={{ px: 2.4, py: 2, borderBottom: '1px solid #DCE8EC' }}
          >
            <TextField
              size="small"
              placeholder="Search by title, category, or color"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              sx={{ ...sellerInputSx, flex: 1, minWidth: 240 }}
            />
            <TextField
              select
              size="small"
              value={filter}
              onChange={(event) => setFilter(event.target.value)}
              sx={{ ...sellerInputSx, minWidth: 180 }}
            >
              <MenuItem value="all">All products</MenuItem>
              <MenuItem value="live">Live listings</MenuItem>
              <MenuItem value="inactive">Out of stock</MenuItem>
              <MenuItem value="low">Low stock</MenuItem>
            </TextField>
          </Stack>

          {!filteredProducts.length && !sellerProduct.loading ? (
            <Box sx={{ p: 2.4 }}>
              <SellerEmptyState
                title="No products match this view"
                description="Try a broader search, switch filters, or add a new product to start building the catalog."
              />
            </Box>
          ) : (
            <TableContainer>
              <Table sx={{ minWidth: 980 }}>
                <TableHead>
                  <TableRow>
                    <TableCell sx={sellerTableHeadCellSx}>Product</TableCell>
                    <TableCell sx={sellerTableHeadCellSx}>Category</TableCell>
                    <TableCell sx={sellerTableHeadCellSx} align="right">
                      Selling Price
                    </TableCell>
                    <TableCell sx={sellerTableHeadCellSx} align="right">
                      Quantity
                    </TableCell>
                    <TableCell sx={sellerTableHeadCellSx} align="right">
                      Discount
                    </TableCell>
                    <TableCell sx={sellerTableHeadCellSx}>Status</TableCell>
                    <TableCell sx={sellerTableHeadCellSx} align="right">
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredProducts.map((item) => (
                    <TableRow key={item.id} hover>
                      <TableCell sx={sellerTableCellSx}>
                        <Stack direction="row" spacing={1.4} alignItems="center">
                          <Avatar
                            variant="rounded"
                            src={item.images?.[0]}
                            alt={item.title}
                            sx={{
                              width: 54,
                              height: 54,
                              borderRadius: '12px',
                              border: '1px solid #DCE8EC',
                            }}
                          />
                          <Box sx={{ minWidth: 0 }}>
                            <Typography sx={{ fontWeight: 800, color: '#0F172A' }}>
                              {item.title}
                            </Typography>
                            <Typography sx={{ fontSize: '.8rem', color: '#64748B', mt: 0.3 }}>
                              SKU #{String(item.id).padStart(6, '0')} •{' '}
                              {humanizeSellerValue(item.color)}
                            </Typography>
                          </Box>
                        </Stack>
                      </TableCell>
                      <TableCell sx={sellerTableCellSx}>
                        <Typography sx={{ fontWeight: 700 }}>
                          {item.category?.name || 'Unassigned'}
                        </Typography>
                        <Typography sx={{ fontSize: '.8rem', color: '#64748B', mt: 0.4 }}>
                          Size {item.sizes || 'N/A'}
                        </Typography>
                      </TableCell>
                      <TableCell sx={sellerTableCellSx} align="right">
                        <Typography sx={{ fontWeight: 800 }}>
                          {formatSellerCurrency(item.sellingPrice)}
                        </Typography>
                        <Typography sx={{ fontSize: '.8rem', color: '#64748B', mt: 0.4 }}>
                          MRP {formatSellerCurrency(item.mrpPrice)}
                        </Typography>
                      </TableCell>
                      <TableCell sx={sellerTableCellSx} align="right">
                        <Typography sx={{ fontWeight: 800 }}>
                          {Number(item.quantity ?? 0).toLocaleString('en-IN')}
                        </Typography>
                        <Typography
                          sx={{
                            fontSize: '.8rem',
                            color: item.quantity <= 5 ? '#D97706' : '#64748B',
                            mt: 0.4,
                          }}
                        >
                          {item.quantity <= 5 ? 'Low stock' : 'Healthy stock'}
                        </Typography>
                      </TableCell>
                      <TableCell sx={sellerTableCellSx} align="right">
                        <Typography sx={{ fontWeight: 800 }}>
                          {Number(item.discountPercent || 0)}%
                        </Typography>
                      </TableCell>
                      <TableCell sx={sellerTableCellSx}>
                        <SellerStatusChip
                          label={item.in_stock ? 'Live' : 'Out of stock'}
                          tone={item.in_stock ? 'success' : 'danger'}
                          small
                        />
                      </TableCell>
                      <TableCell sx={sellerTableCellSx} align="right">
                        <Stack
                          direction="row"
                          spacing={1}
                          justifyContent="flex-end"
                          useFlexGap
                          flexWrap="wrap"
                        >
                          <Button
                            variant="outlined"
                            size="small"
                            sx={sellerSecondaryButtonSx}
                            onClick={() => navigate(`/seller/update-product/${item.id}`)}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="outlined"
                            size="small"
                            sx={sellerSecondaryButtonSx}
                            onClick={() => dispatch(updateProductStock(item.id))}
                          >
                            {item.in_stock ? 'Mark inactive' : 'Restore'}
                          </Button>
                        </Stack>
                      </TableCell>
                    </TableRow>
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
export default ProductTable
