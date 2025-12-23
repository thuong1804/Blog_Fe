import { Editor } from "@tiptap/react";

type ImageUploadButton = {
    editor?: Editor;
    onAddFile: (file: File) => void;
};

export default function ImageUploadButton({ onAddFile }: ImageUploadButton) {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) onAddFile(file);
    };

    return (
        <div className="space-y-2">
            <label className="font-medium text-sm cursor-pointer inline-block p-2  text-gray-700 rounded-md hover:bg-gray-300 transition">
                Upload Image
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleChange}
                    className="hidden"
                />
            </label>
        </div>
    );
}
