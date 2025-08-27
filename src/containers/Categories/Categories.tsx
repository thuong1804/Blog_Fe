"use client";

import { useQuery } from "@apollo/client";
import { GET_ALL_CATEGORIES } from "@/graphql/Query/CategoryQuery";
import Category from "@/components/Categories/Categories";
import { usePathname } from "next/navigation";
import { path } from "@/constant/path";

export default function CategoriesPage() {
  const pathName = usePathname()
  const isContact = pathName === path.contact
  const { data, loading, error } = useQuery(GET_ALL_CATEGORIES);

  if (error) return <p>Error loading categories</p>;

  const categories = data?.categories || [];

  if (isContact) return null;

  return (
    <>
      {loading ? (
        <div className="flex justify-between gap-2 items-center w-full relative text-[#333333] animate-pulse">
          {Array.from({ length: 6 }).map((_, idx) => (
            <div key={idx} className="h-7 w-full bg-gray-200 rounded"></div>
          ))}
        </div>
      ) : (
        <Category items={categories} />
      )}
    </>
  )
}
