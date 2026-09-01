-- AlterTable
-- تراجع عن عمود "source" اللي أضيف بالـ migration السابقة (20260901140000):
-- قسم الإحصائيات صار محسوبًا تلقائيًا بالكامل بدون أي ربط يدوي بالأدمن،
-- فما عاد فيه حاجة لهذا العمود. جدول Statistic وبياناته القديمة تبقى كما هي.
ALTER TABLE "Statistic" DROP COLUMN "source";

-- DropEnum
DROP TYPE "StatisticSource";
