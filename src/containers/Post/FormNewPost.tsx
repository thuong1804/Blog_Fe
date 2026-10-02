"use client";

import EditorForm from "@/components/Editor/Editor";
import DropdownInfoProfile from "@/components/Layouts/Header/DropdownInfoProfile";
import { useAuth } from "@/context/AuthContext/AuthContext";
import Image from "next/image";
import Link from "next/link";
import FormPostField from "./FormPostField";
import { FormValuesPost } from "@/type/typeProps";
import { useMemo, useRef, useState } from "react";
import PreviewPost from "./PreviewPost";
import Button from "@/components/Button/Button";
import { useMutation, useQuery } from "@apollo/client";
import { CREATE_POST } from "@/graphql/Mutation/Post";
import { Editor } from "@tiptap/react";
import { uploadImageToCloud } from "@/utils/api";
import { GET_UPLOAD_SIGNATURE } from "@/graphql/Mutation/UploadImage";
import { GET_ALL_CATEGORIES } from "@/graphql/Query/CategoryQuery";
import { GET_TAGS } from "@/graphql/Query/TagQuery";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const FormNewPostContainer = () => {
    const { user } = useAuth();
    const [contentPost, setContentPost] = useState<string>("");
    const [infoForm, setInFoForm] = useState<FormValuesPost>();
    const [activeTab, setActiveTab] = useState<"edit" | "preview">("edit");
    const router = useRouter();

    const [createPost] = useMutation(CREATE_POST);
    const [filesToUpload, setFilesToUpload] = useState<{ file: File; localUrl: string }[]>([]);
    const editorRef = useRef<Editor>(null);
    const [getUploadSignature] = useMutation(GET_UPLOAD_SIGNATURE);

    const { data: dataTags } = useQuery(GET_TAGS);
    const { data: dataCategory } = useQuery(GET_ALL_CATEGORIES);

    const categoryName = useMemo(() => {
        if (!infoForm?.categoryId || !dataCategory?.categories) return undefined;
        for (const cat of dataCategory.categories) {
            const found = cat.children?.find(
                (c: { id: number; name: string }) => Number(c.id) === Number(infoForm.categoryId)
            );
            if (found) return found.name;
        }
        return undefined;
    }, [infoForm?.categoryId, dataCategory]);

    const tagNames = useMemo(() => {
        if (!infoForm?.tagIds?.length || !dataTags?.getTags) return [];
        return dataTags.getTags
            .filter((t: { id: number; name: string }) => infoForm.tagIds?.includes(Number(t.id)))
            .map((t: { name: string }) => t.name);
    }, [infoForm?.tagIds, dataTags]);

    const handleAddFile = (file: File) => {
        const localUrl = URL.createObjectURL(file);
        setFilesToUpload((prev) => [...prev, { file, localUrl }]);
        editorRef.current?.chain().focus().setImage({ src: localUrl }).run();
    };

    const handleSubmitForm = (values: FormValuesPost) => {
        setInFoForm(values);
        toast.success("Post information configured!");
    };

    const handleSavePost = async () => {
        if (!infoForm?.title) {
            toast.error("Please add post information and a title first!");
            return;
        }

        const uploadPromises = filesToUpload.map((item) =>
            uploadImageToCloud(item.file, getUploadSignature),
        );
        const urls = await Promise.all(uploadPromises);

        let html = editorRef.current?.getHTML() || "";
        urls.forEach((url, i) => {
            const localUrl = filesToUpload[i].localUrl;
            html = html.replaceAll(localUrl, url);
        });

        editorRef.current?.commands.setContent(html);
        setContentPost(html);

        const res = await createPost({
            variables: {
                ...infoForm,
                content: html,
                authorId: user?.id,
            },
        });

        if (res.data) {
            toast.success("Create post success");
            if (user) router.push(`/author/${user.handle}`);
        }
    };

    const hasPreviewContent = Boolean(contentPost || infoForm?.title || infoForm?.image || infoForm?.description);

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
                        <h1 className="font-bold text-gray-700 text-base">New post</h1>
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
                                    modalTitle="Post Information"
                                />
                            </div>
                        )}

                        {/* Editor */}
                        <div className="flex-1 min-h-0 overflow-hidden">
                            <EditorForm
                                setContentPost={setContentPost}
                                onAddFile={handleAddFile}
                                editorRef={editorRef}
                            />
                        </div>
                    </div>

                    {/* ── Preview Tab ── */}
                    <div
                        className={`flex-1 min-h-0 overflow-hidden ${
                            activeTab === "preview" ? "flex flex-col" : "hidden"
                        }`}
                    >
                        {hasPreviewContent ? (
                            <PreviewPost
                                content={contentPost}
                                info={infoForm}
                                categoryName={categoryName}
                                tagNames={tagNames}
                                author={user ? {
                                    name: user.name || user.handle,
                                    email: user.email,
                                    avatar: user.avatar,
                                    handle: user.handle,
                                } : null}
                            />
                        ) : (
                            <div className="flex-1 flex flex-col items-center justify-center text-gray-300 gap-3 p-8">
                                <svg className="w-12 h-12 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                <p className="text-sm italic text-gray-400">Nothing to preview yet. Start writing in the Edit tab or add post information.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* ── Footer actions ── */}
                <div className="flex justify-end mt-4 pb-6">
                    <Button
                        title="Save Post"
                        type="button"
                        classNames="bg-white text-[#6D28D9] font-black py-3 px-10 rounded-xl shadow-xl active:scale-95 transition-all hover:bg-white/90 cursor-pointer"
                        onClick={handleSavePost}
                    />
                </div>
            </div>
        </div>
    );
};

export default FormNewPostContainer;