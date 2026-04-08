import { useAppSelector } from "../../../store";
import HomeCategoryTable from "./HomeCategoryTable";

export default function GridTable() {
  const { homePage} = useAppSelector((store) => store);


  return (
    <>
      <HomeCategoryTable categories={homePage.homePageData?.topBrands as any}/>
    </>
  );
}
