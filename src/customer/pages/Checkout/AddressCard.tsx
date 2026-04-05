import React from 'react'
import { Radio } from '@mui/material'
import type { Address } from '../../../types/userTypes'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import PhoneIcon from '@mui/icons-material/Phone'

interface AddressCardProps {
    value: number;
    selectedValue: number;
    handleChange: (e: any) => void;
    item: Address;
}

const AddressCard: React.FC<AddressCardProps> = ({ value, selectedValue, handleChange, item }) => {
    const isSelected = value === selectedValue;

    return (
        <div
            className={`flex gap-3 px-5 py-4 cursor-pointer transition-colors ${
                isSelected ? 'bg-[#fffdf0]' : 'hover:bg-gray-50'
            }`}
            onClick={() => handleChange({ target: { value } })}
        >
            {/* Radio */}
            <div className='pt-0.5 flex-shrink-0'>
                <Radio
                    checked={isSelected}
                    onChange={handleChange}
                    value={value}
                    name="radio-buttons"
                    size='small'
                    sx={{
                        color: '#0b7285',
                        '&.Mui-checked': { color: '#0b7285' },
                        padding: '2px',
                    }}
                />
            </div>

            {/* Content */}
            <div className='space-y-1.5 flex-1'>
                <div className='flex items-center gap-2'>
                    <h1 className='font-bold text-sm text-gray-900'>{item.name}</h1>
                    {isSelected && (
                        <span className='text-[10px] font-semibold bg-[#0b7285] text-white px-2 py-0.5 rounded-full'>
                            Deliver here
                        </span>
                    )}
                </div>

                <div className='flex items-start gap-1.5 text-sm text-gray-600'>
                    <LocationOnIcon sx={{ fontSize: 14, color: '#888', mt: '2px', flexShrink: 0 }} />
                    <p className='leading-relaxed'>
                        {item.address}, {item.locality},<br />
                        {item.city}, {item.state} – {item.pinCode}
                    </p>
                </div>

                <div className='flex items-center gap-1.5 text-sm text-gray-600'>
                    <PhoneIcon sx={{ fontSize: 13, color: '#888' }} />
                    <span>{item.mobile}</span>
                </div>
            </div>
        </div>
    );
};

export default AddressCard;