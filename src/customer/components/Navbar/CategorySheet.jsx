import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Typography, IconButton, Collapse } from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ExpandLessIcon from '@mui/icons-material/ExpandLess'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import './Navbar.css'
import { toCatalogPath } from '../../../utils/catalogRoute'
import { menLevelThree } from '../../../data/category/level three/menLevelThree'
import { menLevelTwo } from '../../../data/category/level two/menLevelTwo'
import { womenLevelThree } from '../../../data/category/level three/womenLevelThree'
import { womenLevelTwo } from '../../../data/category/level two/womenLevelTwo'
import { electronicsLevelTwo } from '../../../data/category/level two/electronicsLavelTwo'
import { electronicsLevelThree } from '../../../data/category/level three/electronicsLevelThree'
import { furnitureLevelTwo } from '../../../data/category/level two/furnitureLevleTwo'
import { furnitureLevelThree } from '../../../data/category/level three/furnitureLevelThree'
const categoryTwo = {
  men: menLevelTwo,
  women: womenLevelTwo,
  electronics: electronicsLevelTwo,
  home_furniture: furnitureLevelTwo,
}
const categoryThree = {
  men: menLevelThree,
  women: womenLevelThree,
  electronics: electronicsLevelThree,
  home_furniture: furnitureLevelThree,
}
const accentColors = {
  men: '#2563eb',
  women: '#db2777',
  electronics: '#0891b2',
  home_furniture: '#16a34a',
}
const CategorySheet = ({ selectedCategory, toggleDrawer, setShowSheet }) => {
  const navigate = useNavigate()
  const [expandedSections, setExpandedSections] = React.useState({})
  const accent = accentColors[selectedCategory] ?? '#0F172A'
  const childCategory = (category, parentCategoryId) =>
    category?.filter((child) => child.parentCategoryId === parentCategoryId)
  const handleCategoryClick = (categoryId) => {
    if (toggleDrawer) toggleDrawer(false)()
    if (setShowSheet) setShowSheet(false)
    navigate(toCatalogPath(categoryId))
  }
  const toggleSection = (categoryId) =>
    setExpandedSections((prev) => ({ ...prev, [categoryId]: !prev[categoryId] }))
  const getCategoryTitle = () =>
    ({
      men: "Men's Collection",
      women: "Women's Collection",
      electronics: 'Electronics',
      home_furniture: 'Furniture & Home',
    })[selectedCategory] ?? selectedCategory
  return (
    <Box
      sx={{
        background: '#ffffff',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      {/* ── MOBILE HEADER ──────────────────────────────── */}
      <Box
        sx={{
          display: { xs: 'flex', md: 'none' },
          alignItems: 'center',
          justifyContent: 'space-between',
          p: '14px 16px',
          borderBottom: '1px solid #f1f5f9',
          background: '#fafafa',
          flexShrink: 0,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 4, height: 20, borderRadius: 2, background: accent }} />
          <Typography
            className="category"
            sx={{ fontWeight: 700, fontSize: '14px', color: '#0f172a' }}
          >
            {getCategoryTitle()}
          </Typography>
        </div>
        {setShowSheet && (
          <IconButton
            onClick={() => setShowSheet(false)}
            sx={{
              background: '#f1f5f9',
              borderRadius: '8px',
              width: 32,
              height: 32,
              '&:hover': { background: '#0F172A', color: '#fff' },
            }}
          >
            <ExpandLessIcon sx={{ fontSize: 18 }} />
          </IconButton>
        )}
      </Box>

      {/* ── SCROLLABLE BODY ────────────────────────────── */}
      <Box sx={{ flex: 1, overflowY: 'auto' }} className="styled-scrollbar">
        {/* ── DESKTOP (md+) ─────────────────────────────── */}
        <Box sx={{ display: { xs: 'none', md: 'block' }, p: { md: '24px 20px', lg: '24px 28px' } }}>
          {/* Title row */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              marginBottom: 24,
              paddingBottom: 16,
              borderBottom: '1px solid #f1f5f9',
              flexWrap: 'wrap',
            }}
          >
            <div
              style={{ width: 4, height: 22, borderRadius: 2, background: accent, flexShrink: 0 }}
            />
            <span
              style={{ fontSize: 18, fontWeight: 800, color: '#0f172a', letterSpacing: '-0.01em' }}
            >
              {getCategoryTitle()}
            </span>
            <span
              style={{
                fontSize: 11,
                fontWeight: 600,
                color: accent,
                background: `${accent}18`,
                padding: '3px 10px',
                borderRadius: 20,
              }}
            >
              {categoryTwo[selectedCategory]?.length ?? 0} sections
            </span>
          </div>

          {/* Category grid — uses CSS class for responsive columns */}
          <div className="category-desktop-grid">
            {categoryTwo[selectedCategory]?.map((item) => (
              <div key={item.categoryId}>
                <div
                  style={{
                    fontSize: 11,
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    color: '#0f172a',
                    marginBottom: 12,
                    paddingBottom: 8,
                    borderBottom: `2px solid ${accent}`,
                    cursor: 'pointer',
                    transition: 'color 0.2s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = accent)}
                  onMouseLeave={(e) => (e.currentTarget.style.color = '#0f172a')}
                  onClick={() => handleCategoryClick(item.categoryId)}
                >
                  {item.name}
                </div>
                <ul
                  style={{
                    listStyle: 'none',
                    padding: 0,
                    margin: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 6,
                  }}
                >
                  {childCategory(categoryThree[selectedCategory], item.categoryId)?.map((child) => (
                    <li
                      key={child.categoryId}
                      onClick={() => handleCategoryClick(child.categoryId)}
                      style={{
                        fontSize: 12,
                        color: '#64748b',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 5,
                        padding: '3px 0',
                        transition: 'all 0.15s',
                        borderRadius: 4,
                      }}
                      onMouseEnter={(e) => {
                        const el = e.currentTarget
                        el.style.color = accent
                        el.style.paddingLeft = '6px'
                      }}
                      onMouseLeave={(e) => {
                        const el = e.currentTarget
                        el.style.color = '#64748b'
                        el.style.paddingLeft = '0'
                      }}
                      className="category"
                    >
                      <ChevronRightIcon sx={{ fontSize: 11, flexShrink: 0, opacity: 0.5 }} />
                      {child.name}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Browse-all CTA */}
          <div style={{ marginTop: 28, paddingTop: 20, borderTop: '1px solid #f1f5f9' }}>
            <button
              onClick={() => handleCategoryClick(selectedCategory)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '10px 20px',
                borderRadius: 8,
                border: `1.5px solid ${accent}`,
                background: 'transparent',
                color: accent,
                fontSize: 12,
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                fontFamily: 'inherit',
              }}
              onMouseEnter={(e) => {
                const b = e.currentTarget
                b.style.background = accent
                b.style.color = '#fff'
              }}
              onMouseLeave={(e) => {
                const b = e.currentTarget
                b.style.background = 'transparent'
                b.style.color = accent
              }}
            >
              Browse all {getCategoryTitle()} →
            </button>
          </div>
        </Box>

        {/* ── MOBILE ACCORDION (xs–sm) ──────────────────── */}
        <Box sx={{ display: { xs: 'block', md: 'none' }, p: '12px' }}>
          {categoryTwo[selectedCategory]?.map((item) => (
            <div
              key={item.categoryId}
              style={{
                marginBottom: 8,
                borderRadius: 12,
                border: '1px solid #f1f5f9',
                overflow: 'hidden',
              }}
            >
              <div
                onClick={() => toggleSection(item.categoryId)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '14px 16px',
                  background: expandedSections[item.categoryId] ? '#fafafa' : '#fff',
                  cursor: 'pointer',
                  transition: 'background 0.15s',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  {expandedSections[item.categoryId] && (
                    <div style={{ width: 3, height: 16, borderRadius: 2, background: accent }} />
                  )}
                  <Typography
                    className="category"
                    sx={{
                      fontWeight: 700,
                      fontSize: '13px',
                      color: expandedSections[item.categoryId] ? '#0f172a' : '#475569',
                    }}
                  >
                    {item.name}
                  </Typography>
                </div>
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 8,
                    background: expandedSections[item.categoryId] ? accent : '#f1f5f9',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.2s',
                  }}
                >
                  {expandedSections[item.categoryId] ? (
                    <ExpandLessIcon sx={{ fontSize: 16, color: '#fff' }} />
                  ) : (
                    <ExpandMoreIcon sx={{ fontSize: 16, color: '#64748b' }} />
                  )}
                </div>
              </div>
              <Collapse in={expandedSections[item.categoryId]}>
                <div
                  style={{
                    padding: '4px 16px 16px',
                    background: '#fafafa',
                    borderTop: '1px solid #f1f5f9',
                  }}
                >
                  <ul
                    style={{
                      listStyle: 'none',
                      padding: 0,
                      margin: 0,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 8,
                    }}
                  >
                    {childCategory(categoryThree[selectedCategory], item.categoryId)?.map(
                      (child) => (
                        <li
                          key={child.categoryId}
                          onClick={() => handleCategoryClick(child.categoryId)}
                          style={{
                            fontSize: 13,
                            color: '#475569',
                            cursor: 'pointer',
                            padding: '4px 0',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 6,
                            transition: 'color 0.15s',
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.color = accent)}
                          onMouseLeave={(e) => (e.currentTarget.style.color = '#475569')}
                          className="category"
                        >
                          <ChevronRightIcon sx={{ fontSize: 12, color: accent, flexShrink: 0 }} />
                          {child.name}
                        </li>
                      ),
                    )}
                    <li
                      onClick={() => handleCategoryClick(item.categoryId)}
                      style={{
                        fontSize: 12,
                        fontWeight: 700,
                        color: accent,
                        cursor: 'pointer',
                        paddingTop: 8,
                        marginTop: 4,
                        borderTop: '1px solid #f1f5f9',
                      }}
                    >
                      Browse All {item.name} →
                    </li>
                  </ul>
                </div>
              </Collapse>
            </div>
          ))}
        </Box>
      </Box>

      {/* ── MOBILE FOOTER ──────────────────────────────── */}
      <Box
        sx={{
          display: { xs: 'flex', md: 'none' },
          p: '12px 16px',
          borderTop: '1px solid #f1f5f9',
          background: '#fafafa',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexShrink: 0,
        }}
      >
        <Typography className="category" sx={{ fontSize: '11px', color: '#94a3b8' }}>
          {categoryTwo[selectedCategory]?.length || 0} sections
        </Typography>
        <Typography
          onClick={() => handleCategoryClick(selectedCategory)}
          className="category"
          sx={{
            fontSize: '12px',
            fontWeight: 700,
            cursor: 'pointer',
            color: '#fff',
            background: accent,
            px: '12px',
            py: '5px',
            borderRadius: '20px',
            '&:hover': { opacity: 0.9 },
          }}
        >
          Browse All →
        </Typography>
      </Box>
    </Box>
  )
}
export default CategorySheet
