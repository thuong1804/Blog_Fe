"use client";

import EditorForm from "@/components/Editor/Editor";
import DropdownInfoProfile from "@/components/Layouts/Header/DropdownInfoProfile";
import { useAuth } from "@/context/AuthContext/AuthContext";
import Image from "next/image";
import Link from "next/link";
import FormPostField from "./FormPostField";
import { FormValuesPost } from "@/type/typeProps";
import { useRef, useState } from "react";
import PreviewPost from "./PreviewPost";
import Button from "@/components/Button/Button";
import { useMutation } from "@apollo/client";
import { CREATE_POST } from "@/graphql/Mutation/Post";
import { Editor } from "@tiptap/react";
import { uploadImageToCloud } from "@/utils/api";
import { GET_UPLOAD_SIGNATURE } from "@/graphql/Mutation/UploadImage";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const FormNewPostContainer = () => {
    const { user } = useAuth();
    const [contentPost, setContentPost] = useState<string>("");
    const [infoForm, setInFoForm] = useState<FormValuesPost>();
    const [activeTab, setActiveTab] = useState<"edit" | "preview">("edit");
    const router = useRouter()

    const [createPost] = useMutation(CREATE_POST);
    const [filesToUpload, setFilesToUpload] = useState<{ file: File; localUrl: string }[]>([]);
    const editorRef = useRef<Editor>(null);
    const [getUploadSignature] = useMutation(GET_UPLOAD_SIGNATURE);

    const handleAddFile = (file: File) => {
        const localUrl = URL.createObjectURL(file);
        setFilesToUpload((prev) => [...prev, { file, localUrl }]);
        editorRef.current?.chain().focus().setImage({ src: localUrl }).run();
    };

    const handleSubmitForm = (values: FormValuesPost) => {
        setInFoForm(values);
    };

    const handleSavePost = async () => {
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
        console.log(res);

        if (res.data) {
            console.log(res.data)
            toast.success("Create post success")
            if (user)
            router.push(`/author/${user.handle}`)
        }
    };

    return (
        <div className="min-h-screen bg-[#7c4ee4]">
            <div className="max-w-[1400px] mx-auto p-3 md:p-5">

                <div className="flex items-center justify-between mb-4">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="w-10 h-10 md:w-12 md:h-12 relative rounded-full overflow-hidden border-2 border-white/20">
                            <Image src="/images/blog-icon.png" alt="icon" fill />
                        </div>
                        <span className="font-bold text-xl md:text-3xl text-white md:text-black">TECHNEWS</span>
                    </Link>
                    {user && <DropdownInfoProfile user={user} position="left" />}
                </div>

                <div className="flex lg:hidden mb-4 bg-black/10 p-1 rounded-xl backdrop-blur-sm">
                    <button
                        onClick={() => setActiveTab("edit")}
                        className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all ${activeTab === "edit" ? "bg-white text-[#7c4ee4] shadow-md" : "text-white/80"}`}
                    >
                        Post
                    </button>
                    <button
                        onClick={() => setActiveTab("preview")}
                        className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all ${activeTab === "preview" ? "bg-white text-[#7c4ee4] shadow-md" : "text-white/80"}`}
                    >
                        Preview
                    </button>
                </div>

                <div className="w-full">
                    <div className="flex flex-col lg:flex-row gap-5 lg:h-[78vh]">

                        <div className={`flex flex-col w-full lg:w-[60%] bg-white rounded-2xl shadow-xl overflow-hidden h-full 
                            ${activeTab === "preview" ? "hidden lg:flex" : "flex"}`}>
                            <div className="p-4 flex flex-col h-full">
                                <h1 className="text-center font-bold text-gray-700 mb-2 hidden lg:block">New post</h1>
                                {user && (
                                    <div className="mb-4">
                                        <FormPostField user={{ user }} onSubmit={handleSubmitForm} />
                                    </div>
                                )}

                                <div className="flex-1 border border-gray-100 rounded-xl overflow-hidden min-h-[500px] lg:min-h-0 bg-gray-50">
                                    <EditorForm
                                        setContentPost={setContentPost}
                                        onAddFile={handleAddFile}
                                        editorRef={editorRef}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className={`flex flex-col w-full lg:flex-1 bg-white rounded-2xl shadow-xl overflow-hidden h-full
                            ${activeTab === "edit" ? "hidden lg:flex" : "flex"}`}>
                            <div className="p-4 flex flex-col h-full">
                                <div className="flex items-center justify-between mb-2 border-b pb-2 border-gray-100">
                                    <span className="text-[11px] font-black uppercase tracking-wider text-gray-400">
                                        Live Preview Mode
                                    </span>
                                    <div className="flex gap-1">
                                        <div className="w-2 h-2 rounded-full bg-red-400"></div>
                                        <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
                                        <div className="w-2 h-2 rounded-full bg-green-400"></div>
                                    </div>
                                </div>

                                <div className="flex-1 overflow-y-auto min-h-[500px] lg:min-h-0 py-2">
                                    {contentPost ? (
                                        <PreviewPost content={contentPost} />
                                    ) : (
                                        <div className="h-full flex flex-col items-center justify-center text-gray-300 italic">
                                            <p>...</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="w-full flex justify-end mt-6 pb-12">
                        <Button
                            title="Save Post"
                            type="button"
                            classNames="w-full md:w-auto bg-white md:bg-[#7c4ee4] text-[#7c4ee4] md:text-white font-black py-4 md:py-3 px-12 rounded-xl shadow-2xl active:scale-95 transition-all"
                            onClick={handleSavePost}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FormNewPostContainer;