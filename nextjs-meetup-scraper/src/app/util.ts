"use client";
import { toast } from "@/components/ui/use-toast";

export const getPath = async (p: string, toastOn = true) => {
  const res = await fetch(`http://localhost:3333/${p}`);
  const json = await res.json();
  if (json.error) {
    if (toastOn)
      toast({
        title: "Error",
        description: json.error,
        variant: "destructive",
      });
  } else {
    if (toastOn) toast({ title: "Result", description: json.message });
  }
  return json;
};
