import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

export interface FeaturedProduct {
    id: string;
    title: string;
    category: string;
    image: string | null;
    benableUrl: string;
    sourceUrl: string | null;
    featured: boolean;
    sortOrder: number;
    description?: string;
}

export const allowedCategories = [
    "kitchen",
    "pantry",
    "closet",
    "bathroom",
    "laundry",
    "entryway",
    "office",
    "under-the-sink",
] as const;

const csvPath = resolve(process.cwd(), "products.csv");
const imagesDirectory = resolve(
    process.cwd(),
    "public/images/products",
);

const imageExtensions = [".webp", ".jpg", ".jpeg", ".png", ".avif"];

function discoverLocalImage(productId: string): string | null {
    for (const extension of imageExtensions) {
        const filename = `${productId}${extension}`;

        if (existsSync(resolve(imagesDirectory, filename))) {
            return `/images/products/${filename}`;
        }
    }

    return null;
}

/** Parse CSV rows, supporting quoted fields, commas, and escaped quotes. */
function parseCSV(contents: string): string[][] {
    const rows: string[][] = [];
    let row: string[] = [];
    let field = "";
    let insideQuotes = false;

    for (let i = 0; i < contents.length; i++) {
        const char = contents[i];

        if (insideQuotes) {
            if (char === '"') {
                if (contents[i + 1] === '"') {
                    field += '"';
                    i++;
                } else {
                    insideQuotes = false;
                }
            } else {
                field += char;
            }
            continue;
        }

        if (char === '"' && field.length === 0) {
            insideQuotes = true;
        } else if (char === ",") {
            row.push(field);
            field = "";
        } else if (char === "\n" || char === "\r") {
            if (char === "\r" && contents[i + 1] === "\n") i++;

            row.push(field);
            field = "";

            if (row.some((value) => value.trim() !== "")) {
                rows.push(row);
            }

            row = [];
        } else {
            field += char;
        }
    }

    if (insideQuotes) {
        throw new Error("products.csv contains an unclosed quoted field.");
    }

    if (field.length > 0 || row.length > 0) {
        row.push(field);
        if (row.some((value) => value.trim() !== "")) {
            rows.push(row);
        }
    }

    return rows;
}

function loadProducts(): FeaturedProduct[] {
    if (!existsSync(csvPath)) {
        throw new Error(
            `Product catalogue not found: ${csvPath}`,
        );
    }

    const contents = readFileSync(csvPath, "utf8").replace(/^\uFEFF/, "");
    const rows = parseCSV(contents);

    if (rows.length < 2) {
        throw new Error(
            "products.csv must contain a header and at least one product.",
        );
    }

    const headers = rows[0].map((header) => header.trim());

    const requiredHeaders = [
        "id",
        "title",
        "category",
        "benableUrl",
        "sourceUrl",
        "featured",
        "sortOrder",
        "description",
    ];

    for (const header of requiredHeaders) {
        if (!headers.includes(header)) {
            throw new Error(
                `products.csv is missing required column "${header}".`,
            );
        }
    }

    const products: FeaturedProduct[] = [];
    const seenIds = new Set<string>();

    for (let rowIndex = 1; rowIndex < rows.length; rowIndex++) {
        const values = rows[rowIndex];

        if (values.length !== headers.length) {
            throw new Error(
                `products.csv row ${rowIndex + 1} has ${values.length} fields; expected ${headers.length}. Check commas and quotation marks.`,
            );
        }

        const record = Object.fromEntries(
            headers.map((header, index) => [
                header,
                values[index].trim(),
            ]),
        );

        const id = record.id;
        const title = record.title;
        const category = record.category;
        const benableUrl = record.benableUrl;
        const sourceUrl = record.sourceUrl;
        const featuredText = record.featured.toLowerCase();
        const sortOrder = Number(record.sortOrder);
        const description = record.description;

        const errors: string[] = [];

        if (!id || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id)) {
            errors.push("id must use lowercase letters, numbers, and hyphens");
        }

        if (seenIds.has(id)) {
            errors.push(`duplicate product ID "${id}"`);
        }

        if (!title) errors.push("title is required");

        if (
            !allowedCategories.includes(
                category as (typeof allowedCategories)[number],
            )
        ) {
            errors.push(
                `category must be one of: ${allowedCategories.join(", ")}`,
            );
        }

        if (!/^https:\/\/benable\.com\//i.test(benableUrl)) {
            errors.push("benableUrl must be a valid HTTPS Benable URL");
        }

        if (sourceUrl && !/^https:\/\//i.test(sourceUrl)) {
            errors.push("sourceUrl must be an HTTPS URL or empty");
        }

        if (featuredText !== "true" && featuredText !== "false") {
            errors.push('featured must be "true" or "false"');
        }

        if (!Number.isFinite(sortOrder)) {
            errors.push("sortOrder must be a valid number");
        }

        if (errors.length > 0) {
            throw new Error(
                `Invalid products.csv row ${rowIndex + 1} (ID: ${id || "missing"}):\n- ${errors.join("\n- ")}`,
            );
        }

        seenIds.add(id);

        products.push({
            id,
            title,
            category,
            image: discoverLocalImage(id),
            benableUrl,
            sourceUrl: sourceUrl || null,
            featured: featuredText === "true",
            sortOrder,
            ...(description ? { description } : {}),
        });
    }

    return products;
}

export const featuredProducts = loadProducts();

export function getFeaturedProducts(limit = 4): FeaturedProduct[] {
    return featuredProducts
        .filter((product) => product.featured)
        .sort((a, b) => a.sortOrder - b.sortOrder)
        .slice(0, limit);
}
