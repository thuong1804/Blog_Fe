'use client'

import React, { useRef, useState } from 'react';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { atomOneDark } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { FaRegCopy } from "react-icons/fa"

type BlockProps = {
  children: React.ReactNode;
  match?: string;
};

const BlockCode: React.FC<BlockProps> = ({ children, match }) => {
  const [isCopy, setIsCopy] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const codeString = typeof children === 'string' ? children : Array.isArray(children) ? children.join('') : '';

  const handleClickCopyText = (content: string) => {
    navigator.clipboard.writeText(content);
    setIsCopy(true);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      setIsCopy(false);
    }, 2000);
  }

  return (
    <div className='relative'>
      <SyntaxHighlighter language={match} style={atomOneDark} wrapLongLines={true} PreTag='div'>
        {codeString.trim()}
      </SyntaxHighlighter>
      <div onClick={() => handleClickCopyText(codeString.trim())} className='absolute top-0 right-2 p-2 bg-gray-600 rounded-[7px]
        hover:bg-gray-400 hover:scale-110 hover:shadow-md
        transition-all duration-300 ease-in-out cursor-pointer'>
        {isCopy ? (
          <span className="text-green-600 text-sm ml-2 transition-opacity duration-300">
            ✅ Copied!
          </span>
        ) : (
          <FaRegCopy className='text-white text-[20px] hover:text-black transition-colors duration-300' />
        )}
      </div>
    </div>
  );
};

export default BlockCode;
