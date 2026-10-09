"use client";

import hljs from "highlight.js";
import React, { ReactNode, useCallback, useEffect, useState } from "react";
import { FaAlignLeft } from "react-icons/fa";
import {
    FaAlignCenter,
    FaAlignRight,
    FaLink,
    FaListOl,
    FaListUl,
    FaYoutube,
} from "react-icons/fa6";
import { FiBold, FiItalic, FiUnderline } from "react-icons/fi";
import { LuHighlighter, LuStrikethrough } from "react-icons/lu";
import { GrBlockQuote } from "react-icons/gr";
import { GoChecklist } from "react-icons/go";
import { MdHorizontalRule } from "react-icons/md";
import { MdOutlineLinkOff } from "react-icons/md";
import { PiCodeBlockBold } from "react-icons/pi";
import { Editor, useEditorState } from "@tiptap/react";

import "./Editor.scss";
import ImageUploadButton from "./ImageUploadButton";

type MenuBarProps = {
    editor: Editor;
    onAddFile: (file: File) => void;
};

type ToggleProps = {
    onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
    className?: string;
    title?: string;
    isActive?: boolean;
    disabled?: boolean;
    children?: ReactNode;
};

const languages = [
    { label: "Auto Detect", value: "" },
    { label: "JavaScript", value: "javascript" },
    { label: "TypeScript", value: "typescript" },
    { label: "CSS", value: "css" },
    { label: "HTML", value: "html" },
    { label: "Python", value: "python" },
];

/** Thin vertical divider between toolbar groups */
const Divider = () => (
    <span className="w-px self-stretch bg-gray-200 mx-1" aria-hidden="true" />
);

const Menubar: React.FC<MenuBarProps> = React.memo(function Menubar({
    editor,
    onAddFile,
}) {
    const [height, setHeight] = useState<number>(480);
    const [width, setWidth] = useState<number>(640);
    const [langOpen, setLangOpen] = useState(false);

    const editorState = useEditorState({
        editor,
        selector: (ctx) => ({
            isLink: ctx.editor.isActive("link"),
        }),
    });

    const setLink = useCallback(() => {
        const previousUrl = editor.getAttributes("link").href;
        const url = window.prompt("URL", previousUrl);
        if (url === null) return;
        if (url === "") {
            editor.chain().focus().extendMarkRange("link").unsetLink().run();
            return;
        }
        try {
            editor
                .chain()
                .focus()
                .extendMarkRange("link")
                .setLink({ href: url })
                .run();
        } catch (e) {
            const err = e as Error;
            alert(err.message);
        }
    }, [editor]);

    const addYoutubeVideo = () => {
        const url = prompt("Enter YouTube URL");
        if (url) {
            editor.commands.setYoutubeVideo({
                src: url,
                width: Math.max(320, width),
                height: Math.max(180, height),
            });
        }
    };

    const handleLanguageSelect = (lang: string) => {
        if (lang === "") {
            const code = editor.getText();
            const result = hljs.highlightAuto(code, [
                "javascript",
                "typescript",
                "css",
                "html",
                "python",
                "ruby",
            ]);
            lang = result.language || "javascript";
        }
        editor.chain().focus().setCodeBlock({ language: lang }).run();
        setLangOpen(false);
    };

    useEffect(() => {
        if (editor) {
            editor.commands.focus("end");
        }
    }, [editor]);

    // Close lang dropdown on outside click
    useEffect(() => {
        if (!langOpen) return;
        const handler = () => setLangOpen(false);
        document.addEventListener("click", handler);
        return () => document.removeEventListener("click", handler);
    }, [langOpen]);

    /** A small toolbar button with tooltip */
    const Btn = ({
        onClick,
        title,
        isActive,
        disabled,
        children,
        className,
    }: ToggleProps) => (
        <button
            type="button"
            onClick={onClick}
            title={title}
            disabled={disabled}
            className={[
                "flex items-center justify-center w-7 h-7 rounded-md text-sm transition-all cursor-pointer",
                "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
                isActive ? "is-active !bg-[#6D28D9] !text-white" : "",
                disabled ? "opacity-30 cursor-not-allowed" : "",
                className ?? "",
            ]
                .filter(Boolean)
                .join(" ")}
        >
            {children}
        </button>
    );

    return (
        <div className="flex flex-wrap items-center gap-y-1.5 gap-x-0.5 px-3 py-2 border-b border-gray-100 bg-gray-50/80 rounded-t-xl">

            {/* ── Headings ── */}
            <Btn
                onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                title="Heading 1"
                isActive={editor.isActive("heading", { level: 1 })}
            >
                <span className="font-black text-[11px] leading-none">H1</span>
            </Btn>
            <Btn
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                title="Heading 2"
                isActive={editor.isActive("heading", { level: 2 })}
            >
                <span className="font-black text-[11px] leading-none">H2</span>
            </Btn>
            <Btn
                onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                title="Heading 3"
                isActive={editor.isActive("heading", { level: 3 })}
            >
                <span className="font-black text-[11px] leading-none">H3</span>
            </Btn>

            <Divider />

            {/* ── Alignment ── */}
            <Btn
                onClick={() => editor.chain().focus().setTextAlign("left").run()}
                title="Align left"
                isActive={editor.isActive({ textAlign: "left" })}
            >
                <FaAlignLeft />
            </Btn>
            <Btn
                onClick={() => editor.chain().focus().setTextAlign("center").run()}
                title="Align center"
                isActive={editor.isActive({ textAlign: "center" })}
            >
                <FaAlignCenter />
            </Btn>
            <Btn
                onClick={() => editor.chain().focus().setTextAlign("right").run()}
                title="Align right"
                isActive={editor.isActive({ textAlign: "right" })}
            >
                <FaAlignRight />
            </Btn>

            <Divider />

            {/* ── Format ── */}
            <Btn
                onClick={() => editor.chain().focus().toggleBold().run()}
                title="Bold"
                isActive={editor.isActive("bold")}
            >
                <FiBold />
            </Btn>
            <Btn
                onClick={() => editor.chain().focus().toggleItalic().run()}
                title="Italic"
                isActive={editor.isActive("italic")}
            >
                <FiItalic />
            </Btn>
            <Btn
                onClick={() => editor.chain().focus().toggleUnderline().run()}
                title="Underline"
                isActive={editor.isActive("underline")}
            >
                <FiUnderline />
            </Btn>
            <Btn
                onClick={() => editor.chain().focus().toggleStrike().run()}
                title="Strikethrough"
                isActive={editor.isActive("strike")}
            >
                <LuStrikethrough />
            </Btn>

            {/* Highlight Yellow */}
            <Btn
                onClick={() => editor.chain().focus().toggleHighlight().run()}
                title="Highlight yellow"
                isActive={editor.isActive("highlight")}
            >
                <span className="relative">
                    <LuHighlighter />
                    <span className="absolute -bottom-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-yellow-400 border border-white" />
                </span>
            </Btn>
            {/* Highlight Red */}
            <Btn
                onClick={() =>
                    editor.chain().focus().toggleHighlight({ color: "#ffa8a8" }).run()
                }
                title="Highlight red"
                isActive={editor.isActive("highlight", { color: "#ffa8a8" })}
            >
                <span className="relative">
                    <LuHighlighter />
                    <span className="absolute -bottom-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-red-400 border border-white" />
                </span>
            </Btn>

            <Divider />

            {/* ── Lists & Blocks ── */}
            <Btn
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                title="Bullet list"
                isActive={editor.isActive("bulletList")}
            >
                <FaListUl />
            </Btn>
            <Btn
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                title="Ordered list"
                isActive={editor.isActive("orderedList")}
            >
                <FaListOl />
            </Btn>
            <Btn
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
                title="Blockquote"
                isActive={editor.isActive("blockquote")}
            >
                <GrBlockQuote />
            </Btn>
            <Btn
                onClick={() => editor.chain().focus().toggleTaskList().run()}
                title="Task list"
                isActive={editor.isActive("taskList")}
            >
                <GoChecklist />
            </Btn>
            <Btn
                onClick={() => editor.chain().focus().setHorizontalRule().run()}
                title="Horizontal rule"
            >
                <MdHorizontalRule />
            </Btn>

            <Divider />

            {/* ── Links ── */}
            <Btn
                onClick={setLink}
                title="Set link"
                isActive={editorState.isLink}
            >
                <FaLink />
            </Btn>
            <Btn
                onClick={() => editor.chain().focus().unsetLink().run()}
                title="Remove link"
                disabled={!editorState.isLink}
            >
                <MdOutlineLinkOff />
            </Btn>

            <Divider />

            {/* ── Insert ── */}
            <ImageUploadButton editor={editor} onAddFile={onAddFile} />

            {/* YouTube with compact size inputs */}
            <div className="flex items-center gap-1">
                <input
                    id="yt-width"
                    type="number"
                    min="320"
                    max="1024"
                    placeholder="W"
                    value={width}
                    onChange={(e) => setWidth(Number(e.target.value))}
                    className="w-12 text-[11px] px-1.5 py-1 rounded border border-gray-200 bg-white focus:outline-none focus:ring-1 focus:ring-[#6D28D9] text-center"
                />
                <input
                    id="yt-height"
                    type="number"
                    min="180"
                    max="720"
                    placeholder="H"
                    value={height}
                    onChange={(e) => setHeight(Number(e.target.value))}
                    className="w-12 text-[11px] px-1.5 py-1 rounded border border-gray-200 bg-white focus:outline-none focus:ring-1 focus:ring-[#6D28D9] text-center"
                />
                <Btn onClick={addYoutubeVideo} title="Embed YouTube video">
                    <FaYoutube className="text-red-500" />
                </Btn>
            </div>

            <Divider />

            {/* ── Code ── */}
            <Btn
                onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                title="Toggle code block"
                isActive={editor.isActive("codeBlock")}
            >
                <PiCodeBlockBold />
            </Btn>

            {/* Language picker */}
            <div className="relative">
                <button
                    type="button"
                    title="Select code language"
                    onClick={(e) => {
                        e.stopPropagation();
                        setLangOpen((v) => !v);
                    }}
                    className="flex items-center gap-1 h-7 px-2 rounded-md text-[11px] font-medium text-gray-600 hover:bg-gray-100 transition-all border border-gray-200 cursor-pointer"
                >
                    Lang
                    <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 10 6">
                        <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                </button>
                {langOpen && (
                    <ul
                        className="absolute top-full left-0 mt-1 z-50 bg-white border border-gray-100 shadow-lg rounded-xl py-1 w-40"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {languages.map((lang) => (
                            <li key={lang.value}>
                                <button
                                    type="button"
                                    onClick={() => handleLanguageSelect(lang.value)}
                                    className="w-full text-left px-3 py-1.5 text-xs text-gray-700 hover:bg-[#6D28D9]/10 hover:text-[#6D28D9] transition-colors cursor-pointer"
                                >
                                    {lang.label}
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
});

export default Menubar;
