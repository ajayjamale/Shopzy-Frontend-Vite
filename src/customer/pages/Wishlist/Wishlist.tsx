import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../Redux Toolkit/Store';
import { getWishlistByUserId } from '../../../Redux Toolkit/Customer/WishlistSlice';
import WishlistProductCard from './WishlistProductCard';

const Wishlist = () => {
    const dispatch  = useAppDispatch();
    const navigate  = useNavigate();
    const { wishlist, auth } = useAppSelector(store => store);

    useEffect(() => {
        dispatch(getWishlistByUserId() as any);
    }, [auth.jwt]);

    const products = wishlist.wishlist?.products ?? [];
    const count    = products.length;

    return (
        <>
            <style>{`
                .wl-page {
                    min-height: 100vh;
                    background: #EAEDED;
                    font-family: Arial, sans-serif;
                    padding: 20px 16px 48px;
                }
                .wl-inner { max-width: 1300px; margin: 0 auto; }

                /* ── Header card ── */
                .wl-header-card {
                    background: #fff;
                    border: 1px solid #ddd;
                    border-radius: 4px;
                    padding: 16px 20px;
                    margin-bottom: 16px;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    flex-wrap: wrap;
                    gap: 10px;
                }
                .wl-title {
                    font-size: 22px;
                    font-weight: 400;
                    color: #0F1111;
                    margin: 0;
                }
                .wl-count {
                    font-size: 14px;
                    color: #555;
                    margin: 2px 0 0;
                }
                .wl-sort {
                    font-size: 13px;
                    color: #007185;
                    cursor: pointer;
                    border: 1px solid #ddd;
                    border-radius: 4px;
                    padding: 5px 12px;
                    background: #fff;
                    transition: background 0.12s;
                }
                .wl-sort:hover { background: #f5f5f5; }

                /* ── Grid ── */
                .wl-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(185px, 1fr));
                    gap: 8px;
                }

                /* ── Loading skeleton ── */
                .wl-skel-card {
                    background: #fff;
                    border: 1px solid #ddd;
                    border-radius: 4px;
                    overflow: hidden;
                }
                .wl-skel {
                    background: linear-gradient(90deg, #f0f0f0 25%, #e8e8e8 50%, #f0f0f0 75%);
                    background-size: 200% 100%;
                    animation: wl-shimmer 1.4s infinite;
                }
                @keyframes wl-shimmer {
                    from { background-position: 200% 0; }
                    to   { background-position: -200% 0; }
                }

                /* ── Empty state ── */
                .wl-empty {
                    background: #fff;
                    border: 1px solid #ddd;
                    border-radius: 4px;
                    padding: 48px 32px;
                    text-align: center;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 12px;
                }
                .wl-empty-icon { font-size: 52px; opacity: 0.2; }
                .wl-empty-title { font-size: 20px; font-weight: 700; color: #0F1111; margin: 0; }
                .wl-empty-sub { font-size: 14px; color: #666; max-width: 380px; line-height: 1.6; margin: 0; }
                .wl-empty-btn {
                    padding: 9px 24px;
                    background: linear-gradient(to bottom, #FFD814, #F8B200);
                    border: 1px solid #C7980A;
                    border-radius: 4px;
                    font-size: 13px;
                    font-weight: 600;
                    color: #111;
                    cursor: pointer;
                    margin-top: 4px;
                    transition: background 0.15s;
                }
                .wl-empty-btn:hover { background: linear-gradient(to bottom, #f7ca00, #e5a800); }
            `}</style>

            <div className="wl-page">
                <div className="wl-inner">

                    {/* ── Header ── */}
                    <div className="wl-header-card">
                        <div>
                            <h1 className="wl-title">Your Wish List</h1>
                            {!wishlist.loading && (
                                <p className="wl-count">
                                    {count > 0 ? `${count} item${count !== 1 ? 's' : ''}` : 'No items yet'}
                                </p>
                            )}
                        </div>
                        {count > 0 && (
                            <button className="wl-sort">Sort by: Added date ▾</button>
                        )}
                    </div>

                    {/* ── Loading ── */}
                    {wishlist.loading && (
                        <div className="wl-grid">
                            {[...Array(6)].map((_, i) => (
                                <div key={i} className="wl-skel-card">
                                    <div className="wl-skel" style={{ height: 220 }} />
                                    <div style={{ padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: 8 }}>
                                        <div className="wl-skel" style={{ height: 12, width: '60%', borderRadius: 3 }} />
                                        <div className="wl-skel" style={{ height: 12, width: '85%', borderRadius: 3 }} />
                                        <div className="wl-skel" style={{ height: 16, width: '40%', borderRadius: 3 }} />
                                    </div>
                                    <div className="wl-skel" style={{ height: 32, margin: '0 12px 12px', borderRadius: 4 }} />
                                </div>
                            ))}
                        </div>
                    )}

                    {/* ── Items ── */}
                    {!wishlist.loading && count > 0 && (
                        <div className="wl-grid">
                            {products.map((item: any) => (
                                <WishlistProductCard key={item.id} item={item} />
                            ))}
                        </div>
                    )}

                    {/* ── Empty ── */}
                    {!wishlist.loading && count === 0 && (
                        <div className="wl-empty">
                            <div className="wl-empty-icon">❤️</div>
                            <h2 className="wl-empty-title">Your Wish List is empty</h2>
                            <p className="wl-empty-sub">
                                Save items you love to your wish list. Review them anytime and easily move them to cart.
                            </p>
                            <button className="wl-empty-btn" onClick={() => navigate('/')}>
                                Continue Shopping
                            </button>
                        </div>
                    )}

                </div>
            </div>
        </>
    );
};

export default Wishlist;