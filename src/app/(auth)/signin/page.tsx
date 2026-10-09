"use client";

import { Suspense } from "react";
import SigninContainer from "@/containers/Auth/SignIn";

const LoginPage = () => {
    return (
        <Suspense>
            <SigninContainer />
        </Suspense>
    );
};
export default LoginPage;
