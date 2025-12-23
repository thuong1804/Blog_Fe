import { GetUploadSignatureFn } from "@/type/typeProps";

export async function uploadImageToCloud(
    file: File,
    getUploadSignature: GetUploadSignatureFn,
): Promise<string> {
    try {
        const { data } = await getUploadSignature({
            variables: { folder: "blog" },
        });

        if (!data?.getUploadSignature) {
            throw new Error("Upload signature not found");
        }

        const { apiKey, cloudName, timestamp, signature, folder } =
            data.getUploadSignature;

        const formData = new FormData();
        formData.append("file", file);
        formData.append("api_key", apiKey);
        formData.append("timestamp", String(timestamp));
        formData.append("signature", signature);
        if (folder) formData.append("folder", folder);

        const response = await fetch(
            `${process.env.NEXT_PUBLIC_URL_CLOUD}/v1_1/${cloudName}/image/upload`,
            { method: "POST", body: formData },
        );

        if (!response.ok) {
            throw new Error(`Upload failed: ${response.statusText}`);
        }

        const result = await response.json();
        return result.secure_url as string;
    } catch (err) {
        throw err instanceof Error ? err : new Error("Unknown error");
    }
}
