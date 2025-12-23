import React from "react";
import BlockCode from "../BlockCode/BlockCode";
import ReactMarkdown from "react-markdown";

type MarkDownProps = {
    content?: string;
};

export const MarkdownExtra: React.FC<MarkDownProps> = ({ content }) => {
    if (!content) return null;

    return (
        <div className="wysiwyg wysiwyg-slate :wysiwyg-2xl w-full max-w-none tiptap">
            <ReactMarkdown
                components={{
                    code({ node, className, children, ...props }) {
                        console.log(node, className, children);
                        const match = /language-(\w+)/.exec(className || "");

                        if (match) {
                            return (
                                <BlockCode match={className}>
                                    {String(children).replace(/\n$/, "")}
                                </BlockCode>
                            );
                        }

                        return (
                            <code className={className} {...props}>
                                {children}
                            </code>
                        );
                    },
                }}
            >
                {content}
            </ReactMarkdown>
        </div>
    );
};
