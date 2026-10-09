export interface ContentItem {
    id: string;
    title: string;
    author: string;
    image: string;
    path: string;

    tags: string[];

    status:
        | "draft"
        | "published"
        | "needs-update"
        | "retired";

    role:
        | "cornerstone"
        | "supporting"
        | "decision-guide"
        | "checklist";

    featuredEligible: boolean;

    publishedAt: string;
    lastFeatured: string | null;
}

export const content: ContentItem[] = [];

/*
 * Featured Content
 *
 * Selects published content that is explicitly eligible
 * for the Featured Content section.
 */
export function getFeaturedContent(limit = 3): ContentItem[] {
    const eligible = content.filter(
        (item) =>
            item.status === "published" &&
            item.featuredEligible === true
    );

    return eligible
        .sort((a, b) => {
            if (a.lastFeatured === null && b.lastFeatured !== null) {
                return -1;
            }

            if (a.lastFeatured !== null && b.lastFeatured === null) {
                return 1;
            }

            if (a.lastFeatured !== null && b.lastFeatured !== null) {
                return (
                    new Date(a.lastFeatured).getTime() -
                    new Date(b.lastFeatured).getTime()
                );
            }

            return (
                new Date(b.publishedAt).getTime() -
                new Date(a.publishedAt).getTime()
            );
        })
        .slice(0, limit);
}

/*
 * Latest Articles
 *
 * Only published articles are considered.
 * Newest publication date appears first.
 */
export function getLatestArticles(limit = 5): ContentItem[] {
    return content
        .filter((item) => item.status === "published")
        .sort(
            (a, b) =>
                new Date(b.publishedAt).getTime() -
                new Date(a.publishedAt).getTime()
        )
        .slice(0, limit);
}