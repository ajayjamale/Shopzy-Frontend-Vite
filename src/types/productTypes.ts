import type { Seller } from "./sellerTypes";

// ─── Category ─────────────────────────────────────────────────────────────────

export interface Category {
    id?: number;
    name: string;
    categoryId: string;
    parentCategory?: Category;
    level: number;
}

// ─── Product ──────────────────────────────────────────────────────────────────

export interface Product {
    id?: number;
    title: string;
    description: string;
    mrpPrice: number;
    sellingPrice: number;

    // FIX 1: Was optional (discountPercent?) — should be required with default 0.
    // The backend always returns this field (it's a primitive int in Java,
    // never null). Marking it optional causes the customer UI to treat
    // undefined and 0 the same way, hiding valid discounts.
    discountPercent: number;

    // FIX 2: Was optional (quantity?) — should be required with default 0.
    // Same reason: Java primitive int is never null in the response.
    quantity: number;

    color: string;
    images: string[]; // FIX 3: Was any[] — images are always string URLs

    numRatings: number; // FIX 4: Was optional — Java int, always present

    // Category is the resolved entity from the backend (@ManyToOne).
    // The backend returns the deepest category linked to the product
    // (level 3 → 2 → 1 depending on what was selected).
    category?: Category;

    seller?: Seller;

    createdAt?: string; // FIX 5: Was Date — JSON deserialization gives a string,
                        // not a Date object. Use new Date(product.createdAt) if
                        // you need date operations.

    // FIX 6: Was "sizes: string" — field name matches Java "sizes" (lowercase)
    // after the Product.java fix (was "Sizes" with capital S before).
    // Kept as string since only one size is selected per product variant.
    sizes: string;

    in_stock: boolean; // FIX 7: Was optional (in_stock?) — Java boolean primitive,
                       // always present. Marking it required prevents "undefined"
                       // being treated as falsy and hiding in-stock products.
}

// ─── Create Product Request ───────────────────────────────────────────────────
// Mirrors CreateProductRequest.java — used when submitting the product form.

export interface CreateProductRequest {
    title: string;
    description: string;
    mrpPrice: number;
    sellingPrice: number;

    // Must be sent to backend so it's stored correctly.
    // Compute as: Math.round(((mrpPrice - sellingPrice) / mrpPrice) * 100)
    discountPercent: number;

    quantity: number;
    color: string;
    images: string[];
    sizes: string;

    // Sent as category ID strings — backend resolves them to Category entities.
    // e.g. category: "men", category2: "mens_clothing", category3: "t_shirts"
    category: string;
    category2: string;
    category3?: string; // Optional — not all categories have a third level
}