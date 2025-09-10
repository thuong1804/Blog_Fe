'use client';

import { useEditor, EditorContent, EditorContext } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import { ImageUploadButton } from '../tiptap-ui/image-upload-button';
import { handleImageUpload, MAX_FILE_SIZE } from '@/lib/tiptap-utils';
import { ImageUploadNode } from '../tiptap-node/image-upload-node';
import { HeadingButton } from '../tiptap-ui/heading-button';
import { ColorHighlightPopover } from '../tiptap-ui/color-highlight-popover';
import { Highlight } from '@tiptap/extension-highlight'
import { BlockquoteButton } from '../tiptap-ui/blockquote-button';
import { ListDropdownMenu } from '../tiptap-ui/list-dropdown-menu';
import { TaskItem } from '@tiptap/extension-list';
import Underline from '@tiptap/extension-underline';
import Superscript from '@tiptap/extension-superscript';
import Subscript from '@tiptap/extension-subscript';
import { MarkButton } from '../tiptap-ui/mark-button';
import { CodeBlockButton } from '../tiptap-ui/code-block-button';

const TiptapEditor = () => {
  const editor = useEditor({
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: 'focus:outline-none',
      },
    },
    extensions: [
      StarterKit,
      Image,
      Highlight.configure({ multicolor: true }),
      TaskItem.configure({ nested: true }),
      Underline,
      Superscript,
      Subscript,
      ImageUploadNode.configure({
        accept: 'image/*',
        maxSize: MAX_FILE_SIZE,
        limit: 3,
        upload: handleImageUpload,
        onError: (error) => console.error('Upload failed:', error),
      }),
    ],
    content: `
      Type here...
     `,
  })

  if (!editor) return

  return (
    <div className="container mx-auto p-4 h-full flex flex-col gap-8">
      <EditorContext.Provider value={{ editor }}>
        <div className='flex items-center justify-between'>
          <ImageUploadButton
            editor={editor}
            hideWhenUnavailable={true}
            showShortcut={false}
          />
          <MarkButton
            editor={editor}
            type="bold"
            hideWhenUnavailable={true}
            showShortcut={false}
          />
          <MarkButton type="italic" />
          <MarkButton type="strike" />
          <MarkButton type="code" />
          <MarkButton type="underline" />
          <MarkButton type="superscript" />
          <MarkButton type="subscript" />
          <CodeBlockButton
            editor={editor}
            hideWhenUnavailable={true}
            showShortcut={false}
          />
          <HeadingButton
            editor={editor}
            level={1}
            hideWhenUnavailable={true}
            showShortcut={false}
          />
          <HeadingButton
            editor={editor}
            level={2}
            hideWhenUnavailable={true}
            showShortcut={false}
          />
          <HeadingButton
            editor={editor}
            level={3}
            hideWhenUnavailable={true}
            showShortcut={false}
          />
          <ColorHighlightPopover
            editor={editor}
            hideWhenUnavailable={true}
            onApplied={({ color, label }) => console.log(`Applied highlight: ${label} (${color})`)}
          />
          <BlockquoteButton
            editor={editor}
            text="Quote"
            hideWhenUnavailable={true}
            showShortcut={false}
          />
          <ListDropdownMenu
            editor={editor}
            types={['bulletList', 'orderedList', 'taskList']}
            hideWhenUnavailable={true}
            portal={false}
            onOpenChange={(isOpen) => console.log('Dropdown opened:', isOpen)}
          />
        </div>
        <EditorContent editor={editor} role="presentation" className='wysiwyg wysiwyg-slate :wysiwyg-2xl w-full max-w-none'/>
      </EditorContext.Provider>
    </div>
  );
};

export default function EditorForm() {
  return <TiptapEditor />;
}
