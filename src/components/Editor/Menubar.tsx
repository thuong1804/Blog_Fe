'use client'

import hljs from 'highlight.js'
import React, { ReactNode, useCallback, useEffect, useState } from 'react'
import { FaAlignLeft } from "react-icons/fa";
import { FaAlignCenter, FaAlignRight, FaLink, FaListOl, FaListUl, FaYoutube } from 'react-icons/fa6';
import { FiItalic, FiUnderline } from "react-icons/fi";
import { LuHighlighter, LuStrikethrough } from "react-icons/lu";
import { GrBlockQuote } from "react-icons/gr";
import { GoChecklist, GoMultiSelect } from "react-icons/go";
import { MdHorizontalRule } from "react-icons/md";
import { MdOutlineLinkOff } from 'react-icons/md';
import { PiCodeBlockBold } from "react-icons/pi";
import { Editor, useEditorState } from '@tiptap/react'

import './Editor.scss'
import ImageUploadButton from './ImageUploadButton';

type MenuBarProps = {
  editor: Editor,
  onAddFile: (file:File) => void
}

type ToggleProps = {
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void,
  classname?: string,
  title?: string,
  disabled?: boolean | undefined
  children?: ReactNode
}

const languages = [
  { label: "Auto Detect", value: "" },
  { label: "JavaScript", value: "javascript" },
  { label: "TypeScript", value: "typescript" },
  { label: "CSS", value: "css" },
  { label: "HTML", value: "html" },
  { label: "Python", value: "python" },
];

const Menubar: React.FC<MenuBarProps> = React.memo(function Menubar({ editor, onAddFile }) {
  const [height, setHeight] = useState<number>(480)
  const [width, setWidth] = useState<number>(640)

  const editorState = useEditorState({
    editor,
    selector: ctx => ({
      isLink: ctx.editor.isActive('link'),
    }),
  })

  const setLink = useCallback(() => {
    const previousUrl = editor.getAttributes('link').href
    console.log(previousUrl)
    const url = window.prompt('URL', previousUrl)

    if (url === null) {
      return
    }

    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run()

      return
    }

    try {
      editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
    } catch (e) {
      const err = e as Error
      alert(err.message)
    }
  }, [editor])

  const ToggleButton = ({ onClick, classname, title, disabled, children }: ToggleProps) => {
    return (
      <button
        onClick={onClick}
        className={`cursor-pointer px-3 py-1.5 rounded-md text-xs font-medium transition  text-gray-700 hover:bg-gray-300 ${classname}`}
        disabled={disabled}
      >
        <span className='flex item-center justify-center gap-1'>{children ? children : title}</span>
      </button>
    )
  }

  const addYoutubeVideo = () => {
    const url = prompt('Enter YouTube URL')

    if (url) {
      editor.commands.setYoutubeVideo({
        src: url,
        width: Math.max(320, width),
        height: Math.max(180, height),
      })
    }
  }

  const handleLanguageSelect = (lang: string) => {
    if (lang === "") {
      const code = editor.getText();
      console.log(code)
      const result = hljs.highlightAuto(code, [
        "javascript",
        "typescript",
        "css",
        "html",
        "python",
        "ruby"
      ]);
      lang = result.language || "javascript";
    }
    editor.chain().focus().setCodeBlock({ language: lang }).run();
  };

  useEffect(() => {
    if (editor) {
      editor.commands.focus('end')
    }
  }, [editor])

  return (
    <div className='flex items-center flex-wrap justify-between'>
      <div className="control-group">
        <div className="button-group flex gap-2 items-center text-black flex-wrap">
          <ToggleButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            title='H1'
            classname={editor.isActive('heading', { level: 1 }) ? 'is-active' : ''}
          />
          <ToggleButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            title='H2'
            classname={editor.isActive('heading', { level: 2 }) ? 'is-active' : ''}
          />
          <ToggleButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            title='H3'
            classname={editor.isActive('heading', { level: 3 }) ? 'is-active' : ''}
          />
          <ToggleButton
            onClick={() => editor.chain().focus().setTextAlign('left').run()}
            classname={editor.isActive({ textAlign: 'left' }) ? 'is-active' : ''}
          >
            <FaAlignLeft />
          </ToggleButton>
          <ToggleButton
            onClick={() => editor.chain().focus().setTextAlign('center').run()}
            classname={editor.isActive({ textAlign: 'center' }) ? 'is-active' : ''}
          >
            <FaAlignCenter />
          </ToggleButton>
          <ToggleButton
            onClick={() => editor.chain().focus().setTextAlign('right').run()}
            classname={editor.isActive({ textAlign: 'right' }) ? 'is-active' : ''}
          >
            <FaAlignRight />
          </ToggleButton>
          <ImageUploadButton editor={editor} onAddFile={onAddFile}/>
          <ToggleButton
            onClick={() => editor.chain().focus().toggleBold().run()}
            title='B'
            classname={editor.isActive('bold') ? 'is-active' : ''}
          />
          <ToggleButton
            onClick={() => editor.chain().focus().toggleItalic().run()}
            classname={editor.isActive('italic') ? 'is-active' : ''}
          >
            <FiItalic />
          </ToggleButton>
          <ToggleButton
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            classname={editor.isActive('underline') ? 'is-active' : ''}
          >
            <FiUnderline />
          </ToggleButton>
          <ToggleButton
            onClick={() => editor.chain().focus().toggleStrike().run()}
            classname={editor.isActive('strike') ? 'is-active' : ''}
          >
            <LuStrikethrough />
          </ToggleButton>
          <ToggleButton
            onClick={() => editor.chain().focus().toggleHighlight().run()}
            classname={editor.isActive('highlight') ? 'is-active' : ''}
          >
            Yellow <LuHighlighter />
          </ToggleButton>
          <ToggleButton
            onClick={() => editor.chain().focus().toggleHighlight({ color: '#ffa8a8' }).run()}
            classname={editor.isActive('highlight', { color: '#ffa8a8' }) ? 'is-active' : ''}
          >
            Red <LuHighlighter />
          </ToggleButton>
          <ToggleButton
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            classname={editor.isActive('bulletList') ? 'is-active' : ''}
          >
            <FaListUl />
          </ToggleButton>
          <ToggleButton
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            classname={editor.isActive('orderedList') ? 'is-active' : ''}
          >
            <FaListOl />
          </ToggleButton>
          <ToggleButton
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            classname={editor.isActive('blockquote') ? 'is-active' : ''}
          >
            <GrBlockQuote />
          </ToggleButton>
          <ToggleButton
            onClick={() => editor.chain().focus().toggleTaskList().run()}
            classname={editor.isActive('taskList') ? 'is-active' : ''}
          >
            <GoChecklist />
          </ToggleButton>
          <ToggleButton
            onClick={setLink}
            classname={editorState.isLink ? 'is-active' : ''}
          >
            <FaLink />
          </ToggleButton>
          <ToggleButton
            onClick={() => editor.chain().focus().unsetLink().run()}
            disabled={!editorState.isLink}
          >
            <MdOutlineLinkOff />
          </ToggleButton>
          <ToggleButton
            onClick={() => editor.chain().focus().setHorizontalRule().run()}
          >
            <MdHorizontalRule />
          </ToggleButton>
          <input
            id="width"
            type="number"
            min="320"
            max="1024"
            placeholder="width"
            value={width}
            onChange={e => setWidth(Number(e.target.value))}
            className="w-16 text-sm px-2 py-1 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-100 appearance-none"
          />
          <input
            id="height"
            type="number"
            min="180"
            max="720"
            placeholder="height"
            value={height}
            onChange={e => setHeight(Number(e.target.value))}
            className="w-16 px-2 text-sm py-1 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-100 appearance-none"
          />
          <button id="add" onClick={addYoutubeVideo} className='px-3 py-1.5 rounded-md text-xs font-medium transition  text-gray-700 hover:bg-gray-300 '>
            <FaYoutube />
          </button>
          <ToggleButton
            title='Code block'
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            classname={editor.isActive('codeBlock')
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : undefined}
          >
            <PiCodeBlockBold />
          </ToggleButton>
          <button className="btn px-3 btn m-1 h-[27px] text-xs font-medium rounded-md transition py-1.5
                bg-gray-200 text-gray-700 hover:bg-gray-300 border-0 shadow-none" popoverTarget="popover-1"
            style={{ anchorName: "--anchor-1" } as React.CSSProperties}>
            <GoMultiSelect />
          </button>
          <ul className="dropdown menu w-52 rounded-box bg-white text-black  shadow-sm"
            popover="auto" id="popover-1" style={{ positionAnchor: "--anchor-1" } as React.CSSProperties}>
            {languages.map((lang) => (
              <li key={lang.value} className='hover:bg-gray-500 text-black'>
                <a onClick={() => handleLanguageSelect(lang.value)}>{lang.label}</a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
})
export default Menubar;
