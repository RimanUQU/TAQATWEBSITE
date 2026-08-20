import { db } from "@/lib/db";
import { getStaffIcons } from "@/lib/staff-icons";
import { deleteStaffAction, deleteStaffGroupAction, saveStaffAction, saveStaffGroupAction } from "@/actions/admin";
import { ActiveToggle, AdminHeader, TextField } from "@/components/admin-ui";
import { StaffIconPicker } from "@/components/staff-icon-picker";
import { Button } from "@/components/ui";

function PositionSelect({ name, total, value }: { name: string; total: number; value: number }) {
  return <select className="input" name={name} defaultValue={String(value)}>{Array.from({ length: Math.max(1, total) }, (_, index) => <option key={index + 1} value={index + 1}>{index + 1}</option>)}</select>;
}

export default async function StaffAdminPage() {
  const [groups, icons] = await Promise.all([
    db.staffGroup.findMany({ orderBy: { displayOrder: "asc" }, include: { members: { orderBy: { displayOrder: "asc" } } } }),
    getStaffIcons(),
  ]);
  return <>
    <AdminHeader title="الكادر الوظيفي" subtitle="رتّبي المجموعات والأعضاء من القوائم؛ الخيارات المتاحة فقط تمنع الترتيب غير الواضح." />
    <section className="panel staff-admin-create">
      <h2>إضافة مجموعة</h2>
      <form action={saveStaffGroupAction} className="admin-form">
        <TextField name="name" label="اسم المجموعة" hint="اختياري — لن يظهر أي عنوان في الصفحة العامة عند تركه فارغًا." />
        <div className="field"><label>ترتيب المجموعة</label><PositionSelect name="displayOrder" total={groups.length + 1} value={groups.length + 1} /></div>
        <Button>إضافة مجموعة</Button>
      </form>
    </section>
    <section className="staff-admin-groups">
      {groups.length === 0 ? <p className="empty">ابدئي بإضافة مجموعة، ثم أضيفي أعضاءها.</p> : groups.map((group, groupIndex) => <article className="panel staff-admin-group" key={group.id}>
        <div className="staff-admin-group-heading"><div><span className="eyebrow">مجموعة {groupIndex + 1}</span><h2>{group.name || "مجموعة بدون اسم"}</h2></div><form action={deleteStaffGroupAction.bind(null, group.id)}><Button variant="text" size="sm">حذف المجموعة</Button></form></div>
        <form action={saveStaffGroupAction} className="admin-form staff-group-form"><input type="hidden" name="id" value={group.id} /><TextField name="name" label="اسم المجموعة" value={group.name || ""} hint="اختياري، ولا يظهر للزوار عند تركه فارغًا." /><div className="field"><label>الترتيب</label><PositionSelect name="displayOrder" total={groups.length} value={group.displayOrder} /></div><Button variant="outline">حفظ بيانات المجموعة</Button></form>
        <div className="staff-members-heading"><h3>الأعضاء</h3><span>{group.members.length} عضو</span></div>
        <div className="staff-members-list">{group.members.map((member) => <form key={member.id} action={saveStaffAction} className="staff-member-editor"><input type="hidden" name="id" value={member.id} /><TextField name="name" label="الاسم" value={member.name} required /><TextField name="jobTitle" label="المسمى الوظيفي" value={member.jobTitle} required /><div className="field"><label>المجموعة</label><select className="input" name="groupId" defaultValue={member.groupId}>{groups.map((item, index) => <option key={item.id} value={item.id}>{item.name || `مجموعة بدون اسم (${index + 1})`}</option>)}</select></div><div className="field"><label>ترتيب العضو</label><PositionSelect name="displayOrder" total={group.members.length} value={member.displayOrder} /></div><StaffIconPicker icons={icons} value={member.icon} /><ActiveToggle checked={member.active} /><div className="staff-member-actions"><Button variant="outline">حفظ العضو</Button><Button formAction={deleteStaffAction.bind(null, member.id)} variant="text" size="sm">حذف</Button></div></form>)}</div>
        <details className="staff-add-member"><summary>إضافة عضو إلى هذه المجموعة</summary><form action={saveStaffAction} className="admin-form"><input type="hidden" name="groupId" value={group.id} /><TextField name="name" label="الاسم" required /><TextField name="jobTitle" label="المسمى الوظيفي" required /><div className="field"><label>ترتيب العضو</label><PositionSelect name="displayOrder" total={group.members.length + 1} value={group.members.length + 1} /></div><StaffIconPicker icons={icons} /><ActiveToggle checked /><Button>إضافة عضو</Button></form></details>
      </article>)}</section>
  </>;
}
