import { ButtonLink } from "@/components/ui";
import { PageHero } from "@/components/page-hero";
export default function NotFound() {
  return (
    <PageHero
      eyebrow="404"
      title="الصفحة غير موجودة"
      subtitle="يبدو أن الرابط الذي تبحثين عنه لم يعد متاحًا أو تم نقله."
    >
      <ButtonLink href="/">العودة للرئيسية</ButtonLink>
    </PageHero>
  );
}
