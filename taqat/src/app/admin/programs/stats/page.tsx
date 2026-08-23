import Link from "next/link";
import type { Prisma } from "@prisma/client";
import { db } from "@/lib/db";
import { AdminHeader } from "@/components/admin-ui";
import { Badge, Input, Pagination, Select } from "@/components/ui";
import { PrintButton } from "@/components/print-button";
import { formatDate } from "@/lib/utils";

const statusLabel = { DRAFT: "مسودة", PUBLISHED: "منشور", ARCHIVED: "مؤرشف" } as const;
const PAGE_SIZE = 15;

type SearchParams = {
  q?: string;
  status?: string;
  category?: string;
  from?: string;
  to?: string;
  sort?: string;
  dir?: string;
  page?: string;
};

const sortFields = ["title", "startDate", "endDate", "registrations", "createdAt"] as const;
type SortField = (typeof sortFields)[number];

function buildOrderBy(sort: SortField, dir: "asc" | "desc"): Prisma.ProgramOrderByWithRelationInput {
  if (sort === "registrations") return { registrations: { _count: dir } };
  return { [sort]: dir };
}

export default async function ProgramsStatsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;
  const page = Math.max(1, Number(sp.page) || 1);
  const sort = (sortFields as readonly string[]).includes(sp.sort || "")
    ? (sp.sort as SortField)
    : "createdAt";
  const dir = sp.dir === "asc" ? "asc" : "desc";

  const where: Prisma.ProgramWhereInput = {
    ...(sp.q ? { title: { contains: sp.q } } : {}),
    ...(sp.status ? { status: sp.status as "DRAFT" | "PUBLISHED" | "ARCHIVED" } : {}),
    ...(sp.category ? { categoryId: sp.category } : {}),
    ...(sp.from || sp.to
      ? {
          startDate: {
            ...(sp.from ? { gte: new Date(sp.from) } : {}),
            ...(sp.to ? { lte: new Date(sp.to) } : {}),
          },
        }
      : {}),
  };

  const [rows, total, categories, totalAll, published, draft, archived, totalRegistrations] =
    await Promise.all([
      db.program.findMany({
        where,
        include: {
          _count: { select: { registrations: true } },
          createdBy: { select: { name: true } },
          updatedBy: { select: { name: true } },
        },
        orderBy: buildOrderBy(sort, dir),
        skip: (page - 1) * PAGE_SIZE,
        take: PAGE_SIZE,
      }),
      db.program.count({ where }),
      db.programCategory.findMany(),
      db.program.count(),
      db.program.count({ where: { status: "PUBLISHED" } }),
      db.program.count({ where: { status: "DRAFT" } }),
      db.program.count({ where: { status: "ARCHIVED" } }),
      db.programRegistration.count(),
    ]);

  const baseParams = new URLSearchParams();
  if (sp.q) baseParams.set("q", sp.q);
  if (sp.status) baseParams.set("status", sp.status);
  if (sp.category) baseParams.set("category", sp.category);
  if (sp.from) baseParams.set("from", sp.from);
  if (sp.to) baseParams.set("to", sp.to);
  if (sp.sort) baseParams.set("sort", sp.sort);
  if (sp.dir) baseParams.set("dir", sp.dir);
  const baseQuery = baseParams.toString();

  const sortHref = (field: SortField) => {
    const params = new URLSearchParams(baseQuery);
    params.set("sort", field);
    params.set("dir", sort === field && dir === "asc" ? "desc" : "asc");
    return `/admin/programs/stats?${params.toString()}`;
  };
  const sortIndicator = (field: SortField) => (sort === field ? (dir === "asc" ? " ↑" : " ↓") : "");

  return (
    <>
      <AdminHeader
        title="إحصائيات البرامج"
        subtitle="بحث وفلترة وترتيب كل البرامج، مع إمكانية الطباعة."
        actions={
          <>
            <Link className="btn btn-outline btn-sm" href="/admin/programs">
              الرجوع للكروت
            </Link>
            <PrintButton />
          </>
        }
      />

      <div className="dashboard-cards">
        <div className="metric">
          <strong>{totalAll}</strong>
          <span>إجمالي البرامج</span>
        </div>
        <div className="metric">
          <strong>{published}</strong>
          <span>منشور</span>
        </div>
        <div className="metric">
          <strong>{draft}</strong>
          <span>مسودة</span>
        </div>
        <div className="metric">
          <strong>{archived}</strong>
          <span>مؤرشف</span>
        </div>
        <div className="metric">
          <strong>{totalRegistrations}</strong>
          <span>إجمالي التسجيلات</span>
        </div>
      </div>

      <form className="admin-stats-filters" role="search">
        <Input name="q" defaultValue={sp.q} placeholder="ابحثي باسم البرنامج..." aria-label="بحث" />
        <Select name="status" defaultValue={sp.status || ""} aria-label="الحالة">
          <option value="">كل الحالات</option>
          <option value="DRAFT">مسودة</option>
          <option value="PUBLISHED">منشور</option>
          <option value="ARCHIVED">مؤرشف</option>
        </Select>
        <Select name="category" defaultValue={sp.category || ""} aria-label="التصنيف">
          <option value="">كل التصنيفات</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </Select>
        <Input type="date" name="from" defaultValue={sp.from} aria-label="من تاريخ البداية" />
        <Input type="date" name="to" defaultValue={sp.to} aria-label="إلى تاريخ البداية" />
        <button className="btn btn-primary btn-sm" type="submit">
          تصفية
        </button>
      </form>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>
                <Link href={sortHref("title")}>البرنامج{sortIndicator("title")}</Link>
              </th>
              <th>
                <Link href={sortHref("startDate")}>البداية{sortIndicator("startDate")}</Link>
              </th>
              <th>
                <Link href={sortHref("endDate")}>النهاية{sortIndicator("endDate")}</Link>
              </th>
              <th>الحالة</th>
              <th>
                <Link href={sortHref("registrations")}>
                  التسجيلات/السعة{sortIndicator("registrations")}
                </Link>
              </th>
              <th>
                <Link href={sortHref("createdAt")}>تاريخ الإنشاء{sortIndicator("createdAt")}</Link>
              </th>
              <th>أنشأه</th>
              <th>آخر من عدّله</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((p) => (
              <tr key={p.id}>
                <td>
                  <strong>{p.title}</strong>
                </td>
                <td>{formatDate(p.startDate)}</td>
                <td>{formatDate(p.endDate)}</td>
                <td>
                  <Badge tone={p.status === "PUBLISHED" ? "teal" : p.status === "ARCHIVED" ? "warn" : "gray"}>
                    {statusLabel[p.status]}
                  </Badge>
                </td>
                <td>
                  {p._count.registrations} / {p.capacity}
                </td>
                <td>{formatDate(p.createdAt)}</td>
                <td>{p.createdBy?.name || "—"}</td>
                <td>{p.updatedBy?.name || "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Pagination
        page={page}
        total={Math.ceil(total / PAGE_SIZE)}
        base={`/admin/programs/stats${baseQuery ? `?${baseQuery}` : ""}`}
      />
    </>
  );
}
