import React from 'react'
import HomeCategoryTable from './HomeCategoryTable'
import { useAppSelector } from '../../../context/AppContext'
const ShopByCategoryTable = () => {
  const { homePage } = useAppSelector((store) => store)
  return <HomeCategoryTable categories={homePage.homePageData?.shopByCategories} />
}
export default ShopByCategoryTable
