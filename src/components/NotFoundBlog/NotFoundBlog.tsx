import Image from "next/image";

const NotFoundBlog = () => {
    return (
        <div className="
            w-full
            flex
            flex-col
            items-center
            justify-center
            gap-3
            py-12
            sm:py-16
            text-center
            text-gray-400
        ">
            <div className="relative w-[220px] h-[220px] sm:w-[300px] sm:h-[300px] lg:w-[400px] lg:h-[400px]">
                <Image
                    alt="not found"
                    src="/images/no-result.png"
                    fill
                    sizes="(max-width: 640px) 220px,
                           (max-width: 1024px) 300px,
                           400px"
                    className="object-contain"
                    priority={false}
                />
            </div>

            <p className="text-base sm:text-lg font-medium">
                No posts found
            </p>

            <p className="text-sm sm:text-base">
                Try selecting a different category.
            </p>
        </div>
    );
};

export default NotFoundBlog;
