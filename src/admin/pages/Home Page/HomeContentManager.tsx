import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  IconButton,
  Modal,
  Paper,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Stack,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { api } from "../../../Config/Api";
import type { HomeContentItem, HomeSectionConfig, HomeSectionKey } from "../../../types/homeContentTypes";
import { getAdminToken } from "../../../util/authToken";

const sectionOptions: { key: HomeSectionKey; label: string }[] = [
  { key: "HERO", label: "Hero Carousel" },
  { key: "ELECTRONICS", label: "Electronics" },
  { key: "TOP_BRAND", label: "Top Brands" },
  { key: "SHOP_BY_CATEGORY", label: "Shop by Category" },
];

const emptyItem: Partial<HomeContentItem> = {
  title: "",
  subtitle: "",
  description: "",
  imageUrl: "",
  buttonText: "",
  buttonLink: "",
  badgeText: "",
  categoryId: "",
  redirectLink: "",
  displayOrder: 0,
  active: true,
};

const HomeContentManager: React.FC = () => {
  const [items, setItems] = useState<HomeContentItem[]>([]);
  const [sections, setSections] = useState<HomeSectionConfig[]>([]);
  const [selectedSection, setSelectedSection] = useState<HomeSectionKey>("HERO");
  const [editing, setEditing] = useState<Partial<HomeContentItem> | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const authHeader = { Authorization: `Bearer ${getAdminToken()}` };

  const fetchData = async () => {
    const [itemsRes, sectionRes] = await Promise.all([
      api.get<HomeContentItem[]>(`/admin/home-content/items`, {
        params: { sectionKey: selectedSection },
        headers: authHeader,
      }),
      api.get<HomeSectionConfig[]>(`/admin/home-content/sections`, {
        headers: authHeader,
      }),
    ]);
    setItems(itemsRes.data);
    setSections(sectionRes.data);
  };

  useEffect(() => {
    fetchData();
  }, [selectedSection]);

  const openModal = (item?: HomeContentItem) => {
    setEditing(item ?? { ...emptyItem, sectionKey: selectedSection });
    setModalOpen(true);
  };

  const closeModal = () => setModalOpen(false);

  const saveItem = async () => {
    if (!editing?.sectionKey) return;
    if (editing.id) {
      await api.put(`/admin/home-content/items/${editing.id}`, editing, {
        headers: authHeader,
      });
    } else {
      await api.post(`/admin/home-content/items`, { ...editing, sectionKey: selectedSection }, {
        headers: authHeader,
      });
    }
    setModalOpen(false);
    fetchData();
  };

  const deleteItem = async (id: number) => {
    await api.delete(`/admin/home-content/items/${id}`, { headers: authHeader });
    fetchData();
  };

  const toggleActive = async (item: HomeContentItem) => {
    await api.patch(`/admin/home-content/items/${item.id}/status`, null, {
      params: { active: !item.active },
      headers: authHeader,
    });
    fetchData();
  };

  const updateOrder = async (item: HomeContentItem, order: number) => {
    await api.patch(`/admin/home-content/items/${item.id}/order`, null, {
      params: { displayOrder: order },
      headers: authHeader,
    });
    fetchData();
  };

  const toggleSectionVisibility = async (section: HomeSectionConfig) => {
    await api.put(`/admin/home-content/sections/${section.sectionKey}`, { ...section, visible: !section.visible }, {
      headers: authHeader,
    });
    fetchData();
  };

  const currentSectionConfig = useMemo(
    () => sections.find((s) => s.sectionKey === selectedSection),
    [sections, selectedSection]
  );

  return (
    <Box sx={{ p: 2, display: "grid", gap: 2 }}>
      <Typography variant="h5" fontWeight={700}>Home Content Manager</Typography>

      <Paper sx={{ p: 2, display: "flex", gap: 2, alignItems: "center", flexWrap: "wrap" }}>
        <FormControl size="small" sx={{ minWidth: 200 }}>
          <InputLabel>Section</InputLabel>
          <Select
            label="Section"
            value={selectedSection}
            onChange={(e) => setSelectedSection(e.target.value as HomeSectionKey)}
          >
            {sectionOptions.map((opt) => (
              <MenuItem key={opt.key} value={opt.key}>{opt.label}</MenuItem>
            ))}
          </Select>
        </FormControl>

        {currentSectionConfig && (
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography variant="body2">Visible</Typography>
            <Switch
              checked={currentSectionConfig.visible}
              onChange={() => toggleSectionVisibility(currentSectionConfig)}
            />
          </Stack>
        )}

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => openModal()}
          sx={{ ml: "auto" }}
        >
          Add item
        </Button>
      </Paper>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Image</TableCell>
              <TableCell>Active</TableCell>
              <TableCell>Order</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.title || item.subtitle}</TableCell>
                <TableCell>
                  {item.imageUrl && (
                    <img src={item.imageUrl} alt={item.title} style={{ width: 80, height: 50, objectFit: "cover", borderRadius: 6 }} />
                  )}
                </TableCell>
                <TableCell>
                  <Switch checked={item.active} onChange={() => toggleActive(item)} />
                </TableCell>
                <TableCell>
                  <TextField
                    size="small"
                    type="number"
                    value={item.displayOrder ?? 0}
                    onChange={(e) => updateOrder(item, Number(e.target.value))}
                    sx={{ width: 90 }}
                  />
                </TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => openModal(item)}><EditIcon fontSize="small" /></IconButton>
                  <IconButton color="error" onClick={() => deleteItem(item.id)}><DeleteIcon fontSize="small" /></IconButton>
                </TableCell>
              </TableRow>
            ))}
            {items.length === 0 && (
              <TableRow>
                <TableCell colSpan={5}>
                  <Typography textAlign="center" py={2}>No items yet.</Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Modal open={modalOpen} onClose={closeModal}>
        <Box sx={{
          position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
          width: 540, maxWidth: "92vw", bgcolor: "background.paper", p: 3, borderRadius: 2, boxShadow: 24, display: "grid", gap: 2
        }}>
          <Typography fontWeight={700}>{editing?.id ? "Edit" : "Add"} item</Typography>
          <TextField label="Title" fullWidth size="small" value={editing?.title || ""} onChange={(e) => setEditing((p) => ({ ...p!, title: e.target.value }))} />
          <TextField label="Subtitle" fullWidth size="small" value={editing?.subtitle || ""} onChange={(e) => setEditing((p) => ({ ...p!, subtitle: e.target.value }))} />
          <TextField label="Description" multiline rows={3} fullWidth size="small" value={editing?.description || ""} onChange={(e) => setEditing((p) => ({ ...p!, description: e.target.value }))} />
          <TextField label="Image URL" fullWidth size="small" value={editing?.imageUrl || ""} onChange={(e) => setEditing((p) => ({ ...p!, imageUrl: e.target.value }))} />
          <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
            <TextField label="Button Text" fullWidth size="small" value={editing?.buttonText || ""} onChange={(e) => setEditing((p) => ({ ...p!, buttonText: e.target.value }))} />
            <TextField label="Button Link" fullWidth size="small" value={editing?.buttonLink || ""} onChange={(e) => setEditing((p) => ({ ...p!, buttonLink: e.target.value }))} />
          </Stack>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
            <TextField label="Badge" fullWidth size="small" value={editing?.badgeText || ""} onChange={(e) => setEditing((p) => ({ ...p!, badgeText: e.target.value }))} />
            <TextField label="Category / Redirect" fullWidth size="small" value={editing?.categoryId || ""} onChange={(e) => setEditing((p) => ({ ...p!, categoryId: e.target.value }))} />
          </Stack>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
            <TextField label="Display Order" type="number" size="small" value={editing?.displayOrder ?? 0} onChange={(e) => setEditing((p) => ({ ...p!, displayOrder: Number(e.target.value) }))} />
            <FormControl size="small" sx={{ minWidth: 160 }}>
              <InputLabel>Status</InputLabel>
              <Select
                value={editing?.active ? "active" : "inactive"}
                label="Status"
                onChange={(e) => setEditing((p) => ({ ...p!, active: e.target.value === "active" }))}
              >
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="inactive">Inactive</MenuItem>
              </Select>
            </FormControl>
          </Stack>
          <Stack direction="row" justifyContent="flex-end" spacing={1}>
            <Button onClick={closeModal} color="inherit">Cancel</Button>
            <Button variant="contained" onClick={saveItem}>Save</Button>
          </Stack>
        </Box>
      </Modal>
    </Box>
  );
};

export default HomeContentManager;
