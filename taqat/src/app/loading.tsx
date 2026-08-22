import { Skeleton } from "@/components/ui";
export default function Loading() {
  return (
    <div className="container page-section">
      <p>جاري التحميل...</p>
      <div className="grid-3">
        <Skeleton />
        <Skeleton />
        <Skeleton />
      </div>
    </div>
  );
}
