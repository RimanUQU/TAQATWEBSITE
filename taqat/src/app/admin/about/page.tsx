import { db } from "@/lib/db";
import { saveAboutAction } from "@/actions/admin";
import { AdminHeader, AreaField } from "@/components/admin-ui";
import { Alert, Button } from "@/components/ui";
export default async function AdminAbout({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  const [about, sp] = await Promise.all([
    db.aboutContent.findUnique({ where: { id: "main" } }),
    searchParams,
  ]);
  return (
    <>
      <AdminHeader title="محتوى من نحن" />
      {sp.saved && <Alert type="success">تم حفظ محتوى الصفحة.</Alert>}
      <form action={saveAboutAction} className="panel admin-form">
        <AreaField name="introduction" label="نبذة عن النادي" value={about?.introduction} />
        <AreaField name="vision" label="رؤيتنا" value={about?.vision} />
        <AreaField name="mission" label="رسالتنا" value={about?.mission} />
        <AreaField name="goals" label="أهدافنا" value={about?.goals} />
        <AreaField name="values" label="قيمنا" value={about?.values} />
        <Button className="full">حفظ التغييرات</Button>
      </form>
    </>
  );
}
