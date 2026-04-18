import { useEffect, useMemo, useState } from 'react'
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  InputBase,
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import { adminApiPath, api } from '../../../config/Api'
import { getAdminToken } from '../../../utils/authToken'
import { useSearchParams } from 'react-router-dom'
import SellersTable from '../sellers/SellersTable'
const UserManagement = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const tab = searchParams.get('tab') === 'sellers' ? 'sellers' : 'customers'
  const [customers, setCustomers] = useState([])
  const [query, setQuery] = useState('')
  const fetchCustomers = async () => {
    try {
      const res = await api.get(adminApiPath('/users'), {
        headers: {
          Authorization: `Bearer ${getAdminToken()}`,
        },
      })
      setCustomers(Array.isArray(res.data) ? res.data : [])
    } catch (error) {
      console.error('Failed to fetch customers', error)
      setCustomers([])
    }
  }
  useEffect(() => {
    void fetchCustomers()
  }, [])
  useEffect(() => {
    const incoming = searchParams.get('tab')
    if (incoming === 'customers' || incoming === 'sellers') {
      return
    }
    const nextParams = new URLSearchParams(searchParams)
    nextParams.set('tab', 'customers')
    nextParams.delete('status')
    setSearchParams(nextParams, {
      replace: true,
    })
  }, [searchParams, setSearchParams])
  const filteredCustomers = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()
    if (!normalizedQuery) {
      return customers
    }
    return customers.filter((u) =>
      [u.fullName, u.email, u.mobile]
        .filter((field) => Boolean(field))
        .some((field) => field.toLowerCase().includes(normalizedQuery)),
    )
  }, [customers, query])
  return (
    <Box
      sx={{
        p: 2,
        display: 'grid',
        gap: 2,
      }}
    >
      {tab === 'customers' && (
        <Paper
          sx={{
            p: 1.5,
            display: 'flex',
            alignItems: 'center',
            gap: 1,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              border: '1px solid #e0e0e0',
              borderRadius: 1,
              px: 1,
            }}
          >
            <SearchIcon fontSize="small" />
            <InputBase
              placeholder="Search customers"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </Box>
        </Paper>
      )}

      {tab === 'customers' ? (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Mobile</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredCustomers.map((item) => (
                <TableRow key={item.id ?? item.email}>
                  <TableCell>{item.fullName}</TableCell>
                  <TableCell>{item.email}</TableCell>
                  <TableCell>{item.mobile}</TableCell>
                </TableRow>
              ))}
              {filteredCustomers.length === 0 && (
                <TableRow>
                  <TableCell colSpan={3}>
                    <Typography align="center" py={2}>
                      No users found.
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <SellersTable />
      )}
    </Box>
  )
}
export default UserManagement
