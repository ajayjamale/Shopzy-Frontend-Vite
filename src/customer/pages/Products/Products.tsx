import React, { useEffect, useState } from "react";
import ProductCard from "./ProductCard/ProductCard";
import FilterSection from "./FilterSection";
import {
  Box,
  Divider,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Pagination,
  Select,
  useMediaQuery,
  useTheme,
  type SelectChangeEvent,
} from "@mui/material";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import FilterAltOffIcon from "@mui/icons-material/FilterAltOff";
import { useParams, useSearchParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../Redux Toolkit/Store";
import { getAllProducts } from "../../../Redux Toolkit/Customer/ProductSlice";

const Products = () => {
  const [sort, setSort] = React.useState("");
  const theme = useTheme();
  const isLarge = useMediaQuery(theme.breakpoints.up("lg"));
  const [showFilter, setShowFilter] = useState(false);
  const { categoryId } = useParams();
  const dispatch = useAppDispatch();
  const { products } = useAppSelector((store) => store);
  const [searchParams] = useSearchParams();
  const [page, setPage] = useState(1);

  const handleSortProduct = (event: SelectChangeEvent) => {
    setSort(event.target.value as string);
  };

  const handleShowFilter = () => {
    setShowFilter((prev) => !prev);
  };

  const handlePageChange = (_e: any, value: any) => {
    setPage(value);
  };

  useEffect(() => {
    const [minPrice, maxPrice] = searchParams.get("price")?.split("-") || [];
    const newFilters = {
      brand: searchParams.get("brand") || "",
      color: searchParams.get("color") || "",
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
      pageNumber: page - 1,
      minDiscount: searchParams.get("discount")
        ? Number(searchParams.get("discount"))
        : undefined,
    };
    dispatch(getAllProducts({ category: categoryId, sort, ...newFilters }));
  }, [searchParams, categoryId, sort, page]);

  const categoryLabel = categoryId?.split("_").join(" ") || "";

  return (
    <div className="bg-[#f5f6f8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-12">

      {/* Category heading */}
      <div className="pb-4">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 uppercase tracking-wide">
          {categoryLabel}
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              {products.products?.length > 0
                ? `Showing ${products.products.length} results`
                : "No results"}
            </p>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-xs text-gray-500">
            <span className="px-2 py-1 rounded-full bg-white border border-gray-200">
              Curated picks
            </span>
            <span className="px-2 py-1 rounded-full bg-white border border-gray-200">
              Free delivery
            </span>
          </div>
        </div>
      </div>

      <div className="lg:flex gap-6">

        {/* Sidebar filter — desktop */}
        <section className="hidden lg:block w-[260px] sticky top-24 self-start">
          <FilterSection />
        </section>

        {/* Main content */}
        <div className="w-full flex-1 space-y-4">

          {/* Toolbar */}
          <div className="flex justify-between items-center px-4 sm:px-5 py-3 border border-gray-200 bg-white rounded-xl shadow-sm">

            {/* Mobile filter toggle */}
            <div className="relative">
              {!isLarge && (
                <button
                  onClick={handleShowFilter}
                  className="flex items-center gap-1.5 text-sm font-semibold text-[#0b7285] border border-[#0b7285] rounded-full px-3 py-1 hover:bg-teal-50 transition"
                >
                  {showFilter ? (
                    <FilterAltOffIcon sx={{ fontSize: 16 }} />
                  ) : (
                    <FilterAltIcon sx={{ fontSize: 16 }} />
                  )}
                  {showFilter ? "Hide Filters" : "Filters"}
                </button>
              )}
              {showFilter && !isLarge && (
                <Box
                  sx={{ zIndex: 100 }}
                  className="absolute top-[44px] left-0 w-[290px] shadow-xl border border-gray-200 rounded-xl overflow-hidden"
                >
                  <FilterSection />
                </Box>
              )}
            </div>

            {/* Sort dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 hidden sm:inline">Sort by:</span>
              <FormControl size="small" sx={{ width: "190px" }}>
                <Select
                  value={sort}
                  onChange={handleSortProduct}
                  displayEmpty
                  sx={{
                    fontSize: 13,
                    borderRadius: 2,
                    "& .MuiOutlinedInput-notchedOutline": { borderColor: "#ddd" },
                    "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#f4c24d" },
                  }}
                  renderValue={(val) =>
                    val === "" ? <span className="text-gray-400">Featured</span>
                    : val === "price_low" ? "Price: Low to High"
                    : "Price: High to Low"
                  }
                >
                  <MenuItem value="price_low" sx={{ fontSize: 13 }}>Price: Low to High</MenuItem>
                  <MenuItem value="price_high" sx={{ fontSize: 13 }}>Price: High to Low</MenuItem>
                </Select>
              </FormControl>
            </div>
          </div>

          {/* Product grid */}
          {products.products?.length > 0 ? (
            <section className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 lg:gap-5 px-2 sm:px-4">
              {products.products.map((item: any, index: number) => (
                <div key={index * 9}>
                  <ProductCard item={item} />
                </div>
              ))}
            </section>
          ) : (
            <section className="flex flex-col items-center justify-center gap-5 py-16 text-center px-4">
              <style>{`
                .amazon-empty-icon {
                  width: 140px;
                  height: 140px;
                }
                .amazon-empty-title {
                  font-size: 20px;
                  font-weight: 700;
                  color: #0F1111;
                  margin: 0 0 8px;
                }
                .amazon-empty-desc {
                  font-size: 14px;
                  color: #565959;
                  margin: 0 0 16px;
                  line-height: 1.5;
                }
                .amazon-empty-search {
                  display: flex;
                  width: 100%;
                  max-width: 400px;
                  border: 1px solid #888;
                  border-radius: 4px;
                  overflow: hidden;
                  margin-bottom: 20px;
                  box-shadow: 0 1px 3px rgba(0,0,0,0.08);
                }
                .amazon-empty-search input {
                  flex: 1;
                  padding: 8px 12px;
                  border: none;
                  outline: none;
                  font-size: 14px;
                }
                .amazon-empty-search-btn {
                  padding: 0 14px;
                  background: linear-gradient(to bottom, #f4c24d, #e9b12f);
                  border: none;
                  border-left: 1px solid #e1a836;
                  cursor: pointer;
                }
                .amazon-empty-search-btn:hover {
                  background: linear-gradient(to bottom, #f7ca00, #e5a800);
                }
                .amazon-empty-suggestions {
                  text-align: left;
                  margin-top: 8px;
                }
                .amazon-empty-suggestions li {
                  font-size: 13px;
                  color: #565959;
                  margin-bottom: 6px;
                  margin-left: 20px;
                }
                .amazon-empty-suggestions li::marker {
                  color: #949494;
                }
                .amazon-empty-link {
                  color: #0b7285;
                  text-decoration: none;
                  font-size: 13px;
                  cursor: pointer;
                }
                .amazon-empty-link:hover {
                  text-decoration: underline;
                  color: #b45309;
                }
              `}</style>

              {/* Icon */}
              <svg className="amazon-empty-icon" viewBox="0 0 200 180" fill="none">
                {/* Box/Package icon representing no products */}
                <rect x="40" y="60" width="120" height="90" rx="4" fill="#DDD" />
                <rect x="40" y="60" width="120" height="20" rx="4" fill="#CCC" />
                <rect x="90" y="80" width="20" height="70" fill="#BBB" />
                <rect x="60" y="100" width="20" height="50" fill="#BBB" />
                <rect x="120" y="100" width="20" height="50" fill="#BBB" />
                {/* Sad face on box */}
                <circle cx="85" cy="100" r="4" fill="#888" />
                <circle cx="115" cy="100" r="4" fill="#888" />
                <path d="M80 115 Q100 125 120 115" stroke="#888" strokeWidth="3" fill="none" strokeLinecap="round" />
              </svg>

              {/* Title */}
              <h2 className="amazon-empty-title">
                No products found for "{categoryLabel}"
              </h2>

              {/* Description */}
              <p className="amazon-empty-desc">
                We couldn't find any products matching your selection.
                <br />
                Try different keywords or remove filters to see more results.
              </p>

              {/* Search */}
              <div className="amazon-empty-search">
                <input
                  type="text"
                  placeholder="Search for products..."
                />
                <button className="amazon-empty-search-btn">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2.5">
                    <circle cx="11" cy="11" r="8" />
                    <path d="M21 21l-4.35-4.35" strokeLinecap="round" />
                  </svg>
                </button>
              </div>

              {/* Suggestions */}
              <ul className="amazon-empty-suggestions">
                <li>Remove some filters</li>
                <li>Check spelling of keywords</li>
                <li>Browse other categories</li>
                <li>
                  <span className="amazon-empty-link">Browse all products</span>
                </li>
              </ul>
            </section>
          )}

          {/* Pagination */}
          <div className="flex justify-center py-10">
            <Pagination
              page={page}
              onChange={handlePageChange}
              count={products?.totalPages}
              shape="rounded"
              sx={{
                "& .MuiPaginationItem-root": { fontSize: 13 },
                "& .Mui-selected": {
                  background: "#f4c24d !important",
                  borderColor: "#e1a836 !important",
                  color: "#0f172a",
                  fontWeight: 700,
                },
              }}
            />
          </div>

        </div>
      </div>
    </div>
    </div>
  );
};

export default Products;
