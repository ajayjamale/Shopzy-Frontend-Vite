import { useEffect, useMemo, useState } from 'react'
import { Box, Button, Drawer, Stack, Typography } from '@mui/material'
import EditRoundedIcon from '@mui/icons-material/EditRounded'
import PersonRoundedIcon from '@mui/icons-material/PersonRounded'
import BusinessRoundedIcon from '@mui/icons-material/BusinessRounded'
import WarehouseRoundedIcon from '@mui/icons-material/WarehouseRounded'
import AccountBalanceRoundedIcon from '@mui/icons-material/AccountBalanceRounded'
import { useAppSelector } from '../../../context/AppContext'
import ProfileFieldCard from './ProfileFieldCard'
import PersonalDetailsForm from './PersonalDetailsForm'
import BusinessDetailsForm from './BusinessDetailsForm'
import PickupAddressForm from './PickupAddressForm'
import BankDetailsForm from './BankDetailsForm'
import FormFeedbackToast from '../../../components/forms/FormFeedbackToast'
import {
  SellerMetricCard,
  SellerPageIntro,
  SellerSection,
  SellerStatusChip,
  humanizeSellerValue,
  sellerPrimaryButtonSx,
  sellerSecondaryButtonSx,
} from '../../theme/sellerUi'
const tabs = [
  {
    id: 'personal',
    label: 'Personal',
    icon: (
      <PersonRoundedIcon
        sx={{
          fontSize: 18,
        }}
      />
    ),
  },
  {
    id: 'business',
    label: 'Business',
    icon: (
      <BusinessRoundedIcon
        sx={{
          fontSize: 18,
        }}
      />
    ),
  },
  {
    id: 'address',
    label: 'Pickup',
    icon: (
      <WarehouseRoundedIcon
        sx={{
          fontSize: 18,
        }}
      />
    ),
  },
  {
    id: 'bank',
    label: 'Bank',
    icon: (
      <AccountBalanceRoundedIcon
        sx={{
          fontSize: 18,
        }}
      />
    ),
  },
]
const Profile = () => {
  const { sellers } = useAppSelector((state) => state)
  const [activeTab, setActiveTab] = useState('personal')
  const [drawerOpen, setDrawerOpen] = useState(null)
  const [toastOpen, setToastOpen] = useState(false)
  useEffect(() => {
    if (sellers.profileUpdated || sellers.error) {
      setToastOpen(true)
    }
  }, [sellers.error, sellers.profileUpdated])
  const cards = useMemo(
    () => [
      {
        label: 'Account status',
        value: humanizeSellerValue(sellers.profile?.accountStatus),
        helper: sellers.profile?.email || 'Email not available',
        tone: sellers.profile?.accountStatus === 'ACTIVE' ? 'success' : 'warning',
        icon: <PersonRoundedIcon />,
      },
      {
        label: 'Business',
        value: sellers.profile?.businessDetails?.businessName || 'Not provided',
        helper: sellers.profile?.gstin || 'GSTIN not added',
        tone: 'accent',
        icon: <BusinessRoundedIcon />,
      },
      {
        label: 'Pickup city',
        value: sellers.profile?.pickupAddress?.city || 'Not provided',
        helper: sellers.profile?.pickupAddress?.state || 'State not added',
        tone: 'info',
        icon: <WarehouseRoundedIcon />,
      },
      {
        label: 'Bank account',
        value: sellers.profile?.bankDetails?.accountHolderName || 'Not provided',
        helper: sellers.profile?.bankDetails?.ifscCode || 'IFSC not added',
        tone: 'default',
        icon: <AccountBalanceRoundedIcon />,
      },
    ],
    [sellers.profile],
  )
  const currentSection = getTabSection(activeTab, sellers.profile)
  return (
    <Box>
      <SellerPageIntro
        eyebrow="Account"
        title={sellers.profile?.sellerName || 'Seller account'}
        description="Keep profile, business, pickup, and banking details tidy from a single account workspace."
        actions={
          <SellerStatusChip
            label={humanizeSellerValue(sellers.profile?.accountStatus)}
            tone={sellers.profile?.accountStatus === 'ACTIVE' ? 'success' : 'warning'}
          />
        }
      />

      <Box
        sx={{
          display: 'grid',
          gap: 2,
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, minmax(0, 1fr))',
            xl: 'repeat(4, minmax(0, 1fr))',
          },
        }}
      >
        {cards.map((card) => (
          <SellerMetricCard key={card.label} {...card} />
        ))}
      </Box>

      <Box
        sx={{
          mt: 2,
        }}
      >
        <SellerSection
          title={currentSection.label}
          description="Use the tabs to switch sections and edit only the fields relevant to that area."
          action={
            <Button
              variant="contained"
              startIcon={<EditRoundedIcon />}
              onClick={() => setDrawerOpen(activeTab)}
              sx={sellerPrimaryButtonSx}
            >
              Edit {currentSection.shortLabel}
            </Button>
          }
        >
          <Stack
            direction="row"
            spacing={1}
            useFlexGap
            flexWrap="wrap"
            sx={{
              mb: 2,
            }}
          >
            {tabs.map((tab) => (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? 'contained' : 'outlined'}
                startIcon={tab.icon}
                onClick={() => setActiveTab(tab.id)}
                sx={activeTab === tab.id ? sellerPrimaryButtonSx : sellerSecondaryButtonSx}
              >
                {tab.label}
              </Button>
            ))}
          </Stack>

          <Box
            sx={{
              borderTop: '1px solid #E8EFF2',
              pt: 0.8,
            }}
          >
            {currentSection.rows.map((row) => (
              <ProfileFieldCard key={row.key} keys={row.key} value={row.val} />
            ))}
          </Box>
        </SellerSection>
      </Box>

      <Drawer
        anchor="right"
        open={drawerOpen !== null}
        onClose={() => setDrawerOpen(null)}
        PaperProps={{
          sx: {
            width: {
              xs: '100%',
              sm: 440,
            },
            p: 0,
            borderLeft: '1px solid #DCE8EC',
            boxShadow: '-24px 0 44px rgba(15, 23, 42, 0.16)',
          },
        }}
      >
        <Box
          sx={{
            p: 2.4,
            borderBottom: '1px solid #DCE8EC',
            bgcolor: '#F8FBFC',
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontSize: '1.1rem',
            }}
          >
            {drawerOpen ? drawerTitles[drawerOpen] : 'Edit details'}
          </Typography>
          <Typography
            sx={{
              color: '#64748B',
              mt: 0.6,
            }}
          >
            Save the updates below to keep your seller profile current.
          </Typography>
        </Box>
        <Box
          sx={{
            p: 2.4,
          }}
        >
          {renderDrawerForm(drawerOpen, () => setDrawerOpen(null))}
        </Box>
      </Drawer>

      <FormFeedbackToast
        feedback={{
          open: toastOpen,
          severity: sellers.error ? 'error' : 'success',
          message: sellers.error || 'Profile updated successfully',
          autoHideDuration: 5000,
        }}
        onClose={() => setToastOpen(false)}
      />
    </Box>
  )
}
const drawerTitles = {
  personal: 'Edit personal details',
  business: 'Edit business details',
  address: 'Edit pickup address',
  bank: 'Edit bank details',
}
const renderDrawerForm = (drawerOpen, onClose) => {
  switch (drawerOpen) {
    case 'personal':
      return <PersonalDetailsForm onClose={onClose} />
    case 'business':
      return <BusinessDetailsForm onClose={onClose} />
    case 'address':
      return <PickupAddressForm onClose={onClose} />
    case 'bank':
      return <BankDetailsForm onClose={onClose} />
    default:
      return null
  }
}
const getTabSection = (tab, profile) => {
  const sections = {
    personal: {
      label: 'Personal details',
      shortLabel: 'personal',
      rows: [
        {
          key: 'Seller name',
          val: profile?.sellerName,
        },
        {
          key: 'Email',
          val: profile?.email,
        },
        {
          key: 'Mobile',
          val: profile?.mobile,
        },
      ],
    },
    business: {
      label: 'Business details',
      shortLabel: 'business',
      rows: [
        {
          key: 'Business name',
          val: profile?.businessDetails?.businessName,
        },
        {
          key: 'GSTIN',
          val: profile?.gstin,
        },
        {
          key: 'Account status',
          val: humanizeSellerValue(profile?.accountStatus),
        },
      ],
    },
    address: {
      label: 'Pickup address',
      shortLabel: 'pickup',
      rows: [
        {
          key: 'Address',
          val: profile?.pickupAddress?.address,
        },
        {
          key: 'City',
          val: profile?.pickupAddress?.city,
        },
        {
          key: 'State',
          val: profile?.pickupAddress?.state,
        },
        {
          key: 'Mobile',
          val: profile?.pickupAddress?.mobile,
        },
      ],
    },
    bank: {
      label: 'Bank details',
      shortLabel: 'bank',
      rows: [
        {
          key: 'Account holder',
          val: profile?.bankDetails?.accountHolderName,
        },
        {
          key: 'Account number',
          val: profile?.bankDetails?.accountNumber,
        },
        {
          key: 'IFSC code',
          val: profile?.bankDetails?.ifscCode,
        },
      ],
    },
  }
  return sections[tab]
}
export default Profile
