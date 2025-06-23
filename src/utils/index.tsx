const formatSlug = (slug: string): string => {
  return slug.toLowerCase().replace(/&/g, 'and').replace(/\s+/g, '-');
};

const joinSlugCategory = (
  parent: string | undefined,
  children: string | undefined,
  slug: string
) => {
  return `/${formatSlug(parent || '')}/${formatSlug(children || '')}/${slug}`
}

export {
  formatSlug,
  joinSlugCategory
}