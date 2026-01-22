"use client";

import Button from "@/components/Button/Button";
import InputField from "@/components/InputField/InputField";
import SelectField from "@/components/SelectField/SelectField";
import UploadImage from "@/components/UploadImage/UploadImage";
import { GET_ALL_CATEGORIES } from "@/graphql/Query/CategoryQuery";
import { GET_TAGS } from "@/graphql/Query/TagQuery";
import {
    AuthorPageProps,
    CategoryOptionProps,
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
        readingTime: 0,
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
        return dataCategory?.categories
            ?.filter((category: CategoryOptionProps) => category.children?.length)
            .flatMap((category: CategoryOptionProps) =>
                category.children!.map((child: optionProps) => ({
                    label: child.name,
                    value: child.id,
                }))
            );
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
                className="btn bg-[#7c4ee4] text-white border-0 w-full md:w-auto"
                onClick={() => {
                    const modal = document.getElementById(
                        "my_modal_1",
                    ) as HTMLDialogElement | null;
                    if (modal) modal.showModal();
                }}
            >
                Information post
            </Button>

            <dialog id="my_modal_1" className="modal md:modal-middle ">
                <div className="modal-box bg-white w-11/12 max-w-4xl h-[90vh] md:h-auto overflow-y-auto mx-auto">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-xl md:text-2xl text-black">
                            Add information post!
                        </h3>
                        <form method="dialog">
                            <button className="btn btn-sm btn-circle btn-ghost text-black">✕</button>
                        </form>
                    </div>
                    <div className="mt-4">
                        <div className="w-full md:w-1/2 lg:w-1/3 h-50 rounded-2xl bg-gray-600 flex items-center justify-center gap-2 relative overflow-hidden mx-auto md:mx-0">
                            {file ? (
                                <Image
                                    src={file}
                                    alt="thumbnail"
                                    fill
                                    className="object-cover rounded-2xl"
                                />
                            ) : (
                                <div className="flex items-center gap-2 text-white">
                                    <IoIosCamera className="text-xl" />
                                    <span>Thumbnail</span>
                                </div>
                            )}
                        </div>
                        <div className="flex flex-wrap gap-3 mt-3 justify-center md:justify-start">
                            <UploadImage
                                onUploadSuccess={(imageURL) => setFile(imageURL)}
                                title="Upload thumbnail"
                                params={{ userId: user?.user?.id }}
                            />
                            {file && (
                                <Button
                                    classNames="rounded-full bg-gray-200 py-[10px] px-[25px] text-sm text-black hover:bg-gray-300"
                                    title="Delete"
                                    onClick={() => setFile("")}
                                />
                            )}
                        </div>
                        <form
                            className="w-full mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6"
                            onSubmit={handleSubmitForm}
                            id="form-post"
                        >
                            <SelectField
                                title="Tags"
                                required
                                onChange={(newValue) => onChangeTag(newValue as MultiValue<OptionType>)}
                                isMulti={true}
                                options={optionTags}
                            />
                            <SelectField
                                title="Category"
                                required
                                isMulti={false}
                                onChange={(newValue) => onChangeCategory(newValue as SingleValue<OptionType>)}
                                options={optionCategories}
                            />
                            <div className="md:col-span-2">
                                <InputField.Text
                                    title="Title"
                                    required
                                    maxLength={100}
                                    customIcon={<MdOutlineSubtitles />}
                                    value={form.title}
                                    onChange={(value) => onChangeValueInput("title", value)}
                                />
                            </div>
                            <InputField.Text
                                title="Description"
                                customIcon={<MdOutlineDescription />}
                                maxLength={100}
                                required
                                value={form.description}
                                onChange={(value) => onChangeValueInput("description", value)}
                            />
                            <InputField.Text
                                title="Excerpt"
                                maxLength={100}
                                required
                                customIcon={<MdOutlineDescription />}
                                value={form.excerpt}
                                onChange={(value) => onChangeValueInput("excerpt", value)}
                            />
                            <div className="w-full md:w-[240px]">
                                <InputField.Number
                                    title="Reading time (min)"
                                    customIcon={<MdAccessTime />}
                                    value={form.readingTime}
                                    required
                                    placeholder="0"
                                    onChange={(value) => onChangeValueInput("readingTime", value)}
                                />
                            </div>
                        </form>
                    </div>

                    <div className="modal-action mt-8 sticky bottom-0 bg-white pt-4">
                        <form method="dialog" className="flex items-center gap-3 w-full justify-end" id="close">
                            <button className="btn bg-white text-black border-gray-400 flex-1 md:flex-none">
                                Close
                            </button>
                            <button className="btn bg-[#7c4ee4] text-white border-0 flex-1 md:flex-none" form="form-post">
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
