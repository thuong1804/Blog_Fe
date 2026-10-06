import LandingPage from "@/containers/LandingPage/LandingPageContainer";

// ISR for the landing page (the `revalidate` inside LandingPageContainer is
// ignored — Next only reads it from page/layout/route files).
export const revalidate = 300;

export default function Home() {
    return (
        <LandingPage />
    );
}
