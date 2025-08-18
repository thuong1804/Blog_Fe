import { GET_LIST_USER } from "@/graphql/Query/AuthorQuery";
import { createApolloClient } from "@/lib/apolloClient";
import Image from "next/image";
import Link from "next/link";

const client = createApolloClient({ isServer: true });

interface User {
  id: number;
  name: string;
  handle: string;
  avatar: string;
}

interface UsersData {
  users: User[];
}

export default async function AuthorListPage() {
  const { data } = await client.query<UsersData>({
    query: GET_LIST_USER,
  });

  return (
    <div className="w-full pb-20 pt-14 px-5">
      <div className="max-w-(--max-width-desktop) mx-auto">
        <div className="border-b-1 border-gray-300 pb-8">
            <h1>Author</h1>
        </div>
        <div className="mt-5">
          <ul className="list-disc pl-5 space-y-2">
            {data.users.map((item, key) => (
              <li key={key} className="text-black">
                <div className="flex items-center gap-2">
                  <Link className="text-blue-600 underline" href={`/author/${item.handle}`}>{item.name}</Link>
                  <div className="avatar">
                    <div className="w-[30px] object-cover rounded-[50%]">
                      <Image alt='avatar' src={item.avatar} width={30} height={30} />
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}