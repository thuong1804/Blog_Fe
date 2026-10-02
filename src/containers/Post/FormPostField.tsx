"use client";

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
import { useEffect, useMemo, useState } from "react";
import { IoIosCamera, IoIosTrash } from "react-icons/io";
import {
    MdAccessTime,
    MdOutlineDescription,
    MdOutlineSubtitles,
    MdOutlineCategory,
    MdEdit,
} from "react-icons/md";
import { MultiValue, SingleValue } from "react-select";

type FormProps = {
    user: AuthorPageProps;
    onSubmit?: (values: FormValuesPost) => void | Promise<void>;
    initialData?: Partial<FormValuesPost>;
    initialImage?: string;
    buttonTitle?: string;
    modalTitle?: string;
};

const FormPostField = ({
    user,
    onSubmit,
    initialData,
    initialImage,
    buttonTitle = "Information post",
    modalTitle = "Post Information",
}: FormProps) => {
    const [form, setForm] = useState<FormValuesPost>({
        title: initialData?.title || "",
        description: initialData?.description || "",
        readingTime: initialData?.readingTime || 0,
        excerpt: initialData?.excerpt || "",
        categoryId: initialData?.categoryId,
        tagIds: initialData?.tagIds || [],
        image: initialImage || initialData?.image || "",
    });
    const [file, setFile] = useState<string>(
        initialImage || initialData?.image || ""
    );
    const { data } = useQuery(GET_TAGS);
    const { data: dataCategory } = useQuery(GET_ALL_CATEGORIES);

    const optionTags = useMemo(() => {
        return data?.getTags?.map((tag: optionProps) => ({
            label: tag.name,
            value: String(tag.id),
        }));
    }, [data]);

    const optionCategories = useMemo(() => {
        return dataCategory?.categories
            ?.filter((category: CategoryOptionProps) => category.children?.length)
            .flatMap((category: CategoryOptionProps) =>
                category.children!.map((child: optionProps) => ({
                    label: child.name,
                    value: String(child.id),
                }))
            );
    }, [dataCategory]);

    useEffect(() => {
        if (initialData) {
            setForm((prev) => ({
                ...prev,
                title: initialData.title ?? prev.title,
                description: initialData.description ?? prev.description,
                readingTime: initialData.readingTime ?? prev.readingTime,
                excerpt: initialData.excerpt ?? prev.excerpt,
                categoryId: initialData.categoryId ?? prev.categoryId,
                tagIds: initialData.tagIds ?? prev.tagIds,
                image: initialImage || initialData.image || prev.image,
            }));
        }
        if (initialImage || initialData?.image) {
            setFile(initialImage || initialData?.image || "");
        }
    }, [initialData, initialImage]);

    const selectedTagValues = useMemo(() => {
        if (!optionTags || !form.tagIds?.length) return [];
        return optionTags.filter((opt: OptionType) =>
            form.tagIds?.includes(Number(opt.value))
        );
    }, [optionTags, form.tagIds]);

    const selectedCategoryValue = useMemo(() => {
        if (!optionCategories || !form.categoryId) return null;
        return (
            optionCategories.find(
                (opt: OptionType) => Number(opt.value) === Number(form.categoryId)
            ) || null
        );
    }, [optionCategories, form.categoryId]);

    const selectedCategoryName = selectedCategoryValue?.label;
    const selectedTagNames = selectedTagValues.map((t: OptionType) => t.label);

    const onChangeValueInput = (fieldName: string, value: string | number) => {
        setForm((prev) => ({
            ...prev,
            [fieldName]: value,
        }));
    };

    const onChangeTag = (newValues: MultiValue<OptionType>) => {
        const idTags = newValues.map((item) => Number(item.value));
        setForm((prev) => ({
            ...prev,
            tagIds: idTags,
        }));
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
    };

    const openModal = () => {
        const modal = document.getElementById(
            "my_modal_1",
        ) as HTMLDialogElement | null;
        if (modal) modal.showModal();
    };

    const hasInfo = Boolean(form.title || file || form.categoryId || form.tagIds?.length);

    return (
        <div className="w-full">
            {/* ── Outer Summary Bar ── */}
            {hasInfo ? (
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3 bg-gradient-to-r from-purple-50/60 via-white to-purple-50/40 rounded-2xl border border-purple-100 shadow-xs hover:border-purple-200 transition-all">
                    <div className="flex items-center gap-3.5 min-w-0 flex-1">
                        {/* Thumbnail mini preview */}
                        <div className="w-14 h-14 rounded-xl overflow-hidden relative shrink-0 border border-purple-200/70 bg-purple-50 flex items-center justify-center shadow-xs">
                            {file ? (
                                <Image
                                    src={file}
                                    alt="thumbnail"
                                    fill
                                    className="object-cover"
                                />
                            ) : (
                                <IoIosCamera className="text-2xl text-purple-400" />
                            )}
                        </div>

                        {/* Title and badges */}
                        <div className="flex flex-col min-w-0 flex-1">
                            <h4 className="font-bold text-gray-800 text-sm sm:text-base truncate leading-snug">
                                {form.title || "Untitled Post"}
                            </h4>
                            <div className="flex flex-wrap items-center gap-1.5 mt-1">
                                {selectedCategoryName && (
                                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#6D28D9]/10 text-[#6D28D9]">
                                        <MdOutlineCategory className="text-xs" />
                                        {selectedCategoryName}
                                    </span>
                                )}
                                {selectedTagNames.slice(0, 2).map((name: string) => (
                                    <span
                                        key={name}
                                        className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-gray-100 text-gray-600"
                                    >
                                        #{name}
                                    </span>
                                ))}
                                {selectedTagNames.length > 2 && (
                                    <span className="text-[11px] text-gray-400 font-medium">
                                        +{selectedTagNames.length - 2} more
                                    </span>
                                )}
                                {form.readingTime ? (
                                    <span className="inline-flex items-center gap-1 text-xs text-gray-500 ml-1">
                                        <MdAccessTime className="text-gray-400" />
                                        {form.readingTime} min read
                                    </span>
                                ) : null}
                            </div>
                        </div>
                    </div>

                    {/* Action button */}
                    <button
                        type="button"
                        onClick={openModal}
                        className="btn btn-sm bg-[#6D28D9] hover:bg-[#4C1D95] text-white border-0 rounded-xl px-4 font-semibold shadow-sm flex items-center gap-1.5 shrink-0 active:scale-95 transition-all"
                    >
                        <MdEdit size={14} />
                        {buttonTitle}
                    </button>
                </div>
            ) : (
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3.5 bg-gradient-to-r from-purple-50/80 to-indigo-50/50 rounded-2xl border border-dashed border-purple-200">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#6D28D9]/10 flex items-center justify-center text-[#6D28D9] text-lg shrink-0">
                            ✨
                        </div>
                        <div>
                            <p className="font-semibold text-gray-800 text-sm">Post details not configured</p>
                            <p className="text-xs text-gray-500">Set title, thumbnail, category, tags & SEO description</p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={openModal}
                        className="btn btn-sm bg-[#6D28D9] hover:bg-[#4C1D95] text-white border-0 rounded-xl px-4 font-semibold shadow-sm flex items-center gap-1.5 shrink-0 active:scale-95 transition-all"
                    >
                        + Add Information
                    </button>
                </div>
            )}

            {/* ── Modal Dialog ── */}
            <dialog id="my_modal_1" className="modal modal-middle backdrop-blur-xs">
                <div className="modal-box bg-white w-11/12 max-w-4xl p-6 sm:p-8 rounded-3xl shadow-2xl border border-gray-100 max-h-[90vh] overflow-y-auto">
                    {/* Modal Header */}
                    <div className="flex justify-between items-start pb-4 border-b border-gray-100 mb-6">
                        <div>
                            <h3 className="font-bold text-xl sm:text-2xl text-gray-900 flex items-center gap-2">
                                <span className="text-[#6D28D9]">⚙️</span> {modalTitle}
                            </h3>
                            <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                                Set up metadata, thumbnail, category, tags, and summary for your post
                            </p>
                        </div>
                        <form method="dialog">
                            <button className="btn btn-sm btn-circle btn-ghost text-gray-400 hover:text-gray-700 hover:bg-gray-100">
                                ✕
                            </button>
                        </form>
                    </div>

                    {/* Modal Body Form */}
                    <form onSubmit={handleSubmitForm} id="form-post">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                            {/* Left Column: Thumbnail + Quick Settings (5 cols) */}
                            <div className="lg:col-span-5 flex flex-col gap-4">
                                <div className="flex flex-col gap-2">
                                    <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                                        Post Thumbnail
                                    </label>
                                    <div className="w-full aspect-video rounded-2xl bg-gray-50 border-2 border-dashed border-gray-200 overflow-hidden relative flex items-center justify-center group transition-all">
                                        {file ? (
                                            <>
                                                <Image
                                                    src={file}
                                                    alt="thumbnail"
                                                    fill
                                                    className="object-cover"
                                                />
                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                                    <button
                                                        type="button"
                                                        onClick={() => setFile("")}
                                                        className="btn btn-xs bg-red-500 hover:bg-red-600 text-white border-0 rounded-lg px-2.5 flex items-center gap-1 shadow-md"
                                                    >
                                                        <IoIosTrash size={14} /> Remove
                                                    </button>
                                                </div>
                                            </>
                                        ) : (
                                            <div className="flex flex-col items-center justify-center text-gray-400 p-4 text-center">
                                                <IoIosCamera className="text-4xl text-gray-300 mb-1" />
                                                <span className="text-xs font-medium text-gray-500">16:9 banner image</span>
                                                <span className="text-[11px] text-gray-400 mt-0.5">Recommended 1200x675</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-2 mt-1">
                                        <UploadImage
                                            onUploadSuccess={(imageURL) => setFile(imageURL)}
                                            title="Upload Thumbnail"
                                            params={{ userId: user?.user?.id }}
                                        />
                                        {file && (
                                            <button
                                                type="button"
                                                onClick={() => setFile("")}
                                                className="btn btn-sm bg-gray-100 hover:bg-red-50 text-gray-600 hover:text-red-500 border-0 rounded-full px-3 text-xs flex items-center gap-1"
                                            >
                                                <IoIosTrash size={14} /> Clear
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {/* Category */}
                                <div className="mt-1">
                                    <SelectField
                                        title="Category"
                                        required
                                        isMulti={false}
                                        onChange={(newValue) => onChangeCategory(newValue as SingleValue<OptionType>)}
                                        options={optionCategories}
                                        value={selectedCategoryValue}
                                    />
                                </div>

                                {/* Tags */}
                                <div>
                                    <SelectField
                                        title="Tags"
                                        required
                                        onChange={(newValue) => onChangeTag(newValue as MultiValue<OptionType>)}
                                        isMulti={true}
                                        options={optionTags}
                                        value={selectedTagValues}
                                    />
                                </div>

                                {/* Reading Time */}
                                <div className="w-full">
                                    <InputField.Number
                                        title="Reading time (minutes)"
                                        customIcon={<MdAccessTime />}
                                        value={form.readingTime}
                                        required
                                        placeholder="5"
                                        onChange={(value) => onChangeValueInput("readingTime", Number(value))}
                                    />
                                </div>
                            </div>

                            {/* Right Column: Title, Description, Excerpt (7 cols) */}
                            <div className="lg:col-span-7 flex flex-col gap-4">
                                <div>
                                    <InputField.Text
                                        title="Post Title"
                                        required
                                        maxLength={150}
                                        placeholder="Enter an engaging title for your post..."
                                        customIcon={<MdOutlineSubtitles />}
                                        value={form.title}
                                        onChange={(value) => onChangeValueInput("title", value)}
                                    />
                                </div>

                                <div>
                                    <InputField.Textarea
                                        title="Description (SEO / Overview)"
                                        customIcon={<MdOutlineDescription />}
                                        maxLength={350}
                                        rows={3}
                                        required
                                        placeholder="Write a clear description of your post (press Enter to create new lines)..."
                                        value={form.description}
                                        onChange={(value) => onChangeValueInput("description", value)}
                                    />
                                </div>

                                <div>
                                    <InputField.Textarea
                                        title="Excerpt (Short Summary)"
                                        maxLength={350}
                                        rows={3}
                                        required
                                        customIcon={<MdOutlineDescription />}
                                        placeholder="Brief summary to highlight in previews and cards (supports multiline)..."
                                        value={form.excerpt}
                                        onChange={(value) => onChangeValueInput("excerpt", value)}
                                    />
                                </div>
                            </div>
                        </div>
                    </form>

                    {/* Modal Footer Actions */}
                    <div className="modal-action mt-8 pt-4 border-t border-gray-100 flex items-center justify-end gap-3 sticky bottom-0 bg-white">
                        <form method="dialog">
                            <button className="btn bg-gray-100 hover:bg-gray-200 text-gray-700 border-0 rounded-xl px-5 font-semibold">
                                Cancel
                            </button>
                        </form>
                        <button
                            type="submit"
                            form="form-post"
                            className="btn bg-[#6D28D9] hover:bg-[#4C1D95] text-white border-0 rounded-xl px-7 font-bold shadow-lg shadow-purple-500/20 active:scale-95 transition-all"
                        >
                            Save Information
                        </button>
                    </div>
                </div>
            </dialog>
        </div>
    );
};

export default FormPostField;
