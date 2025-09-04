import Image from "next/image";

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

const renderImage = (file: string | null | undefined) => {
  if (file) {
    return (
      <Image
        key={file}
        src={file}
        alt="preview"
        width={64}
        height={64}
        className="rounded-full object-cover"
        unoptimized
      />
    );
  } else {
    return (
      <Image
        src="/default-avatar.jpg"
        alt="default avatar"
        width={64}
        height={64}
        className="rounded-full object-cover"
        unoptimized
      />
    );
  }
};

export {
  formatSlug,
  joinSlugCategory,
  renderImage,
}