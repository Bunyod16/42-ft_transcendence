import * as React from "react";

import Game from "@/components/Game";
import DefaultLayout from "@/components/layout/DefaultLayout";

export default function Home() {
  return (
    <DefaultLayout>
      <Game />
    </DefaultLayout>
  );
}
