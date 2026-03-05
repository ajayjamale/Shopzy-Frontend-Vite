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
    <div className="mt-10">

      {/* Category heading */}
      <div className="px-9 pb-4">
        <h1 className="text-2xl font-bold text-gray-900 uppercase tracking-wide">
          {categoryLabel}
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          {products.products?.length > 0
            ? `Showing ${products.products.length} results`
            : "No results"}
        </p>
      </div>

      <div className="lg:flex">

        {/* Sidebar filter — desktop */}
        <section className="hidden lg:block w-[22%] sticky top-0 self-start">
          <FilterSection />
        </section>

        {/* Main content */}
        <div className="w-full lg:w-[78%] space-y-4">

          {/* Toolbar */}
          <div className="flex justify-between items-center px-5 h-[48px] border-b border-gray-200 bg-white">

            {/* Mobile filter toggle */}
            <div className="relative">
              {!isLarge && (
                <button
                  onClick={handleShowFilter}
                  className="flex items-center gap-1.5 text-sm font-semibold text-[#007185] border border-[#007185] rounded px-3 py-1 hover:bg-teal-50 transition"
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
                  className="absolute top-[44px] left-0 w-[280px] shadow-xl border border-gray-200 rounded-md overflow-hidden"
                >
                  <FilterSection />
                </Box>
              )}
            </div>

            {/* Sort dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 hidden sm:inline">Sort by:</span>
              <FormControl size="small" sx={{ width: "180px" }}>
                <Select
                  value={sort}
                  onChange={handleSortProduct}
                  displayEmpty
                  sx={{
                    fontSize: 13,
                    borderRadius: 1,
                    "& .MuiOutlinedInput-notchedOutline": { borderColor: "#ddd" },
                    "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#F6A429" },
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
            <section className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-y-6 gap-x-2 px-5">
              {products.products.map((item: any, index: number) => (
                <div key={index * 9}>
                  <ProductCard item={item} />
                </div>
              ))}
            </section>
          ) : (
            <section className="flex flex-col items-center justify-center gap-5 h-[65vh]">
              <img
                className="w-64 opacity-80"
                src="https://cdn.pixabay.com/photo/2022/05/28/10/45/oops-7227010_960_720.png"
                alt="No products found"
              />
              <div className="text-center">
                <h2 className="text-xl font-bold text-gray-700">No results for "{categoryLabel}"</h2>
                <p className="text-sm text-gray-500 mt-1">Try adjusting your filters or search for something else.</p>
              </div>
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
                  background: "#FFD814 !important",
                  borderColor: "#C7980A !important",
                  color: "#111",
                  fontWeight: 700,
                },
              }}
            />
          </div>

        </div>
      </div>
    </div>
  );
};

export default Products;