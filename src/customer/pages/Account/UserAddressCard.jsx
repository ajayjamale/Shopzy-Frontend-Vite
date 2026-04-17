import React from 'react'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import './Profile.css'
const UserAddressCard = ({ item }) => {
  return (
    <div className="amz-address-card">
      {/* Name & actions row */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: 12,
        }}
      >
        <div className="amz-address-card-name">{item.name}</div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            className="amz-btn-secondary"
            style={{
              fontSize: '0.75rem',
              padding: '4px 10px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
            }}
          >
            <EditIcon style={{ fontSize: '0.875rem' }} />
            Edit
          </button>
          <button
            className="amz-btn-danger"
            style={{
              fontSize: '0.75rem',
              padding: '4px 10px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
            }}
          >
            <DeleteIcon style={{ fontSize: '0.875rem' }} />
            Delete
          </button>
        </div>
      </div>

      {/* Address */}
      <div className="amz-address-card-text">
        {item.address}, {item.locality}
      </div>
      <div className="amz-address-card-text">
        {item.city}, {item.state} — {item.pinCode}
      </div>

      {/* Mobile */}
      <div className="amz-address-card-mobile" style={{ marginTop: 8 }}>
        <strong>Mobile:</strong> {item.mobile}
      </div>
    </div>
  )
}
export default UserAddressCard
