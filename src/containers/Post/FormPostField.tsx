"use client";

import Button from "@/components/Button/Button";
import InputField from "@/components/InputField/InputField";
import SelectField from "@/components/SelectField/SelectField";
import UploadImage from "@/components/UploadImage/UploadImage";
import { GET_ALL_CATEGORIES } from "@/graphql/Query/CategoryQuery";
import { GET_TAGS } from "@/graphql/Query/TagQuery";
import {
    AuthorPageProps,
    FormValuesPost,
    optionProps,
    OptionType,
} from "@/type/typeProps";
import { useQuery } from "@apollo/client";
import Image from "next/image";
import { useMemo, useState } from "react";
import { IoIosCamera } from "react-icons/io";
import {
    MdAccessTime,
    MdOutlineDescription,
    MdOutlineSubtitles,
} from "react-icons/md";
import { MultiValue, SingleValue } from "react-select";
import { toast } from "sonner";

type FormProps = {
    user: AuthorPageProps;
    onSubmit?: (values: FormValuesPost) => void | Promise<void>;
};

const FormPostField = ({ user, onSubmit }: FormProps) => {
    const [form, setForm] = useState<FormValuesPost>({
        title: "",
        description: "",
        readingTime: undefined,
        excerpt: "",
        categoryId: undefined,
        tagIds: [],
        image: "",
    });
    const [file, setFile] = useState<string>("");
    const { data } = useQuery(GET_TAGS);
    const { data: dataCategory } = useQuery(GET_ALL_CATEGORIES);

    const optionTags = useMemo(() => {
        return data?.getTags?.map((tag: optionProps) => ({
            label: tag.name,
            value: tag.id,
        }));
    }, [data]);

    const optionCategories = useMemo(() => {
        return dataCategory?.categories?.map((category: optionProps) => ({
            label: category.name,
            value: category.id,
        }));
    }, [dataCategory]);

    const onChangeValueInput = (fieldName: string, value: string) => {
        setForm((prev) => ({
            ...prev,
            [fieldName]: value,
        }));
    };

    const onChangeTag = (newValues: MultiValue<OptionType>) => {
        const idTags = newValues.map((item) => Number(item.value));

        if (newValues) {
            setForm((prev) => ({
                ...prev,
                tagIds: idTags,
            }));
        }
    };

    const onChangeCategory = (newValue: SingleValue<OptionType>) => {
        if (newValue) {
            setForm((prev) => ({
                ...prev,
                categoryId: +newValue.value,
            }));
        }
    };

    const handleSubmitForm = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        onSubmit?.({
            ...form,
            image: file,
        });
        const modal = document.getElementById(
            "my_modal_1",
        ) as HTMLDialogElement | null;
        if (modal) modal.close();

        try {
            // await updateUserDetail({
            //   variables: {
            //     id: user!.id,
            //     ...form,
            //   },
            // });
        } catch (err) {
            const error = err as Error;
            toast.error(error.message);
        }
    };

    return (
        <div className="w-full">
            <Button
                className="btn bg-[#7c4ee4] text-white border-0"
                onClick={() => {
                    const modal = document.getElementById(
                        "my_modal_1",
                    ) as HTMLDialogElement | null;
                    if (modal) modal.showModal();
                }}
            >
                Information post
            </Button>
            <dialog id="my_modal_1" className="modal">
                <div className="modal-box bg-white  max-w-4xl h-[90%]">
                    <h3 className="font-bold text-2xl text-black">
                        Add information post!
                    </h3>
                    <div className="mt-4">
                        <div className="w-1/4 h-[200px] rounded-2xl bg-gray-600 flex items-center justify-center gap-2 relative">
                            {file ? (
                                <Image
                                    src={file}
                                    alt="thumbnail"
                                    fill
                                    className="object-cover rounded-2xl"
                                />
                            ) : (
                                <>
                                    {" "}
                                    <IoIosCamera className="text-xl" />{" "}
                                    Thumbnail
                                </>
                            )}
                        </div>
                        <div className="flex gap-3 mt-3">
                            <UploadImage
                                // onUploadSuccess={(imageURL) => setFile(imageURL)}
                                // onLoadingUpload={(loading) => setDisabledDeleteButton(loading)}
                                // actionUpload={updateAvatarUser}
                                onUploadSuccess={(imageURL) =>
                                    setFile(imageURL)
                                }
                                title="Upload thumbnail"
                                params={{
                                    userId: user?.user?.id,
                                }}
                            />
                            <Button
                                classNames="rounded-4xl bg-gray-200 py-[10px] px-[25px] text-sm text-black hover:bg-transparent"
                                title="Delete"
                                // disabled={disabledDeleteButton || isNullAvatar}
                                onClick={() => setFile("")}
                            />
                        </div>
                        <form
                            className="w-full mt-3 grid grid-cols-2 gap-5"
                            onSubmit={handleSubmitForm}
                            id="form-post"
                        >
                            <SelectField
                                title="Tags"
                                required
                                onChange={(newValue) =>
                                    onChangeTag(
                                        newValue as MultiValue<OptionType>,
                                    )
                                }
                                isMulti={true}
                                options={optionTags}
                            />
                            <SelectField
                                title="Category"
                                required
                                isMulti={false}
                                onChange={(newValue) =>
                                    onChangeCategory(
                                        newValue as SingleValue<OptionType>,
                                    )
                                }
                                options={optionCategories}
                            />
                            <InputField.Text
                                title="Title"
                                required
                                maxLength={100}
                                customIcon={<MdOutlineSubtitles />}
                                value={form.title}
                                onChange={(value) =>
                                    onChangeValueInput("title", value)
                                }
                            />

                            <InputField.Text
                                title="Description"
                                customIcon={<MdOutlineDescription />}
                                maxLength={100}
                                required
                                value={form.description}
                                minLength={10}
                                onChange={(value) =>
                                    onChangeValueInput("description", value)
                                }
                            />
                            <InputField.Text
                                title="Excerpt"
                                maxLength={100}
                                required
                                customIcon={<MdOutlineDescription />}
                                value={form.excerpt}
                                minLength={10}
                                onChange={(value) =>
                                    onChangeValueInput("excerpt", value)
                                }
                            />
                            <div className="w-[200px]">
                                <InputField.Number
                                    title="Reading time (minutes)"
                                    customIcon={<MdAccessTime />}
                                    value={form.readingTime}
                                    required
                                    placeholder="0"
                                    onChange={(value) =>
                                        onChangeValueInput("readingTime", value)
                                    }
                                />
                            </div>
                            <button
                                type="submit"
                                form="close"
                                className="btn btn-sm transition-transform duration-200 hover:border-1 hover:border-gray-200 text-black hover:bg-white btn-circle btn-ghost absolute right-2 top-2"
                            >
                                ✕
                            </button>
                        </form>
                    </div>
                    <div className="modal-action">
                        <form
                            method="dialog"
                            className="flex items-center gap-3"
                            id="close"
                        >
                            <button className="btn bg-white text-black border-1 border-gray-400">
                                Close
                            </button>
                            <button className="btn" form="form-post">
                                Save
                            </button>
                        </form>
                    </div>
                </div>
            </dialog>
        </div>
    );
};
export default FormPostField;
