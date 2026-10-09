
export interface FeaturedProduct {
    id: string;
    title: string;
    category: string;
    image: string | null;
    benableUrl: string;
    sourceUrl: string | null;
    featured: boolean;
    sortOrder: number;
}

export const featuredProducts: FeaturedProduct[] = [
    {
        id: "bxaolu-utensil-hanger",
        title: "Bxaolu Kitchen Utensil Hanger, Adhesive Utensil Holder Wall Mount Kitchen Rack Rail with 8 Hooks, Space Saving and No Drilling, Black, 15.75 Inch",
        category: "kitchen",
        image: "https://i5.walmartimages.com/seo/Bxaolu-Kitchen-Utensil-Hanger-Adhesive-Utensil-Holder-Wall-Mount-Kitchen-Rack-Rail-with-8-Hooks-Space-Saving-and-No-Drilling-Black-15-75Inch_18990765-5729-456b-860e-71ef56168af5.2a3425578bfc1577d3bf0d8640f41d61.jpeg?odnBg=FFFFFF&odnHeight=573&odnWidth=573",
        benableUrl: "https://benable.com/CarolinaWilson/no-drill-kitchen-storage-renter-approved-picks/details?detail_id=24329966",
        sourceUrl: "https://www.walmart.com/ip/16250262685",
        featured: true,
        sortOrder: 1,
    },
    {
        id: "adrinfly-rotating-hooks",
        title: "Adrinfly 2-Pieces Rotating Adhesive Kitchen Utensil Hooks Under Cabinet Hanging Rack for Tools Towels Knives Black P29E011SA04-1",
        category: "kitchen",
        image: "https://images.thdstatic.com/productImages/3d8828ca-dc64-4571-bfad-b3743fd52cf5/svn/black-adrinfly-pantry-organizers-p29e011sa04-1-64_600.jpg",
        benableUrl: "https://benable.com/CarolinaWilson/no-drill-kitchen-storage-renter-approved-picks/details?detail_id=24330002",
        sourceUrl: "https://www.homedepot.com/p/335417132",
        featured: true,
        sortOrder: 2,
    },
    {
        id: "adhesive-oval-hooks",
        title: "12 Pcs Adhesive Minimalist Oval Metal Hooks",
        category: "kitchen",
        image: null,
        benableUrl: "https://benable.com/CarolinaWilson/no-drill-kitchen-storage-renter-approved-picks/details?detail_id=24329939",
        sourceUrl: null,
        featured: true,
        sortOrder: 3,
    },
    {
        id: "mimifly-storage-shelf",
        title: "Mimifly Kitchen Storage Shelf, Metal Cupboard Organizer, 16.9 x 8.3 x 5.9 Inches, 2 Pack, White",
        category: "kitchen",
        image: null,
        benableUrl: "https://benable.com/CarolinaWilson/no-drill-kitchen-storage-renter-approved-picks/details?detail_id=24330177",
        sourceUrl: "https://www.walmart.com/ip/409787115",
        featured: true,
        sortOrder: 4,
    },
];

export function getFeaturedProducts(limit = 4): FeaturedProduct[] {
    return featuredProducts
        .filter((product) => product.featured)
        .sort((a, b) => a.sortOrder - b.sortOrder)
        .slice(0, limit);
}
