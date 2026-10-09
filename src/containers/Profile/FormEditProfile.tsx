"use client";

import Button from "@/components/Button/Button";
import InputField from "@/components/InputField/InputField";
import UploadImage from "@/components/UploadImage/UploadImage";
import { useAuth } from "@/context/AuthContext/AuthContext";
import { UPDATE_USER_DETAIL } from "@/graphql/Mutation/User";
import {
    DELETE_AVATAR_IMAGE,
    UPDATE_AVATAR_IMAGE,
} from "@/graphql/Mutation/UploadImage";
import { renderImage } from "@/utils/render";
import { useMutation } from "@apollo/client";
import React, { useEffect, useMemo, useState } from "react";
import { FaCheck, FaEye, FaLock, FaRotateLeft, FaTrash } from "react-icons/fa6";
import { MdOutlineAlternateEmail, MdOutlineDescription } from "react-icons/md";
import { toast } from "sonner";

const FormEditProfile = () => {
    const { user } = useAuth();
    const [file, setFile] = useState<string | null>(null);
    const [updateUserDetail, { loading: saving }] = useMutation(UPDATE_USER_DETAIL);
    const [updateAvatarUser] = useMutation(UPDATE_AVATAR_IMAGE);
    const [deleteAvatar] = useMutation(DELETE_AVATAR_IMAGE);
    const [disabledDeleteButton, setDisabledDeleteButton] =
        useState<boolean>(false);
    const isNullAvatar = !user?.avatar;

    const [form, setForm] = useState({
        email: "",
        description: "",
        name: "",
        handle: "",
    });

    const onChangeValueInput = (fieldName: string, value: string) => {
        setForm((prev) => ({
            ...prev,
            [fieldName]: value,
        }));
    };

    const handleSubmitForm = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            await updateUserDetail({
                variables: {
                    name: form.name,
                    description: form.description,
                    handle: form.handle,
                },
            });

            toast.success("Upload user success");
        } catch {
            toast.error("Could not save profile. Please try again.");
        }
    };

    const handleDeleteAvatar = async () => {
        if (!user?.id || !user?.avatarPublicId) {
            toast.error("No avatar to delete. Please sign in again.");
            return;
        }
        try {
            await deleteAvatar({
                variables: {
                    publicId: user.avatarPublicId,
                    userId: user.id,
                },
            });
            setFile(null);
            toast.success("Delete avatar success");
        } catch {
            toast.error("Could not delete avatar. Please try again.");
        }
    };

    const handleReset = () => {
        if (!user) return;
        setForm({
            email: user?.email || "",
            description: user?.description || "",
            name: user?.name || "",
            handle: user?.handle || "",
        });
        setFile(user.avatar || null);
    };

    useEffect(() => {
        if (user?.avatar) {
            setFile(user.avatar);
        }
    }, [user]);

    useEffect(() => {
        if (user) {
            setForm({
                email: user?.email || "",
                description: user?.description || "",
                name: user?.name || "",
                handle: user?.handle || "",
            });
        }
    }, [user]);

    const completion = useMemo(() => {
        const checks = [
            !!form.name && form.name.length >= 3,
            !!form.handle && form.handle.length >= 3,
            !!form.description && form.description.length >= 10,
            !!file,
        ];
        const done = checks.filter(Boolean).length;
        return Math.round((done / checks.length) * 100);
    }, [form, file]);

    return (
        <div className="space-y-5">
            {/* Avatar card */}
            <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-6 py-4">
                    <div>
                        <h2 className="text-[15px] font-bold text-slate-900">
                            Profile photo
                        </h2>
                        <p className="text-[13px] text-slate-500">
                            This will be displayed on your articles & comments
                        </p>
                    </div>
                    <span
                        className={`hidden rounded-full px-3 py-1 text-xs font-semibold sm:inline-block ${
                            completion === 100
                                ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
                                : "bg-blue-50 text-blue-700 ring-1 ring-blue-100"
                        }`}
                    >
                        {completion}% complete
                    </span>
                </div>

                <div className="px-6 py-5">
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                        <div
                            className="h-full rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 transition-all duration-500"
                            style={{ width: `${completion}%` }}
                        />
                    </div>

                    <div className="mt-5 flex flex-col gap-5 sm:flex-row sm:items-center">
                        <div className="relative shrink-0">
                            <div className="avatar">
                                <div className="h-20 w-20 overflow-hidden rounded-2xl ring-2 ring-slate-100 [&_img]:h-full [&_img]:w-full [&_img]:rounded-none [&_img]:object-cover">
                                    {renderImage(file)}
                                </div>
                            </div>
                            {file && (
                                <span className="absolute -bottom-1 -right-1 grid h-6 w-6 place-items-center rounded-full bg-emerald-500 text-white ring-2 ring-white">
                                    <FaCheck className="text-[10px]" />
                                </span>
                            )}
                        </div>

                        <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2.5">
                                <UploadImage
                                    onUploadSuccess={(imageURL) =>
                                        setFile(imageURL)
                                    }
                                    onLoadingUpload={(loading) =>
                                        setDisabledDeleteButton(loading)
                                    }
                                    actionUpload={updateAvatarUser}
                                />
                                <Button
                                    classNames="rounded-full bg-slate-100 py-[10px] px-[22px] text-sm font-medium text-slate-700 hover:bg-red-50 hover:text-red-600 border border-transparent hover:border-red-200 shadow-none"
                                    title="Delete"
                                    disabled={
                                        disabledDeleteButton || isNullAvatar
                                    }
                                    onClick={handleDeleteAvatar}
                                >
                                    <span className="flex items-center gap-1.5">
                                        <FaTrash className="text-xs" /> Delete
                                    </span>
                                </Button>
                            </div>
                            <p className="mt-2.5 text-xs leading-relaxed text-slate-400">
                                JPG, JPEG or PNG. Recommended 400×400px, max
                                5MB. Your avatar is public to everyone.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Info card */}
            <form
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
                onSubmit={handleSubmitForm}
            >
                <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-6 py-4">
                    <div>
                        <h2 className="text-[15px] font-bold text-slate-900">
                            Personal information
                        </h2>
                        <p className="text-[13px] text-slate-500">
                            How you appear across TECHNEWS
                        </p>
                    </div>
                    {form.handle && (
                        <a
                            href={`/author/${form.handle}`}
                            target="_blank"
                            className="hidden items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:bg-blue-50 hover:text-blue-700 sm:inline-flex"
                        >
                            <FaEye className="text-xs" /> Preview public profile
                        </a>
                    )}
                </div>

                <div className="space-y-5 px-6 py-6">
                    <div className="relative">
                        <InputField.Email
                            title="Email"
                            maxLength={100}
                            disabled
                            value={form.email}
                            onChange={(value) =>
                                onChangeValueInput("email", value)
                            }
                        />
                        <span className="pointer-events-none absolute right-1 top-0 inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-500">
                            <FaLock className="text-[10px]" /> Locked
                        </span>
                    </div>

                    <div className="grid gap-5 md:grid-cols-2">
                        <InputField.Text
                            title="Name"
                            placeholder="Ex: Thuong Le"
                            maxLength={100}
                            required
                            value={form.name}
                            minLength={10}
                            onChange={(value) =>
                                onChangeValueInput("name", value)
                            }
                        />
                        <InputField.Text
                            title="Handle@"
                            placeholder="Ex: thuong123tvt"
                            customIcon={<MdOutlineAlternateEmail />}
                            maxLength={100}
                            required
                            value={form.handle}
                            minLength={10}
                            onChange={(value) =>
                                onChangeValueInput("handle", value)
                            }
                        />
                    </div>
                    {form.handle && (
                        <p className="-mt-2 text-xs text-slate-400">
                            Your public URL:{" "}
                            <span className="font-medium text-blue-600">
                                /author/{form.handle}
                            </span>
                        </p>
                    )}

                    <InputField.Textarea
                        title="Description"
                        placeholder="Tell readers who you are in 1-2 sentences..."
                        customIcon={<MdOutlineDescription />}
                        maxLength={160}
                        rows={3}
                        value={form.description}
                        onChange={(value) =>
                            onChangeValueInput("description", value)
                        }
                    />
                </div>

                <div className="flex flex-col-reverse gap-3 border-t border-slate-100 bg-slate-50/70 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-xs text-slate-400">
                        Changes are visible immediately after saving.
                    </p>
                    <div className="flex gap-2.5">
                        <Button
                            type="button"
                            onClick={handleReset}
                            classNames="rounded-xl bg-white border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-600 shadow-sm hover:bg-slate-100"
                        >
                            <span className="flex items-center gap-1.5">
                                <FaRotateLeft className="text-xs" /> Reset
                            </span>
                        </Button>
                        <Button
                            type="submit"
                            title={
                                saving ? "Saving..." : "Save changes"
                            }
                            disabled={saving}
                            loading={saving}
                            classNames="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-2.5 text-sm font-semibold shadow-md shadow-blue-600/25"
                        />
                    </div>
                </div>
            </form>
        </div>
    );
};
export default FormEditProfile;
