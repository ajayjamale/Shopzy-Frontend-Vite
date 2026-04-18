import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  Box,
  Button,
  Chip,
  FormControlLabel,
  IconButton,
  Modal,
  MenuItem,
  Paper,
  Stack,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material'
import EditRoundedIcon from '@mui/icons-material/EditRounded'
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded'
import ArrowUpwardRoundedIcon from '@mui/icons-material/ArrowUpwardRounded'
import ArrowDownwardRoundedIcon from '@mui/icons-material/ArrowDownwardRounded'
import { useSearchParams } from 'react-router-dom'
import { adminApiPath, api } from '../../../config/Api'
import { getAdminToken } from '../../../utils/authToken'
import FormFeedbackToast from '../../../components/forms/FormFeedbackToast'
const sectionOptions = [
  {
    key: 'HERO',
    label: 'Hero Spotlights',
  },
  {
    key: 'SHOP_BY_CATEGORY',
    label: 'Shop By Category',
  },
  {
    key: 'ELECTRONICS',
    label: 'Tech Feature Rail',
  },
  {
    key: 'TOP_BRAND',
    label: 'Premium Brand Showcase',
  },
]
const emptyItem = {
  sectionKey: 'HERO',
  title: '',
  subtitle: '',
  description: '',
  imageUrl: '',
  buttonText: '',
  buttonLink: '',
  badgeText: '',
  categoryId: '',
  redirectLink: '',
  displayOrder: 0,
  active: true,
}
const HOME_CONTENT_ITEMS_PATH = adminApiPath('/home-content/items')
const HOME_CONTENT_SECTIONS_PATH = adminApiPath('/home-content/sections')
const HomeContentManager = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [items, setItems] = useState([])
  const [sections, setSections] = useState([])
  const [selectedSection, setSelectedSection] = useState('HERO')
  const [editing, setEditing] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [notice, setNotice] = useState({
    open: false,
    text: '',
    severity: 'success',
  })
  const authHeader = useMemo(() => ({ Authorization: `Bearer ${getAdminToken()}` }), [])
  const fetchData = useCallback(async () => {
    try {
      const [itemsRes, sectionRes] = await Promise.all([
        api.get(HOME_CONTENT_ITEMS_PATH, {
          headers: authHeader,
        }),
        api.get(HOME_CONTENT_SECTIONS_PATH, {
          headers: authHeader,
        }),
      ])
      setItems(itemsRes.data)
      setSections(sectionRes.data)
    } catch {
      setNotice({ open: true, text: 'Failed to load home content', severity: 'error' })
    }
  }, [authHeader])
  useEffect(() => {
    fetchData()
  }, [fetchData])
  const availableSectionOptions = useMemo(() => {
    const fallbackOrder = new Map(sectionOptions.map((option, index) => [option.key, index + 1]))
    return [...sectionOptions].sort((a, b) => {
      const sectionA = sections.find((section) => section.sectionKey === a.key)
      const sectionB = sections.find((section) => section.sectionKey === b.key)
      const orderA = sectionA?.displayOrder ?? fallbackOrder.get(a.key) ?? 999
      const orderB = sectionB?.displayOrder ?? fallbackOrder.get(b.key) ?? 999
      return orderA - orderB
    })
  }, [sections])
  useEffect(() => {
    if (
      !availableSectionOptions.some((option) => option.key === selectedSection) &&
      availableSectionOptions.length
    ) {
      setSelectedSection(availableSectionOptions[0].key)
    }
  }, [availableSectionOptions, selectedSection])
  const selectedItems = useMemo(
    () =>
      items
        .filter((item) => item.sectionKey === selectedSection)
        .sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0)),
    [items, selectedSection],
  )
  const countBySection = useMemo(() => {
    const counts = {}
    for (const option of availableSectionOptions) {
      counts[option.key] = items.filter((item) => item.sectionKey === option.key).length
    }
    return counts
  }, [availableSectionOptions, items])
  const openModal = useCallback(
    (item) => {
      if (item) {
        setEditing({ ...item })
      } else {
        setEditing({
          ...emptyItem,
          sectionKey: selectedSection,
          displayOrder: selectedItems.length,
        })
      }
      setModalOpen(true)
    },
    [selectedItems.length, selectedSection],
  )
  const closeModal = () => {
    setModalOpen(false)
    setEditing(null)
    if (searchParams.get('action') === 'create') {
      const nextParams = new URLSearchParams(searchParams)
      nextParams.delete('action')
      setSearchParams(nextParams, { replace: true })
    }
  }
  const actionFromQuery = searchParams.get('action')
  useEffect(() => {
    if (actionFromQuery === 'create' && !modalOpen) {
      openModal()
    }
  }, [actionFromQuery, modalOpen, openModal])
  const saveItem = async () => {
    if (!editing?.sectionKey) return
    if (!editing?.imageUrl) {
      setNotice({ open: true, text: 'Image URL is required', severity: 'error' })
      return
    }
    setSaving(true)
    try {
      const payload = {
        ...editing,
        sectionKey: editing.sectionKey || selectedSection,
      }
      if (editing.id) {
        await api.put(`${HOME_CONTENT_ITEMS_PATH}/${editing.id}`, payload, {
          headers: authHeader,
        })
      } else {
        await api.post(HOME_CONTENT_ITEMS_PATH, payload, {
          headers: authHeader,
        })
      }
      setNotice({ open: true, text: 'Home content saved', severity: 'success' })
      closeModal()
      fetchData()
    } catch {
      setNotice({ open: true, text: 'Failed to save home content', severity: 'error' })
    } finally {
      setSaving(false)
    }
  }
  const deleteItem = async (id) => {
    const confirmed = window.confirm('Delete this item?')
    if (!confirmed) return
    try {
      await api.delete(`${HOME_CONTENT_ITEMS_PATH}/${id}`, { headers: authHeader })
      setNotice({ open: true, text: 'Item deleted', severity: 'success' })
      fetchData()
    } catch {
      setNotice({ open: true, text: 'Failed to delete item', severity: 'error' })
    }
  }
  const toggleItemActive = async (item) => {
    try {
      await api.patch(`${HOME_CONTENT_ITEMS_PATH}/${item.id}/status`, null, {
        params: { active: !item.active },
        headers: authHeader,
      })
      fetchData()
    } catch {
      setNotice({ open: true, text: 'Failed to update status', severity: 'error' })
    }
  }
  const shiftOrder = async (item, direction) => {
    const nextOrder =
      direction === 'up' ? Math.max(0, (item.displayOrder ?? 0) - 1) : (item.displayOrder ?? 0) + 1
    try {
      await api.patch(`${HOME_CONTENT_ITEMS_PATH}/${item.id}/order`, null, {
        params: { displayOrder: nextOrder },
        headers: authHeader,
      })
      fetchData()
    } catch {
      setNotice({ open: true, text: 'Failed to update order', severity: 'error' })
    }
  }
  return (
    <Box sx={{ display: 'grid', gap: 2 }}>
      <Box sx={{ display: 'grid', gap: 2 }}>
        <Paper sx={{ p: 2, borderRadius: 3, border: '1px solid #DCE8EC' }}>
          <Typography sx={{ fontWeight: 800, color: '#0F172A', mb: 1.5 }}>Sections</Typography>

          <Box
            sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 1.2 }}
          >
            {availableSectionOptions.map((option) => {
              const section = sections.find((s) => s.sectionKey === option.key)
              const active = selectedSection === option.key
              const visible = section?.visible ?? true
              return (
                <button
                  key={option.key}
                  onClick={() => setSelectedSection(option.key)}
                  style={{
                    border: active ? '1px solid #0F766E' : '1px solid #DCE8EC',
                    background: active ? '#EAF7F5' : '#FFFFFF',
                    borderRadius: 12,
                    padding: '12px',
                    textAlign: 'left',
                    cursor: 'pointer',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: 10,
                    }}
                  >
                    <p style={{ fontWeight: 700, color: '#0F172A', margin: 0 }}>{option.label}</p>
                    <Chip
                      size="small"
                      label={visible ? 'Visible' : 'Hidden'}
                      color={visible ? 'success' : 'default'}
                      variant={visible ? 'filled' : 'outlined'}
                    />
                  </div>
                  <p
                    style={{ margin: '10px 0 0', color: '#0F766E', fontSize: 12, fontWeight: 700 }}
                  >
                    {countBySection[option.key] || 0} items
                  </p>
                </button>
              )
            })}
          </Box>
        </Paper>
      </Box>

      <Paper sx={{ borderRadius: 3, border: '1px solid #DCE8EC', overflow: 'hidden' }}>
        <Box
          sx={{
            p: 2,
            borderBottom: '1px solid #E7EFF2',
            display: 'flex',
            alignItems: 'center',
            gap: 1,
          }}
        >
          <Typography sx={{ fontWeight: 800, color: '#0F172A' }}>
            {availableSectionOptions.find((section) => section.key === selectedSection)?.label ||
              selectedSection}{' '}
            Items
          </Typography>
          <Chip size="small" label={`${selectedItems.length} total`} sx={{ ml: 'auto' }} />
        </Box>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Content</TableCell>
                <TableCell>Redirect Target</TableCell>
                <TableCell>Active</TableCell>
                <TableCell>Order</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {selectedItems.map((item) => (
                <TableRow key={item.id} hover>
                  <TableCell>
                    <Stack direction="row" spacing={1.3} alignItems="center">
                      {item.imageUrl ? (
                        <img
                          src={item.imageUrl}
                          alt={item.title || item.subtitle || 'Item'}
                          style={{
                            width: 76,
                            height: 52,
                            borderRadius: 8,
                            objectFit: 'cover',
                            border: '1px solid #E5ECEF',
                          }}
                        />
                      ) : (
                        <Box
                          sx={{
                            width: 76,
                            height: 52,
                            borderRadius: 1,
                            border: '1px dashed #D4DFE3',
                          }}
                        />
                      )}
                      <Box>
                        <Typography sx={{ fontWeight: 700, color: '#0F172A', fontSize: 14 }}>
                          {item.title || item.subtitle || 'Untitled'}
                        </Typography>
                        <Typography sx={{ color: '#64748B', fontSize: 12 }}>
                          {item.badgeText || item.sectionKey}
                        </Typography>
                      </Box>
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Typography sx={{ color: '#0F172A', fontSize: 13 }}>
                      {item.redirectLink || item.categoryId || item.buttonLink || '-'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Switch checked={item.active} onChange={() => toggleItemActive(item)} />
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={0.5} alignItems="center">
                      <IconButton size="small" onClick={() => shiftOrder(item, 'up')}>
                        <ArrowUpwardRoundedIcon sx={{ fontSize: 16 }} />
                      </IconButton>
                      <TextField
                        value={item.displayOrder ?? 0}
                        size="small"
                        sx={{ width: 64 }}
                        inputProps={{ readOnly: true, style: { textAlign: 'center' } }}
                      />
                      <IconButton size="small" onClick={() => shiftOrder(item, 'down')}>
                        <ArrowDownwardRoundedIcon sx={{ fontSize: 16 }} />
                      </IconButton>
                    </Stack>
                  </TableCell>
                  <TableCell align="right">
                    <IconButton onClick={() => openModal(item)}>
                      <EditRoundedIcon fontSize="small" />
                    </IconButton>
                    <IconButton color="error" onClick={() => deleteItem(item.id)}>
                      <DeleteOutlineRoundedIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              {!selectedItems.length && (
                <TableRow>
                  <TableCell colSpan={5}>
                    <Typography sx={{ textAlign: 'center', color: '#64748B', py: 2 }}>
                      No items in this section yet. Add your first one.
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Modal open={modalOpen} onClose={closeModal}>
        <Box
          sx={{
            width: 680,
            maxWidth: '94vw',
            maxHeight: '92vh',
            overflowY: 'auto',
            bgcolor: '#fff',
            borderRadius: 3,
            border: '1px solid #DCE8EC',
            boxShadow: '0 18px 50px rgba(15,23,42,.22)',
            p: 2.4,
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            display: 'grid',
            gap: 1.4,
          }}
        >
          <Typography sx={{ fontSize: 18, fontWeight: 800, color: '#0F172A' }}>
            {editing?.id ? 'Edit Content Item' : 'Create Content Item'}
          </Typography>

          <TextField
            select
            label="Section"
            size="small"
            value={editing?.sectionKey || selectedSection}
            onChange={(e) =>
              setEditing((prev) => ({ ...(prev || emptyItem), sectionKey: e.target.value }))
            }
          >
            {availableSectionOptions.map((option) => (
              <MenuItem key={option.key} value={option.key}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>

          <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.2}>
            <TextField
              label="Title"
              size="small"
              fullWidth
              value={editing?.title || ''}
              onChange={(e) =>
                setEditing((prev) => ({ ...(prev || emptyItem), title: e.target.value }))
              }
            />
            <TextField
              label="Subtitle"
              size="small"
              fullWidth
              value={editing?.subtitle || ''}
              onChange={(e) =>
                setEditing((prev) => ({ ...(prev || emptyItem), subtitle: e.target.value }))
              }
            />
          </Stack>

          <TextField
            label="Description"
            size="small"
            multiline
            rows={3}
            value={editing?.description || ''}
            onChange={(e) =>
              setEditing((prev) => ({ ...(prev || emptyItem), description: e.target.value }))
            }
          />

          <TextField
            label="Image URL"
            size="small"
            value={editing?.imageUrl || ''}
            onChange={(e) =>
              setEditing((prev) => ({ ...(prev || emptyItem), imageUrl: e.target.value }))
            }
            helperText="Required. This image appears on homepage."
          />

          <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.2}>
            <TextField
              label="Redirect Link"
              size="small"
              fullWidth
              value={editing?.redirectLink || ''}
              onChange={(e) =>
                setEditing((prev) => ({ ...(prev || emptyItem), redirectLink: e.target.value }))
              }
              helperText="Use `/products` path or category id like `mobiles`"
            />
            <TextField
              label="Category ID (optional)"
              size="small"
              fullWidth
              value={editing?.categoryId || ''}
              onChange={(e) =>
                setEditing((prev) => ({ ...(prev || emptyItem), categoryId: e.target.value }))
              }
            />
          </Stack>

          <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.2}>
            <TextField
              label="Button Text"
              size="small"
              fullWidth
              value={editing?.buttonText || ''}
              onChange={(e) =>
                setEditing((prev) => ({ ...(prev || emptyItem), buttonText: e.target.value }))
              }
            />
            <TextField
              label="Button Link"
              size="small"
              fullWidth
              value={editing?.buttonLink || ''}
              onChange={(e) =>
                setEditing((prev) => ({ ...(prev || emptyItem), buttonLink: e.target.value }))
              }
            />
          </Stack>

          <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.2}>
            <TextField
              label="Badge Text"
              size="small"
              fullWidth
              value={editing?.badgeText || ''}
              onChange={(e) =>
                setEditing((prev) => ({ ...(prev || emptyItem), badgeText: e.target.value }))
              }
            />
            <TextField
              label="Display Order"
              type="number"
              size="small"
              fullWidth
              value={editing?.displayOrder ?? 0}
              onChange={(e) =>
                setEditing((prev) => ({
                  ...(prev || emptyItem),
                  displayOrder: Number(e.target.value),
                }))
              }
            />
          </Stack>

          <FormControlLabel
            control={
              <Switch
                checked={editing?.active ?? true}
                onChange={(e) =>
                  setEditing((prev) => ({ ...(prev || emptyItem), active: e.target.checked }))
                }
              />
            }
            label="Active"
          />

          <Stack direction="row" justifyContent="flex-end" spacing={1}>
            <Button color="inherit" onClick={closeModal}>
              Cancel
            </Button>
            <Button variant="contained" onClick={saveItem} disabled={saving}>
              {saving ? 'Saving...' : 'Save Item'}
            </Button>
          </Stack>
        </Box>
      </Modal>

      <FormFeedbackToast
        feedback={{
          open: notice.open,
          severity: notice.severity,
          message: notice.text,
          autoHideDuration: 3500,
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'right',
          },
        }}
        onClose={() => setNotice((prev) => ({ ...prev, open: false }))}
      />
    </Box>
  )
}
export default HomeContentManager
