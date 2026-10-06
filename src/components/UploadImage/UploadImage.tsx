"use client";

import { GET_UPLOAD_SIGNATURE } from "@/graphql/Mutation/UploadImage";
import { MutationFunction, useMutation } from "@apollo/client";
import { useState } from "react";
import { toast } from "sonner";
import { IoIosCamera } from "react-icons/io";

type PropsUpload<TData, TVariables> = {
    params?: Record<string, string | number | Date | undefined>;
    title?: string;
    onUploadSuccess?: (imageUrl: string) => void;
    onLoadingUpload?: ((loading: boolean) => void) | undefined;
    actionUpload?: MutationFunction<TData, TVariables>;
};

export default function UploadImage<TData, TVariables>({
    onUploadSuccess,
    actionUpload,
    onLoadingUpload,
    params = {},
    title = "Upload image",
}: PropsUpload<TData, TVariables>) {
    const [getUploadSignature] = useMutation(GET_UPLOAD_SIGNATURE);
    const [loading, setLoading] = useState<boolean>(false);

    const MAX_SIZE = 5 * 1024 * 1024; // 5MB
    const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/jpg"];
    const ALLOWED_EXTS = [".png", ".jpeg", ".jpg"];

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0] || null;

        if (!selectedFile) return;

        // Client-side guard (backend signature endpoint must re-check):
        // wrong type or oversized files are rejected before any upload.
        const ext = `.${selectedFile.name.split(".").pop()?.toLowerCase()}`;
        if (
            !ALLOWED_TYPES.includes(selectedFile.type) ||
            !ALLOWED_EXTS.includes(ext)
        ) {
            toast.error("Only JPG, JPEG or PNG images are allowed.");
            e.target.value = "";
            return;
        }
        if (selectedFile.size > MAX_SIZE) {
            toast.error("Image must be smaller than 5MB.");
            e.target.value = "";
            return;
        }

        setLoading(true);
        onLoadingUpload?.(true);

        try {
            const { data } = await getUploadSignature({
                variables: { folder: "blog" },
            });

            const { apiKey, cloudName, timestamp, signature, folder } =
                data.getUploadSignature;

            const formData = new FormData();
            formData.append("file", selectedFile);
            formData.append("api_key", apiKey);
            formData.append("timestamp", String(timestamp));
            formData.append("signature", signature);

            if (folder) formData.append("folder", folder);

            const uploadRes = await fetch(
                `${process.env.NEXT_PUBLIC_URL_CLOUD}/v1_1/${cloudName}/image/upload`,
                {
                    method: "POST",
                    body: formData,
                },
            );

            const uploadData = await uploadRes.json();
            if (!uploadRes.ok) {
                throw new Error("Upload failed");
            }

            const imageUrl = uploadData.secure_url;
            const publicId = uploadData.public_id;

            onUploadSuccess?.(imageUrl);

            const res = await actionUpload?.({
                variables: {
                    ...params,
                    image: imageUrl,
                    publicId: publicId,
                } as TVariables,
            });

            if (res?.data) {
                onLoadingUpload?.(false);
                toast.success("Upload image success");
            }
            setLoading(false);
        } catch {
            setLoading(false);
            onLoadingUpload?.(false);
            toast.error("Image upload failed. Please try again.");
        }
    };

    return (
        <div className="w-max">
            <label
                htmlFor="file-input"
                className={`py-[10px] px-[25px] rounded-4xl text-sm font-medium flex gap-2 items-center border-1 transition-all duration-300 ease-in-out
    ${loading ? "bg-gray-200 text-gray-500 cursor-not-allowed pointer-events-none" : "cursor-pointer hover:shadow-lg hover:scale-105 hover:bg-transparent bg-white border-gray-400 text-black"}
  `}
            >
                <input
                    type="file"
                    id="file-input"
                    className="hidden"
                    accept=".png,.jpeg,.jpg"
                    onChange={handleUpload}
                    disabled={loading}
                />
                {loading ? (
                    <>
                        Uploading{" "}
                        <span className="loading loading-spinner loading-sm"></span>
                    </>
                ) : (
                    <>
                        <IoIosCamera className="text-xl" /> {title}
                    </>
                )}
            </label>
        </div>
    );
}
