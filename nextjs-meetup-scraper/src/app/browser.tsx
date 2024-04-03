"use client";
import { Button, buttonVariants } from "@/components/ui/button";
import { getPath } from "./util";
import { useState } from "react";

export default function Browser({
  action,
  description,
  variant = "default",
  showJson = false,
}: {
  action: string;
  description: string;
  variant?: any;
  showJson?: boolean;
}) {
  const [json, jsonSet] = useState(null);
  const gp = async () => {
    const j = await getPath(action);
    jsonSet(j);
  };
  return (
    <>
      <Button variant={variant} onClick={() => gp()}>
        {description}
      </Button>
      {showJson && json && <pre>{JSON.stringify(json, null, 2)}</pre>}
    </>
  );
}
