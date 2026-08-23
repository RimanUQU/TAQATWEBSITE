"use client";
import { Button } from "./ui";

export function PrintButton() {
  return (
    <Button type="button" variant="outline" size="sm" onClick={() => window.print()}>
      طباعة
    </Button>
  );
}
