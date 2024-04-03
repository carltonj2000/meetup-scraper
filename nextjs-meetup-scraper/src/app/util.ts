"use client";
import { toast } from "@/components/ui/use-toast";

export const getPath = async (p: string) => {
  const res = await fetch(`http://localhost:3333/${p}`);
  const json = await res.json();
  if (json.error) {
    toast({
      title: "Error",
      description: json.error,
      variant: "destructive",
    });
  } else {
    toast({ title: "Result", description: json.message });
  }
  return json;
};
