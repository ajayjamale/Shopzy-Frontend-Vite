import * as React from 'react';
import {
    Box, Chip, IconButton, MenuItem, Select, styled,
    Typography, Tooltip, Skeleton, Dialog, DialogTitle,
    DialogContent, DialogContentText, DialogActions, Button,
    TableContainer, Table, TableHead, TableRow, TableBody,
    TableCell, tableCellClasses, Paper, Fade
} from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../../store';
import type { Coupon } from '../../../types/couponTypes';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { deleteCoupon } from '../../../store/admin/AdminCouponSlice';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import FilterListIcon from '@mui/icons-material/FilterList';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

const StyledTableCell = styled(TableCell)(() => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: '#1E293B',
        color: '#ffffff',
        fontFamily: '"Manrope", "Arial", sans-serif',
        fontWeight: 700,
        fontSize: 12,
        letterSpacing: '0.6px',
        textTransform: 'uppercase',
        borderBottom: '3px solid #0F766E',
        padding: '14px 18px',
        whiteSpace: 'nowrap',
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 13,
        fontFamily: '"Manrope", "Arial", sans-serif',
        color: '#0F172A',
        padding: '12px 18px',
        borderBottom: '1px solid #f0f0f0',
    },
}));

const StyledTableRow = styled(TableRow)(() => ({
    transition: 'background-color 0.15s ease',
    '&:nth-of-type(odd)': { backgroundColor: '#fafafa' },
    '&:nth-of-type(even)': { backgroundColor: '#ffffff' },
    '&:hover': { backgroundColor: '#fff8e7' },
    '&:last-child td': { border: 0 },
}));

const filterOptions = [
    { value: 'ALL', label: 'All Coupons' },
    { value: 'ACTIVE', label: 'Active Only' },
    { value: 'INACTIVE', label: 'Inactive Only' },
];

export default function CouponTable() {
    const [filter, setFilter] = React.useState('ALL');
    const [deleteTarget, setDeleteTarget] = React.useState<Coupon | null>(null);
    const [deletingId, setDeletingId] = React.useState<number | null>(null);

    // ✅ CORRECT key: store registers AdminCouponSlice as `adminCoupon`
    const { adminCoupon } = useAppSelector(store => store);
    const dispatch = useAppDispatch();

    const allCoupons: Coupon[] = adminCoupon?.coupons ?? [];

    const filteredCoupons = allCoupons.filter((c: Coupon) => {
        if (filter === 'ACTIVE') return c.active;
        if (filter === 'INACTIVE') return !c.active;
        return true;
    });

    const activeCoupons = allCoupons.filter((c: Coupon) => c.active).length;

    const handleDeleteConfirm = async () => {
        if (!deleteTarget) return;
        setDeletingId(deleteTarget.id);
        setDeleteTarget(null);
        await dispatch(deleteCoupon({
            id: deleteTarget.id,
            jwt: localStorage.getItem('jwt') || ''
        }));
        setDeletingId(null);
    };

    const formatDate = (dateStr: string) => {
        try {
            return new Date(dateStr).toLocaleDateString('en-US', {
                year: 'numeric', month: 'short', day: '2-digit'
            });
        } catch { return dateStr; }
    };

    const isExpired = (endDate: string) => new Date(endDate) < new Date();

    return (
        <Box>
            {/* Stat Cards */}
            <Box sx={{ display: 'flex', gap: 2, mb: 2.5, flexWrap: 'wrap' }}>
                {[
                    { label: 'Total Coupons', value: allCoupons.length, color: '#0F172A', bg: '#fff' },
                    { label: 'Active', value: activeCoupons, color: '#067D62', bg: '#f0faf7' },
                    { label: 'Inactive', value: allCoupons.length - activeCoupons, color: '#CC0C39', bg: '#fff5f7' },
                ].map(stat => (
                    <Box key={stat.label} sx={{
                        backgroundColor: stat.bg,
                        border: '1px solid #e0e0e0',
                        borderTop: `4px solid ${stat.color}`,
                        borderRadius: '4px',
                        px: 2.5, py: 1.5,
                        minWidth: 130,
                        boxShadow: '0 1px 3px rgba(0,0,0,0.07)',
                    }}>
                        {adminCoupon?.loading
                            ? <Skeleton width={40} height={32} />
                            : <Typography sx={{ fontSize: 24, fontWeight: 800, color: stat.color, lineHeight: 1.1, fontFamily: '"Manrope", Arial, sans-serif' }}>
                                {stat.value}
                            </Typography>
                        }
                        <Typography sx={{ fontSize: 11, color: '#64748B', fontFamily: '"Manrope", Arial, sans-serif', mt: 0.3 }}>
                            {stat.label}
                        </Typography>
                    </Box>
                ))}
            </Box>

            {/* Filter Bar */}
            <Box sx={{
                display: 'flex', alignItems: 'center', gap: 1.5,
                px: 2, py: 1.5, mb: 1.5,
                backgroundColor: '#fff',
                border: '1px solid #ddd',
                borderRadius: '4px',
            }}>
                <FilterListIcon sx={{ color: '#64748B', fontSize: 17 }} />
                <Typography sx={{ fontSize: 13, fontWeight: 600, color: '#0F172A', fontFamily: '"Manrope", Arial, sans-serif' }}>
                    Filter:
                </Typography>
                <Select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    size="small"
                    sx={{
                        fontSize: 13, minWidth: 160,
                        fontFamily: '"Manrope", Arial, sans-serif',
                        '& .MuiOutlinedInput-notchedOutline': { borderColor: '#c4c4c4' },
                        '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#0F766E' },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#0F766E', borderWidth: 2 },
                    }}
                >
                    {filterOptions.map(o => (
                        <MenuItem key={o.value} value={o.value} sx={{ fontSize: 13, fontFamily: '"Manrope", Arial, sans-serif' }}>
                            {o.label}
                        </MenuItem>
                    ))}
                </Select>
                <Typography sx={{ ml: 'auto', fontSize: 12, color: '#64748B', fontFamily: '"Manrope", Arial, sans-serif' }}>
                    Showing {filteredCoupons.length} of {allCoupons.length} coupons
                </Typography>
            </Box>

            {/* Table */}
            <TableContainer component={Paper} sx={{
                border: '1px solid #ddd', borderRadius: '4px',
                boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
                overflow: 'hidden',
            }}>
                <Table sx={{ minWidth: 700 }} aria-label="coupon table">
                    <TableHead>
                        <TableRow>
                            <StyledTableCell>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                                    <LocalOfferIcon sx={{ fontSize: 13 }} /> Coupon Code
                                </Box>
                            </StyledTableCell>
                            <StyledTableCell>Start Date</StyledTableCell>
                            <StyledTableCell>End Date</StyledTableCell>
                            <StyledTableCell>Min. Order</StyledTableCell>
                            <StyledTableCell>Discount</StyledTableCell>
                            <StyledTableCell align="center">Status</StyledTableCell>
                            <StyledTableCell align="center">Delete</StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {adminCoupon?.loading
                            ? Array.from({ length: 4 }).map((_, i) => (
                                <StyledTableRow key={i}>
                                    {Array.from({ length: 7 }).map((_, j) => (
                                        <StyledTableCell key={j}><Skeleton height={22} /></StyledTableCell>
                                    ))}
                                </StyledTableRow>
                            ))
                            : filteredCoupons.map((c: Coupon) => {
                                const expired = isExpired(c.validityEndDate);
                                const isDeleting = deletingId === c.id;
                                return (
                                    <Fade in key={c.id}>
                                        <StyledTableRow sx={{ opacity: isDeleting ? 0.4 : 1, transition: 'opacity 0.3s' }}>
                                            <StyledTableCell>
                                                <Box sx={{
                                                    display: 'inline-flex', alignItems: 'center', gap: 0.8,
                                                    backgroundColor: '#1E293B', color: '#0F766E',
                                                    fontFamily: '"Courier New", monospace',
                                                    fontWeight: 800, fontSize: 13,
                                                    px: 1.5, py: 0.5, borderRadius: '3px',
                                                    letterSpacing: '1.5px',
                                                }}>
                                                    <LocalOfferIcon sx={{ fontSize: 12 }} />
                                                    {c.code}
                                                </Box>
                                            </StyledTableCell>
                                            <StyledTableCell sx={{ color: '#555', fontSize: 12 }}>
                                                {formatDate(c.validityStartDate)}
                                            </StyledTableCell>
                                            <StyledTableCell>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                    <Typography sx={{ fontSize: 12, color: expired ? '#CC0C39' : '#555', fontFamily: '"Manrope", Arial, sans-serif' }}>
                                                        {formatDate(c.validityEndDate)}
                                                    </Typography>
                                                    {expired && (
                                                        <Tooltip title="Expired">
                                                            <WarningAmberIcon sx={{ fontSize: 14, color: '#CC0C39' }} />
                                                        </Tooltip>
                                                    )}
                                                </Box>
                                            </StyledTableCell>
                                            <StyledTableCell>
                                                <Typography sx={{ fontWeight: 700, fontSize: 13, fontFamily: '"Manrope", Arial, sans-serif' }}>
                                                    ${Number(c.minimumOrderValue).toFixed(2)}
                                                </Typography>
                                            </StyledTableCell>
                                            <StyledTableCell>
                                                <Box sx={{
                                                    display: 'inline-block',
                                                    background: 'linear-gradient(135deg, #0F766E, #0b5f59)',
                                                    color: '#fff',
                                                    fontWeight: 800, fontSize: 13,
                                                    px: 1.2, py: 0.4, borderRadius: '3px',
                                                    fontFamily: '"Manrope", Arial, sans-serif',
                                                    boxShadow: '0 1px 3px rgba(255,153,0,0.4)',
                                                }}>
                                                    {c.discountPercentage}% OFF
                                                </Box>
                                            </StyledTableCell>
                                            <StyledTableCell align="center">
                                                <Chip
                                                    icon={c.active && !expired
                                                        ? <CheckCircleOutlineIcon style={{ fontSize: 13 }} />
                                                        : <HighlightOffIcon style={{ fontSize: 13 }} />}
                                                    label={expired ? 'Expired' : c.active ? 'Active' : 'Inactive'}
                                                    size="small"
                                                    sx={{
                                                        fontWeight: 700, fontSize: 11,
                                                        fontFamily: '"Manrope", Arial, sans-serif',
                                                        backgroundColor: expired ? '#FFF3CD' : c.active ? '#D4EDDA' : '#F8D7DA',
                                                        color: expired ? '#856404' : c.active ? '#155724' : '#721C24',
                                                        border: `1px solid ${expired ? '#FFEAA7' : c.active ? '#C3E6CB' : '#F5C6CB'}`,
                                                        '& .MuiChip-icon': {
                                                            color: expired ? '#856404' : c.active ? '#155724' : '#721C24',
                                                        }
                                                    }}
                                                />
                                            </StyledTableCell>
                                            <StyledTableCell align="center">
                                                <Tooltip title="Delete coupon" arrow>
                                                    <span>
                                                        <IconButton
                                                            size="small"
                                                            disabled={isDeleting}
                                                            onClick={() => setDeleteTarget(c)}
                                                            sx={{
                                                                color: '#CC0C39',
                                                                border: '1px solid #CC0C39',
                                                                borderRadius: '4px',
                                                                p: 0.7,
                                                                transition: 'all 0.15s ease',
                                                                '&:hover': { backgroundColor: '#CC0C39', color: '#fff' },
                                                                '&.Mui-disabled': { opacity: 0.4, border: '1px solid #ccc' },
                                                            }}
                                                        >
                                                            <DeleteOutlineIcon sx={{ fontSize: 16 }} />
                                                        </IconButton>
                                                    </span>
                                                </Tooltip>
                                            </StyledTableCell>
                                        </StyledTableRow>
                                    </Fade>
                                );
                            })}
                    </TableBody>
                </Table>

                {!adminCoupon?.loading && filteredCoupons.length === 0 && (
                    <Box sx={{ textAlign: 'center', py: 7, color: '#64748B' }}>
                        <LocalOfferIcon sx={{ fontSize: 44, color: '#ddd', mb: 1.5 }} />
                        <Typography sx={{ fontFamily: '"Manrope", Arial, sans-serif', fontSize: 14, fontWeight: 600 }}>
                            No coupons found
                        </Typography>
                        <Typography sx={{ fontFamily: '"Manrope", Arial, sans-serif', fontSize: 12, color: '#999', mt: 0.5 }}>
                            {filter !== 'ALL' ? 'Try changing the filter.' : 'Create your first coupon to get started.'}
                        </Typography>
                    </Box>
                )}
            </TableContainer>

            {/* Delete Confirmation Dialog */}
            <Dialog
                open={!!deleteTarget}
                onClose={() => setDeleteTarget(null)}
                PaperProps={{ sx: { borderRadius: '6px', border: '1px solid #ddd', maxWidth: 400 } }}
            >
                <DialogTitle sx={{
                    fontFamily: '"Manrope", Arial, sans-serif',
                    fontWeight: 700, fontSize: 16,
                    backgroundColor: '#1E293B', color: '#fff',
                    borderBottom: '3px solid #0F766E',
                    display: 'flex', alignItems: 'center', gap: 1,
                }}>
                    <WarningAmberIcon sx={{ color: '#0F766E', fontSize: 20 }} />
                    Confirm Delete
                </DialogTitle>
                <DialogContent sx={{ pt: 2.5 }}>
                    <DialogContentText sx={{ fontFamily: '"Manrope", Arial, sans-serif', fontSize: 13, color: '#0F172A' }}>
                        Are you sure you want to delete coupon{' '}
                        <Box component="span" sx={{
                            fontFamily: '"Courier New", monospace', fontWeight: 800,
                            backgroundColor: '#1E293B', color: '#0F766E',
                            px: 0.8, py: 0.2, borderRadius: '3px', fontSize: 13,
                        }}>
                            {deleteTarget?.code}
                        </Box>
                        ? This action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions sx={{ px: 2.5, pb: 2, gap: 1 }}>
                    <Button
                        onClick={() => setDeleteTarget(null)}
                        sx={{
                            fontFamily: '"Manrope", Arial, sans-serif',
                            fontSize: 13, textTransform: 'none',
                            color: '#0F172A', border: '1px solid #ccc',
                            borderRadius: '20px', px: 2.5,
                            '&:hover': { backgroundColor: '#f5f5f5' },
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleDeleteConfirm}
                        variant="contained"
                        sx={{
                            fontFamily: '"Manrope", Arial, sans-serif',
                            fontSize: 13, textTransform: 'none', fontWeight: 700,
                            backgroundColor: '#CC0C39', borderRadius: '20px', px: 2.5,
                            '&:hover': { backgroundColor: '#a30a2e' },
                        }}
                    >
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}