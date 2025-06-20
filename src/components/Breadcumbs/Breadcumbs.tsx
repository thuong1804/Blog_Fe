'use client'
import { formatSlug } from "@/utils"
import Link from "next/link"
import { usePathname } from 'next/navigation';

type ItemProps = {
  slug: string,
  path: string
}

type ItemBreadcrumbsProps = {
  items: ItemProps[]
}

const Breadcrumbs: React.FC<ItemBreadcrumbsProps> = ({ items }) => {
  const pathName = usePathname()
  const defaultPath: ItemProps[] = [
    {
      path: "Home",
      slug: "/",
    },
    ...items,
  ];
  const isLastItem = (path: string) => {
    const splitPathName = pathName.split('/')
    const isLast = splitPathName[splitPathName.length - 1] === path.toLocaleLowerCase()
    return isLast
  }

  return (
    <div className="breadcrumbs text-base font-normal text-(--text-color-title)">
      <ul>
        {defaultPath.map((item, key) => {
          const formatSlugItem = formatSlug(item.slug);
          const isLast = isLastItem(item.path)
          return (
            <li key={key}>
              {isLast ? <span className="pointer-events-none">{item.path}</span> : <Link href={`/${formatSlugItem}`}>{item.path}</Link>}
            </li>
          )
        })}
      </ul>
    </div>
  )
}
export default Breadcrumbs