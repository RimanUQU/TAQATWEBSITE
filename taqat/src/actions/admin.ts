"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { slugify } from "@/lib/utils";
import { getStaffIcons, isStaffIcon } from "@/lib/staff-icons";
import { Prisma } from "@prisma/client";
const text = (fd: FormData, key: string) => String(fd.get(key) || "").trim();
const bool = (fd: FormData, key: string) => fd.get(key) === "on";
const num = (fd: FormData, key: string) => Number(fd.get(key) || 0);
export async function saveSettingsAction(formData: FormData) {
  await requireAdmin();
  const keys = [
    "clubName",
    "email",
    "phone",
    "mobile",
    "address",
    "footerDescription",
    "copyright",
    "instagram",
    "x",
    "whatsapp",
    "tiktok",
    "snapchat",
    "siteTitle",
    "metaDescription",
    "logo",
    "defaultSocialImage",
  ];
  await db.$transaction(
    keys.map((key) =>
      db.siteSetting.upsert({
        where: { key },
        create: { key, value: text(formData, key) },
        update: { value: text(formData, key) },
      }),
    ),
  );
  revalidatePath("/", "layout");
  redirect("/admin/settings?saved=1");
}
export async function saveHomepageAction(formData: FormData) {
  await requireAdmin();
  const textKeys = [
      "heroEyebrow",
      "heroTitle",
      "heroSubtitle",
      "programsHeading",
      "partnersHeading",
      "statisticsHeading",
      "testimonialsHeading",
      "sectionEyebrow",
      "programsSubtitle",
      "programsCta",
      "partnersSubtitle",
      "partnersCta",
      "testimonialsSubtitle",
    ],
    boolKeys = ["showPrograms", "showPartners", "showStatistics", "showTestimonials"];
  await db.$transaction([
    ...textKeys.map((key) =>
      db.siteSetting.upsert({
        where: { key },
        create: { key, value: text(formData, key), group: "home" },
        update: { value: text(formData, key) },
      }),
    ),
    ...boolKeys.map((key) =>
      db.siteSetting.upsert({
        where: { key },
        create: { key, value: String(bool(formData, key)), group: "home" },
        update: { value: String(bool(formData, key)) },
      }),
    ),
  ]);
  revalidatePath("/");
  redirect("/admin/homepage?saved=1");
}
export async function saveAboutAction(formData: FormData) {
  await requireAdmin();
  await db.aboutContent.upsert({
    where: { id: "main" },
    create: {
      id: "main",
      introduction: text(formData, "introduction"),
      vision: text(formData, "vision"),
      mission: text(formData, "mission"),
      goals: text(formData, "goals"),
      values: text(formData, "values"),
    },
    update: {
      introduction: text(formData, "introduction"),
      vision: text(formData, "vision"),
      mission: text(formData, "mission"),
      goals: text(formData, "goals"),
      values: text(formData, "values"),
    },
  });
  revalidatePath("/about");
  redirect("/admin/about?saved=1");
}
export async function saveProgramAction(id: string | undefined, formData: FormData) {
  const admin = await requireAdmin();
  const shortDescription = text(formData, "shortDescription");
  const endDate = new Date(text(formData, "endDate"));
  const registrationDeadlineRaw = text(formData, "registrationDeadline");
  const backgroundColorRaw = text(formData, "backgroundColor");
  const data = {
    title: text(formData, "title"),
    slug: slugify(text(formData, "slug") || text(formData, "title")),
    shortDescription,
    // برنامج جديد بدون وصف كامل منفصل: نستخدم الوصف المختصر كقيمة افتراضية
    description: text(formData, "description") || shortDescription,
    coverImage: text(formData, "coverImage") || text(formData, "cardImage"),
    cardImage: text(formData, "cardImage") || text(formData, "coverImage"),
    location: text(formData, "location"),
    startDate: new Date(text(formData, "startDate")),
    endDate,
    // بدون آخر موعد تسجيل محدد: نفترضه نفس تاريخ نهاية البرنامج
    registrationDeadline: registrationDeadlineRaw ? new Date(registrationDeadlineRaw) : endDate,
    capacity: num(formData, "capacity"),
    price: num(formData, "price"),
    status: text(formData, "status") as "DRAFT" | "PUBLISHED" | "ARCHIVED",
    featured: bool(formData, "featured"),
    showInSlider: bool(formData, "showInSlider"),
    isNew: bool(formData, "isNew"),
    categoryId: text(formData, "categoryId") || null,
    targetAudienceId: text(formData, "targetAudienceId") || null,
    bannerImage: text(formData, "bannerImage") || null,
    // بدون لون محدد: نبقي اللون التركوازي الافتراضي (نفس القيمة الافتراضية بقاعدة البيانات)
    backgroundColor: backgroundColorRaw || "#075658",
  };
  if (!data.title || !data.slug || !data.description || !data.shortDescription || !data.location)
    throw new Error("بيانات البرنامج الأساسية غير مكتملة");
  if (data.capacity < 1) throw new Error("السعة يجب أن تكون رقمًا أكبر من صفر");
  if (data.endDate < data.startDate)
    throw new Error("تاريخ النهاية يجب أن يكون بعد تاريخ البداية");
  // نفس التحقق من صيغة اللون اللي بواجهة الأدمن، بس هنا على السيرفر - حماية
  // من أي طلب يوصل بدون المرور بالواجهة (Validation على الطبقتين)
  if (!/^#[0-9A-Fa-f]{6}$/.test(data.backgroundColor))
    throw new Error("صيغة لون البرنامج غير صحيحة، لازم تكون مثل #FB5E96");
  try {
    if (id) await db.program.update({ where: { id }, data: { ...data, updatedById: admin.id } });
    else await db.program.create({ data: { ...data, createdById: admin.id, updatedById: admin.id } });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002")
      throw new Error(
        "رابط البرنامج (Slug) مستخدم مسبقًا لبرنامج آخر، جرّبي كتابة رابط مختلف يدويًا من خانة الرابط المختصر بنافذة التفاصيل",
      );
    throw error;
  }
  revalidatePath("/programs");
  revalidatePath("/");
  revalidatePath("/admin/programs");
  redirect("/admin/programs?saved=1");
}
export async function archiveProgramAction(id: string) {
  await requireAdmin();
  await db.program.update({ where: { id }, data: { status: "ARCHIVED" } });
  revalidatePath("/programs");
  revalidatePath("/admin/programs");
}
export async function restoreProgramAction(id: string) {
  await requireAdmin();
  await db.program.update({ where: { id }, data: { status: "DRAFT" } });
  revalidatePath("/programs");
  revalidatePath("/admin/programs");
}
export async function deleteProgramAction(id: string) {
  await requireAdmin();
  const registrations = await db.programRegistration.count({ where: { programId: id } });
  if (registrations > 0)
    throw new Error("لا يمكن حذف برنامج مرتبط بتسجيلات حقيقية، استخدمي الأرشفة بدلاً من ذلك");
  await db.program.delete({ where: { id } });
  revalidatePath("/programs");
  revalidatePath("/admin/programs");
}
export async function savePartnerAction(formData: FormData) {
  await requireAdmin();
  const id = text(formData, "id"),
    data = {
      name: text(formData, "name"),
      logo: text(formData, "logo"),
      url: text(formData, "url") || null,
      displayOrder: num(formData, "displayOrder"),
      active: bool(formData, "active"),
    };
  if (id) await db.partner.update({ where: { id }, data });
  else await db.partner.create({ data });
  revalidatePath("/");
  revalidatePath("/admin/partners");
}
export async function deletePartnerAction(id: string) {
  await requireAdmin();
  await db.partner.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/admin/partners");
}
export async function saveCategoryAction(formData: FormData) {
  await requireAdmin();
  const id = text(formData, "id"),
    name = text(formData, "name"),
    data = { name, slug: slugify(text(formData, "slug") || name) };
  if (!data.name) throw new Error("اسم التصنيف مطلوب");
  if (id) await db.programCategory.update({ where: { id }, data });
  else await db.programCategory.create({ data });
  revalidatePath("/admin/categories");
  revalidatePath("/admin/programs");
}
export async function deleteCategoryAction(id: string) {
  await requireAdmin();
  await db.programCategory.delete({ where: { id } });
  revalidatePath("/admin/categories");
  revalidatePath("/admin/programs");
  revalidatePath("/programs");
}
export async function saveAudienceAction(formData: FormData) {
  await requireAdmin();
  const id = text(formData, "id"),
    name = text(formData, "name");
  if (!name) throw new Error("اسم الفئة المستهدفة مطلوب");
  if (id) await db.targetAudience.update({ where: { id }, data: { name } });
  else await db.targetAudience.create({ data: { name } });
  revalidatePath("/admin/audiences");
  revalidatePath("/admin/programs");
}
export async function deleteAudienceAction(id: string) {
  await requireAdmin();
  await db.targetAudience.delete({ where: { id } });
  revalidatePath("/admin/audiences");
  revalidatePath("/admin/programs");
  revalidatePath("/programs");
}
// قسم "الإحصائيات" بالرئيسية محسوب بالكامل تلقائيًا من قاعدة البيانات (بدون
// أي إدخال يدوي) - صلاحية الأدمن الوحيدة هنا إظهار/إخفاء أي بطاقة إحصائية،
// نفس نمط saveHomepageAction بالأعلى لكن لمفاتيح الإحصائيات الأربعة فقط.
export async function saveStatisticVisibilityAction(formData: FormData) {
  await requireAdmin();
  const keys = [
    "showStatBeneficiaries",
    "showStatPartners",
    "showStatPrograms",
    "showStatSatisfaction",
  ];
  await db.$transaction(
    keys.map((key) =>
      db.siteSetting.upsert({
        where: { key },
        create: { key, value: String(bool(formData, key)), group: "home" },
        update: { value: String(bool(formData, key)) },
      }),
    ),
  );
  revalidatePath("/");
  redirect("/admin/statistics?saved=1");
}
export async function saveTestimonialAction(formData: FormData) {
  await requireAdmin();
  const id = text(formData, "id"),
    data = {
      quote: text(formData, "quote"),
      name: text(formData, "name"),
      title: text(formData, "title") || null,
      rating: Math.min(5, Math.max(1, num(formData, "rating"))),
      displayOrder: num(formData, "displayOrder"),
      active: bool(formData, "active"),
    };
  if (id) await db.testimonial.update({ where: { id }, data });
  else await db.testimonial.create({ data });
  revalidatePath("/");
  revalidatePath("/admin/testimonials");
}
export async function deleteTestimonialAction(id: string) {
  await requireAdmin();
  await db.testimonial.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/admin/testimonials");
}
const staffPaths = () => {
  revalidatePath("/staff");
  revalidatePath("/admin/staff");
};
const boundedPosition = (value: number, length: number) =>
  Math.max(1, Math.min(Number.isFinite(value) ? Math.floor(value) : length + 1, length + 1));
async function orderGroups(tx: Prisma.TransactionClient, ids: string[]) {
  for (const [index, id] of ids.entries())
    await tx.staffGroup.update({ where: { id }, data: { displayOrder: index + 1 } });
}
async function orderMembers(tx: Prisma.TransactionClient, ids: string[]) {
  for (const [index, id] of ids.entries())
    await tx.staffMember.update({ where: { id }, data: { displayOrder: index + 1 } });
}
export async function saveStaffGroupAction(formData: FormData) {
  await requireAdmin();
  const id = text(formData, "id"),
    name = text(formData, "name") || null,
    requested = num(formData, "displayOrder");
  await db.$transaction(async (tx) => {
    const groups = await tx.staffGroup.findMany({
      orderBy: { displayOrder: "asc" },
      select: { id: true },
    });
    if (id) {
      const ids = groups.map((group) => group.id).filter((groupId) => groupId !== id);
      ids.splice(boundedPosition(requested, ids.length) - 1, 0, id);
      await tx.staffGroup.update({ where: { id }, data: { name } });
      await orderGroups(tx, ids);
    } else {
      const group = await tx.staffGroup.create({ data: { name } });
      const ids = groups.map((item) => item.id);
      ids.splice(boundedPosition(requested, ids.length) - 1, 0, group.id);
      await orderGroups(tx, ids);
    }
  });
  staffPaths();
}
export async function deleteStaffGroupAction(id: string) {
  await requireAdmin();
  await db.$transaction(async (tx) => {
    await tx.staffGroup.delete({ where: { id } });
    const groups = await tx.staffGroup.findMany({
      orderBy: { displayOrder: "asc" },
      select: { id: true },
    });
    await orderGroups(
      tx,
      groups.map((group) => group.id),
    );
  });
  staffPaths();
}
export async function saveStaffAction(formData: FormData) {
  await requireAdmin();
  const id = text(formData, "id"),
    name = text(formData, "name"),
    jobTitle = text(formData, "jobTitle"),
    groupId = text(formData, "groupId"),
    requested = num(formData, "displayOrder"),
    icon = text(formData, "icon");
  if (!name || !jobTitle || !groupId) throw new Error("الاسم والمسمى والمجموعة مطلوبة");
  const icons = await getStaffIcons();
  if (!isStaffIcon(icon, icons)) throw new Error("الأيقونة المختارة غير متاحة");
  await db.$transaction(async (tx) => {
    const target = await tx.staffGroup.findUnique({ where: { id: groupId }, select: { id: true } });
    if (!target) throw new Error("المجموعة المختارة غير موجودة");
    const current = id
      ? await tx.staffMember.findUnique({ where: { id }, select: { groupId: true } })
      : null;
    if (id && !current) throw new Error("عضو الكادر غير موجود");
    const targetMembers = await tx.staffMember.findMany({
      where: { groupId },
      orderBy: { displayOrder: "asc" },
      select: { id: true },
    });
    const targetIds = targetMembers
      .map((member) => member.id)
      .filter((memberId) => memberId !== id);
    const position = boundedPosition(requested, targetIds.length);
    if (id) {
      await tx.staffMember.update({
        where: { id },
        data: { name, jobTitle, icon, active: bool(formData, "active"), groupId },
      });
    } else {
      const member = await tx.staffMember.create({
        data: { name, jobTitle, icon, active: bool(formData, "active"), groupId },
      });
      targetIds.splice(position - 1, 0, member.id);
    }
    if (id) targetIds.splice(position - 1, 0, id);
    await orderMembers(tx, targetIds);
    if (current && current.groupId !== groupId) {
      const source = await tx.staffMember.findMany({
        where: { groupId: current.groupId },
        orderBy: { displayOrder: "asc" },
        select: { id: true },
      });
      await orderMembers(
        tx,
        source.map((member) => member.id),
      );
    }
  });
  staffPaths();
}
export async function deleteStaffAction(id: string) {
  await requireAdmin();
  await db.$transaction(async (tx) => {
    const member = await tx.staffMember.delete({ where: { id }, select: { groupId: true } });
    const members = await tx.staffMember.findMany({
      where: { groupId: member.groupId },
      orderBy: { displayOrder: "asc" },
      select: { id: true },
    });
    await orderMembers(
      tx,
      members.map((item) => item.id),
    );
  });
  staffPaths();
}
export async function updateUserAction(id: string, formData: FormData) {
  const admin = await requireAdmin();
  if (id === admin.id && text(formData, "role") !== "ADMIN")
    throw new Error("لا يمكنك إزالة صلاحية حسابك الإداري");
  await db.user.update({
    where: { id },
    data: { role: text(formData, "role") as "USER" | "ADMIN", active: bool(formData, "active") },
  });
  revalidatePath("/admin/users");
}
export async function updateRegistrationAction(id: string, formData: FormData) {
  await requireAdmin();
  await db.programRegistration.update({
    where: { id },
    data: { status: text(formData, "status") as "CONFIRMED" | "CANCELLED" | "WAITLIST" },
  });
  revalidatePath("/admin/registrations");
}
