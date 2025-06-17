import Link from "next/link"
type ItemProps = {
  slug: string,
  path: string
}
type ItemBreadcrumbsProps = {
  items: ItemProps[]
}

const Breadcrumbs: React.FC<ItemBreadcrumbsProps> = ({items}) => {

 const defaultPath: ItemProps[] = [
    {
      path: "Home",
      slug: "/",
    },
    ...items,
  ];


  return (
    <div className="breadcrumbs text-base font-normal text-(--text-color-title)">
      <ul>
        {defaultPath.map((item, key) => {
          return (
            <li key={key}>
              <Link  href={item.slug}>{item.path}</Link>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
export default Breadcrumbs