import React from 'react'
import { useNavigate } from 'react-router-dom'
import './HomeCategoryCard.css' // import the CSS file
import { toCatalogPath } from '../../../../utils/catalogRoute'
const HomeCategoryCard = ({ item }) => {
  const navigate = useNavigate()
  return (
    <div className="hcc-card" onClick={() => navigate(toCatalogPath(item.categoryId))}>
      <div className="hcc-img-wrap">
        <img src={item.image || item.imageUrl} alt={item.name} loading="lazy" />
      </div>
      <span className="hcc-name">{item.name}</span>
    </div>
  )
}
export default HomeCategoryCard
