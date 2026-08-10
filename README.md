# موقع تقييم المقررات - جامعة الأمير سطام بن عبدالعزيز

## متطلبات التشغيل
- Node.js v18+
- PostgreSQL

---

## إعداد Backend

```bash
cd backend
npm install
```

### إنشاء ملف `.env`
```
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/course_evaluation_db"
JWT_SECRET="psau_course_evaluation_super_secret_key_2025"
JWT_EXPIRES_IN="7d"
PORT=5000
```

### إنشاء قاعدة البيانات وتشغيل الـ Migrations
```bash
npx prisma migrate dev --name init
```

### بذر البيانات الأولية
```bash
npm run db:seed
```

### تشغيل الـ Backend
```bash
npm run dev
```

---

## إعداد Frontend

```bash
cd frontend
npm install
npm start
```

---

## حسابات تجريبية
| الدور | البريد | كلمة المرور |
|-------|--------|-------------|
| مسؤول | admin@university.edu | admin123 |
| طالب | student1@university.edu | student123 |
| طالب | student2@university.edu | student123 |

---

## المسارات (API Routes)
- `POST /api/auth/register` — تسجيل حساب جديد
- `POST /api/auth/login` — تسجيل الدخول
- `GET /api/auth/me` — معلومات المستخدم الحالي
- `GET /api/courses` — قائمة المقررات
- `GET /api/courses/my` — مقررات الطالب
- `GET /api/evaluations/my` — تقييمات الطالب
- `POST /api/evaluations` — إرسال تقييم
- `GET /api/analytics/dashboard` — إحصائيات الـ Admin
- `GET /api/analytics/leaderboard` — لوحة المتصدرين
- `GET /api/contact/my` — رسائل الطالب
- `POST /api/contact` — إرسال رسالة للإدارة
