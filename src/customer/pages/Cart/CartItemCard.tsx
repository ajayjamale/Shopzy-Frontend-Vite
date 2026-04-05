import React from "react";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import type { CartItem } from "../../../types/cartTypes";
import { useAppDispatch } from "../../../Redux Toolkit/Store";
import { deleteCartItem, updateCartItem } from "../../../Redux Toolkit/Customer/CartSlice";

interface CartItemProps {
  item: CartItem;
}

const CartItemCard: React.FC<CartItemProps> = ({ item }) => {
  const dispatch = useAppDispatch();

  const handleUpdateQuantity = (value: number) => {
    dispatch(
      updateCartItem({
        jwt: localStorage.getItem("jwt"),
        cartItemId: item.id,
        cartItem: { quantity: item.quantity + value },
      })
    );
  };

  const handleRemoveCartItem = () => {
    dispatch(
      deleteCartItem({
        jwt: localStorage.getItem("jwt") || "",
        cartItemId: item.id,
      })
    );
  };

  const saved = item.product?.mrpPrice - item.sellingPrice;

  return (
    <div className="px-5 py-4 flex flex-col sm:flex-row gap-4 relative">

      {/* Remove button */}
      <button
        onClick={handleRemoveCartItem}
        className="absolute top-3 right-3 text-gray-400 hover:text-red-500 transition-colors p-1 rounded-full hover:bg-red-50"
        title="Remove item"
      >
        <CloseIcon sx={{ fontSize: 17 }} />
      </button>

      {/* Product image */}
      <div className="flex-shrink-0">
        <img
          className="w-full sm:w-[110px] h-[160px] sm:h-[130px] rounded-lg object-cover object-top border border-gray-100 bg-white"
          src={item.product.images[0]}
          alt={item.product?.title}
        />
      </div>

      {/* Details */}
      <div className="flex-1 space-y-1 pr-0 sm:pr-6">
        <h1 className="font-semibold text-sm text-gray-900 leading-snug">
          {item.product?.seller?.businessDetails.businessName}
        </h1>
        <p className="text-gray-700 text-sm font-medium">{item.product?.title}</p>
        <p className="text-xs text-gray-400">
          <strong className="text-gray-500">Sold by:</strong>{" "}
          {item.product?.seller?.businessDetails.businessName}
        </p>
        <p className="text-xs text-[#007600] font-semibold">In Stock</p>
        <p className="text-xs text-gray-500">
          <strong>7 days</strong> replacement available
        </p>

        {/* Price */}
        <div className="flex items-baseline gap-2 pt-1">
          <span className="text-base font-bold text-gray-900">
            ₹{item.sellingPrice}
          </span>
          {item.product?.mrpPrice > item.sellingPrice && (
            <>
              <span className="text-xs text-gray-400 line-through">
                ₹{item.product.mrpPrice}
              </span>
              <span className="text-xs text-[#CC0C39] font-semibold">
                Save ₹{saved}
              </span>
            </>
          )}
        </div>

        {/* Quantity stepper */}
        <div className="flex items-center gap-0 border border-gray-300 rounded-full w-fit overflow-hidden mt-2">
          <button
            disabled={item.quantity === 1}
            onClick={() => handleUpdateQuantity(-1)}
            className="px-2.5 py-1 text-gray-600 hover:bg-gray-100 disabled:opacity-30 transition"
          >
            <RemoveIcon sx={{ fontSize: 15 }} />
          </button>
          <span className="px-3.5 text-sm font-semibold border-x border-gray-300 py-1">
            {item.quantity}
          </span>
          <button
            onClick={() => handleUpdateQuantity(1)}
            className="px-2.5 py-1 text-gray-600 hover:bg-gray-100 transition"
          >
            <AddIcon sx={{ fontSize: 15 }} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartItemCard;
