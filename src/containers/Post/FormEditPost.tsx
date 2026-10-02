"use client";

import Button from "@/components/Button/Button";
import EditorForm from "@/components/Editor/Editor";
import DropdownInfoProfile from "@/components/Layouts/Header/DropdownInfoProfile";
import { useAuth } from "@/context/AuthContext/AuthContext";
import { UPDATE_POST } from "@/graphql/Mutation/Post";
import { GET_UPLOAD_SIGNATURE } from "@/graphql/Mutation/UploadImage";
import { GET_POST_BY_ID } from "@/graphql/Query/PostQuery";
import { GET_ALL_CATEGORIES } from "@/graphql/Query/CategoryQuery";
import { GET_TAGS } from "@/graphql/Query/TagQuery";
import { FormValuesPost } from "@/type/typeProps";
import { joinSlugCategory, markdownToHtml } from "@/utils";
import { uploadImageToCloud } from "@/utils/api";
import { useMutation, useQuery } from "@apollo/client";
import { Editor } from "@tiptap/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import FormPostField from "./FormPostField";
import PreviewPost from "./PreviewPost";

interface FormEditPostProps {
    postId: number | string;
}

const FormEditPostContainer: React.FC<FormEditPostProps> = ({ postId }) => {
    const { user } = useAuth();
    const isLogin = Boolean(user);
    const router = useRouter();

    const [contentPost, setContentPost] = useState<string>("");
    const [infoForm, setInfoForm] = useState<FormValuesPost>();
    const [activeTab, setActiveTab] = useState<"edit" | "preview">("edit");
    const [filesToUpload, setFilesToUpload] = useState<
        { file: File; localUrl: string }[]
    >([]);
    const [isSaving, setIsSaving] = useState(false);

    const editorRef = useRef<Editor>(null);

    const { data, loading, error } = useQuery(GET_POST_BY_ID, {
        variables: { id: Number(postId) },
        skip: !postId,
        fetchPolicy: "network-only",
    });

    const { data: dataTags } = useQuery(GET_TAGS);
    const { data: dataCategory } = useQuery(GET_ALL_CATEGORIES);

    const [updatePost] = useMutation(UPDATE_POST);
    const [getUploadSignature] = useMutation(GET_UPLOAD_SIGNATURE);

    const post = data?.post;

    const categoryName = useMemo(() => {
        if (infoForm?.categoryId && dataCategory?.categories) {
            for (const cat of dataCategory.categories) {
                const found = cat.children?.find(
                    (c: { id: number; name: string }) => Number(c.id) === Number(infoForm.categoryId)
                );
                if (found) return found.name;
            }
        }
        return post?.category?.name;
    }, [infoForm?.categoryId, dataCategory, post?.category?.name]);

    const tagNames = useMemo(() => {
        if (infoForm?.tagIds?.length && dataTags?.getTags) {
            const mapped = dataTags.getTags
                .filter((t: { id: number; name: string }) => infoForm.tagIds?.includes(Number(t.id)))
                .map((t: { name: string }) => t.name);
            if (mapped.length) return mapped;
        }
        return post?.tags?.map((t: { name: string }) => t.name) || [];
    }, [infoForm?.tagIds, dataTags, post?.tags]);

    // Initialize form and content when post data arrives
    useEffect(() => {
        if (post) {
            const initialFormValues: FormValuesPost = {
                title: post.title || "",
                description: post.description || "",
                excerpt: post.excerpt || "",
                readingTime: post.readingTime || 0,
                categoryId: post.category?.id ? Number(post.category.id) : undefined,
                tagIds: post.tags
                    ? post.tags.map((tag: { id: number }) => Number(tag.id))
                    : [],
                image: post.image || "",
            };
            setInfoForm(initialFormValues);

            if (post.content) {
                setContentPost(markdownToHtml(post.content));
            }
        }
    }, [post]);

    // Check ownership
    const isAuthor = useMemo(() => {
        if (!post || !user) return true; // wait or fallback
        if (post.authorId && Number(user.id) === Number(post.authorId)) return true;
        if (post.author?.email && user.email === post.author.email) return true;
        if (post.author?.handle && user.handle === post.author.handle) return true;
        return false;
    }, [post, user]);

    const handleAddFile = (file: File) => {
        const localUrl = URL.createObjectURL(file);
        setFilesToUpload((prev) => [...prev, { file, localUrl }]);
        editorRef.current?.chain().focus().setImage({ src: localUrl }).run();
    };

    const handleSubmitForm = (values: FormValuesPost) => {
        setInfoForm(values);
        toast.success("Post information updated");
    };

    const handleSavePost = async () => {
        if (!infoForm?.title) {
            toast.error("Please provide post information and title");
            return;
        }

        setIsSaving(true);
        try {
            // Upload any newly added images
            const uploadPromises = filesToUpload.map((item) =>
                uploadImageToCloud(item.file, getUploadSignature)
            );
            const urls = await Promise.all(uploadPromises);

            let html = editorRef.current?.getHTML() || contentPost;
            urls.forEach((url, i) => {
                const localUrl = filesToUpload[i]?.localUrl;
                if (localUrl) {
                    html = html.replaceAll(localUrl, url);
                }
            });

            editorRef.current?.commands.setContent(html);
            setContentPost(html);

            const res = await updatePost({
                variables: {
                    id: Number(postId),
                    title: infoForm.title,
                    description: infoForm.description,
                    excerpt: infoForm.excerpt,
                    readingTime: infoForm.readingTime
                        ? Number(infoForm.readingTime)
                        : undefined,
                    categoryId: infoForm.categoryId
                        ? Number(infoForm.categoryId)
                        : undefined,
                    tagIds: infoForm.tagIds,
                    image: infoForm.image,
                    content: html,
                    authorId: user?.id ? Number(user.id) : undefined,
                },
            });

            if (res.data?.updatePost) {
                toast.success("Post updated successfully!");
                const updated = res.data.updatePost;
                if (user?.handle) {
                    router.push(`/author/${user.handle}`);
                } else if (updated.category) {
                    const postUrl = joinSlugCategory(
                        updated.category?.parent?.name,
                        updated.category?.name,
                        updated.slug
                    );
                    router.push(postUrl);
                } else {
                    router.push("/blog");
                }
            }
        } catch (err: unknown) {
            const error = err as Error;
            toast.error(error.message || "Failed to update post");
        } finally {
            setIsSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#6D28D9] flex flex-col items-center justify-center text-white">
                <span className="loading loading-spinner loading-lg text-white"></span>
                <p className="mt-4 font-semibold text-lg">Loading post data...</p>
            </div>
        );
    }

    if (error || !post) {
        return (
            <div className="min-h-screen bg-[#6D28D9] flex flex-col items-center justify-center text-white p-4">
                <div className="bg-white text-gray-800 p-8 rounded-2xl shadow-xl max-w-md w-full text-center">
                    <h2 className="text-2xl font-bold text-red-600 mb-2">Error</h2>
                    <p className="text-gray-600 mb-6">
                        {error?.message || "Post not found or has been removed."}
                    </p>
                    <Link href="/">
                        <Button classNames="w-full bg-[#6D28D9] text-white font-bold py-3 rounded-xl">
                            Back to Home
                        </Button>
                    </Link>
                </div>
            </div>
        );
    }

    if (!isAuthor && isLogin) {
        return (
            <div className="min-h-screen bg-[#6D28D9] flex flex-col items-center justify-center text-white p-4">
                <div className="bg-white text-gray-800 p-8 rounded-2xl shadow-xl max-w-md w-full text-center">
                    <h2 className="text-2xl font-bold text-red-600 mb-2">
                        Permission Denied
                    </h2>
                    <p className="text-gray-600 mb-6">
                        You do not have permission to edit this post.
                    </p>
                    <Link href="/">
                        <Button classNames="w-full bg-[#6D28D9] text-white font-bold py-3 rounded-xl">
                            Back to Home
                        </Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#6D28D9] flex flex-col">
            <div className="max-w-[1200px] w-full mx-auto px-4 py-4 flex flex-col flex-1">

                {/* ── Header ── */}
                <div className="flex items-center justify-between mb-4">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="w-10 h-10 relative rounded-full overflow-hidden border-2 border-white/20">
                            <Image src="/images/blog-icon.png" alt="icon" fill />
                        </div>
                        <span className="font-bold text-xl text-white">TECHNEWS</span>
                    </Link>
                    {user && <DropdownInfoProfile user={user} position="end" />}
                </div>

                {/* ── Main Panel ── */}
                <div className="flex-1 bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col min-h-0">

                    {/* Panel Header: title + tab switcher */}
                    <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100 shrink-0">
                        <h1 className="font-bold text-gray-700 text-base truncate max-w-[60%]">
                            Edit Post
                            {post.title && (
                                <span className="ml-1 font-normal text-gray-400 text-sm">
                                    — {post.title}
                                </span>
                            )}
                        </h1>
                        <div className="flex bg-gray-100 p-0.5 rounded-lg gap-0.5">
                            <button
                                onClick={() => setActiveTab("edit")}
                                className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all ${
                                    activeTab === "edit"
                                        ? "bg-white text-[#6D28D9] shadow-sm"
                                        : "text-gray-500 hover:text-gray-700"
                                }`}
                            >
                                ✏️ Edit
                            </button>
                            <button
                                onClick={() => setActiveTab("preview")}
                                className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all ${
                                    activeTab === "preview"
                                        ? "bg-white text-[#6D28D9] shadow-sm"
                                        : "text-gray-500 hover:text-gray-700"
                                }`}
                            >
                                👁 Preview
                            </button>
                        </div>
                    </div>

                    {/* ── Edit Tab ── */}
                    <div
                        className={`flex flex-col flex-1 min-h-0 ${
                            activeTab === "edit" ? "flex" : "hidden"
                        }`}
                    >
                        {/* Post info fields */}
                        {user && (
                            <div className="px-5 pt-3 pb-2 border-b border-gray-100 shrink-0">
                                <FormPostField
                                    user={{ user }}
                                    onSubmit={handleSubmitForm}
                                    initialData={infoForm}
                                    initialImage={infoForm?.image}
                                    buttonTitle="Edit Information"
                                    modalTitle="Edit Information Post"
                                />
                            </div>
                        )}

                        {/* Editor */}
                        <div className="flex-1 min-h-0 overflow-hidden">
                            <EditorForm
                                setContentPost={setContentPost}
                                onAddFile={handleAddFile}
                                editorRef={editorRef}
                                initialContent={post.content}
                            />
                        </div>
                    </div>

                    {/* ── Preview Tab ── */}
                    <div
                        className={`flex-1 min-h-0 overflow-hidden ${
                            activeTab === "preview" ? "flex flex-col" : "hidden"
                        }`}
                    >
                        {contentPost || infoForm?.title || infoForm?.image || infoForm?.description ? (
                            <PreviewPost
                                content={contentPost}
                                info={infoForm}
                                categoryName={categoryName}
                                tagNames={tagNames}
                                author={post?.author || (user ? {
                                    name: user.name || user.handle,
                                    email: user.email,
                                    avatar: user.avatar,
                                    handle: user.handle,
                                } : null)}
                            />
                        ) : (
                            <div className="flex-1 flex flex-col items-center justify-center text-gray-300 gap-3 p-8">
                                <svg className="w-12 h-12 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                <p className="text-sm italic text-gray-400">Nothing to preview yet.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* ── Footer actions ── */}
                <div className="flex justify-end gap-3 mt-4 pb-6">
                    <Link href={user?.handle ? `/author/${user.handle}` : "/"}>
                        <Button
                            title="Cancel"
                            type="button"
                            classNames="bg-white/20 text-white font-bold py-3 px-8 rounded-xl hover:bg-white/30 transition-all"
                        />
                    </Link>
                    <Button
                        title={isSaving ? "Saving..." : "Update Post"}
                        type="button"
                        classNames="bg-white text-[#6D28D9] font-black py-3 px-10 rounded-xl shadow-xl active:scale-95 transition-all hover:bg-white/90 disabled:opacity-60"
                        onClick={handleSavePost}
                        disabled={isSaving}
                    />
                </div>
            </div>
        </div>
    );
};

export default FormEditPostContainer;
