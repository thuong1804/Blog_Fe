import { FaBlogger } from "react-icons/fa";
import Link from "next/link";
import SearchBar from "@/components/SearchBar/SearchBar";
import Button from "@/components/Button/Button";
import { cookies } from "next/headers";
import { getCurrentUserFromToken } from "@/lib/Session";
import DropdownInfoProfile from "./DropdownInfoProfile";
import { path } from "@/constant/path";
import SideBar from "./Sidebar";
import { createApolloClient } from "@/lib/apolloClient";
import { GET_ALL_CATEGORIES } from "@/graphql/Query/CategoryQuery";
import Category from "@/components/Categories/Categories";

const itemMenu = [
    { title: "Blog", href: "/blog" },
    { title: "About", href: "/about" },
    { title: "Contact", href: "/contact" },
];

export default async function HeaderLayout() {
    const token = (await cookies()).get("accessToken")?.value;
    const user = await getCurrentUserFromToken(token);
    const client = createApolloClient({isServer: true});
    const { data } = await client.query({ query: GET_ALL_CATEGORIES });
    const categories = data?.categories || [];

    return (
        <header className="w-full bg-white text-title">
            <div className="flex justify-center">
                <div className="max-w-desktop w-full px-6 py-4 flex items-center justify-between gap-2">
                    <Link href="/" className="flex items-center gap-2">
                        <FaBlogger className="text-5xl" />
                        <span className="font-bold text-xl md:text-3xl">
                            TECHNEWS
                        </span>
                    </Link>

                    <div className="hidden lg:flex items-center gap-6 ml-auto flex-1">
                        <div className="flex-1">
                            <SearchBar />
                        </div>

                        {itemMenu.map((item) =>
                            item.href === path.contact ? (
                                <Link key={item.href} href={item.href}>
                                    <Button title="Contact us" />
                                </Link>
                            ) : (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className="font-bold hover:text-primary"
                                >
                                    {item.title}
                                </Link>
                            )
                        )}

                        <DropdownInfoProfile user={user?.data} position="end" />
                    </div>
                    <div className="lg:hidden">
                        <SideBar itemMenu={itemMenu} user={user?.data} categories={categories}/>
                    </div>
                </div>
            </div>

            <div className="hidden lg:flex justify-center">
                <div className="max-w-desktop w-full px-6 py-2">
                    <Category items={categories} />
                </div>
            </div>
        </header>
    );
}
