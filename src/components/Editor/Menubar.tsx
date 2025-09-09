'use client'

import React, { useRef } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import TextAlign from '@tiptap/extension-text-align'

export default function EditorWithMenuBar({ onUpdate }) {
  const fileInputRef = useRef(null)

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        // enable/disable sub-extensions if cần
      }),
      Underline,
      Link.configure({
        openOnClick: false,
      }),
      Image,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
    ],
    content: '',
    onUpdate: ({ editor }) => {
      // trả về HTML cho parent nếu cần
      onUpdate?.(editor.getHTML())
    },
    immediatelyRender: false
  })

  if (!editor) return null

  const insertImage = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.onchange = () => {
      const file = input.files?.[0]
      if (file) {
        const previewURL = URL.createObjectURL(file)
        setPendingImages(prev => [...prev, file])
        editor.chain().focus().setImage({ src: previewURL }).run()
      }
    }
    input.click()
  }

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (file) addImage(file)
    e.target.value = ''
  }

  const promptForLink = () => {
    const previousUrl = editor.getAttributes('link').href || ''
    const url = window.prompt('Nhập URL', previousUrl)
    if (url === null) return // cancel
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run()
      return
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
  }

  const toolbarBtn = (props) => {
    // props: { onClick, isActive, title, children }
    const { onClick, isActive, title, children } = props
    return (
      <button
        type="button"
        onClick={onClick}
        title={title}
        className={`p-2 rounded-md hover:bg-gray-100 transition ${isActive ? 'bg-gray-200' : ''
          }`}
      >
        {children}
      </button>
    )
  }

  return (
    <div className="prose w-full">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-2 items-center mb-3 border text-black border-gray-200 rounded-md p-2">
        {/* Formatting */}
        {toolbarBtn({
          onClick: () => editor.chain().focus().toggleBold().run(),
          isActive: editor.isActive('bold'),
          title: 'Bold (Ctrl/Cmd+B)',
          children: <strong>B</strong>,
        })}
        {toolbarBtn({
          onClick: () => editor.chain().focus().toggleItalic().run(),
          isActive: editor.isActive('italic'),
          title: 'Italic (Ctrl/Cmd+I)',
          children: <em>I</em>,
        })}
        {toolbarBtn({
          onClick: () => editor.chain().focus().toggleUnderline().run(),
          isActive: editor.isActive('underline'),
          title: 'Underline',
          children: <span style={{ textDecoration: 'underline' }}>U</span>,
        })}
        {toolbarBtn({
          onClick: () => editor.chain().focus().toggleStrike().run(),
          isActive: editor.isActive('strike'),
          title: 'Strike',
          children: <s>S</s>,
        })}
        {toolbarBtn({
          onClick: () => editor.chain().focus().toggleCode().run(),
          isActive: editor.isActive('code'),
          title: 'Inline code',
          children: <code>{'{}'}</code>,
        })}

        {/* Headings / paragraph */}
        <div className="border-l h-6 mx-2" />
        {toolbarBtn({
          onClick: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
          isActive: editor.isActive('heading', { level: 1 }),
          title: 'Heading 1',
          children: <span>H1</span>,
        })}
        {toolbarBtn({
          onClick: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
          isActive: editor.isActive('heading', { level: 2 }),
          title: 'Heading 2',
          children: <span>H2</span>,
        })}
        {toolbarBtn({
          onClick: () => editor.chain().focus().setParagraph().run(),
          isActive: editor.isActive('paragraph'),
          title: 'Paragraph',
          children: <span>P</span>,
        })}

        {/* Lists */}
        <div className="border-l h-6 mx-2" />
        {toolbarBtn({
          onClick: () => editor.chain().focus().toggleBulletList().run(),
          isActive: editor.isActive('bulletList'),
          title: 'Bullet list',
          children: <span>• List</span>,
        })}
        {toolbarBtn({
          onClick: () => editor.chain().focus().toggleOrderedList().run(),
          isActive: editor.isActive('orderedList'),
          title: 'Numbered list',
          children: <span>1. List</span>,
        })}
        {toolbarBtn({
          onClick: () => editor.chain().focus().toggleTaskList().run(),
          isActive: editor.isActive('taskList'),
          title: 'Task list',
          children: <span>☐ Task</span>,
        })}

        {/* Block */}
        <div className="border-l h-6 mx-2" />
        {toolbarBtn({
          onClick: () => editor.chain().focus().toggleBlockquote().run(),
          isActive: editor.isActive('blockquote'),
          title: 'Blockquote',
          children: <span>❝</span>,
        })}
        {toolbarBtn({
          onClick: () => editor.chain().focus().toggleCodeBlock().run(),
          isActive: editor.isActive('codeBlock'),
          title: 'Code block',
          children: <span>{'</>'}</span>,
        })}
        {toolbarBtn({
          onClick: () => editor.chain().focus().setHorizontalRule().run(),
          title: 'Horizontal rule',
          children: <span>—</span>,
        })}

        {/* Link / Image */}
        <div className="border-l h-6 mx-2" />
        {toolbarBtn({
          onClick: promptForLink,
          isActive: editor.isActive('link'),
          title: 'Add / Edit link',
          children: <span>🔗</span>,
        })}
        {toolbarBtn({
          onClick: () => fileInputRef.current?.click(),
          title: 'Insert image',
          children: <span>🖼️</span>,
        })}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />

        {/* Alignment */}
        <div className="border-l h-6 mx-2" />
        {toolbarBtn({
          onClick: () => editor.chain().focus().setTextAlign('left').run(),
          isActive: editor.isActive({ textAlign: 'left' }),
          title: 'Align left',
          children: <span>≡ L</span>,
        })}
        {toolbarBtn({
          onClick: () => editor.chain().focus().setTextAlign('center').run(),
          isActive: editor.isActive({ textAlign: 'center' }),
          title: 'Align center',
          children: <span>≡ C</span>,
        })}
        {toolbarBtn({
          onClick: () => editor.chain().focus().setTextAlign('right').run(),
          isActive: editor.isActive({ textAlign: 'right' }),
          title: 'Align right',
          children: <span>≡ R</span>,
        })}
        {toolbarBtn({
          onClick: () => editor.chain().focus().setTextAlign('justify').run(),
          isActive: editor.isActive({ textAlign: 'justify' }),
          title: 'Justify',
          children: <span>≡ J</span>,
        })}

        {/* Undo/Redo / Clear */}
        <div className="border-l h-6 mx-2" />
        {toolbarBtn({
          onClick: () => editor.chain().focus().undo().run(),
          title: 'Undo (Ctrl/Cmd+Z)',
          children: <span>↺</span>,
        })}
        {toolbarBtn({
          onClick: () => editor.chain().focus().redo().run(),
          title: 'Redo (Ctrl/Cmd+Y)',
          children: <span>↻</span>,
        })}
        {toolbarBtn({
          onClick: () => editor.chain().focus().clearNodes().unsetAllMarks().run(),
          title: 'Clear formatting',
          children: <span>✖</span>,
        })}
      </div>

      {/* Editor area */}
      <div className="border rounded-md p-4 min-h-[240px] bg-white">
        <EditorContent editor={editor} />
      </div>

      {/* Footer / actions */}
      <div className="flex gap-2 mt-3">
        <button
          onClick={() => {
            const html = editor.getHTML()
            const plain = editor.getText()
            // ví dụ: show console hoặc gửi lên server
            console.log('HTML:', html)
            console.log('Plain text:', plain)
            alert('HTML đã log ra console.')
          }}
          className="px-3 py-1 rounded bg-blue-600 text-white"
        >
          Export HTML (console)
        </button>

        <button
          onClick={() => {
            editor.commands.setContent('<p>Nội dung đã được reset.</p>')
          }}
          className="px-3 py-1 rounded border"
        >
          Reset
        </button>
      </div>
    </div>
  )
}
