"use client";

import {
    forwardRef,
    useEffect,
    useImperativeHandle,
    useRef,
} from "react";
import styles from "./CommentSection.module.css";

export type CommentEditorHandle = {
    getHtml: () => string;
    isEmpty: () => boolean;
    clear: () => void;
    focus: () => void;
};

type CommentEditorProps = {
    initialHtml?: string;
    placeholder?: string;
    autoFocus?: boolean;
    onInput?: (html: string, text: string) => void;
    onSubmitShortcut?: () => void;
};

/**
 * Minimal rich-text editor for comments (contentEditable).
 * Toolbar applies real formatting in place — no markdown markers.
 * Paste is forced to plain text so stored HTML stays clean.
 */
const CommentEditor = forwardRef<CommentEditorHandle, CommentEditorProps>(
    function CommentEditor(
        { initialHtml = "", placeholder, autoFocus, onInput, onSubmitShortcut },
        ref,
    ) {
        const areaRef = useRef<HTMLDivElement>(null);

        useImperativeHandle(ref, () => ({
            getHtml: () => areaRef.current?.innerHTML ?? "",
            isEmpty: () =>
                (areaRef.current?.textContent || "").trim().length === 0,
            clear: () => {
                if (areaRef.current) areaRef.current.innerHTML = "";
                onInput?.("", "");
            },
            focus: () => areaRef.current?.focus(),
        }));

        // Set initial content once on mount (edit mode).
        useEffect(() => {
            if (areaRef.current && initialHtml && !areaRef.current.innerHTML) {
                areaRef.current.innerHTML = initialHtml;
            }
            if (autoFocus) areaRef.current?.focus();
            // Mount-only on purpose: later prop changes must not clobber typing.
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, []);

        const apply = (command: string, value?: string) => {
            areaRef.current?.focus();
            // execCommand is deprecated but remains the only cross-browser
            // way to apply inline formatting inside contentEditable.
            document.execCommand(command, false, value);
            emit();
        };

        const emit = () => {
            const el = areaRef.current;
            if (!el) return;
            onInput?.(el.innerHTML, el.textContent || "");
        };

        const pastePlainText = (
            event: React.ClipboardEvent<HTMLDivElement>,
        ) => {
            event.preventDefault();
            const text = event.clipboardData.getData("text/plain");
            document.execCommand("insertText", false, text);
            emit();
        };

        const tools = [
            { label: "B", title: "Bold", run: () => apply("bold") },
            { label: "I", title: "Italic", run: () => apply("italic") },
            {
                label: "“”",
                title: "Quote",
                run: () => apply("formatBlock", "blockquote"),
            },
            {
                label: "•–",
                title: "Bullet list",
                run: () => apply("insertUnorderedList"),
            },
        ];

        return (
            <div>
                <div
                    ref={areaRef}
                    contentEditable
                    suppressContentEditableWarning
                    role="textbox"
                    aria-multiline
                    data-placeholder={placeholder || "Share your thoughts..."}
                    className={styles.editable}
                    onInput={emit}
                    onPaste={pastePlainText}
                    onKeyDown={(e) => {
                        if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
                            e.preventDefault();
                            onSubmitShortcut?.();
                        }
                    }}
                />
                <div
                    className={styles.toolbar}
                    role="toolbar"
                    aria-label="Formatting"
                    onMouseDown={(e) => e.preventDefault()}
                >
                    {tools.map((tool) => (
                        <button
                            key={tool.title}
                            type="button"
                            title={tool.title}
                            className={styles.toolButton}
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={tool.run}
                        >
                            {tool.label}
                        </button>
                    ))}
                </div>
            </div>
        );
    },
);

export default CommentEditor;
