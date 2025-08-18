import LandingPage from "@/containers/LandingPage/LandingPageContainer";
import { Suspense } from "react";

export default function Home() {
  return (
    <Suspense fallback='loading'>
      <LandingPage />
    </Suspense>
  );
}
