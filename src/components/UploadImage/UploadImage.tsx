"use client";

import { GET_UPLOAD_SIGNATURE } from "@/graphql/Mutation/UploadImage";
import { MutationFunction, useMutation } from "@apollo/client";
import { toast } from "sonner";

type UploadImageVariables = {
  image: string;
} & Record<string, number>;

type UploadImageResponse = {
  uploadImage: {
    id: number;
    url: string;
  };
};

type PropsUpload = {
  params: Record<string, number>;
  title?: string,
  onChangeSuccess?: (imageUrl: string) => void,
  setFile: React.Dispatch<React.SetStateAction<File | null>>;
  actionUpload?: MutationFunction<UploadImageResponse, UploadImageVariables>;
};

export default function UploadImage({ onChangeSuccess, actionUpload, params, title = 'Upload image', setFile }: PropsUpload) {
  const [getUploadSignature, { loading: signing }] = useMutation(GET_UPLOAD_SIGNATURE);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile)

    if (!selectedFile) return;

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
        }
      );

      const uploadData = await uploadRes.json();
      if (!uploadRes.ok) {
        throw new Error(uploadData.error?.message || toast.error(uploadData.error?.message));
      }

      const imageUrl = uploadData.secure_url;

      onChangeSuccess?.(imageUrl)

      await actionUpload?.({
        variables: { ...params, image: imageUrl },
      });

      toast.success("Upload image success")

    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error(err.message)
      }
    }
  };

  return (
    <div className="w-max">
      <label
        htmlFor="file-input"
        className="cursor-pointer hover:shadow-lg hover:scale-105
          transition-all duration-300 ease-in-out py-[10px] px-[25px]
          rounded-4xl bg-white border-1 border-gray-400 text-black
          text-sm
          hover:bg-transparent font-medium"
        >
        <input
          type="file"
          id="file-input"
          className="hidden"
          accept=".png,.jpeg,.jpg"
          onChange={handleUpload}
        />
        {signing ? "In progress.." : title}
      </label>
    </div>
  );
}
