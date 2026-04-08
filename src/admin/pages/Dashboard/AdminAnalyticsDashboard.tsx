import React, { useEffect } from 'react';
import {
    Box, Grid, Paper, Typography, Skeleton, Divider,
    Table, TableBody, TableCell, TableContainer, TableHead,
    TableRow, Chip, styled, tableCellClasses,
} from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../../Redux Toolkit/Store';
import { fetchSellers } from '../../../Redux Toolkit/Seller/sellerSlice';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from 'recharts';
import DashboardIcon from '@mui/icons-material/Dashboard';
import StorefrontIcon from '@mui/icons-material/Storefront';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import PeopleIcon from '@mui/icons-material/People';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import InventoryIcon from '@mui/icons-material/Inventory';

// ── Styled table ────────────────────────────────────────────────────────────
const StyledTableCell = styled(TableCell)(() => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: '#1E293B',
        color: '#fff',
        fontFamily: '"Manrope", Arial, sans-serif',
        fontWeight: 700, fontSize: 12,
        letterSpacing: '0.6px', textTransform: 'uppercase',
        borderBottom: '3px solid #0F766E',
        padding: '12px 16px',
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 13,
        fontFamily: '"Manrope", Arial, sans-serif',
        color: '#0F172A', padding: '10px 16px',
        borderBottom: '1px solid #f0f0f0',
    },
}));

const StyledTableRow = styled(TableRow)(() => ({
    '&:nth-of-type(odd)': { backgroundColor: '#fafafa' },
    '&:nth-of-type(even)': { backgroundColor: '#fff' },
    '&:hover': { backgroundColor: '#fff8e7' },
    '&:last-child td': { border: 0 },
}));

// ── Mock data (replace with real slices when available) ─────────────────────
const revenueData = [
    { month: 'Jan', revenue: 42000, orders: 320 },
    { month: 'Feb', revenue: 55000, orders: 410 },
    { month: 'Mar', revenue: 47000, orders: 370 },
    { month: 'Apr', revenue: 63000, orders: 490 },
    { month: 'May', revenue: 71000, orders: 530 },
    { month: 'Jun', revenue: 58000, orders: 445 },
    { month: 'Jul', revenue: 84000, orders: 620 },
    { month: 'Aug', revenue: 92000, orders: 710 },
    { month: 'Sep', revenue: 76000, orders: 580 },
    { month: 'Oct', revenue: 98000, orders: 740 },
    { month: 'Nov', revenue: 115000, orders: 880 },
    { month: 'Dec', revenue: 134000, orders: 1020 },
];

const recentOrders = [
    { id: '#ORD-9821', customer: 'Rahul Sharma',   product: 'Samsung 4K TV',      amount: 42999, status: 'DELIVERED' },
    { id: '#ORD-9820', customer: 'Priya Singh',    product: 'Nike Air Max',        amount: 8499,  status: 'SHIPPED' },
    { id: '#ORD-9819', customer: 'Amit Kumar',     product: 'Apple AirPods Pro',   amount: 19999, status: 'PROCESSING' },
    { id: '#ORD-9818', customer: 'Sneha Patel',    product: 'Levi\'s Jeans',       amount: 2999,  status: 'DELIVERED' },
    { id: '#ORD-9817', customer: 'Vikram Mehta',   product: 'LG Washing Machine',  amount: 32000, status: 'CANCELLED' },
    { id: '#ORD-9816', customer: 'Anjali Verma',   product: 'Sony Headphones',     amount: 12499, status: 'SHIPPED' },
];

const orderStatusData = [
    { name: 'Delivered',  value: 58, color: '#067D62' },
    { name: 'Shipped',    value: 22, color: '#0F766E' },
    { name: 'Processing', value: 12, color: '#0066c0' },
    { name: 'Cancelled',  value: 8,  color: '#CC0C39' },
];

const statusChip = (status: string) => {
    const map: Record<string, { color: string; bg: string; border: string }> = {
        DELIVERED:  { color: '#155724', bg: '#D4EDDA', border: '#C3E6CB' },
        SHIPPED:    { color: '#856404', bg: '#FFF3CD', border: '#FFEAA7' },
        PROCESSING: { color: '#004085', bg: '#CCE5FF', border: '#B8DAFF' },
        CANCELLED:  { color: '#721C24', bg: '#F8D7DA', border: '#F5C6CB' },
    };
    const s = map[status] ?? map['PROCESSING'];
    return (
        <Chip label={status} size="small" sx={{
            fontWeight: 700, fontSize: 10,
            fontFamily: '"Manrope", Arial, sans-serif',
            backgroundColor: s.bg, color: s.color,
            border: `1px solid ${s.border}`,
        }} />
    );
};

// ── Stat card ────────────────────────────────────────────────────────────────
const StatCard = ({ label, value, icon, color, sub }: {
    label: string; value: string | number; icon: React.ReactNode;
    color: string; sub?: string;
}) => (
    <Paper sx={{
        p: 2.5, border: '1px solid #e0e0e0',
        borderTop: `4px solid ${color}`,
        borderRadius: '4px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.07)',
        display: 'flex', alignItems: 'flex-start', gap: 2,
    }}>
        <Box sx={{
            width: 44, height: 44, borderRadius: '4px',
            backgroundColor: color + '18',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
        }}>
            <Box sx={{ color, '& svg': { fontSize: 22 } }}>{icon}</Box>
        </Box>
        <Box>
            <Typography sx={{ fontSize: 22, fontWeight: 800, color, lineHeight: 1.1, fontFamily: '"Manrope", Arial, sans-serif' }}>
                {value}
            </Typography>
            <Typography sx={{ fontSize: 12, color: '#0F172A', fontWeight: 600, fontFamily: '"Manrope", Arial, sans-serif', mt: 0.3 }}>
                {label}
            </Typography>
            {sub && (
                <Typography sx={{ fontSize: 11, color: '#64748B', fontFamily: '"Manrope", Arial, sans-serif', mt: 0.2 }}>
                    {sub}
                </Typography>
            )}
        </Box>
    </Paper>
);

// ── Section heading ──────────────────────────────────────────────────────────
const SectionHeading = ({ title, sub }: { title: string; sub?: string }) => (
    <Box sx={{ mb: 2 }}>
        <Typography sx={{ fontSize: 15, fontWeight: 700, color: '#0F172A', fontFamily: '"Manrope", Arial, sans-serif' }}>
            {title}
        </Typography>
        {sub && <Typography sx={{ fontSize: 12, color: '#64748B', fontFamily: '"Manrope", Arial, sans-serif' }}>{sub}</Typography>}
    </Box>
);

// ── Main component ───────────────────────────────────────────────────────────
const AdminAnalyticsDashboard = () => {
    const dispatch = useAppDispatch();
    const { sellers, adminCoupon } = useAppSelector(store => store);

    useEffect(() => {
        dispatch(fetchSellers('ACTIVE'));
    }, []);

    const activeSellers  = sellers.sellers?.length ?? 0;
    const totalCoupons   = adminCoupon?.coupons?.length ?? 0;
    const activeCoupons  = adminCoupon?.coupons?.filter((c: any) => c.active).length ?? 0;

    return (
        <Box sx={{ backgroundColor: '#F3F7F8', minHeight: '100vh', p: 3 }}>
            {/* Page header */}
            <Box sx={{
                display: 'flex', alignItems: 'center', gap: 1.5,
                mb: 3, pb: 2, borderBottom: '2px solid #0F766E',
            }}>
                <DashboardIcon sx={{ color: '#0F766E', fontSize: 28 }} />
                <Box>
                    <Typography variant="h5" sx={{ fontFamily: '"Manrope", Arial, sans-serif', fontWeight: 700, color: '#0F172A', letterSpacing: '-0.3px', lineHeight: 1.2 }}>
                        Admin Analytics
                    </Typography>
                    <Typography sx={{ fontSize: 11, color: '#64748B', fontFamily: '"Manrope", Arial, sans-serif' }}>
                        Overview of your marketplace performance
                    </Typography>
                </Box>
                <Typography variant="body2" sx={{ color: '#64748B', ml: 'auto', fontSize: 12, fontFamily: '"Manrope", Arial, sans-serif' }}>
                    Seller Central › Admin › Dashboard
                </Typography>
            </Box>

            {/* KPI Stat cards */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
                {[
                    { label: 'Total Revenue',    value: '₹8,42,000', icon: <TrendingUpIcon />,  color: '#067D62', sub: '+14% vs last month' },
                    { label: 'Total Orders',     value: '6,120',     icon: <InventoryIcon />,   color: '#0F766E', sub: '740 this month'     },
                    { label: 'Active Sellers',   value: activeSellers, icon: <StorefrontIcon />, color: '#0F172A', sub: 'Currently active'   },
                    { label: 'Total Customers',  value: '18,450',    icon: <PeopleIcon />,      color: '#0066c0', sub: '+320 this month'    },
                    { label: 'Active Coupons',   value: activeCoupons, icon: <LocalOfferIcon />, color: '#CC0C39', sub: `${totalCoupons} total` },
                ].map(card => (
                    <Grid key={card.label} size={{ xs: 12, sm: 6, md: 4, lg: 2 }}>
                        <StatCard {...card} />
                    </Grid>
                ))}
            </Grid>

            {/* Revenue chart + Pie chart */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
                {/* Area chart */}
                <Grid size={{ xs: 12, lg: 8 }}>
                    <Paper sx={{ p: 2.5, border: '1px solid #e0e0e0', borderRadius: '4px', boxShadow: '0 1px 3px rgba(0,0,0,0.07)' }}>
                        <SectionHeading title="Revenue & Orders — 2024" sub="Monthly breakdown across all sellers" />
                        <ResponsiveContainer width="100%" height={260}>
                            <AreaChart data={revenueData} margin={{ top: 5, right: 20, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="revenue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%"  stopColor="#0F766E" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#0F766E" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="orders" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%"  stopColor="#0F172A" stopOpacity={0.2} />
                                        <stop offset="95%" stopColor="#0F172A" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                <XAxis dataKey="month" tick={{ fontSize: 11, fontFamily: '"Manrope", Arial, sans-serif', fill: '#64748B' }} />
                                <YAxis yAxisId="left" tick={{ fontSize: 11, fontFamily: '"Manrope", Arial, sans-serif', fill: '#64748B' }} />
                                <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11, fontFamily: '"Manrope", Arial, sans-serif', fill: '#64748B' }} />
                                <Tooltip
                                    contentStyle={{ fontFamily: '"Manrope", Arial, sans-serif', fontSize: 12, border: '1px solid #ddd', borderRadius: '4px' }}
                                    formatter={(value: any, name: string) => [
                                        name === 'revenue' ? `₹${value.toLocaleString()}` : value,
                                        name === 'revenue' ? 'Revenue' : 'Orders'
                                    ]}
                                />
                                <Area yAxisId="left"  type="monotone" dataKey="revenue" stroke="#0F766E" strokeWidth={2} fill="url(#revenue)" />
                                <Area yAxisId="right" type="monotone" dataKey="orders"  stroke="#0F172A" strokeWidth={2} fill="url(#orders)"  />
                            </AreaChart>
                        </ResponsiveContainer>
                    </Paper>
                </Grid>

                {/* Pie chart */}
                <Grid size={{ xs: 12, lg: 4 }}>
                    <Paper sx={{ p: 2.5, border: '1px solid #e0e0e0', borderRadius: '4px', boxShadow: '0 1px 3px rgba(0,0,0,0.07)', height: '100%' }}>
                        <SectionHeading title="Order Status Breakdown" sub="Percentage by fulfilment status" />
                        <ResponsiveContainer width="100%" height={220}>
                            <PieChart>
                                <Pie
                                    data={orderStatusData}
                                    cx="50%" cy="50%"
                                    innerRadius={55} outerRadius={85}
                                    paddingAngle={3}
                                    dataKey="value"
                                >
                                    {orderStatusData.map((entry, index) => (
                                        <Cell key={index} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ fontFamily: '"Manrope", Arial, sans-serif', fontSize: 12, border: '1px solid #ddd', borderRadius: '4px' }}
                                    formatter={(value: any) => [`${value}%`]}
                                />
                                <Legend
                                    iconType="circle" iconSize={8}
                                    wrapperStyle={{ fontFamily: '"Manrope", Arial, sans-serif', fontSize: 12 }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </Paper>
                </Grid>
            </Grid>

            {/* Seller status breakdown + Recent orders */}
            <Grid container spacing={2}>
                {/* Seller breakdown */}
                <Grid size={{ xs: 12, lg: 4 }}>
                    <Paper sx={{ p: 2.5, border: '1px solid #e0e0e0', borderRadius: '4px', boxShadow: '0 1px 3px rgba(0,0,0,0.07)' }}>
                        <SectionHeading title="Seller Status Breakdown" />
                        {[
                            { label: 'Active',               value: 84,  color: '#067D62', bg: '#D4EDDA' },
                            { label: 'Pending Verification', value: 23,  color: '#856404', bg: '#FFF3CD' },
                            { label: 'Suspended',            value: 11,  color: '#721C24', bg: '#F8D7DA' },
                            { label: 'Banned',               value: 4,   color: '#fff',    bg: '#CC0C39' },
                            { label: 'Deactivated',          value: 7,   color: '#64748B', bg: '#e9ecef' },
                        ].map(row => (
                            <Box key={row.label} sx={{ mb: 1.5 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                    <Typography sx={{ fontSize: 12, fontFamily: '"Manrope", Arial, sans-serif', color: '#0F172A' }}>
                                        {row.label}
                                    </Typography>
                                    <Typography sx={{ fontSize: 12, fontWeight: 700, fontFamily: '"Manrope", Arial, sans-serif', color: row.color === '#fff' ? '#CC0C39' : row.color }}>
                                        {row.value}
                                    </Typography>
                                </Box>
                                <Box sx={{ height: 6, backgroundColor: '#f0f0f0', borderRadius: '3px', overflow: 'hidden' }}>
                                    <Box sx={{
                                        height: '100%',
                                        width: `${(row.value / 129) * 100}%`,
                                        backgroundColor: row.color === '#fff' ? '#CC0C39' : row.bg === '#CC0C39' ? '#CC0C39' : row.color,
                                        borderRadius: '3px',
                                        transition: 'width 0.6s ease',
                                    }} />
                                </Box>
                            </Box>
                        ))}
                        <Divider sx={{ my: 1.5, borderColor: '#f0f0f0' }} />
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography sx={{ fontSize: 12, fontFamily: '"Manrope", Arial, sans-serif', color: '#64748B' }}>Total Sellers</Typography>
                            <Typography sx={{ fontSize: 12, fontWeight: 800, fontFamily: '"Manrope", Arial, sans-serif', color: '#0F172A' }}>129</Typography>
                        </Box>
                    </Paper>
                </Grid>

                {/* Recent orders */}
                <Grid size={{ xs: 12, lg: 8 }}>
                    <Paper sx={{ p: 2.5, border: '1px solid #e0e0e0', borderRadius: '4px', boxShadow: '0 1px 3px rgba(0,0,0,0.07)' }}>
                        <SectionHeading title="Recent Orders" sub="Latest 6 orders across the platform" />
                        <TableContainer sx={{ borderRadius: '4px', overflow: 'hidden', border: '1px solid #e0e0e0' }}>
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <StyledTableCell>Order ID</StyledTableCell>
                                        <StyledTableCell>Customer</StyledTableCell>
                                        <StyledTableCell>Product</StyledTableCell>
                                        <StyledTableCell>Amount</StyledTableCell>
                                        <StyledTableCell align="center">Status</StyledTableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {recentOrders.map(order => (
                                        <StyledTableRow key={order.id}>
                                            <StyledTableCell>
                                                <Typography sx={{ fontFamily: '"Courier New", monospace', fontSize: 12, fontWeight: 700, color: '#0066c0' }}>
                                                    {order.id}
                                                </Typography>
                                            </StyledTableCell>
                                            <StyledTableCell>{order.customer}</StyledTableCell>
                                            <StyledTableCell sx={{ maxWidth: 160 }}>
                                                <Typography sx={{ fontSize: 13, fontFamily: '"Manrope", Arial, sans-serif', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                    {order.product}
                                                </Typography>
                                            </StyledTableCell>
                                            <StyledTableCell>
                                                <Typography sx={{ fontWeight: 700, fontSize: 13, fontFamily: '"Manrope", Arial, sans-serif' }}>
                                                    ₹{order.amount.toLocaleString()}
                                                </Typography>
                                            </StyledTableCell>
                                            <StyledTableCell align="center">
                                                {statusChip(order.status)}
                                            </StyledTableCell>
                                        </StyledTableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default AdminAnalyticsDashboard;