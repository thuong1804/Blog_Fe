'use client'

import Button from "@/components/Button/Button"
import InputField from "@/components/InputField/InputField"
import UploadImage from "@/components/UploadImage/UploadImage";
import { useAuth } from "@/context/AuthContext/AuthContext";
import { UPDATE_USER_DETAIL } from "@/graphql/Mutation/AuthorQuery";
import { DELETE_AVATAR_IMAGE, UPDATE_AVATAR_IMAGE } from "@/graphql/Mutation/UploadImage";
import { renderImage } from "@/utils";
import { useMutation } from "@apollo/client";
import React, { useEffect, useState } from "react";
import { MdOutlineAlternateEmail, MdOutlineDescription } from "react-icons/md";
import { toast } from "sonner";

const FormEditProfile = () => {
  const { user } = useAuth()
  const [file, setFile] = useState<string | null>(null);
  const [updateUserDetail] = useMutation(UPDATE_USER_DETAIL)
  const [updateAvatarUser] = useMutation(UPDATE_AVATAR_IMAGE)
  const [deleteAvatar] = useMutation(DELETE_AVATAR_IMAGE)
  const [disabledDeleteButton, setDisabledDeleteButton] = useState<boolean>(false)
  const isNullAvatar = !user?.avatar

  const [form, setForm] = useState({
    email: "",
    description: "",
    name: "",
    handle: "",
  });

  useEffect(() => {
    if (user) {
      setForm({
        email: user?.email || "",
        description: user?.description || "",
        name: user?.name || "",
        handle: user?.handle || "",
      })
    }
  }, [user])

  const onChangeValueInput = (fieldName: string, value: string) => {
    setForm((prev) => ({
      ...prev,
      [fieldName]: value
    }))
  }

  const handleSubmitForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!user?.id) {
      console.error("User ID not found");
      return;
    }

    try {
      await updateUserDetail({
        variables: {
          id: user!.id,
          ...form,
        },
      });

      toast.success("Upload user success")
    } catch (err) {
      const error = err as Error;
      toast.error(error.message);
    }
  };

  const handleDeleteAvatar = async () => {
    try {
      await deleteAvatar({
        variables: {
          publicId: user!.avatarPublicId,
          userId: user!.id
        }
      })
      setFile(null)
      toast.success("Delete avatar success")
    } catch (err) {
      const error = err as Error;
      toast.error(error.message);
    }
  }

  useEffect(() => {
    if (user?.avatar) {
      setFile(user.avatar)
    }
  }, [user])

  return (
    <React.Fragment>
      <div className="flex items-center gap-5">
        <div className="avatar">
          <div className="w-18 rounded-full">
            {renderImage(file)}
          </div>
        </div>
        <UploadImage
          onUploadSuccess={(imageURL) => setFile(imageURL)}
          onLoadingUpload={(loading) => setDisabledDeleteButton(loading)}
          actionUpload={updateAvatarUser}
          params={{
            userId: user?.id
          }}
        />
        <Button
          classNames="rounded-4xl bg-gray-200 py-[10px] px-[25px] text-sm text-black hover:bg-transparent"
          title="Delete"
          disabled={disabledDeleteButton || isNullAvatar}
          onClick={handleDeleteAvatar}
        />
      </div>
      <form className="w-[70%] mt-5" onSubmit={handleSubmitForm}>
        <InputField.Email
          title="Email"
          maxLength={100}
          disabled
          value={form.email}
          onChange={(value) => onChangeValueInput('email', value)}
        />
        <InputField.Text
          title="Name"
          placeholder="Name..."
          maxLength={100}
          required
          value={form.name}
          minLength={10}
          onChange={(value) => onChangeValueInput('name', value)}
        />
        <InputField.Text
          title="Handle@"
          placeholder="Handle..."
          customIcon={<MdOutlineAlternateEmail />}
          maxLength={100}
          required
          value={form.handle}
          minLength={10}
          onChange={(value) => onChangeValueInput('handle', value)}
        />
        <InputField.Text
          title="Description"
          placeholder="Description..."
          customIcon={<MdOutlineDescription />}
          maxLength={100}
          value={form.description}
          minLength={10}
          onChange={(value) => onChangeValueInput('description', value)}
        />
        <div className="flex justify-end mt-5">
          <Button type="submit" title="Save profile" />
        </div>
      </form>
    </React.Fragment>
  )
}
export default FormEditProfile