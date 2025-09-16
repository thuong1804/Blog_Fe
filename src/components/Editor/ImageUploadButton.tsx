import { Editor } from '@tiptap/react'

type ImageUploadButton = {
  editor?: Editor,
  onAddFile: (file: File) => void
}

export default function ImageUploadButton({onAddFile}: ImageUploadButton) {
  console.log(onAddFile)
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onAddFile(file);
  };

  return (
    <div className="mt-2 space-y-2">
      <label className="cursor-pointer inline-block p-2 bg-blue-500 text-white rounded-md">
        Upload Image
        <input
          type="file"
          accept="image/*"
          onChange={handleChange}
          className="hidden"
        />
      </label>
    </div>
  )
}
