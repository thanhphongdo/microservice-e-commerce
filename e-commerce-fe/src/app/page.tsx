"use client";

import { useMemo } from "react";
import { useQuery } from "@apollo/client/react";
import { Button } from "@/components/ui/button";
import { GetStatusesDocument } from "@/graphql/generated";
import { useUiStore } from "@/store/use-ui-store";

export default function Home() {
  const darkMode = useUiStore((s) => s.darkMode);
  const toggleDarkMode = useUiStore((s) => s.toggleDarkMode);
  const { data, loading, error, refetch } = useQuery(GetStatusesDocument);

  const items = useMemo(
    () => data?.servicesStatus ?? [],
    [data],
  );

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 px-6 py-10">
      <section className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">E-Commerce Frontend</h1>
          <p className="text-sm text-muted-foreground">
            Next.js + Apollo + Zustand + shadcn/ui
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => toggleDarkMode()}>
            Theme: {darkMode ? "Dark" : "Light"}
          </Button>
          <Button onClick={() => refetch()}>Refresh</Button>
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-2">
        {loading && <p>Loading statuses...</p>}
        {error && <p className="text-red-500">GraphQL error: {error.message}</p>}
        {!loading &&
          !error &&
          items.map((item) => (
            <div key={item.service} className="rounded-lg border p-4">
              <p className="text-sm text-muted-foreground">{item.service}</p>
              <p className="text-lg font-medium">{item.status}</p>
            </div>
          ))}
      </section>
    </main>
  );
}
