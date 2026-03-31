import React, { useEffect } from "react";
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

  const results = products.searchProduct ?? [];
  const count   = results.length;

  return (
    <>
      <style>{`
        .sp-page {
          min-height: 100vh;
          background: #EAEDED;
          font-family: Arial, sans-serif;
        }

        /* ── Results bar ── */
        .sp-bar {
          background: #fff;
          border-bottom: 1px solid #e0e0e0;
          padding: 10px 24px;
        }
        .sp-bar-inner {
          max-width: 1400px;
          margin: 0 auto;
          display: flex;
          align-items: baseline;
          gap: 6px;
          flex-wrap: wrap;
        }
        .sp-result-count {
          font-size: 13px;
          color: #555;
        }
        .sp-result-count strong { color: #C45500; }
        .sp-query-highlight {
          font-size: 13px;
          color: #C45500;
          font-style: italic;
        }

        /* ── Main layout ── */
        .sp-main {
          max-width: 1400px;
          margin: 0 auto;
          padding: 16px 20px 40px;
        }

        /* ── Section heading ── */
        .sp-heading {
          font-size: 20px;
          font-weight: 400;
          color: #0F1111;
          margin: 0 0 12px;
          padding-bottom: 8px;
          border-bottom: 1px solid #e0e0e0;
        }
        .sp-heading span {
          font-weight: 700;
          color: #C45500;
        }

        /* ── Grid ── */
        .sp-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 6px;
        }

        /* ── Product card wrapper ── */
        .sp-card-wrap {
          background: #fff;
          border: 1px solid #ddd;
          border-radius: 4px;
          overflow: hidden;
          transition: box-shadow 0.15s, border-color 0.15s;
        }
        .sp-card-wrap:hover {
          box-shadow: 0 4px 16px rgba(0,0,0,0.1);
          border-color: #c9c9c9;
        }

        /* ── Loading skeleton ── */
        .sp-skeleton-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 6px;
        }
        .sp-skeleton-card {
          background: #fff;
          border: 1px solid #ddd;
          border-radius: 4px;
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .sp-skel {
          background: linear-gradient(90deg, #f0f0f0 25%, #e8e8e8 50%, #f0f0f0 75%);
          background-size: 200% 100%;
          animation: sp-shimmer 1.4s infinite;
          border-radius: 4px;
        }
        @keyframes sp-shimmer {
          from { background-position: 200% 0; }
          to   { background-position: -200% 0; }
        }

        /* ── Empty / no query states ── */
        .sp-empty {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 55vh;
          text-align: center;
          gap: 12px;
        }
        .sp-empty-icon {
          font-size: 56px;
          line-height: 1;
          opacity: 0.25;
        }
        .sp-empty-title {
          font-size: 20px;
          font-weight: 700;
          color: #0F1111;
          margin: 0;
        }
        .sp-empty-sub {
          font-size: 14px;
          color: #666;
          max-width: 360px;
          line-height: 1.6;
          margin: 0;
        }

        /* ── Search tip card (no query) ── */
        .sp-tip-card {
          background: #fff;
          border: 1px solid #ddd;
          border-radius: 4px;
          padding: 24px 32px;
          max-width: 460px;
          text-align: left;
          margin-top: 8px;
        }
        .sp-tip-title {
          font-size: 14px;
          font-weight: 700;
          color: #0F1111;
          margin: 0 0 10px;
        }
        .sp-tip-list {
          list-style: disc;
          padding-left: 18px;
          font-size: 13px;
          color: #555;
          line-height: 2;
          margin: 0;
        }
      `}</style>

      <div className="sp-page">

        {/* ── Result count bar ── */}
        {query && !products.loading && (
          <div className="sp-bar">
            <div className="sp-bar-inner">
              {count > 0 ? (
                <span className="sp-result-count">
                  1–{count} of <strong>{count} results</strong> for{" "}
                  <span className="sp-query-highlight">"{query}"</span>
                </span>
              ) : (
                <span className="sp-result-count">
                  No results for <span className="sp-query-highlight">"{query}"</span>
                </span>
              )}
            </div>
          </div>
        )}

        <div className="sp-main">

          {/* ── Loading skeleton ── */}
          {products.loading && (
            <>
              <div className="sp-heading" style={{ background: '#e0e0e0', height: 28, width: 280, borderRadius: 4, marginBottom: 16 }} />
              <div className="sp-skeleton-grid">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="sp-skeleton-card">
                    <div className="sp-skel" style={{ height: 200 }} />
                    <div className="sp-skel" style={{ height: 14, width: '80%' }} />
                    <div className="sp-skel" style={{ height: 14, width: '55%' }} />
                    <div className="sp-skel" style={{ height: 18, width: '40%' }} />
                    <div className="sp-skel" style={{ height: 32 }} />
                  </div>
                ))}
              </div>
            </>
          )}

          {/* ── No query entered ── */}
          {!products.loading && !query.trim() && (
            <div className="sp-empty">
              <div className="sp-empty-icon">🔍</div>
              <h2 className="sp-empty-title">Search Shopzy</h2>
              <p className="sp-empty-sub">
                Use the search bar at the top to find products across all categories.
              </p>
              <div className="sp-tip-card">
                <p className="sp-tip-title">Search tips</p>
                <ul className="sp-tip-list">
                  <li>Check spelling or try alternate spellings</li>
                  <li>Use more general terms — "saree" instead of "silk saree"</li>
                  <li>Try searching by brand, colour, or category</li>
                </ul>
              </div>
            </div>
          )}

          {/* ── Results ── */}
          {!products.loading && query.trim() && count > 0 && (
            <>
              <h2 className="sp-heading">
                Results for <span>"{query}"</span>
              </h2>
              <div className="sp-grid">
                {results.map((item: any) => (
                  <div key={item.id} className="sp-card-wrap">
                    <ProductCard item={item} />
                  </div>
                ))}
              </div>
            </>
          )}

          {/* ── No results ── */}
          {!products.loading && query.trim() && count === 0 && (
            <div className="sp-empty">
              <div className="sp-empty-icon">📭</div>
              <h2 className="sp-empty-title">
                No results for "{query}"
              </h2>
              <p className="sp-empty-sub">
                We couldn't find any products matching your search. Try different keywords or check your spelling.
              </p>
              <div className="sp-tip-card">
                <p className="sp-tip-title">Suggestions</p>
                <ul className="sp-tip-list">
                  <li>Make sure all words are spelled correctly</li>
                  <li>Try more general keywords</li>
                  <li>Try different keywords</li>
                  <li>Browse categories from the homepage</li>
                </ul>
              </div>
            </div>
          )}

        </div>
      </div>
    </>
  );
};

export default SearchProducts;