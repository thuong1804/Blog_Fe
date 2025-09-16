'use client'

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
import { Editor } from '@tiptap/react'
import { uploadImageToCloud } from "@/utils/api";
import { GET_UPLOAD_SIGNATURE } from "@/graphql/Mutation/UploadImage";

const FormNewPostContainer = () => {
  const { user } = useAuth()
  const [contentPost, setContentPost] = useState<string>('')
  const [infoForm, setInFoForm] = useState<FormValuesPost>()
  const [createPost] = useMutation(CREATE_POST)
  const [filesToUpload, setFilesToUpload] = useState<{ file: File; localUrl: string }[]>([]);
  const editorRef = useRef<Editor>(null);
  const [getUploadSignature] = useMutation(GET_UPLOAD_SIGNATURE);

  const handleAddFile = (file: File) => {
    const localUrl = URL.createObjectURL(file);
    setFilesToUpload((prev) => [...prev, { file, localUrl }]);

    editorRef.current?.chain().focus().setImage({ src: localUrl }).run();
  };

  const handleSubmitForm = (values: FormValuesPost) => {
    console.log(values)
    setInFoForm(values)
  }

  const handleSavePost = async () => {
    const uploadPromises = filesToUpload.map((item) => uploadImageToCloud(item.file, getUploadSignature));
    const urls = await Promise.all(uploadPromises);

    let html = editorRef.current?.getHTML() || '';
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
        authorId: user?.id
      }
    })
    console.log(res)
  }

  return (
    <div className="max-w-[1400px] mx-auto p-5">
      <div className="flex items-center justify-between">
        <Link href="/" className="flex items-center pr-2.5 gap-2">
          <div className="avatar relative">
            <div className="w-15 rounded-full h-auto">
              <Image src="/images/blog-icon.png" alt="icon" fill />
            </div>
          </div>
          <span className="font-bold text-3xl">TECHNEWS</span>
        </Link>
        {user && <DropdownInfoProfile user={user} />}
      </div>
      <div className="w-full h-[700px] max-h-[1000px]  mt-5">
        <div className="flex gap-3 w-full h-full">
          <div className="flex flex-col h-full w-[55%] bg-white rounded-xl border-2 gap-2 p-2 pt-5 shadow-md">
            <h1 className="text-center">New post</h1>
            <div className="divider before:bg-gray-300 after:bg-gray-300 text-gray-500" />
            {user && (
              <div className="mt-2 ">
                <FormPostField user={{ user }} onSubmit={handleSubmitForm} />
              </div>
            )}
            <div className="flex-1 mt-2 border border-gray-300 shadow rounded-[6px] overflow-auto h-auto">
              <EditorForm
                setContentPost={setContentPost}
                onAddFile={handleAddFile}
                editorRef={editorRef}
              />
            </div>
          </div>
          <div className="flex-1 items-center bg-white rounded-xl w-full border-2 gap-5 p-2 pt-5 shadow-md h-full">
            <PreviewPost content={contentPost} />
          </div>
        </div>
        <div className="w-full flex justify-end mt-5">
          <Button title="Save" type="button" onClick={handleSavePost} />
        </div>
      </div>
    </div>
  )
}
export default FormNewPostContainer;