import CardAbout from "@/containers/About/CardAbout";
import Image from "next/image";

const AboutPage = () => {
    return (
        <div className="w-full pb-16 pt-10 px-5">
            <div className="max-w-(--max-width-desktop) mx-auto">
                {/* HERO */}
                <div className="flex flex-col items-center">
                    <h4 className="text-center text-sm lg:text-base">
                        ABOUT US
                    </h4>

                    <h1 className="max-w-[650px] text-center mt-4
                                   text-2xl leading-snug
                                   md:text-3xl
                                   lg:text-4xl lg:leading-tight">
                        Creative Blog Writing and Publishing Site
                    </h1>

                    <p className="max-w-[1000px] text-center mt-4
                                  text-sm leading-6
                                  md:text-base">
                        Leverage agile frameworks to provide a robust synopsis
                        for high level overviews. Iterative approaches to
                        corporate strategy foster collaborative thinking to
                        further the overall value proposition. Organically grow
                        the holistic world view of disruptive innovation via
                        workplace diversity and empowerment.
                    </p>

                    <div className="relative w-full mt-12
                                    h-[220px]
                                    md:h-[320px]
                                    lg:h-[500px]">
                        <Image
                            src="/images/image-about.jpg"
                            alt="about"
                            fill
                            priority
                            className="object-cover rounded-xl"
                        />
                    </div>
                </div>

                {/* HOW WE WORK */}
                <h4 className="mt-14 text-sm lg:text-base">
                    HOW WE WORK
                </h4>

                <div className="mt-5
                                flex flex-col gap-4
                                lg:flex-row lg:items-end lg:justify-between">
                    <h1 className="max-w-[500px]
                                   text-xl leading-snug
                                   md:text-2xl
                                   lg:text-3xl lg:leading-tight">
                        I will show you how our team works
                    </h1>

                    <p className="text-sm md:text-base">
                        Bring to the table win-win market strategies to ensure
                        <br className="hidden lg:block" />
                        perfect articles.
                    </p>
                </div>

                {/* CARD */}
                <div className="mt-12 lg:mt-16">
                    <CardAbout />
                </div>
            </div>
        </div>
    );
};

export default AboutPage;
