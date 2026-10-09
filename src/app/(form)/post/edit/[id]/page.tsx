import FormEditPostContainer from "@/containers/Post/FormEditPost";

type tParams = Promise<{ id: string }>;

export default async function EditPostPage(props: { params: tParams }) {
    const { id } = await props.params;

    return <FormEditPostContainer postId={id} />;
}
