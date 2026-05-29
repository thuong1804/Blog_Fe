import AuthorSkeleton from "@/components/Loading/LoadingAuthorPage";
import AuthorPage from "@/containers/Author/Author";
import { Suspense } from "react";

type tParams = Promise<{ handle: string }>;

export default async function Author(props: { params: tParams }) {
    const { handle } = await props.params;

    return (
        <Suspense fallback={<AuthorSkeleton />}>
            <AuthorPage handle={handle} />
        </Suspense>
    );
}
