import React from 'react'
import { useNavigate } from 'react-router-dom'
import { toCatalogPath } from '../../../../utils/catalogRoute'
const DealCard = ({ deal }) => {
  const navigate = useNavigate()
  const categoryId = deal.category?.categoryId || 'products'
  const categoryImage = deal.category?.image || ''
  return (
    <div onClick={() => navigate(toCatalogPath(categoryId))} className="w-full cursor-pointer">
      <img
        className="border-x-[7px] border-t-[7px] border-pink-600 w-full h-[12rem] object-cover object-top"
        src={categoryImage}
        alt=""
      />
      <div className="border-4 border-black bg-black text-white p-2 text-center">
        <p className="text-lg font-semibold">{categoryId.split('_').join(' ')}</p>
        <p className="text-2xl font-bold">{deal.discount ?? 0}% OFF</p>
        <p className="text-balance text-lg">shop now</p>
      </div>
    </div>
  )
}
export default DealCard
