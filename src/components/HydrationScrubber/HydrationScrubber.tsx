"use client";

import { useEffect } from "react";

// Attributes injected by browser extensions (ad-blockers, password managers,
// grammar checkers...) BEFORE React hydrates. If left in the DOM, React sees
// server HTML != client DOM and throws "Hydration failed".
// This component strips them on mount and observes future injections.
const EXTENSION_ATTRS = [
    "bis_skin_checked",
    "bis_use",
    "bis_register",
    "data-new-gr-c-s-check-loaded",
    "data-gr-ext-installed",
    "data-grammarly-shadow-root",
];

function scrub(root: ParentNode = document) {
    const selector = EXTENSION_ATTRS.map((a) => `[${a}]`).join(",");
    if (!selector) return;
    root.querySelectorAll(selector).forEach((el) => {
        EXTENSION_ATTRS.forEach((attr) => {
            if (el.hasAttribute(attr)) el.removeAttribute(attr);
        });
    });
    // Some extensions also tag <body> itself
    if (root === document) {
        EXTENSION_ATTRS.forEach((attr) => {
            if (document.body?.hasAttribute(attr)) {
                document.body.removeAttribute(attr);
            }
            if (document.documentElement?.hasAttribute(attr)) {
                document.documentElement.removeAttribute(attr);
            }
        });
    }
}

export default function HydrationScrubber() {
    useEffect(() => {
        scrub();

        const observer = new MutationObserver((mutations) => {
            for (const m of mutations) {
                if (m.type === "attributes") {
                    const attr = m.attributeName || "";
                    if (EXTENSION_ATTRS.includes(attr)) {
                        (m.target as Element).removeAttribute(attr);
                    }
                } else {
                    m.addedNodes.forEach((node) => {
                        if (node instanceof Element) {
                            EXTENSION_ATTRS.forEach((attr) => {
                                if (node.hasAttribute(attr)) {
                                    node.removeAttribute(attr);
                                }
                            });
                            scrub(node);
                        }
                    });
                }
            }
        });

        observer.observe(document.documentElement, {
            attributes: true,
            childList: true,
            subtree: true,
            attributeFilter: EXTENSION_ATTRS,
        });

        return () => observer.disconnect();
    }, []);

    return null;
}
