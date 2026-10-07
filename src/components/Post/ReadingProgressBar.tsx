"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

/**
 * Thin reading-progress bar pinned to the top of the viewport.
 * Rendered via portal into document.body so no ancestor (transform/filter)
 * can hijack its `fixed` positioning. rAF-throttled scroll listener.
 */
const ReadingProgressBar = () => {
    const [progress, setProgress] = useState(0);
    const [mounted, setMounted] = useState(false);
    const rafId = useRef<number | null>(null);

    useEffect(() => {
        setMounted(true);

        const update = () => {
            rafId.current = null;
            const scrollable =
                document.documentElement.scrollHeight - window.innerHeight;
            setProgress(
                scrollable > 0
                    ? Math.min(
                          100,
                          Math.max(0, (window.scrollY / scrollable) * 100),
                      )
                    : 0,
            );
        };

        const onScroll = () => {
            if (rafId.current === null) {
                rafId.current = requestAnimationFrame(update);
            }
        };

        update();
        window.addEventListener("scroll", onScroll, { passive: true });
        window.addEventListener("resize", onScroll);
        return () => {
            window.removeEventListener("scroll", onScroll);
            window.removeEventListener("resize", onScroll);
            if (rafId.current !== null) {
                cancelAnimationFrame(rafId.current);
            }
        };
    }, []);

    // SSR / pre-hydration: document.body doesn't exist — render nothing.
    if (!mounted) return null;

    return createPortal(
        <div
            aria-hidden
            className="fixed inset-x-0 top-0 z-[9999] h-1 bg-slate-900/10"
        >
            <div
                className="h-full bg-gradient-to-r from-indigo-500 via-violet-500 to-lime-400"
                style={{ width: `${progress}%` }}
            />
        </div>,
        document.body,
    );
};

export default ReadingProgressBar;
