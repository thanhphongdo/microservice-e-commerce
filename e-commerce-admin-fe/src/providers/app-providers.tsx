"use client";

import { ApolloProvider } from "@apollo/client/react";
import { ReactNode, useEffect } from "react";
import { apolloClient } from "@/lib/apollo-client";
import { useUiStore } from "@/store/use-ui-store";

type Props = {
  children: ReactNode;
};

export function AppProviders({ children }: Props) {
  const darkMode = useUiStore((s) => s.darkMode);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  return <ApolloProvider client={apolloClient}>{children}</ApolloProvider>;
}
