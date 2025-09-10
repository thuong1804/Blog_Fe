import Button from "@/components/Button/Button";
import InputField from "@/components/InputField/InputField";
import UploadImage from "@/components/UploadImage/UploadImage";
import { AuthorPageProps } from "@/type/typeProps";
import { useState } from "react";
import { MdAccessTime, MdOutlineDescription, MdOutlineSubtitles } from "react-icons/md";
import { toast } from "sonner";

type FormValues = {
  title: string;
  excerpt: string;
  description: string,
  readingTime: number
};

type FormProps = {
  user: AuthorPageProps,
  onSubmit: (values: FormValues) => void | Promise<void>;
}

const FormPostField = ({ user, onSubmit }: FormProps) => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    readingTime: 0,
    excerpt: "",
  });

  const onChangeValueInput = (fieldName: string, value: string) => {
    setForm((prev) => ({
      ...prev,
      [fieldName]: value
    }))
  }

  const handleSubmitForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    onSubmit(form)

    try {
      // await updateUserDetail({
      //   variables: {
      //     id: user!.id,
      //     ...form,
      //   },
      // });

      toast.success("Upload user success")
    } catch (err) {
      const error = err as Error;
      toast.error(error.message);
    }
  };

  return (
    <div className="w-full">
      {/* Open the modal using document.getElementById('ID').showModal() method */}
      <button
        className="btn"
        onClick={() => {
          const modal = document.getElementById('my_modal_1') as HTMLDialogElement | null;
          if (modal) modal.showModal();
        }}
      >
        open modal
      </button>
      <dialog id="my_modal_1" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Hello!</h3>
          <p className="py-4">Press ESC key or click the button below to close</p>
          <div className="modal-action">
            <form method="dialog">
              {/* if there is a button in form, it will close the modal */}
              <button className="btn">Close</button>
            </form>
          </div>
        </div>
      </dialog>
      <div className="flex">
        <UploadImage
          // onUploadSuccess={(imageURL) => setFile(imageURL)}
          // onLoadingUpload={(loading) => setDisabledDeleteButton(loading)}
          // actionUpload={updateAvatarUser}
          params={{
            userId: user?.user?.id
          }}
        />
        <Button
          classNames="rounded-4xl bg-gray-200 py-[10px] px-[25px] text-sm text-black hover:bg-transparent"
          title="Delete"
          // disabled={disabledDeleteButton || isNullAvatar}
          // onClick={handleDeleteAvatar}
        />
      </div>
     
      <form className="w-full mt-5" onSubmit={handleSubmitForm}>
        <InputField.Text
          title="Title"
          maxLength={100}
          customIcon={<MdOutlineSubtitles />}
          value={form.title}
          onChange={(value) => onChangeValueInput('title', value)}
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
        <InputField.Text
          title="Excerpt"
          maxLength={100}
          customIcon={<MdOutlineDescription />}
          value={form.excerpt}
          minLength={10}
          onChange={(value) => onChangeValueInput('excerpt', value)}
        />
        <div className="w-[150px]">
          <InputField.Number
            title="Reading time (minutes)"
            customIcon={<MdAccessTime />}
            value={form.readingTime}
            onChange={(value) => onChangeValueInput('readingTime', value)}
          />
        </div>
      </form>
    </div>
  )
}
export default FormPostField;