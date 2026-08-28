import { readdir } from "node:fs/promises";
import path from "node:path";

const iconsDirectory = path.join(process.cwd(), "public", "staff-icons");

/** SVG files in public/staff-icons are automatically available to the staff editor. */
export async function getStaffIcons() {
  try {
    const entries = await readdir(iconsDirectory, { withFileTypes: true });
    return entries
      .filter((entry) => entry.isFile() && entry.name.toLowerCase().endsWith(".svg"))
      .map((entry) => `/staff-icons/${encodeURIComponent(entry.name)}`)
      .sort((a, b) => a.localeCompare(b));
  } catch {
    return [];
  }
}

export function isStaffIcon(value: string, icons: string[]) {
  return value === "" || icons.includes(value);
}
