import { Radio } from '@mui/material'
import LocationOnRoundedIcon from '@mui/icons-material/LocationOnRounded'
const AddressCard = ({ value, selectedValue, handleChange, item }) => {
  const active = selectedValue === value
  return (
    <button
      className="w-full text-left border-b border-[#E7EFF2] px-4 py-4"
      style={{ background: active ? '#EDF8F7' : '#fff' }}
      onClick={() => handleChange({ target: { value } })}
    >
      <div className="flex items-start gap-3">
        <Radio
          checked={active}
          onChange={handleChange}
          value={value}
          size="small"
          sx={{
            mt: -0.5,
            color: '#0F766E',
            '&.Mui-checked': { color: '#0F766E' },
          }}
        />
        <div>
          <p className="text-sm font-bold text-slate-900">{item.name}</p>
          <p className="text-sm text-slate-600 mt-1 leading-6">
            {item.address}, {item.locality}, {item.city}, {item.state} - {item.pinCode}
          </p>
          <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
            <LocationOnRoundedIcon sx={{ fontSize: 13 }} />
            {item.mobile}
          </p>
        </div>
      </div>
    </button>
  )
}
export default AddressCard
