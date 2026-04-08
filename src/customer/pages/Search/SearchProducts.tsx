import { useEffect } from "react";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import { useSearchParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../Redux Toolkit/Store";
import { searchProduct } from "../../../Redux Toolkit/Customer/ProductSlice";
import ProductCard from "../Products/ProductCard/ProductCard";

const SearchProducts = () => {
  const dispatch = useAppDispatch();
  const { products } = useAppSelector((store) => store);
  const [searchParams] = useSearchParams();

  const query = searchParams.get("query") || "";

  useEffect(() => {
    if (query.trim()) {
      dispatch(searchProduct(query));
    }
  }, [query, dispatch]);

  const results = products.searchProduct || [];

  return (
    <div className="app-container py-7">
      <div className="mb-5">
        <p className="section-kicker mb-2">Search</p>
        <h1 style={{ fontSize: "clamp(1.6rem, 3vw, 2.2rem)" }}>Results for "{query || "..."}"</h1>
      </div>

      {products.loading ? (
        <div className="surface p-8" style={{ borderRadius: 18 }}>
          <p className="text-sm text-slate-500">Searching products...</p>
        </div>
      ) : !query.trim() ? (
        <div className="empty-state">
          <SearchRoundedIcon sx={{ fontSize: 48, color: "#9AB0BF" }} />
          <h3 style={{ fontSize: "1.2rem" }}>Start searching</h3>
          <p style={{ color: "#64748B", fontSize: "0.9rem" }}>
            Use the top search bar to find products by brand, category, or keyword.
          </p>
        </div>
      ) : results.length ? (
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
          {results.map((item: any) => (
            <ProductCard key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <h3 style={{ fontSize: "1.2rem" }}>No matches found</h3>
          <p style={{ color: "#64748B", fontSize: "0.9rem" }}>
            Try different keywords or browse categories from the homepage.
          </p>
        </div>
      )}
    </div>
  );
};

export default SearchProducts;
