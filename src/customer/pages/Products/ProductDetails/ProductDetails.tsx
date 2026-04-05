import React, { useEffect, useState } from 'react'
import StarIcon from '@mui/icons-material/Star';
import { teal } from '@mui/material/colors';
import { Box, Button, CircularProgress, Divider, Modal } from '@mui/material';
import ShieldIcon from '@mui/icons-material/Shield';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import { Wallet } from '@mui/icons-material';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import SmilarProduct from '../SimilarProduct/SmilarProduct';
import ZoomableImage from './ZoomableImage';
import { useAppDispatch, useAppSelector } from '../../../../Redux Toolkit/Store';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchProductById, getAllProducts } from '../../../../Redux Toolkit/Customer/ProductSlice';
import { addItemToCart } from '../../../../Redux Toolkit/Customer/CartSlice';
import ProductReviewCard from '../../Review/ProductReviewCard';
import RatingCard from '../../Review/RatingCard';
import { fetchReviewsByProductId } from '../../../../Redux Toolkit/Customer/ReviewSlice';

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: "auto",
    height: "100%",
    boxShadow: 24,
    outline: "none",
};

const ProductDetails = () => {
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const dispatch = useAppDispatch();
    const { products, review } = useAppSelector(store => store);
    const navigate = useNavigate();
    const { productId, categoryId, name } = useParams();
    const [selectedImage, setSelectedImage] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [addedToCart, setAddedToCart] = useState(false);

    // ── Safe fallbacks — prevents white screen when data is undefined on first render
    const product = products?.product;
    const images: string[] = product?.images ?? [];
    const reviews = review?.reviews ?? [];
    const savings = product?.mrpPrice ? product.mrpPrice - product.sellingPrice : 0;

    useEffect(() => {
        setSelectedImage(0); // reset when navigating between products
        if (productId) {
            dispatch(fetchProductById(Number(productId)));
            dispatch(fetchReviewsByProductId({ productId: Number(productId) }));
        }
        dispatch(getAllProducts({ category: categoryId }));
    }, [productId]);

    const handleAddCart = () => {
        dispatch(addItemToCart({
            jwt: localStorage.getItem('jwt'),
            request: { productId: Number(productId), size: "FREE", quantity }
        }));
        setAddedToCart(true);
        setTimeout(() => setAddedToCart(false), 2000);
    };

    // ── Show spinner while product data is loading
    if (!product) {
        return (
            <div className='flex items-center justify-center h-[80vh]'>
                <CircularProgress sx={{ color: teal[500] }} />
            </div>
        );
    }

    return (
        <div className='bg-[#f5f6f8]'>
            <div className='max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>

            {/* ── Breadcrumb ── */}
            <p className='text-xs text-gray-500 mb-4'>
                Home &rsaquo; {product.category?.name} &rsaquo;
                <span className='text-gray-700'> {product.title}</span>
            </p>

            <div className='bg-white border border-gray-200 rounded-2xl shadow-sm p-5 sm:p-7'>
                <div className='grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] gap-8'>

                {/* ── Left: Images ── */}
                <section className='flex flex-col lg:flex-row gap-4'>

                    {/* Thumbnail strip */}
                    <div className='w-full lg:w-[16%] flex flex-row lg:flex-col gap-2 overflow-x-auto lg:overflow-visible'>
                        {images.map((item, index) => (
                            <img
                                key={index}
                                onClick={() => setSelectedImage(index)}
                                className='w-[60px] h-[60px] lg:w-full lg:h-[80px] cursor-pointer rounded-lg border-2 transition-all duration-150 object-cover bg-white'
                                style={{
                                    borderColor: selectedImage === index ? '#f4c24d' : 'transparent',
                                    boxShadow: selectedImage === index ? '0 0 0 1px #f4c24d' : 'none',
                                }}
                                src={item}
                                alt={`thumb-${index}`}
                            />
                        ))}
                    </div>

                    {/* Main image */}
                    <div className='w-full lg:w-[84%]'>
                        {images.length > 0 && (
                            <img
                                onClick={handleOpen}
                                className='w-full rounded-xl cursor-zoom-in border border-gray-200 bg-[#f8fafc] p-4'
                                src={images[selectedImage]}
                                alt="product"
                            />
                        )}
                    </div>

                    <Modal open={open} onClose={handleClose}>
                        <Box sx={style}>
                            <ZoomableImage src={images[selectedImage]} alt="" />
                        </Box>
                    </Modal>
                </section>

                {/* ── Right: Details ── */}
                <section>
                    {/* Brand + Title */}
                    <p className='text-sm text-[#0b7285] font-semibold hover:underline cursor-pointer'>
                        {product.seller?.businessDetails.businessName}
                    </p>
                    <h1 className='text-xl font-medium text-gray-900 mt-1 leading-snug'>
                        {product.title}
                    </h1>

                    {/* Rating bar */}
                    <div className='flex items-center gap-2 mt-2'>
                        <div className='flex items-center gap-0.5'>
                            {[1, 2, 3, 4, 5].map((s) => (
                                <StarIcon key={s} sx={{ fontSize: 16, color: s <= 4 ? '#f4c24d' : '#ddd' }} />
                            ))}
                        </div>
                        <span className='text-sm text-[#0b7285] hover:underline cursor-pointer'>
                            358 ratings
                        </span>
                        <span className='text-gray-300 text-sm'>|</span>
                        <span className='text-sm text-[#0b7285] hover:underline cursor-pointer'>
                            {reviews.length} reviews
                        </span>
                    </div>

                    <Divider sx={{ my: 1.5 }} />

                    {/* Price block */}
                    <div className='space-y-1'>
                        <p className='text-xs text-gray-500'>
                            M.R.P.: <span className='line-through'>₹{product.mrpPrice?.toLocaleString("en-IN")}</span>
                        </p>
                        <div className='flex items-baseline gap-3'>
                            <span className='text-3xl font-semibold text-gray-900'>
                                ₹{product.sellingPrice?.toLocaleString("en-IN")}
                            </span>
                            {product.discountPercent ? (
                                <span className='text-base text-red-600 font-semibold'>
                                    -{product.discountPercent}%
                                </span>
                            ) : null}
                        </div>
                        {savings > 0 && (
                            <p className='text-xs text-emerald-700 font-semibold'>
                                You save ₹{savings.toLocaleString("en-IN")} on this order
                            </p>
                        )}
                        <p className='text-xs text-gray-500'>Inclusive of all taxes.</p>
                    </div>

                    {/* Delivery */}
                    <div className='mt-3 flex items-center gap-2 text-sm text-[#007600] font-semibold'>
                        <LocalShippingIcon sx={{ fontSize: 16 }} />
                        Free delivery <strong>Tomorrow</strong>
                        <span className='text-gray-500 font-normal ml-1'>on orders above ₹1,500</span>
                    </div>

                    <Divider sx={{ my: 2 }} />

                    {/* Trust badges */}
                    <div className='space-y-2.5'>
                        {[
                            { icon: <ShieldIcon sx={{ color: teal[500], fontSize: 20 }} />, label: 'Authentic & Quality Assured' },
                            { icon: <WorkspacePremiumIcon sx={{ color: teal[500], fontSize: 20 }} />, label: '100% money back guarantee' },
                            { icon: <LocalShippingIcon sx={{ color: teal[500], fontSize: 20 }} />, label: 'Free Shipping & Returns' },
                            { icon: <Wallet sx={{ color: teal[500], fontSize: 20 }} />, label: 'Pay on delivery might be available' },
                        ].map(({ icon, label }) => (
                            <div key={label} className='flex items-center gap-3 text-sm text-gray-700'>
                                {icon}
                                <span>{label}</span>
                            </div>
                        ))}
                    </div>

                    <Divider sx={{ my: 2 }} />

                    {/* Quantity */}
                    <div className='space-y-2'>
                        <p className='text-sm font-semibold text-gray-700 uppercase tracking-wide'>Quantity</p>
                        <div className='flex items-center border border-gray-300 rounded-full w-fit overflow-hidden'>
                            <button
                                disabled={quantity === 1}
                                onClick={() => setQuantity(q => q - 1)}
                                className='px-3 py-1.5 text-gray-600 hover:bg-gray-100 disabled:opacity-30 transition'
                            >
                                <RemoveIcon sx={{ fontSize: 16 }} />
                            </button>
                            <span className='px-4 text-base font-semibold border-x border-gray-300'>{quantity}</span>
                            <button
                                onClick={() => setQuantity(q => q + 1)}
                                className='px-3 py-1.5 text-gray-600 hover:bg-gray-100 transition'
                            >
                                <AddIcon sx={{ fontSize: 16 }} />
                            </button>
                        </div>
                    </div>

                    {/* CTA Buttons */}
                    <div className='mt-6 flex items-center gap-3'>
                        <button
                            onClick={handleAddCart}
                            className='flex-1 flex items-center justify-center gap-2 py-3 rounded-full font-semibold text-sm transition-all duration-200'
                            style={{
                                background: addedToCart
                                    ? 'linear-gradient(to bottom, #5cb85c, #449d44)'
                                    : 'linear-gradient(to bottom, #f7d56a, #f4c24d)',
                                border: addedToCart ? '1px solid #3d8b3d' : '1px solid #e1a836',
                                color: addedToCart ? '#fff' : '#111',
                            }}
                        >
                            <AddShoppingCartIcon sx={{ fontSize: 18 }} />
                            {addedToCart ? 'Added to Cart ✓' : 'Add to Cart'}
                        </button>

                        <button className='flex-1 flex items-center justify-center gap-2 py-3 rounded-full font-semibold text-sm border border-[#0b7285] text-[#0b7285] hover:bg-[#e6f6f6] transition'>
                            <FavoriteBorderIcon sx={{ fontSize: 18 }} />
                            Wishlist
                        </button>
                    </div>

                    {/* Description */}
                    <div className='mt-6'>
                        <Divider sx={{ mb: 2 }} />
                        <h2 className='font-semibold text-sm uppercase tracking-wide text-gray-600 mb-2'>
                            Product Description
                        </h2>
                        <p className='text-sm text-gray-700 leading-relaxed'>
                            {product.description}
                        </p>
                    </div>

                    {/* Reviews Section */}
                    <div className='mt-10'>
                        <Divider sx={{ mb: 3 }} />
                        <h2 className='font-semibold text-lg mb-4'>Customer Reviews & Ratings</h2>
                        <RatingCard reviews={reviews} />
                        <div className='mt-6 space-y-5'>
                            {reviews.map((item, i) => (
                                <div key={i} className='space-y-5'>
                                    <ProductReviewCard item={item} />
                                    <Divider />
                                </div>
                            ))}
                            <Button
                                onClick={() => navigate(`/reviews/${productId}`)}
                                variant='outlined'
                                sx={{ borderRadius: 8, textTransform: 'none', borderColor: '#0b7285', color: '#0b7285' }}
                            >
                                View All {reviews.length} Reviews
                            </Button>
                        </div>
                    </div>
                </section>
            </div>
            </div>

            {/* Similar Products */}
            <section className='mt-20'>
                <Divider sx={{ mb: 3 }} />
                <h2 className='text-lg font-bold'>Similar Products</h2>
                <div className='pt-5'>
                    <SmilarProduct />
                </div>
            </section>
        </div>
        </div>
    );
};

export default ProductDetails;
