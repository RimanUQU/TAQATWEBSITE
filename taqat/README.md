# نادي طاقات للفتيات

منصة عربية كاملة باتجاه RTL لعرض برامج نادي طاقات، تسجيل العضوات، إدارة الحسابات، وإدارة محتوى الموقع من لوحة تحكم محمية.

## التقنيات

- Next.js 15 App Router وReact 19 وTypeScript
- Prisma ORM مع PostgreSQL على Supabase، مناسب للنشر على Netlify
- جلسات JWT موقعة داخل Cookie محمية وHTTP-only
- bcryptjs لتجزئة كلمات المرور
- Zod للتحقق من المدخلات
- Vitest للاختبارات
- CSS Design System مخصص وفق ألوان طاقات وخط Noto Sans Arabic

## المتطلبات

- Node.js 20 أو أحدث
- npm 10 أو أحدث

## التشغيل لأول مرة

```bash
cd taqat
npm install
copy .env.example .env
npm run setup
npm run dev
```

ثم افتح `http://localhost:3000`.

## متغيرات البيئة

| المتغير | الغرض |
|---|---|
| `DATABASE_URL` | رابط Supabase Pooler (منفذ 6543) الذي يستخدمه التطبيق في وقت التشغيل |
| `DIRECT_URL` | رابط Supabase المباشر (منفذ 5432) الذي تستخدمه Prisma لتطبيق الترحيلات |
| `AUTH_SECRET` | مفتاح عشوائي لا يقل عن 32 حرفًا لتوقيع الجلسات |
| `NEXT_PUBLIC_APP_URL` | الرابط العام للموقع والـSEO |
| `NEXT_PUBLIC_SUPABASE_URL` | رابط مشروع Supabase المستخدم لصور Storage |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | المفتاح العام لمشروع Supabase؛ يستخدم فقط لإتمام رفع موقّع |
| `SUPABASE_SERVICE_ROLE_KEY` | مفتاح الخادم لإنشاء روابط الرفع وحذف الصور؛ لا تضعه في متغير يبدأ بـ `NEXT_PUBLIC_` |
| `SEED_ADMIN_EMAIL` | بريد المدير الذي ينشئه أمر seed |
| `SEED_ADMIN_PASSWORD` | كلمة مرور تطوير قوية؛ لا تستخدم قيمة التطوير في الإنتاج |
| `GOOGLE_CLIENT_ID` | اختياري، لإظهار تكامل Google عند إضافة موفر OAuth |
| `GOOGLE_CLIENT_SECRET` | اختياري، سر موفر Google |

لتوليد مفتاح جلسة قوي في PowerShell:

```powershell
[Convert]::ToBase64String((1..48 | ForEach-Object { Get-Random -Maximum 256 }))
```

## قاعدة البيانات والبيانات الأولية

أنشئ مشروع Supabase، ثم انسخ روابط الاتصال من **Connect** إلى ملف `.env` حسب المثال: رابط Pooler في `DATABASE_URL` والرابط المباشر في `DIRECT_URL`. بعد ذلك طبّق المخطط والبيانات الأولية:

```bash
npm run db:deploy
npm run db:seed
```

في Netlify أضف `DATABASE_URL` و`DIRECT_URL` و`AUTH_SECRET` وبقية متغيرات الإنتاج في إعدادات البيئة. لا تشغّل `db:push` ضمن عملية النشر؛ الترحيلات الموجودة في `prisma/migrations` هي المصدر المعتمد للمخطط، ويشغّل أمر `db:deploy` الترحيلات الآمنة فقط.

## تخزين الصور

يستخدم الموقع bucket عام موجود في Supabase باسم `uploads`. أضف متغيرات Storage الثلاثة الموضحة أعلاه إلى `.env` وNetlify. طلب إنشاء رابط الرفع الموقّع وحذف الصور يتطلبان جلسة أدمن، بينما يرفع المتصفح الملف باستخدام token مؤقت فقط؛ لا يُرسل مفتاح `SUPABASE_SERVICE_ROLE_KEY` إلى المتصفح.

يشمل seed ثلاثة برامج عربية وأربعة شركاء وثلاث شهادات وثلاثة أعضاء فريق وإحصائيات ومحتوى صفحة «من نحن» وإعدادات عامة. ينشأ حساب المدير فقط عندما تكون قيمتا `SEED_ADMIN_EMAIL` و`SEED_ADMIN_PASSWORD` موجودتين.

إعداد التطوير المرفق محليًا فقط:

- البريد: `admin@taqat.local`
- كلمة المرور: `Admin123!`

غيّر هذه القيم قبل أي نشر، ولا ترفع ملف `.env` إلى Git.

## أوامر الجودة والبناء

```bash
npm run lint
npm run typecheck
npm test
npm run build
npm start
```

## المسارات

العامة: `/`، `/about`، `/programs`، `/programs/[slug]`، `/staff`، `/login`، `/register`، `/forgot-password`، `/account`، `/privacy`، `/terms`، `/faq`.

الإدارة: `/admin`، `/admin/settings`، `/admin/homepage`، `/admin/programs`، `/admin/programs/new`، `/admin/programs/[id]/edit`، `/admin/partners`، `/admin/statistics`، `/admin/testimonials`، `/admin/staff`، `/admin/about`، `/admin/users`، `/admin/registrations`.

## المصادقة والأمان

- تخزن كلمات المرور بعد تجزئتها بـbcrypt (عامل كلفة 12).
- الجلسة JWT موقعة، HTTP-only، SameSite=Lax، وتصبح Secure في الإنتاج.
- تفحص جميع إجراءات الإدارة دور `ADMIN` على الخادم، وليس في الواجهة فقط.
- تمنع قاعدة البيانات تكرار التسجيل في البرنامج نفسه بقيد مركب فريد.
- تتحقق عملية التسجيل خادميًا من النشر والموعد والسعة والتسجيل السابق.
- لا يكشف تدفق «نسيت كلمة المرور» وجود البريد من عدمه. طبقة التوكن جاهزة لربط موفر بريد إنتاجي.

## الصور والتخزين

يوجد مسار رفع تطويري محمي للمدير في `/api/admin/upload`. يقبل JPEG وPNG وWebP وSVG حتى 5MB ويحفظها تحت `public/uploads`. حقول الإدارة تقبل أيضًا روابط صور. في الإنتاج يوصى باستبدال طبقة التخزين بـS3 أو Cloudinary أو Supabase Storage لأن أنظمة الملفات في الاستضافات عديمة الحالة ليست دائمة.

## Google OAuth

تسجيل Google غير مفعّل في النسخة المحلية حتى لا يظهر زر غير عامل. متغيرا `GOOGLE_CLIENT_ID` و`GOOGLE_CLIENT_SECRET` محجوزان لربط موفر OAuth موثوق في بيئة الإنتاج مع عنوان رد مطابق للاستضافة.

## بنية المشروع

- `src/app`: الصفحات، مسارات API، حالات التحميل والخطأ وSEO
- `src/components`: نظام التصميم والمكونات العامة والإدارية
- `src/actions`: إجراءات الخادم للمصادقة والبرامج والإدارة
- `src/lib`: قاعدة البيانات والجلسات والإعدادات والتحقق
- `prisma`: المخطط والبيانات الأولية
- `public/uploads`: تخزين الصور المحلي أثناء التطوير

## ملاحظة المراجع المرئية

لم تكن ملفات PDF أو لقطات الشاشة المذكورة في المواصفات موجودة ضمن المرفقات المتاحة أثناء التنفيذ؛ لذلك طُبقت القيم النصية المحددة للألوان والخطوط والشبكة باعتبارها مصدر التصميم المتاح.
