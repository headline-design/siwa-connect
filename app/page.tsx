"use client";

import dynamic from "next/dynamic";

const DynamicComponentWithNoSSR = dynamic(
  () => import("../components/SIWAConnect"),
  { ssr: false },
);

export default function Home() {
  return (
    <main className="flex min-h-screen  ">
      <DynamicComponentWithNoSSR />
    </main>
  );
}
