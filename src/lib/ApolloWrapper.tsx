"use client";

import { useState } from "react";
import { ApolloProvider } from "@apollo/client";
import { createApolloClient } from "./apolloClient";

export default function ApolloWrapper({
    children,
}: {
    children: React.ReactNode;
}) {
    // One client per mount — creating it per render wipes the cache and
    // causes refetch storms.
    const [client] = useState(() => createApolloClient());
    return <ApolloProvider client={client}>{children}</ApolloProvider>;
}
