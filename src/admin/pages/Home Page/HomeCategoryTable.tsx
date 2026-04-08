import React, { useState } from 'react'
import {
    Box, IconButton, Modal, Paper, Skeleton, styled, Table,
    TableBody, TableCell, tableCellClasses, TableContainer,
    TableHead, TableRow, Tooltip, Typography,
} from '@mui/material'
import type { HomeCategory } from '../../../types/homeDataTypes'
import EditIcon from '@mui/icons-material/Edit'
import CategoryIcon from '@mui/icons-material/Category'
import UpdateHomeCategoryForm from './UpdateHomeCategoryForm'

const StyledTableCell = styled(TableCell)(() => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: '#1E293B',
        color: '#fff',
        fontFamily: '"Manrope", Arial, sans-serif',
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
        fontFamily: '"Manrope", Arial, sans-serif',
        color: '#0F172A',
        padding: '12px 18px',
        borderBottom: '1px solid #f0f0f0',
    },
}))

const StyledTableRow = styled(TableRow)(() => ({
    transition: 'background-color 0.15s ease',
    '&:nth-of-type(odd)': { backgroundColor: '#fafafa' },
    '&:nth-of-type(even)': { backgroundColor: '#ffffff' },
    '&:hover': { backgroundColor: '#fff8e7' },
    '&:last-child td': { border: 0 },
}))

interface Props {
    categories: HomeCategory[] | undefined
}

const HomeCategoryTable = ({ categories }: Props) => {
    const [selectedCategory, setSelectedCategory] = useState<HomeCategory | null>(null)

    if (!categories) {
        return (
            <TableContainer component={Paper} sx={{ border: '1px solid #ddd', borderRadius: '4px', overflow: 'hidden' }}>
                <Table sx={{ minWidth: 700 }}>
                    <TableHead>
                        <TableRow>
                            {['#', 'ID', 'Image', 'Category ID', 'Edit'].map(h => (
                                <StyledTableCell key={h}>{h}</StyledTableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {Array.from({ length: 5 }).map((_, i) => (
                            <StyledTableRow key={i}>
                                {Array.from({ length: 5 }).map((_, j) => (
                                    <StyledTableCell key={j}><Skeleton height={22} /></StyledTableCell>
                                ))}
                            </StyledTableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        )
    }

    return (
        <>
            <TableContainer component={Paper} sx={{
                border: '1px solid #ddd', borderRadius: '4px',
                boxShadow: '0 1px 4px rgba(0,0,0,0.08)', overflow: 'hidden',
            }}>
                <Table sx={{ minWidth: 700 }} aria-label="categories table">
                    <TableHead>
                        <TableRow>
                            <StyledTableCell>#</StyledTableCell>
                            <StyledTableCell>ID</StyledTableCell>
                            <StyledTableCell>Image</StyledTableCell>
                            <StyledTableCell>Category ID</StyledTableCell>
                            <StyledTableCell align="center">Edit</StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {categories.map((category: HomeCategory, index: number) => (
                            <StyledTableRow key={category.categoryId}>
                                {/* # */}
                                <StyledTableCell>
                                    <Typography sx={{ fontWeight: 600, fontSize: 13, color: '#64748B', fontFamily: '"Manrope", Arial, sans-serif' }}>
                                        {index + 1}
                                    </Typography>
                                </StyledTableCell>

                                {/* ID */}
                                <StyledTableCell>
                                    <Box sx={{
                                        display: 'inline-block',
                                        backgroundColor: '#f0f0f0', color: '#64748B',
                                        fontFamily: '"Courier New", monospace',
                                        fontSize: 12, fontWeight: 600,
                                        px: 1, py: 0.3, borderRadius: '3px',
                                        border: '1px solid #e0e0e0',
                                    }}>
                                        {category.id}
                                    </Box>
                                </StyledTableCell>

                                {/* Image */}
                                <StyledTableCell>
                                    <Box sx={{
                                        width: 72, height: 56, borderRadius: '4px',
                                        overflow: 'hidden', border: '1px solid #e0e0e0',
                                        backgroundColor: '#f7f7f7',
                                    }}>
                                        <img
                                            src={(category as any).image || (category as any).imageUrl}
                                            alt={category.categoryId}
                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                        />
                                    </Box>
                                </StyledTableCell>

                                {/* Category ID */}
                                <StyledTableCell>
                                    <Typography sx={{ fontFamily: '"Manrope", Arial, sans-serif', fontSize: 13, fontWeight: 600 }}>
                                        {category.categoryId}
                                    </Typography>
                                </StyledTableCell>

                                {/* Edit */}
                                <StyledTableCell align="center">
                                    <Tooltip title="Edit category" arrow>
                                        <IconButton
                                            size="small"
                                            onClick={() => setSelectedCategory(category)}
                                            sx={{
                                                color: '#0F766E', border: '1px solid #0F766E',
                                                borderRadius: '4px', p: 0.7,
                                                transition: 'all 0.15s ease',
                                                '&:hover': { backgroundColor: '#0F766E', color: '#fff' },
                                            }}
                                        >
                                            <EditIcon sx={{ fontSize: 16 }} />
                                        </IconButton>
                                    </Tooltip>
                                </StyledTableCell>
                            </StyledTableRow>
                        ))}
                    </TableBody>
                </Table>

                {/* Empty state */}
                {categories.length === 0 && (
                    <Box sx={{ textAlign: 'center', py: 7 }}>
                        <CategoryIcon sx={{ fontSize: 44, color: '#ddd', mb: 1.5 }} />
                        <Typography sx={{ fontFamily: '"Manrope", Arial, sans-serif', fontSize: 14, fontWeight: 600, color: '#64748B' }}>
                            No categories found
                        </Typography>
                    </Box>
                )}
            </TableContainer>

            {/* Edit Modal */}
            {selectedCategory && (
                <Modal open onClose={() => setSelectedCategory(null)}>
                    <Box sx={{
                        position: 'absolute', top: '50%', left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 460, backgroundColor: '#fff',
                        border: '1px solid #ddd', borderRadius: '6px',
                        overflow: 'hidden',
                        boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
                    }}>
                        <Box sx={{
                            backgroundColor: '#1E293B', px: 3, py: 2,
                            borderBottom: '3px solid #0F766E',
                            display: 'flex', alignItems: 'center', gap: 1,
                        }}>
                            <EditIcon sx={{ color: '#0F766E', fontSize: 18 }} />
                            <Typography sx={{ color: '#fff', fontFamily: '"Manrope", Arial, sans-serif', fontWeight: 700, fontSize: 15 }}>
                                Edit Category
                            </Typography>
                        </Box>
                        <Box sx={{ p: 3 }}>
                            <UpdateHomeCategoryForm
                                category={selectedCategory}
                                handleClose={() => setSelectedCategory(null)}
                            />
                        </Box>
                    </Box>
                </Modal>
            )}
        </>
    )
}

export default HomeCategoryTable
