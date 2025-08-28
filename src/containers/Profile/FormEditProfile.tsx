'use client'

import Button from "@/components/Button/Button"
import InputField from "@/components/InputField/InputField"
import UploadImage from "@/components/UploadImage/UploadImage";
import { useAuth } from "@/context/AuthContext/AuthContext";
import { UPDATE_USER_DETAIL } from "@/graphql/Mutation/AuthorQuery";
import { useMutation } from "@apollo/client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { MdOutlineAlternateEmail, MdOutlineDescription } from "react-icons/md";

const FormEditProfile = () => {
  const { user } = useAuth()
  const [file, setFile] = useState<File | null>(null);
  const [updateUserDetail] = useMutation(UPDATE_USER_DETAIL)
  const [imgUrl, setImgUrl] = useState('')

  const [form, setForm] = useState({
    email: "",
    avatar: "",
    description: "",
    name: "",
    handle: "",
  });

  useEffect(() => {
    if (user) {
      setForm({
        email: user?.email || "",
        avatar: user?.avatar || "",
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

  const renderImage = (file: File) => {
    if (user?.avatar) {
      return (
          <Image
            src={user?.avatar}
            alt="preview"
            width={64}
            height={64}
            className="rounded-full object-cover"
            unoptimized
          />
      )
    } else if (file && file.type.startsWith("image/")) {
        <Image
          src={URL.createObjectURL(file)}
          alt="preview"
          width={64}
          height={64}
          className="rounded-full object-cover"
          unoptimized
        />
    } else {
      <Image
        src={'/avatar.png'}
        alt="avatar" width={64}
        height={64}
        className="rounded-full object-cover"
      />
    }
  }

  const handleSubmitForm = async () => {
    if (!user?.id) {
      console.error("User ID not found");
      return;
    }

    try {
      const { data: userData } = await updateUserDetail({
        variables: {
          id: user.id,
          image: imgUrl,
          ...form,
        },
      });


      console.log("User updated:", userData);
    } catch (err) {
      console.error("Update failed:", err);
    }
  };

  const handleUploadSuccess = (imgUrl: string) => {
    setImgUrl(imgUrl)
  }

  return (
    <div>
      <div className="flex items-center gap-5">
        <div className="avatar">
          <div className="w-18 rounded-full">
            {renderImage(file)}
          </div>
        </div>
        <UploadImage
          setFile={setFile}
          onChangeSuccess={handleUploadSuccess}
          params={{
            userId: 1
          }}
        />
        <Button classNames="rounded-4xl bg-gray-200 py-[10px] px-[25px] text-sm text-black hover:bg-transparent" title="Delete" onClick={() => setFile(null)} />
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
    </div>
  )
}
export default FormEditProfile