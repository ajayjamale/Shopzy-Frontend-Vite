import React from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material'
import ImageIcon from '@mui/icons-material/Image'
import CategoryIcon from '@mui/icons-material/Category'
import { mainCategory } from '../../../data/category/mainCategory'
import { menLevelTwo } from '../../../data/category/level two/menLevelTwo'
import { womenLevelTwo } from '../../../data/category/level two/womenLevelTwo'
import { menLevelThree } from '../../../data/category/level three/menLevelThree'
import { womenLevelThree } from '../../../data/category/level three/womenLevelThree'
import { furnitureLevelThree } from '../../../data/category/level three/furnitureLevelThree'
import { electronicsLevelThree } from '../../../data/category/level three/electronicsLevelThree'
import { furnitureLevelTwo } from '../../../data/category/level two/furnitureLevleTwo'
import { electronicsLevelTwo } from '../../../data/category/level two/electronicsLavelTwo'
import { useAppDispatch } from '../../../store'
import { updateHomeCategory } from '../../../store/admin/AdminSlice'
const modernTextField = {
  '& label.Mui-focused': { color: '#1E293B' },
  '& .MuiOutlinedInput-root': {
    fontFamily: '"Manrope", Arial, sans-serif',
    fontSize: 13,
    '&:hover fieldset': { borderColor: '#0F766E' },
    '&.Mui-focused fieldset': { borderColor: '#0F766E', borderWidth: 2 },
  },
  '& label': { fontFamily: '"Manrope", Arial, sans-serif', fontSize: 13 },
  '& .MuiFormHelperText-root': { fontFamily: '"Manrope", Arial, sans-serif', fontSize: 11 },
}
const modernSelect = {
  '& label.Mui-focused': { color: '#1E293B' },
  '& .MuiOutlinedInput-root': {
    fontFamily: '"Manrope", Arial, sans-serif',
    fontSize: 13,
    '&:hover fieldset': { borderColor: '#0F766E' },
    '&.Mui-focused fieldset': { borderColor: '#0F766E', borderWidth: 2 },
  },
  '& label': { fontFamily: '"Manrope", Arial, sans-serif', fontSize: 13 },
  '& .MuiFormHelperText-root': { fontFamily: '"Manrope", Arial, sans-serif', fontSize: 11 },
}
const categoryTwo = {
  men: menLevelTwo,
  women: womenLevelTwo,
  home_furniture: furnitureLevelTwo,
  beauty: [],
  electronics: electronicsLevelTwo,
}
const categoryThree = {
  men: menLevelThree,
  women: womenLevelThree,
  home_furniture: furnitureLevelThree,
  beauty: [],
  electronics: electronicsLevelThree,
}
const UpdateHomeCategoryForm = ({ category, handleClose }) => {
  const dispatch = useAppDispatch()
  const formik = useFormik({
    initialValues: {
      image: '',
      category: '',
      category2: '',
      category3: '',
    },
    validationSchema: Yup.object({
      image: Yup.string().required('Image URL is required'),
      category: Yup.string().required('Please select a top-level category'),
    }),
    onSubmit: (values) => {
      if (category?.id) {
        dispatch(
          updateHomeCategory({
            id: category.id,
            data: {
              image: values.image,
              categoryId: values.category3 || values.category2 || values.category,
            },
          }),
        )
      }
      handleClose()
    },
  })
  const childCategory = (cats, parentCategoryId) =>
    cats.filter((child) => child.parentCategoryId == parentCategoryId)
  return (
    <Box
      component="form"
      onSubmit={formik.handleSubmit}
      sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}
    >
      {/* Current category info */}
      {category && (
        <Box
          sx={{
            backgroundColor: '#f7f7f7',
            border: '1px solid #e0e0e0',
            borderRadius: '4px',
            px: 2,
            py: 1.5,
            display: 'flex',
            alignItems: 'center',
            gap: 2,
          }}
        >
          {category.image && (
            <Box
              sx={{
                width: 48,
                height: 36,
                borderRadius: '3px',
                overflow: 'hidden',
                border: '1px solid #ddd',
                flexShrink: 0,
              }}
            >
              <img
                src={category.image}
                alt=""
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </Box>
          )}
          <Box>
            <Typography
              sx={{ fontSize: 11, color: '#64748B', fontFamily: '"Manrope", Arial, sans-serif' }}
            >
              Currently editing
            </Typography>
            <Typography
              sx={{
                fontSize: 13,
                fontWeight: 700,
                color: '#0F172A',
                fontFamily: '"Manrope", Arial, sans-serif',
              }}
            >
              {category.categoryId}
            </Typography>
          </Box>
        </Box>
      )}

      {/* Image URL */}
      <TextField
        fullWidth
        id="image"
        name="image"
        label="Image URL"
        placeholder="https://example.com/image.jpg"
        value={formik.values.image}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.image && Boolean(formik.errors.image)}
        helperText={formik.touched.image && formik.errors.image}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <ImageIcon sx={{ fontSize: 16, color: '#64748B' }} />
            </InputAdornment>
          ),
        }}
        sx={modernTextField}
      />

      {/* Level 1 */}
      <FormControl
        fullWidth
        error={formik.touched.category && Boolean(formik.errors.category)}
        sx={modernSelect}
      >
        <InputLabel id="cat1-label">Main Category</InputLabel>
        <Select
          labelId="cat1-label"
          id="category"
          name="category"
          value={formik.values.category}
          onChange={(e) => {
            formik.setFieldValue('category', e.target.value)
            formik.setFieldValue('category2', '')
            formik.setFieldValue('category3', '')
          }}
          label="Main Category"
          startAdornment={
            <InputAdornment position="start">
              <CategoryIcon sx={{ fontSize: 16, color: '#64748B' }} />
            </InputAdornment>
          }
        >
          {mainCategory.map((item) => (
            <MenuItem
              key={item.categoryId}
              value={item.categoryId}
              sx={{ fontSize: 13, fontFamily: '"Manrope", Arial, sans-serif' }}
            >
              {item.name}
            </MenuItem>
          ))}
        </Select>
        {formik.touched.category && formik.errors.category && (
          <FormHelperText>{formik.errors.category}</FormHelperText>
        )}
      </FormControl>

      {/* Level 2 */}
      <FormControl fullWidth disabled={!formik.values.category} sx={modernSelect}>
        <InputLabel id="cat2-label">Second Category</InputLabel>
        <Select
          labelId="cat2-label"
          id="category2"
          name="category2"
          value={formik.values.category2}
          onChange={(e) => {
            formik.setFieldValue('category2', e.target.value)
            formik.setFieldValue('category3', '')
          }}
          label="Second Category"
        >
          <MenuItem value="" sx={{ fontSize: 13, fontFamily: '"Manrope", Arial, sans-serif' }}>
            <em>None</em>
          </MenuItem>
          {formik.values.category &&
            categoryTwo[formik.values.category]?.map((item) => (
              <MenuItem
                key={item.categoryId}
                value={item.categoryId}
                sx={{ fontSize: 13, fontFamily: '"Manrope", Arial, sans-serif' }}
              >
                {item.name}
              </MenuItem>
            ))}
        </Select>
      </FormControl>

      {/* Level 3 */}
      <FormControl fullWidth disabled={!formik.values.category2} sx={modernSelect}>
        <InputLabel id="cat3-label">Third Category</InputLabel>
        <Select
          labelId="cat3-label"
          id="category3"
          name="category3"
          value={formik.values.category3}
          onChange={formik.handleChange}
          label="Third Category"
        >
          <MenuItem value="" sx={{ fontSize: 13, fontFamily: '"Manrope", Arial, sans-serif' }}>
            <em>None</em>
          </MenuItem>
          {formik.values.category2 &&
            childCategory(categoryThree[formik.values.category] ?? [], formik.values.category2).map(
              (item) => (
                <MenuItem
                  key={item.categoryId}
                  value={item.categoryId}
                  sx={{ fontSize: 13, fontFamily: '"Manrope", Arial, sans-serif' }}
                >
                  {item.name}
                </MenuItem>
              ),
            )}
        </Select>
      </FormControl>

      {/* Note */}
      <Box
        sx={{
          backgroundColor: '#FFF3CD',
          border: '1px solid #FFEAA7',
          borderRadius: '3px',
          px: 2,
          py: 1,
        }}
      >
        <Typography
          sx={{ fontSize: 12, color: '#856404', fontFamily: '"Manrope", Arial, sans-serif' }}
        >
          <strong>Note:</strong> If no second or third category is selected, the main category will
          be used. Changes will reflect on the homepage immediately.
        </Typography>
      </Box>

      {/* Actions */}
      <Box sx={{ display: 'flex', gap: 1.5 }}>
        <Button
          onClick={handleClose}
          fullWidth
          sx={{
            fontFamily: '"Manrope", Arial, sans-serif',
            fontSize: 13,
            textTransform: 'none',
            color: '#0F172A',
            border: '1px solid #ccc',
            borderRadius: '20px',
            py: 1,
            '&:hover': { backgroundColor: '#f5f5f5' },
          }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          type="submit"
          fullWidth
          sx={{
            backgroundColor: '#0F766E',
            color: '#0F172A',
            fontFamily: '"Manrope", Arial, sans-serif',
            fontWeight: 700,
            fontSize: 13,
            textTransform: 'none',
            borderRadius: '20px',
            py: 1,
            border: '1px solid #0b5f59',
            '&:hover': { backgroundColor: '#0b5f59' },
            '&:active': { backgroundColor: '#115e59' },
          }}
        >
          Save Changes
        </Button>
      </Box>
    </Box>
  )
}
export default UpdateHomeCategoryForm
