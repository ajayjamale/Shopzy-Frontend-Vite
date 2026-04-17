import React, { useEffect, useMemo, useState } from 'react'
import { Box, IconButton, Tooltip, Typography } from '@mui/material'
import LocalOfferIcon from '@mui/icons-material/LocalOffer'
import TableChartIcon from '@mui/icons-material/TableChart'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded'
import DealsTable from './DealsTable'
import CreateDealForm from './CreateDealForm'
import { useAppDispatch, useAppSelector } from '../../../context/AppContext'
import { getAllDailyDiscounts } from '../../../store/admin/DealSlice'
const tabs = [
  { name: 'Daily Discounts', icon: <TableChartIcon sx={{ fontSize: 15 }} /> },
  { name: 'Create Discount', icon: <AddCircleOutlineIcon sx={{ fontSize: 15 }} /> },
]
const Deal = () => {
  const [activeTab, setActiveTab] = useState(tabs[0].name)
  const dispatch = useAppDispatch()
  const { deal } = useAppSelector((store) => store)
  const syncDealData = () => {
    dispatch(getAllDailyDiscounts())
  }
  useEffect(() => {
    syncDealData()
  }, [])
  const activeToday = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10)
    return deal.discounts.filter((item) => {
      if (item.active === false) return false
      if (!item.startDate || !item.endDate) return true
      return item.startDate <= today && item.endDate >= today
    }).length
  }, [deal.discounts])
  const cards = useMemo(
    () => [
      { label: 'Total Discounts', value: deal.discounts.length, tone: '#0F766E' },
      { label: 'Active Today', value: activeToday, tone: '#334155' },
      { label: 'Status', value: deal.loading ? 'Syncing...' : 'Up to date', tone: '#7C3AED' },
    ],
    [activeToday, deal.discounts.length, deal.loading],
  )
  return (
    <Box sx={{ backgroundColor: '#F3F7F8', minHeight: '100vh', p: { xs: 1.5, md: 2.5 } }}>
      {/* Page header */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          flexWrap: 'wrap',
          mb: 2.2,
          p: { xs: 1.4, md: 1.8 },
          border: '1px solid #DCE8EC',
          borderRadius: '14px',
          background: 'linear-gradient(145deg, #FFFFFF 0%, #F8FCFC 100%)',
        }}
      >
        <LocalOfferIcon sx={{ color: '#0F766E', fontSize: 24 }} />
        <Box>
          <Typography
            variant="h6"
            sx={{
              fontFamily: '"Manrope", Arial, sans-serif',
              fontWeight: 800,
              color: '#0F172A',
              letterSpacing: '-0.2px',
            }}
          >
            Daily Discounts Management
          </Typography>
          <Typography
            sx={{
              color: '#64748B',
              fontSize: 12,
              fontFamily: '"Manrope", Arial, sans-serif',
              mt: 0.25,
            }}
          >
            Create, update, and publish homepage discount cards from one place.
          </Typography>
        </Box>

        <Typography
          variant="body2"
          sx={{
            color: '#64748B',
            ml: { xs: 0, md: 'auto' },
            fontSize: 11,
            fontFamily: '"Manrope", Arial, sans-serif',
          }}
        >
          Admin Console &gt; Homepage &gt; Daily Discounts
        </Typography>

        <Tooltip title="Refresh daily discounts">
          <IconButton
            onClick={syncDealData}
            sx={{
              ml: 'auto',
              border: '1px solid #CFE3E6',
              color: '#0F766E',
              '&:hover': { backgroundColor: '#E9F8F5' },
            }}
          >
            <RefreshRoundedIcon sx={{ fontSize: 18 }} />
          </IconButton>
        </Tooltip>
      </Box>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' },
          gap: 1.5,
          mb: 2.5,
        }}
      >
        {cards.map((card) => (
          <Box
            key={card.label}
            sx={{
              border: '1px solid #DEEAEE',
              borderRadius: '12px',
              backgroundColor: '#fff',
              px: 1.7,
              py: 1.4,
            }}
          >
            <Typography
              sx={{
                color: '#64748B',
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: '.08em',
                textTransform: 'uppercase',
                mb: 0.8,
              }}
            >
              {card.label}
            </Typography>
            <Typography
              sx={{
                fontSize: 18,
                fontWeight: 800,
                color: card.tone,
                fontFamily: '"Manrope", Arial, sans-serif',
              }}
            >
              {card.value}
            </Typography>
          </Box>
        ))}
      </Box>

      {/* Tab bar */}
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          backgroundColor: '#fff',
          border: '1px solid #DEEAEE',
          borderRadius: '12px',
          p: 0.8,
          gap: 0.8,
          mb: 3,
          width: 'fit-content',
          maxWidth: '100%',
        }}
      >
        {tabs.map((tab) => {
          const isActive = activeTab === tab.name
          return (
            <Box
              key={tab.name}
              onClick={() => setActiveTab(tab.name)}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0.8,
                px: 1.8,
                py: 1.1,
                cursor: 'pointer',
                fontFamily: '"Manrope", Arial, sans-serif',
                fontSize: 12.5,
                fontWeight: isActive ? 700 : 600,
                color: isActive ? '#FFFFFF' : '#64748B',
                backgroundColor: isActive ? '#0F766E' : 'transparent',
                borderRadius: '9px',
                border: isActive ? '1px solid #0F766E' : '1px solid transparent',
                transition: 'all 0.2s ease',
                userSelect: 'none',
                '&:hover': { backgroundColor: isActive ? '#0b5f59' : '#F5FAFA' },
              }}
            >
              {tab.icon}
              {tab.name}
            </Box>
          )
        })}
      </Box>

      {/* Tab content */}
      <Box>
        {activeTab === 'Daily Discounts' && <DealsTable />}
        {activeTab === 'Create Discount' && (
          <Box sx={{ display: 'flex', justifyContent: 'center', pt: 2 }}>
            <CreateDealForm
              onSuccess={() => {
                setActiveTab('Daily Discounts')
                syncDealData()
              }}
            />
          </Box>
        )}
      </Box>
    </Box>
  )
}
export default Deal
