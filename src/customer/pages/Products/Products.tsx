import { useEffect, useState } from "react";
import { FormControl, MenuItem, Pagination, Select, type SelectChangeEvent, useMediaQuery, useTheme } from "@mui/material";
import FilterAltRoundedIcon from "@mui/icons-material/FilterAltRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { useParams, useSearchParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../Redux Toolkit/Store";
import { getAllProducts } from "../../../Redux Toolkit/Customer/ProductSlice";
import ProductCard from "./ProductCard/ProductCard";
import FilterSection from "./FilterSection";

const Products = () => {
  const { categoryId } = useParams();
  const dispatch = useAppDispatch();
  const { products } = useAppSelector((store) => store);

  const [sort, setSort] = useState("");
  const [page, setPage] = useState(1);
  const [showMobileFilter, setShowMobileFilter] = useState(false);
  const [searchParams] = useSearchParams();

  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("lg"));

  useEffect(() => {
    const [minPrice, maxPrice] = searchParams.get("price")?.split("-") || [];

    dispatch(
      getAllProducts({
        category: categoryId,
        sort,
        brand: searchParams.get("brand") || "",
        colors: searchParams.get("color") || "",
        minPrice: minPrice ? Number(minPrice) : undefined,
        maxPrice: maxPrice ? Number(maxPrice) : undefined,
        minDiscount: searchParams.get("discount") ? Number(searchParams.get("discount")) : undefined,
        pageNumber: page - 1,
      })
    );
  }, [searchParams, categoryId, sort, page, dispatch]);

  const categoryLabel = (categoryId || "products").split("_").join(" ");

  const handleSort = (event: SelectChangeEvent) => {
    setSort(event.target.value);
  };

  return (
    <div className="app-container py-7">
      <div className="mb-5">
        <p className="section-kicker mb-2">Collection</p>
        <h1 style={{ fontSize: "clamp(1.7rem, 3vw, 2.4rem)", textTransform: "capitalize" }}>{categoryLabel}</h1>
        <p className="text-sm text-slate-500 mt-2">
          {products.products?.length || 0} results found
        </p>
      </div>

      <div className="grid lg:grid-cols-[280px_1fr] gap-5 items-start">
        {isDesktop ? (
          <div className="sticky top-28">
            <FilterSection />
          </div>
        ) : (
          <div className="relative">
            <button
              onClick={() => setShowMobileFilter((v) => !v)}
              className="btn-secondary"
            >
              {showMobileFilter ? <CloseRoundedIcon sx={{ fontSize: 18 }} /> : <FilterAltRoundedIcon sx={{ fontSize: 18 }} />}
              {showMobileFilter ? "Hide Filters" : "Show Filters"}
            </button>
            {showMobileFilter && (
              <div className="absolute left-0 right-0 mt-3 z-40">
                <FilterSection />
              </div>
            )}
          </div>
        )}

        <div>
          <div className="surface p-3 sm:p-4 mb-4 flex items-center justify-between gap-3" style={{ borderRadius: 16 }}>
            <p className="text-sm text-slate-600">Sorted by relevance</p>
            <FormControl size="small" sx={{ minWidth: 190 }}>
              <Select
                value={sort}
                onChange={handleSort}
                displayEmpty
                renderValue={(value) => {
                  if (!value) return "Featured";
                  return value === "price_low" ? "Price: Low to High" : "Price: High to Low";
                }}
              >
                <MenuItem value="">Featured</MenuItem>
                <MenuItem value="price_low">Price: Low to High</MenuItem>
                <MenuItem value="price_high">Price: High to Low</MenuItem>
              </Select>
            </FormControl>
          </div>

          {products.products?.length ? (
            <section className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
              {products.products.map((item: any) => (
                <ProductCard key={item.id} item={item} />
              ))}
            </section>
          ) : (
            <div className="empty-state">
              <h3 style={{ fontSize: "1.2rem", marginBottom: 8 }}>No products found</h3>
              <p style={{ color: "#64748B", fontSize: "0.92rem" }}>
                Try clearing filters or changing the search criteria.
              </p>
            </div>
          )}

          <div className="flex justify-center py-8">
            <Pagination
              page={page}
              onChange={(_, value) => setPage(value)}
              count={products.totalPages || 1}
              shape="rounded"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;
