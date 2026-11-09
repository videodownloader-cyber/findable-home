const SITE_URL = "https://findablehome.me";

export const absoluteUrl = (path: string) =>
    new URL(path, SITE_URL).href;

export const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: "Findable Home",
    url: SITE_URL,
    logo: {
        "@type": "ImageObject",
        url: absoluteUrl("/images/branding/findable-home-logo.webp"),
    },
};

export const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    name: "Findable Home",
    url: SITE_URL,
    publisher: {
        "@id": `${SITE_URL}/#organization`,
    },
};

export function createBreadcrumbSchema(
    items: { label: string; href?: string }[],
) {
    return {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: items.map((item, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: item.label,
            ...(item.href
                ? { item: absoluteUrl(item.href) }
                : {}),
        })),
    };
}

export function createBlogPostingSchema(post: any) {
    const articleUrl = absoluteUrl(`/blog/${post.slug}/`);
    const articleImage = absoluteUrl(post.image);
    const authorImage = absoluteUrl(
        post.authorImage ?? "/images/authors/carolina-wilson.webp",
    );

    const toSchemaDate = (value: string | undefined) => {
        if (!value) return undefined;

        const dateValue = new Date(value);
        return Number.isNaN(dateValue.getTime())
            ? undefined
            : dateValue.toISOString();
    };

    const datePublished = toSchemaDate(post.datePublished ?? post.date);
    const dateModified = toSchemaDate(
        post.dateModified ?? post.datePublished ?? post.date,
    );

    return {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        mainEntityOfPage: {
            "@type": "WebPage",
            "@id": articleUrl,
        },
        headline: post.title,
        description: post.metaDescription ?? post.description,
        image: [articleImage],
        author: {
            "@type": "Person",
            name: post.author,
            url: absoluteUrl("/about/"),
            image: authorImage,
        },
        publisher: {
            "@id": `${SITE_URL}/#organization`,
        },
        ...(datePublished ? { datePublished } : {}),
        ...(dateModified ? { dateModified } : {}),
    };
}

export function createCollectionPageSchema({
    name,
    description,
    url,
    items = [],
}: {
    name: string;
    description: string;
    url: string;
    items?: { name: string; url: string }[];
}) {
    return {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name,
        description,
        url: absoluteUrl(url),
        ...(items.length
            ? {
                  mainEntity: {
                      "@type": "ItemList",
                      itemListElement: items.map((item, index) => ({
                          "@type": "ListItem",
                          position: index + 1,
                          name: item.name,
                          url: absoluteUrl(item.url),
                      })),
                  },
              }
            : {}),
    };
}

export function createProductSchema(product: any) {
    if (!product?.name || !product?.slug || product.price == null) {
        return null;
    }

    const schema: Record<string, any> = {
        "@context": "https://schema.org",
        "@type": "Product",
        name: product.name,
        url: absoluteUrl(`/product/${product.slug}/`),
        ...(product.description ? { description: product.description } : {}),
        ...(product.images?.length
            ? { image: product.images.map((image: string) => absoluteUrl(image)) }
            : {}),
    };

    schema.offers = {
        "@type": "Offer",
        price: product.price,
        ...(product.currency ? { priceCurrency: product.currency } : {}),
        ...(typeof product.stock === "number"
            ? {
                  availability:
                      product.stock > 0
                          ? "https://schema.org/InStock"
                          : "https://schema.org/OutOfStock",
              }
            : {}),
        url: absoluteUrl(`/product/${product.slug}/`),
    };

    return schema;
}
