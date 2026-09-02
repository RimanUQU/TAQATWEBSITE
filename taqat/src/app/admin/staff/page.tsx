import { db } from "@/lib/db";
import { getStaffIcons } from "@/lib/staff-icons";
import {
  deleteStaffAction,
  deleteStaffGroupAction,
  saveStaffAction,
  saveStaffGroupAction,
  saveStaffGroupsOrderAction,
} from "@/actions/admin";
import { ActiveToggle, AdminHeader, TextField } from "@/components/admin-ui";
import { StaffIconPicker } from "@/components/staff-icon-picker";
import { Button } from "@/components/ui";

function PositionSelect({ name, total, value }: { name: string; total: number; value: number }) {
  return (
    <select className="input" name={name} defaultValue={String(value)}>
      {Array.from({ length: Math.max(1, total) }, (_, index) => (
        <option key={index + 1} value={index + 1}>
          {index + 1}
        </option>
      ))}
    </select>
  );
}

function ParentSelect({
  groups,
  value,
  excludeId,
}: {
  groups: { id: string; name: string | null; parentId: string | null; displayOrder: number }[];
  value: string | null;
  excludeId?: string;
}) {
  const categories = groups.filter((group) => !group.parentId && group.id !== excludeId);
  return (
    <select className="input" name="parentId" defaultValue={value || ""}>
      <option value="">فئة رئيسية / بدون فئة</option>
      {categories.map((group) => (
        <option key={group.id} value={group.id}>
          {group.name || `فئة بدون عنوان (ترتيب ${group.displayOrder})`}
        </option>
      ))}
    </select>
  );
}

export default async function StaffAdminPage({
  searchParams,
}: {
  searchParams: Promise<{ ordered?: string }>;
}) {
  const [groups, icons] = await Promise.all([
    db.staffGroup.findMany({
      orderBy: { displayOrder: "asc" },
      include: { members: { orderBy: { displayOrder: "asc" } } },
    }),
    getStaffIcons(),
  ]);
  const { ordered } = await searchParams;
  return (
    <>
      <AdminHeader
        title="الكادر الوظيفي"
        subtitle="رتّبي المجموعات والأعضاء من القوائم؛ الخيارات المتاحة فقط تمنع الترتيب غير الواضح."
      />
      {ordered === "1" && <p className="admin-success">تم حفظ ترتيب المجموعات، ويمكنك الآن فتح الصفحة العامة للتأكد من النتيجة.</p>}
      {groups.length > 0 && (
        <section className="panel staff-order-panel">
          <div className="staff-order-heading">
            <div>
              <span className="eyebrow">خطوة واحدة</span>
              <h2>ترتيب ظهور المجموعات</h2>
              <p>اختاري رقمًا لكل فئة أو صف. الرقم 1 يظهر أولًا، ثم 2، ثم 3. الصف المرتبط بفئة يظهر تحت عنوانها.</p>
            </div>
            <span className="staff-order-badge">يظهر في صفحة الكادر</span>
          </div>
          <form action={saveStaffGroupsOrderAction} className="staff-order-form">
            {groups.map((group) => (
              <div className="staff-order-row" key={group.id}>
                <span>{group.name || `صف بدون اسم (ترتيب ${group.displayOrder})`}</span>
                <label>
                  <span>الموضع</span>
                  <PositionSelect name="displayOrder" total={groups.length} value={group.displayOrder} />
                </label>
                <input type="hidden" name="groupId" value={group.id} />
              </div>
            ))}
            <Button>حفظ ترتيب المجموعات</Button>
          </form>
        </section>
      )}
      <section className="panel staff-admin-create">
        <h2>إضافة مجموعة</h2>
        <form action={saveStaffGroupAction} className="admin-form">
          <TextField
            name="name"
            label="اسم المجموعة"
            hint="اختياري — لن يظهر أي عنوان في الصفحة العامة عند تركه فارغًا."
          />
          <div className="field">
            <label>الفئة الظاهرة</label>
            <ParentSelect groups={groups} value={null} />
            <small className="field-hint">اختاري فئة لعرض هذا الصف تحت عنوانها، أو اتركيه فئة رئيسية.</small>
          </div>
          <div className="field">
            <label>ترتيب المجموعة</label>
            <PositionSelect
              name="displayOrder"
              total={groups.length + 1}
              value={groups.length + 1}
            />
          </div>
          <Button size="sm" className="staff-create-group-button">إضافة مجموعة</Button>
        </form>
      </section>
      <section className="staff-admin-groups">
        {groups.length === 0 ? (
          <p className="empty">ابدئي بإضافة مجموعة، ثم أضيفي أعضاءها.</p>
        ) : (
          groups.map((group) => (
            <article className="panel staff-admin-group" key={group.id}>
              <div className="staff-admin-group-heading">
                <div>
                  <span className="eyebrow">ترتيب الظهور: {group.displayOrder}</span>
                  <h2>{group.name || "صف بدون اسم"}</h2>
                </div>
                <form action={deleteStaffGroupAction.bind(null, group.id)}>
                  <Button variant="text" size="sm">
                    حذف المجموعة
                  </Button>
                </form>
              </div>
              <form action={saveStaffGroupAction} className="admin-form staff-group-form">
                <input type="hidden" name="id" value={group.id} />
                <TextField
                  name="name"
                  label="اسم المجموعة"
                  value={group.name || ""}
                  hint="اختياري، ولا يظهر للزوار عند تركه فارغًا."
                />
                <div className="field">
                  <label>الفئة الظاهرة</label>
                  <ParentSelect groups={groups} value={group.parentId} excludeId={group.id} />
                  <small className="field-hint">لإظهار هذا الصف تحت فئة موجودة، اختاري اسم الفئة هنا.</small>
                </div>
                <Button variant="outline" size="sm">حفظ بيانات المجموعة</Button>
              </form>
              <div className="staff-members-heading">
                <h3>الأعضاء</h3>
                <span>{group.members.length} عضو</span>
              </div>
              <div className="staff-members-list">
                {group.members.length === 0 && (
                  <p className="staff-members-empty">لا يوجد أعضاء في هذه المجموعة بعد. ابدئي بإضافة أول عضو.</p>
                )}
                {group.members.map((member) => (
                  <form key={member.id} action={saveStaffAction} className="staff-member-editor">
                    <input type="hidden" name="id" value={member.id} />
                    <TextField name="name" label="الاسم" value={member.name} required />
                    <TextField
                      name="jobTitle"
                      label="المسمى الوظيفي"
                      value={member.jobTitle}
                      required
                    />
                    <div className="field">
                      <label>المجموعة</label>
                      <select className="input" name="groupId" defaultValue={member.groupId}>
                        {groups.map((item, index) => (
                          <option key={item.id} value={item.id}>
                            {item.name || `مجموعة بدون اسم (${index + 1})`}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="field">
                      <label>ترتيب العضو</label>
                      <PositionSelect
                        name="displayOrder"
                        total={group.members.length}
                        value={member.displayOrder}
                      />
                    </div>
                    <StaffIconPicker icons={icons} value={member.icon} />
                    <ActiveToggle checked={member.active} />
                    <div className="staff-member-actions">
                      <Button variant="outline">حفظ العضو</Button>
                      <Button
                        formAction={deleteStaffAction.bind(null, member.id)}
                        variant="text"
                        size="sm"
                      >
                        حذف
                      </Button>
                    </div>
                  </form>
                ))}
              </div>
              <details className="staff-add-member">
                <summary className="staff-add-member-summary">
                  <span className="staff-add-member-icon" aria-hidden="true">+</span>
                  <span className="staff-add-member-copy">
                    <strong>إضافة عضو إلى هذه المجموعة</strong>
                    <small>أضيفي بيانات العضو ليظهر ضمن الكادر في الصفحة العامة.</small>
                  </span>
                  <span className="staff-add-member-action">إضافة عضو</span>
                </summary>
                <p className="staff-add-member-hint">املئي البيانات الأساسية ثم اضغطي على زر الإضافة.</p>
                <form action={saveStaffAction} className="admin-form">
                  <input type="hidden" name="groupId" value={group.id} />
                  <TextField name="name" label="الاسم" required />
                  <TextField name="jobTitle" label="المسمى الوظيفي" required />
                  <div className="field">
                    <label>ترتيب العضو</label>
                    <PositionSelect
                      name="displayOrder"
                      total={group.members.length + 1}
                      value={group.members.length + 1}
                    />
                  </div>
                  <StaffIconPicker icons={icons} />
                  <ActiveToggle checked />
                  <Button>إضافة عضو</Button>
                </form>
              </details>
            </article>
          ))
        )}
      </section>
    </>
  );
}
