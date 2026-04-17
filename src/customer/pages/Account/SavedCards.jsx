import AddCardRoundedIcon from '@mui/icons-material/AddCardRounded'
import SecurityRoundedIcon from '@mui/icons-material/SecurityRounded'
import './Profile.css'
const SavedCards = () => {
  return (
    <div className="amz-card">
      <div className="amz-card-header">Saved payment methods</div>
      <div className="amz-empty-state">
        <AddCardRoundedIcon sx={{ fontSize: 56, color: '#9CB2C2' }} />
        <p className="amz-empty-title">No saved cards yet</p>
        <p className="amz-empty-desc">Save a debit or credit card for faster and safer checkout.</p>
        <p className="text-xs text-slate-500 flex items-center gap-1">
          <SecurityRoundedIcon sx={{ fontSize: 13 }} />
          Encrypted and securely stored
        </p>
        <button className="amz-btn-primary">Add payment method</button>
      </div>
    </div>
  )
}
export default SavedCards
