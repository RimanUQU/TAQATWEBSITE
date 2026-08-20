import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();
async function clearImages() {
  await db.$transaction([
    db.program.updateMany({ data: { coverImage: "", cardImage: "" } }),
    db.partner.updateMany({ data: { logo: "" } }),
    db.siteSetting.upsert({ where: { key: "logo" }, create: { key: "logo", value: "" }, update: { value: "" } }),
    db.siteSetting.upsert({ where: { key: "defaultSocialImage" }, create: { key: "defaultSocialImage", value: "" }, update: { value: "" } }),
  ]);
}
clearImages().finally(() => db.$disconnect());
