import * as React from 'react';
import { styled } from '@mui/material/styles';
import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Button, IconButton,
  Tooltip, TextField, InputAdornment, Box,
  Typography, Chip, Skeleton, Select, MenuItem,
  FormControl, InputLabel, Divider,
} from '@mui/material';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import FilterListIcon from '@mui/icons-material/FilterList';
import InventoryOutlinedIcon from '@mui/icons-material/InventoryOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import RefreshIcon from '@mui/icons-material/Refresh';
import { useAppDispatch, useAppSelector } from '../../../Redux Toolkit/Store';
import { fetchSellerProducts, updateProductStock } from '../../../Redux Toolkit/Seller/sellerProductSlice';
import { useNavigate } from 'react-router-dom';

// ─── Design Tokens ────────────────────────────────────────────────────────────
const AMZ = {
  navy:       '#131921',
  navyLight:  '#232f3e',
  orange:     '#ff9900',
  orangeHover:'#e88b00',
  blue:       '#007185',
  blueHover:  '#005f73',
  green:      '#067d62',
  red:        '#cc0c39',
  bg:         '#f3f3f3',
  white:      '#ffffff',
  border:     '#dddddd',
  borderDark: '#aaaaaa',
  text:       '#0f1111',
  textMuted:  '#565959',
  textLight:  '#8a8a8a',
  rowHover:   '#f7f8f8',
  headerBg:   '#f0f2f2',
  linkBlue:   '#007185',
};

// ─── Styled Components ────────────────────────────────────────────────────────

const PageWrap = styled('div')({
  background: AMZ.bg,
  minHeight: '100vh',
  padding: '0',
  fontFamily: "'Helvetica Neue', Arial, sans-serif",
});

const TopBar = styled('div')({
  background: AMZ.navy,
  padding: '8px 24px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
});

const ContentArea = styled('div')({
  padding: '20px 24px',
  maxWidth: '1400px',
  margin: '0 auto',
});

const SummaryBar = styled('div')({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
  gap: '12px',
  marginBottom: '16px',
});

const SummaryCard = styled(Paper)({
  borderRadius: '4px',
  border: `1px solid ${AMZ.border}`,
  padding: '14px 18px',
  boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
  background: AMZ.white,
  cursor: 'pointer',
  transition: 'box-shadow 0.15s',
  '&:hover': { boxShadow: '0 2px 8px rgba(0,0,0,0.12)' },
});

const MainCard = styled(Paper)({
  borderRadius: '4px',
  border: `1px solid ${AMZ.border}`,
  boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
  background: AMZ.white,
  overflow: 'hidden',
});

const ToolbarRow = styled('div')({
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  padding: '12px 16px',
  borderBottom: `1px solid ${AMZ.border}`,
  background: AMZ.headerBg,
  flexWrap: 'wrap',
});

const AmazonSearchField = styled(TextField)({
  '& .MuiOutlinedInput-root': {
    borderRadius: '4px',
    height: '34px',
    fontSize: '13px',
    fontFamily: "'Helvetica Neue', Arial, sans-serif",
    background: '#fff',
    '& fieldset': { borderColor: AMZ.borderDark, borderWidth: '1px' },
    '&:hover fieldset': { borderColor: '#007185' },
    '&.Mui-focused fieldset': { borderColor: '#007185', borderWidth: '2px' },
  },
  '& .MuiInputBase-input': { padding: '6px 10px', fontSize: '13px' },
});

const AmazonButton = styled(Button)(({ variant: v }: any) => ({
  borderRadius: '4px',
  height: '34px',
  padding: '0 14px',
  fontFamily: "'Helvetica Neue', Arial, sans-serif",
  fontWeight: 400,
  fontSize: '13px',
  textTransform: 'none',
  boxShadow: 'none',
  ...(v === 'contained' ? {
    background: 'linear-gradient(to bottom, #f7dfa5, #f0c14b)',
    color: '#111',
    border: '1px solid #a88734',
    '&:hover': {
      background: 'linear-gradient(to bottom, #f5d78e, #eeb933)',
      boxShadow: 'none',
    },
  } : {
    background: 'linear-gradient(to bottom, #f7f8fa, #e7e9ec)',
    color: '#111',
    border: '1px solid #adb1b8',
    '&:hover': {
      background: 'linear-gradient(to bottom, #e7eaf0, #d9dce3)',
      boxShadow: 'none',
    },
  }),
}));

const BlueLink = styled('span')({
  color: AMZ.linkBlue,
  cursor: 'pointer',
  fontSize: '13px',
  fontWeight: 400,
  '&:hover': { color: '#c45500', textDecoration: 'underline' },
});

const HeadCell = styled(TableCell)({
  background: AMZ.headerBg,
  borderBottom: `1px solid ${AMZ.border}`,
  borderRight: `1px solid ${AMZ.border}`,
  padding: '8px 12px',
  fontSize: '12px',
  fontWeight: 700,
  color: AMZ.text,
  fontFamily: "'Helvetica Neue', Arial, sans-serif",
  whiteSpace: 'nowrap',
  userSelect: 'none',
  '&:last-child': { borderRight: 'none' },
});

const BodyCell = styled(TableCell)({
  padding: '10px 12px',
  fontSize: '13px',
  color: AMZ.text,
  borderBottom: `1px solid ${AMZ.border}`,
  borderRight: `1px solid ${AMZ.border}`,
  fontFamily: "'Helvetica Neue', Arial, sans-serif",
  verticalAlign: 'middle',
  '&:last-child': { borderRight: 'none' },
});

const BodyRow = styled(TableRow)({
  '&:hover': { background: AMZ.rowHover },
  '&:last-child td': { borderBottom: 0 },
});

const StatusBadge = styled('span')(({ status }: { status: string }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '4px',
  fontSize: '12px',
  fontWeight: 700,
  padding: '2px 8px',
  borderRadius: '3px',
  fontFamily: "'Helvetica Neue', Arial, sans-serif",
  ...(status === 'active' ? {
    background: '#e6f4ea',
    color: '#1e7e34',
    border: '1px solid #a8d5b5',
  } : {
    background: '#fce8e6',
    color: '#c62828',
    border: '1px solid #f5c6c2',
  }),
}));

const AmazonSelect = styled(FormControl)({
  '& .MuiOutlinedInput-root': {
    height: '34px',
    borderRadius: '4px',
    fontSize: '13px',
    fontFamily: "'Helvetica Neue', Arial, sans-serif",
    '& fieldset': { borderColor: AMZ.borderDark },
    '&:hover fieldset': { borderColor: '#007185' },
  },
  '& .MuiSelect-select': { padding: '6px 12px', fontSize: '13px' },
});

// ─── Component ────────────────────────────────────────────────────────────────

export default function ProductTable() {
  const { sellerProduct } = useAppSelector(store => store);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [search, setSearch] = React.useState('');
  const [stockFilter, setStockFilter] = React.useState('all');

  React.useEffect(() => {
    dispatch(fetchSellerProducts(localStorage.getItem('jwt')));
  }, []);

  const handleUpdateStack = (id: number | undefined) => () => {
    dispatch(updateProductStock(id));
  };

  const products = sellerProduct.products || [];

  const filtered = products.filter(item => {
    const matchSearch =
      item.title?.toLowerCase().includes(search.toLowerCase()) ||
      item.color?.toLowerCase().includes(search.toLowerCase());
    const matchStock =
      stockFilter === 'all' ? true :
      stockFilter === 'active' ? item.in_stock :
      !item.in_stock;
    return matchSearch && matchStock;
  });

  const inStock  = products.filter(p => p.in_stock).length;
  const outStock = products.filter(p => !p.in_stock).length;
  const totalValue = products.reduce((s, p) => s + (p.sellingPrice || 0), 0);

  return (
    <PageWrap>
      {/* ── Top Nav Bar ── */}
      <TopBar>
        <Box display="flex" alignItems="center" gap={2}>
          <Typography sx={{ color: AMZ.orange, fontWeight: 700, fontSize: '20px', letterSpacing: '-0.5px', fontFamily: "'Helvetica Neue', Arial" }}>
            seller<span style={{ color: '#fff' }}>central</span>
          </Typography>
          <Divider orientation="vertical" flexItem sx={{ borderColor: 'rgba(255,255,255,0.2)', mx: 1 }} />
          <Typography sx={{ color: 'rgba(255,255,255,0.85)', fontSize: '13px' }}>Inventory</Typography>
        </Box>
        <Typography sx={{ color: 'rgba(255,255,255,0.6)', fontSize: '12px' }}>
          Manage All Inventory
        </Typography>
      </TopBar>

      <ContentArea>
        {/* ── Page Title ── */}
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={2} flexWrap="wrap" gap={1}>
          <Box>
            <Typography sx={{ fontSize: '20px', fontWeight: 700, color: AMZ.text, fontFamily: "'Helvetica Neue', Arial" }}>
              Manage Inventory
            </Typography>
            <Typography sx={{ fontSize: '12px', color: AMZ.textMuted, mt: 0.3 }}>
              {products.length} total SKUs &nbsp;·&nbsp; Last refreshed just now
            </Typography>
          </Box>
          <Box display="flex" gap={1} flexWrap="wrap">
            <AmazonButton variant="outlined" startIcon={<RefreshIcon sx={{ fontSize: 15 }} />} onClick={() => dispatch(fetchSellerProducts(localStorage.getItem('jwt')))}>
              Refresh
            </AmazonButton>
            <AmazonButton variant="contained" startIcon={<AddIcon sx={{ fontSize: 15 }} />} onClick={() => navigate('/seller/add-product')}>
              Add a Product
            </AmazonButton>
          </Box>
        </Box>

        {/* ── Summary Cards ── */}
        <SummaryBar>
          {[
            { label: 'Total Active', value: inStock, icon: <CheckCircleOutlineIcon sx={{ fontSize: 18, color: AMZ.green }} />, color: AMZ.green },
            { label: 'Inactive / OOS', value: outStock, icon: <ErrorOutlineIcon sx={{ fontSize: 18, color: AMZ.red }} />, color: AMZ.red },
            { label: 'Total SKUs', value: products.length, icon: <InventoryOutlinedIcon sx={{ fontSize: 18, color: AMZ.blue }} />, color: AMZ.blue },
            { label: 'Catalog Value', value: `₹${(totalValue / 1000).toFixed(1)}k`, icon: <InventoryOutlinedIcon sx={{ fontSize: 18, color: AMZ.orange }} />, color: AMZ.orange },
          ].map(c => (
            <SummaryCard key={c.label} elevation={0}>
              <Box display="flex" alignItems="center" gap={1} mb={0.5}>{c.icon}
                <Typography sx={{ fontSize: '12px', color: AMZ.textMuted, fontFamily: "'Helvetica Neue', Arial" }}>{c.label}</Typography>
              </Box>
              <Typography sx={{ fontSize: '22px', fontWeight: 700, color: c.color, fontFamily: "'Helvetica Neue', Arial", lineHeight: 1.2 }}>
                {c.value}
              </Typography>
            </SummaryCard>
          ))}
        </SummaryBar>

        {/* ── Main Table Card ── */}
        <MainCard elevation={0}>
          {/* Toolbar */}
          <ToolbarRow>
            <AmazonSearchField
              placeholder="Search by title, color, SKU…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ fontSize: 16, color: AMZ.textMuted }} />
                  </InputAdornment>
                ),
              }}
              sx={{ minWidth: 260 }}
            />

            <AmazonSelect size="small" sx={{ minWidth: 140 }}>
              <Select
                value={stockFilter}
                onChange={e => setStockFilter(e.target.value)}
                displayEmpty
              >
                <MenuItem value="all" sx={{ fontSize: '13px' }}>All Status</MenuItem>
                <MenuItem value="active" sx={{ fontSize: '13px' }}>Active</MenuItem>
                <MenuItem value="inactive" sx={{ fontSize: '13px' }}>Inactive</MenuItem>
              </Select>
            </AmazonSelect>

            <Box flex={1} />
            <Typography sx={{ fontSize: '12px', color: AMZ.textMuted }}>
              {filtered.length} result{filtered.length !== 1 ? 's' : ''}
            </Typography>
          </ToolbarRow>

          {/* Table */}
          <TableContainer>
            <Table sx={{ minWidth: 900 }}>
              <TableHead>
                <TableRow>
                  <HeadCell sx={{ width: 60 }}>Image</HeadCell>
                  <HeadCell>Product Name / SKU</HeadCell>
                  <HeadCell align="right">MRP</HeadCell>
                  <HeadCell align="right">Selling Price</HeadCell>
                  <HeadCell align="right">Discount</HeadCell>
                  <HeadCell align="center">Color</HeadCell>
                  <HeadCell align="center">Status</HeadCell>
                  <HeadCell align="center" sx={{ width: 100 }}>Actions</HeadCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {sellerProduct.loading
                  ? Array.from({ length: 5 }).map((_, i) => (
                    <BodyRow key={i}>
                      {Array.from({ length: 8 }).map((_, j) => (
                        <BodyCell key={j}><Skeleton height={28} sx={{ borderRadius: '2px' }} /></BodyCell>
                      ))}
                    </BodyRow>
                  ))
                  : filtered.length === 0
                  ? (
                    <BodyRow>
                      <BodyCell colSpan={8}>
                        <Box py={5} textAlign="center">
                          <InventoryOutlinedIcon sx={{ fontSize: 40, color: '#ddd', mb: 1, display: 'block', mx: 'auto' }} />
                          <Typography sx={{ fontSize: '14px', color: AMZ.textMuted, fontFamily: "'Helvetica Neue', Arial" }}>
                            No products match your search
                          </Typography>
                        </Box>
                      </BodyCell>
                    </BodyRow>
                  )
                  : filtered.map(item => {
                    const discount = item.mrpPrice && item.sellingPrice
                      ? Math.round(((item.mrpPrice - item.sellingPrice) / item.mrpPrice) * 100)
                      : 0;
                    return (
                      <BodyRow key={item.id}>
                        {/* Image */}
                        <BodyCell>
                          <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                            {item.images?.slice(0, 1).map((img, i) => (
                              <img key={i} src={img} alt=""
                                style={{ width: 48, height: 48, objectFit: 'cover', border: `1px solid ${AMZ.border}`, borderRadius: '2px' }}
                              />
                            ))}
                          </Box>
                        </BodyCell>

                        {/* Title */}
                        <BodyCell sx={{ minWidth: 240 }}>
                          <BlueLink onClick={() => navigate('/seller/update-product/' + item.id)}>
                            {item.title}
                          </BlueLink>
                          <Typography sx={{ fontSize: '11px', color: AMZ.textLight, mt: 0.3, fontFamily: "'Helvetica Neue', Arial" }}>
                            ASIN: #{String(item.id).padStart(10, '0')}
                          </Typography>
                        </BodyCell>

                        {/* MRP */}
                        <BodyCell align="right">
                          <Typography sx={{ fontSize: '13px', color: AMZ.textMuted, textDecoration: 'line-through', fontFamily: "'Helvetica Neue', Arial" }}>
                            ₹{item.mrpPrice?.toLocaleString('en-IN')}.00
                          </Typography>
                        </BodyCell>

                        {/* Selling Price */}
                        <BodyCell align="right">
                          <Typography sx={{ fontSize: '14px', fontWeight: 700, color: AMZ.text, fontFamily: "'Helvetica Neue', Arial" }}>
                            ₹{item.sellingPrice?.toLocaleString('en-IN')}.00
                          </Typography>
                        </BodyCell>

                        {/* Discount */}
                        <BodyCell align="center">
                          {discount > 0 && (
                            <Box sx={{ display: 'inline-block', background: '#fff3cd', border: '1px solid #ffc107', borderRadius: '3px', px: 0.8, py: 0.2 }}>
                              <Typography sx={{ fontSize: '12px', fontWeight: 700, color: '#856404', fontFamily: "'Helvetica Neue', Arial" }}>
                                -{discount}%
                              </Typography>
                            </Box>
                          )}
                        </BodyCell>

                        {/* Color */}
                        <BodyCell align="center">
                          <Typography sx={{ fontSize: '13px', color: AMZ.textMuted, fontFamily: "'Helvetica Neue', Arial" }}>
                            {item.color}
                          </Typography>
                        </BodyCell>

                        {/* Status */}
                        <BodyCell align="center">
                          <Button
                            onClick={handleUpdateStack(item.id)}
                            disableRipple
                            sx={{ p: 0, minWidth: 0, background: 'none', '&:hover': { background: 'none' } }}
                          >
                            <StatusBadge status={item.in_stock ? 'active' : 'inactive'}>
                              {item.in_stock
                                ? <><CheckCircleOutlineIcon sx={{ fontSize: 12 }} /> Active</>
                                : <><ErrorOutlineIcon sx={{ fontSize: 12 }} /> Inactive</>}
                            </StatusBadge>
                          </Button>
                        </BodyCell>

                        {/* Actions */}
                        <BodyCell align="center">
                          <AmazonButton
                            variant="outlined"
                            sx={{ height: '28px', fontSize: '12px', px: 1.5 }}
                            onClick={() => navigate('/seller/update-product/' + item.id)}
                          >
                            Edit
                          </AmazonButton>
                        </BodyCell>
                      </BodyRow>
                    );
                  })
                }
              </TableBody>
            </Table>
          </TableContainer>

          {/* Footer */}
          <Box sx={{ borderTop: `1px solid ${AMZ.border}`, px: 2, py: 1.2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: AMZ.headerBg }}>
            <Typography sx={{ fontSize: '12px', color: AMZ.textMuted, fontFamily: "'Helvetica Neue', Arial" }}>
              Showing <b>{filtered.length}</b> of <b>{products.length}</b> products
            </Typography>
            <Typography sx={{ fontSize: '12px', color: AMZ.linkBlue, cursor: 'pointer', fontFamily: "'Helvetica Neue', Arial", '&:hover': { textDecoration: 'underline' } }}>
              Download Report
            </Typography>
          </Box>
        </MainCard>
      </ContentArea>
    </PageWrap>
  );
}