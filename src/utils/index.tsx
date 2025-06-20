const formatSlug = (slug: string): string => {
  return slug.toLowerCase().replace(/&/g, 'and').replace(/\s+/g, '-');
};

export {
  formatSlug
}