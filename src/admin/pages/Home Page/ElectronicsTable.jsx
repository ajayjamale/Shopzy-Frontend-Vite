import { useAppSelector } from '../../../store'
import HomeCategoryTable from './HomeCategoryTable'
function ElectronicsTable() {
  const { homePage } = useAppSelector((store) => store)
  return (
    <>
      <HomeCategoryTable categories={homePage.homePageData?.electronics} />
    </>
  )
}
export default ElectronicsTable
