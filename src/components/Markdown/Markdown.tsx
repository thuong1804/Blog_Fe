import React from 'react'
import BlockCode from '../BlockCode/BlockCode'
import ReactMarkdown from "react-markdown";

type MarkDownProps = {
  content?: string
}

export const MarkdownExtra: React.FC<MarkDownProps> = ({ content }) => {
  if (!content) return null

  return (
    <div className="wysiwyg wysiwyg-slate :wysiwyg-2xl w-full max-w-none">
      <ReactMarkdown
        components={{
          code({ className, children, ...rest }) {
            const match = /language-(\w+)/.exec(className || "");
            return match ? (
              <BlockCode match={className}>
                {children}
              </BlockCode>
            ) : (
              <code {...rest} className={className}>
                {children}
              </code>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>

  )
}
