import Image from "next/image";

// Avatar/image helper — only depends on next/image, safe for SSR.
// Kept separate from sanitize.ts so server components never pull jsdom.

const renderImage = (file: string | null | undefined) => {
    if (file) {
        return (
            <Image
                key={file}
                src={file}
                alt="preview"
                width={64}
                height={64}
                className="rounded-full object-cover"
                unoptimized
            />
        );
    } else {
        return (
            <Image
                src="/default-avatar.jpg"
                alt="default avatar"
                width={64}
                height={64}
                className="rounded-full object-cover"
                unoptimized
            />
        );
    }
};

export { renderImage };
