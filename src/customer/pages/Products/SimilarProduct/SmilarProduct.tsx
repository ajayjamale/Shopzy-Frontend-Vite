import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../../../Redux Toolkit/Store';

// ── SimilarProductCard ────────────────────────────────────────────────────────

const SimilarProductCard = ({ product }: any) => {
    const [isHovered, setIsHovered] = useState(false);
    const [isFavorite, setIsFavorite] = useState(false);
    const navigate = useNavigate();

    return (
        <div
            onClick={() => navigate(
                `/product-details/${product.category?.categoryId}/${product.title}/${product.id}`
            )}
            className='group cursor-pointer'
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div
                className='relative h-[300px] overflow-hidden rounded-md'
                style={{
                    boxShadow: isHovered ? '0 4px 16px rgba(0,0,0,0.12)' : '0 1px 4px rgba(0,0,0,0.07)',
                    transition: 'box-shadow 0.2s, transform 0.2s',
                    transform: isHovered ? 'translateY(-3px)' : 'translateY(0)',
                }}
            >
                <img
                    className='h-full w-full object-cover object-top transition-transform duration-300'
                    style={{ transform: isHovered ? 'scale(1.04)' : 'scale(1)' }}
                    src={product.images?.[0]}
                    alt={product.title}
                />
            </div>

            <div className='details pt-3 space-y-1 group-hover-effect rounded-md'>
                <div className='name space-y-0.5'>
                    <h1 className='font-semibold text-sm text-gray-800'>
                        {product.seller?.businessDetails.businessName}
                    </h1>
                    <p className='text-sm text-gray-600 truncate'>{product.title}</p>
                </div>
                <div className='price flex items-center gap-2'>
                    <span className='font-semibold text-gray-900'>₹{product.sellingPrice}</span>
                    <span className='text-xs line-through text-gray-400'>₹{product.mrpPrice}</span>
                    <span className='text-xs text-[#007600] font-semibold'>{product.discountPercent}% off</span>
                </div>
            </div>
        </div>
    );
};

// ── SmilarProduct ─────────────────────────────────────────────────────────────

const SmilarProduct = () => {
    const products = useAppSelector((store) => store.products);

    // Guard: don't render until products array is available
    const similarProducts = products?.products ?? [];

    if (similarProducts.length === 0) return null;

    return (
        <div className='grid lg:grid-cols-6 md:grid-cols-4 sm:grid-cols-2 grid-cols-1 gap-4 gap-y-8'>
            {similarProducts.map((item: any) => (
                <SimilarProductCard key={item.id} product={item} />
            ))}
        </div>
    );
};

export default SmilarProduct;