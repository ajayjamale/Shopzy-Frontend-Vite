import React, { useState, useEffect, MouseEvent } from "react";
import "./ProductCard.css";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { teal } from "@mui/material/colors";
import { Box, Button, IconButton, Modal } from "@mui/material";
import { useNavigate } from "react-router-dom";
import type { Product } from "../../../../types/productTypes";
import {
    useAppDispatch,
    useAppSelector,
} from "../../../../Redux Toolkit/Store";
import { addProductToWishlist } from "../../../../Redux Toolkit/Customer/WishlistSlice";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { isWishlisted } from "../../../../util/isWishlisted";
import ModeCommentIcon from '@mui/icons-material/ModeComment';
import ChatBot from "../../ChatBot/ChatBot";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";

interface ProductCardProps {
    item: Product;
}

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: "auto",
    borderRadius: ".5rem",
    boxShadow: 24,
};

const StarRating: React.FC<{ rating: number }> = ({ rating = 4 }) => (
    <div className="star-rating">
        {[1, 2, 3, 4, 5].map((i) => (
            <span key={i} className={`star ${i <= Math.round(rating) ? "filled" : ""}`}>★</span>
        ))}
        <span className="rating-count">{rating.toFixed(1)}</span>
    </div>
);

const ProductCard: React.FC<ProductCardProps> = ({ item }) => {
    const [currentImage, setCurrentImage] = useState(0);
    const [isHovered, setIsHovered] = useState(false);
    const [isFavorite, setIsFavorite] = useState(false);
    const [addedToCart, setAddedToCart] = useState(false);
    const { wishlist } = useAppSelector((store) => store);
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const [showChatBot, setShowChatBot] = useState(false);

    const handleAddWishlist = (event: MouseEvent) => {
        event.stopPropagation();
        setIsFavorite((prev) => !prev);
        if (item.id) dispatch(addProductToWishlist({ productId: item.id }));
    };

    useEffect(() => {
        let interval: any;
        if (isHovered) {
            interval = setInterval(() => {
                setCurrentImage((prevImage) => (prevImage + 1) % item.images.length);
            }, 1000);
        } else {
            setCurrentImage(0);
        }
        return () => clearInterval(interval);
    }, [isHovered, item.images.length]);

    const handleShowChatBot = (event: MouseEvent) => {
        event.stopPropagation();
        setShowChatBot(true);
    };

    const handleCloseChatBot = (e: MouseEvent) => {
        e.stopPropagation();
        setShowChatBot(false);
    };

    const handleAddToCart = (e: MouseEvent) => {
        e.stopPropagation();
        setAddedToCart(true);
        setTimeout(() => setAddedToCart(false), 1800);
    };

    return (
        <>
            <div
                onClick={() =>
                    navigate(
                        `/product-details/${item.category?.categoryId}/${item.title}/${item.id}`
                    )
                }
                className={`product-card-wrapper ${isHovered ? "hovered" : ""}`}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                {/* Image Section */}
                <div className="card">
                    {item.discountPercent ? (
                        <span className="pc-badge">-{item.discountPercent}%</span>
                    ) : null}
                    {item.images.map((image: any, index: number) => (
                        <img
                            key={index}
                            className="card-media object-top"
                            src={image}
                            alt={`product-${index}`}
                            style={{
                                transform: `translateX(${(index - currentImage) * 100}%)`,
                            }}
                        />
                    ))}

                    {/* Wishlist button — always visible */}
                    <div className="wishlist-btn" onClick={handleAddWishlist}>
                        {wishlist.wishlist && isWishlisted(wishlist.wishlist, item) ? (
                            <FavoriteIcon sx={{ color: "#CC0C39", fontSize: 20 }} />
                        ) : (
                            <FavoriteBorderIcon sx={{ color: "#555", fontSize: 20 }} />
                        )}
                    </div>

                    {/* Hover overlay */}
                    {isHovered && (
                        <div className="indicator">
                            {/* Image dots */}
                            <div className="dot-row">
                                {item.images.map((_: any, index: number) => (
                                    <button
                                        key={index}
                                        className={`indicator-button ${index === currentImage ? "active" : ""}`}
                                        onClick={(e) => { e.stopPropagation(); setCurrentImage(index); }}
                                    />
                                ))}
                            </div>

                            {/* Action buttons */}
                            <div className="action-row">
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    sx={{ zIndex: 10, minWidth: 0, padding: "6px 10px" }}
                                    onClick={handleAddWishlist}
                                >
                                    {isWishlisted(wishlist.wishlist, item) ? (
                                        <FavoriteIcon sx={{ color: teal[500] }} />
                                    ) : (
                                        <FavoriteBorderIcon sx={{ color: "gray" }} />
                                    )}
                                </Button>
                                <Button
                                    onClick={handleShowChatBot}
                                    color="secondary"
                                    variant="contained"
                                    sx={{ minWidth: 0, padding: "6px 10px" }}
                                >
                                    <ModeCommentIcon sx={{ color: teal[500] }} />
                                </Button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Product Details */}
                <div className="details">
                    <div className="seller-name">
                        {item.seller?.businessDetails.businessName}
                    </div>
                    <p className="product-title">{item.title}</p>

                    <StarRating rating={4.3} />

                    <div className="price-row">
                        <span className="selling-price">₹{item.sellingPrice?.toLocaleString("en-IN")}</span>
                        <span className="mrp-price">₹{item.mrpPrice?.toLocaleString("en-IN")}</span>
                        {item.discountPercent ? (
                            <span className="discount-percent">{item.discountPercent}% off</span>
                        ) : null}
                    </div>

                    <div className="delivery-info">
                        <LocalShippingOutlinedIcon sx={{ fontSize: 14, color: "#007600" }} />
                        <span>Free delivery <strong>Tomorrow</strong></span>
                    </div>

                    <button
                        className={`add-to-cart-btn ${addedToCart ? "added" : ""}`}
                        onClick={handleAddToCart}
                    >
                        {addedToCart ? "✓ Added to Cart" : "Add to Cart"}
                    </button>
                </div>
            </div>

            {showChatBot && (
                <section className="absolute left-16 top-0">
                    <Modal
                        open={true}
                        onClose={handleCloseChatBot}
                        aria-labelledby="modal-modal-title"
                        aria-describedby="modal-modal-description"
                    >
                        <Box sx={style}>
                            <ChatBot handleClose={handleCloseChatBot} productId={item.id} />
                        </Box>
                    </Modal>
                </section>
            )}
        </>
    );
};

export default ProductCard;
