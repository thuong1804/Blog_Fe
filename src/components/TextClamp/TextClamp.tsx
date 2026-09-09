'use client'

import React, { useRef, useState, useEffect, ElementType  } from 'react';
import { twMerge } from 'tailwind-merge';

type TextClampProps = {
    text: string;
    maxLines?: number;
    className?: string;
    as?: ElementType;
    tooltip?: boolean;
};

const TextClamp: React.FC<TextClampProps> = ({
    text,
    maxLines = 2,
    className = '',
    as: Tag = 'p',
    tooltip = false,
}) => {
    const textRef = useRef<HTMLElement>(null);
    const [isClamped, setIsClamped] = useState(false);

    useEffect(() => {
        const el = textRef.current;
        if (el) {
            setIsClamped(el.scrollHeight > el.clientHeight);
        }
    }, [text]);

    const showTooltip = tooltip && isClamped;

    return (
        <div className={showTooltip ? 'tooltip tooltip-bottom text-left' : ''} data-tip={showTooltip ? text : undefined}>
            <Tag
                ref={textRef as React.Ref<HTMLElement>}
                className={twMerge('break-words overflow-hidden', className)}
                style={{
                    display: '-webkit-box',
                    WebkitLineClamp: maxLines,
                    WebkitBoxOrient: 'vertical',
                    minHeight: `${maxLines}lh`,
                }}
            >
                {text}
            </Tag>
        </div>
    );
};

export default TextClamp;
