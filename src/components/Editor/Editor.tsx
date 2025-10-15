'use client';

import { useEditor, EditorContent, Editor } from '@tiptap/react';
import { RefObject, useCallback, useEffect } from 'react';
import Blockquote from '@tiptap/extension-blockquote'
import StarterKit from '@tiptap/starter-kit';
import Document from '@tiptap/extension-document'
import Image from '@tiptap/extension-image';
import Heading from '@tiptap/extension-heading'
import HorizontalRule from '@tiptap/extension-horizontal-rule'
import Paragraph from '@tiptap/extension-paragraph'
import Youtube from '@tiptap/extension-youtube'
import Bold from '@tiptap/extension-bold'
import Highlight from '@tiptap/extension-highlight'
import Italic from '@tiptap/extension-italic'
import Strike from '@tiptap/extension-strike'
import { ListItem, OrderedList, TaskItem, TaskList } from '@tiptap/extension-list';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align'
import Superscript from '@tiptap/extension-superscript';
import Subscript from '@tiptap/extension-subscript';
import Link from '@tiptap/extension-link';
import { all, createLowlight } from 'lowlight';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';

import Menubar from './Menubar';
import './Editor.scss'

type EditorProps = {
  setContentPost: React.Dispatch<React.SetStateAction<string>>,
  onAddFile: (file: File) => void,
  editorRef: RefObject<Editor | null>
}

const TiptapEditor = ({ setContentPost, editorRef, onAddFile }: EditorProps) => {
  const lowlight = createLowlight(all)

  const editor = useEditor({
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: 'focus:outline-none',
      },
    },
    extensions: [
      StarterKit,
      Document,
      ListItem,
      Paragraph,
      HorizontalRule,
      Blockquote,
      Bold,
      Image,
      OrderedList,
      Underline,
      Strike,
      Link,
      Italic,
      Highlight.configure({ multicolor: true }),
      Heading.configure({
        levels: [1, 2, 3],
      }),
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
      Youtube.configure({
        controls: false,
        nocookie: true,
      }),
      Link.configure({
        openOnClick: false,
        autolink: true,
        defaultProtocol: 'https',
        protocols: ['http', 'https'],
        isAllowedUri: (url, ctx) => {
          try {
            const parsedUrl = url.includes(':') ? new URL(url) : new URL(`${ctx.defaultProtocol}://${url}`)

            if (!ctx.defaultValidate(parsedUrl.href)) {
              return false
            }
            // disallowed protocols
            const disallowedProtocols = ['ftp', 'file', 'mailto']
            const protocol = parsedUrl.protocol.replace(':', '')

            if (disallowedProtocols.includes(protocol)) {
              return false
            }

            const allowedProtocols = ctx.protocols.map(p => (typeof p === 'string' ? p : p.scheme))

            if (!allowedProtocols.includes(protocol)) {
              return false
            }

            // disallowed domains
            const disallowedDomains = ['example-phishing.com', 'malicious-site.net']
            const domain = parsedUrl.hostname

            if (disallowedDomains.includes(domain)) {
              return false
            }

            return true
          } catch {
            return false
          }
        },
        shouldAutoLink: url => {
          try {
            // construct URL
            const parsedUrl = url.includes(':') ? new URL(url) : new URL(`https://${url}`)

            // only auto-link if the domain is not in the disallowed list
            const disallowedDomains = ['example-no-autolink.com', 'another-no-autolink.com']
            const domain = parsedUrl.hostname

            return !disallowedDomains.includes(domain)
          } catch {
            return false
          }
        },
      }),
      Underline,
      Superscript,
      Subscript,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      CodeBlockLowlight.configure({
        lowlight,
        languageClassPrefix: 'language-',
      }),
    ],
  })

  const renderMenuBar = useCallback(() => {
    return editor ? <Menubar editor={editor} onAddFile={onAddFile} /> : null
  }, [editor])

  useEffect(() => {
    if (editorRef) editorRef.current = editor;
  }, [editor]);

  if (!editor) return

  editor.on('update', ({ editor }) => {
    const html = editor.getHTML()
    setContentPost(html)
  })

  return (
    <div className='w-full p-3 '>
      {renderMenuBar()}
      <EditorContent editor={editor} className='wysiwyg wysiwyg-slate :wysiwyg-2xl w-full max-w-none mt-3' />
    </div>
  );
};

export default function EditorForm({ setContentPost, onAddFile, editorRef }: EditorProps) {
  return <TiptapEditor setContentPost={setContentPost} onAddFile={onAddFile} editorRef={editorRef} />;
}
