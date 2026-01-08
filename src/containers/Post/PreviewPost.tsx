import hljs from "highlight.js";
import { useEffect } from "react";

type PreviewPostPost = {
    content: string;
};

const PreviewPost = ({ content }: PreviewPostPost) => {
    useEffect(() => {
        hljs.highlightAll();
    }, [content]);

    return (
        <div className="w-full flex flex-col gap-3">
            <h3 className="text-(--text-color-title) text-center text-2xl font-medium">
                Preview
            </h3>
            <div className="w-full h-[90%] mt-5 overflow-auto max-w-[580px]">
                <div
                    className="wysiwyg wysiwyg-slate :wysiwyg-2xl tiptap"
                    dangerouslySetInnerHTML={{ __html: content }}
                />
            </div>
        </div>
    );
};
export default PreviewPost;
