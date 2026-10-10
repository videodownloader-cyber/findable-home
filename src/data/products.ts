
export interface Product {
    id: string;
    name: string;
    title: string;
    price: number;
    description: string;
    category: string;
    subcategory?: string;
    stock: number;
    images: string[];
    slug: string;
    badge?: string;
    discount?: number;
    specs?: { label: string; value: string }[];
}

export const products: Product[] = [];

export const getProductBySlug = (slug: string) =>
    products.find((product) => product.slug === slug);

export const getRelatedProducts = (category: string, currentSlug: string) =>
    products
        .filter(
            (product) =>
                product.category === category &&
                product.slug !== currentSlug,
        )
        .slice(0, 4);

