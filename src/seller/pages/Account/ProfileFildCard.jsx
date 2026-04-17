import { Box, Typography } from '@mui/material'
const ProfileFieldCard = ({ keys, value }) => (
  <Box
    sx={{
      display: 'grid',
      gridTemplateColumns: { xs: '1fr', sm: '180px 1fr' },
      alignItems: 'center',
      gap: 1.5,
      py: 1.4,
      borderBottom: '1px solid #E8EFF2',
    }}
  >
    <Typography sx={{ fontSize: '.84rem', color: '#64748B', fontWeight: 700 }}>{keys}</Typography>
    <Typography sx={{ fontSize: '.95rem', color: '#0F172A', fontWeight: 700 }}>
      {value || <span style={{ color: '#94A3B8', fontStyle: 'italic' }}>Not provided</span>}
    </Typography>
  </Box>
)
export default ProfileFieldCard
