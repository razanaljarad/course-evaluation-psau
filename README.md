# نظام تقييم المقررات الجامعية
## جامعة الأمير سطام بن عبدالعزيز

<div align="center">

![PSAU](https://img.shields.io/badge/جامعة-الأمير_سطام-2d7a6b?style=for-the-badge)
![Node.js](https://img.shields.io/badge/Node.js-v24-339933?style=for-the-badge&logo=node.js)
![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-18-336791?style=for-the-badge&logo=postgresql)
![Prisma](https://img.shields.io/badge/Prisma-v7-2D3748?style=for-the-badge)

</div>

---

## 📋 نظرة عامة

نظام إلكتروني متكامل لإدارة تقييم المقررات الدراسية الجامعية، يتيح للطلاب تقديم تقييماتهم في نهاية كل فصل دراسي، ويمكّن الإدارات الأكاديمية من متابعة النتائج وتحليلها من خلال لوحة معلومات متقدمة.

### الأهداف
- رفع كفاءة جمع البيانات وتحليلها
- دعم اتخاذ القرار الأكاديمي بمؤشرات دقيقة
- ضمان خصوصية الطلاب عبر التقييم المجهول
- تحفيز الطلاب على المشاركة عبر نظام الأوسمة والمكافآت

---

## 🏗️ المعمارية التقنية

```
course-evaluation-system/
├── backend/                          # Node.js + Express + Prisma
│   ├── prisma/
│   │   ├── schema.prisma             # تصميم قاعدة البيانات (7 جداول)
│   │   ├── seed.js                   # البيانات التجريبية
│   │   └── migrations/               # سجل تغييرات قاعدة البيانات
│   ├── src/
│   │   ├── index.js                  # نقطة الدخول الرئيسية
│   │   ├── controllers/              # منطق الأعمال (8 controllers)
│   │   │   ├── auth.controller.js
│   │   │   ├── course.controller.js
│   │   │   ├── evaluation.controller.js
│   │   │   ├── analytics.controller.js
│   │   │   ├── semester.controller.js
│   │   │   ├── question.controller.js
│   │   │   ├── user.controller.js
│   │   │   └── contact.controller.js
│   │   ├── routes/                   # تعريف مسارات الـ API (8 routes)
│   │   ├── middleware/               # المصادقة والتفويض
│   │   │   └── auth.middleware.js
│   │   └── lib/
│   │       └── prisma.js             # اتصال قاعدة البيانات
│   ├── .env                          # متغيرات البيئة
│   └── package.json
│
└── frontend/                         # React + TypeScript
    └── src/
        ├── App.tsx                   # التوجيه الرئيسي
        ├── pages/                    # الصفحات (11 صفحة)
        │   ├── Login.tsx
        │   ├── Register.tsx
        │   ├── StudentDashboard.tsx
        │   ├── AdminDashboard.tsx
        │   ├── SearchPage.tsx
        │   ├── BadgesPage.tsx
        │   ├── ContactPage.tsx
        │   ├── CoursesManagePage.tsx
        │   ├── InboxPage.tsx
        │   ├── ActivityPage.tsx
        │   └── ProfilePage.tsx
        ├── components/               # المكونات المشتركة
        │   ├── Navbar.tsx
        │   ├── Sidebar.tsx
        │   ├── EvaluationForm.tsx
        │   ├── ContactModal.tsx
        │   ├── ProtectedRoute.tsx
        │   └── PSAULogo.tsx
        ├── context/                  # إدارة الحالة العامة
        │   ├── AuthContext.tsx
        │   └── ThemeContext.tsx
        └── api/
            └── axios.ts              # طبقة التواصل مع API
```

---

## 🚀 تشغيل المشروع

### المتطلبات المسبقة
| الأداة | الإصدار |
|--------|---------|
| Node.js | v18 أو أعلى |
| PostgreSQL | v15 أو أعلى |
| npm | v9 أو أعلى |

### خطوات التشغيل

#### 1. إعداد قاعدة البيانات
```bash
# إنشاء قاعدة البيانات
psql -U postgres -c "CREATE DATABASE course_evaluation_db;"

# الانتقال لمجلد الـ Backend
cd backend

# تطبيق الـ Migration
npx prisma migrate dev

# توليد Prisma Client
npx prisma generate

# تشغيل البيانات التجريبية
node prisma/seed.js
```

#### 2. تشغيل الـ Backend
```bash
cd backend
npm run dev
# ✅ يعمل على: http://localhost:5000
```

#### 3. تشغيل الـ Frontend
```bash
cd frontend
npm start
# ✅ يعمل على: http://localhost:3000
```

---

## 👥 حسابات تجريبية

| الدور | البريد الإلكتروني | كلمة المرور |
|-------|------------------|-------------|
| 🔴 مسؤول | admin@university.edu | admin123 |
| 🟡 مدرس | instructor@university.edu | instructor123 |
| 🟢 طالب 1 | student1@university.edu | student123 |
| 🟢 طالب 2 | student2@university.edu | student123 |

---

## 🗄️ تصميم قاعدة البيانات

### جداول قاعدة البيانات

```
┌─────────────┐     ┌─────────────┐     ┌──────────────┐
│    User     │     │   Course    │     │   Semester   │
├─────────────┤     ├─────────────┤     ├──────────────┤
│ id (PK)     │     │ id (PK)     │     │ id (PK)      │
│ name        │     │ code        │     │ name         │
│ email       │     │ name        │     │ year         │
│ password    │     │ description │     │ term         │
│ role        │     │ instructorId│     │ isActive     │
│ studentId   │     │ semesterId  │     └──────────────┘
└──────┬──────┘     └──────┬──────┘
       │                   │
       │    ┌──────────────┴───┐     ┌─────────────┐
       │    │   Enrollment     │     │  Question   │
       │    ├──────────────────┤     ├─────────────┤
       │    │ id (PK)          │     │ id (PK)     │
       │    │ studentId (FK)   │     │ text        │
       │    │ courseId (FK)    │     │ category    │
       │    └──────────────────┘     │ order       │
       │                             │ isActive    │
       │    ┌──────────────────┐     └──────┬──────┘
       │    │   Evaluation     │            │
       │    ├──────────────────┤     ┌──────┴──────┐
       └────┤ studentId (FK)   │     │   Answer    │
            │ courseId (FK)    ├─────┤ evaluationId│
            │ semesterId (FK)  │     │ questionId  │
            │ comment          │     │ rating(1-5) │
            └──────────────────┘     └─────────────┘

┌──────────────────────┐
│   ContactMessage     │
├──────────────────────┤
│ id (PK)              │
│ studentId (FK)       │
│ subject              │
│ message              │
│ reply                │
│ isRead               │
└──────────────────────┘
```

### نماذج البيانات (Data Models)

**User**
```json
{
  "id": 1,
  "name": "Mohammed Ali",
  "email": "student1@university.edu",
  "role": "STUDENT",
  "studentId": "S20210001",
  "createdAt": "2024-01-01T00:00:00Z"
}
```

**Evaluation**
```json
{
  "id": 1,
  "studentId": 1,
  "courseId": 1,
  "semesterId": 1,
  "comment": "مقرر ممتاز ومفيد",
  "submittedAt": "2024-01-15T10:30:00Z",
  "answers": [
    { "questionId": 1, "rating": 4 },
    { "questionId": 2, "rating": 5 }
  ]
}
```

**ContactMessage**
```json
{
  "id": 1,
  "studentId": 1,
  "subject": "استفسار",
  "message": "نص الرسالة",
  "reply": "رد الإدارة",
  "isRead": true,
  "repliedAt": "2024-01-16T09:00:00Z"
}
```

---

## 📡 توثيق واجهات البرمجة (API Documentation)

**Base URL:** `http://localhost:5000/api`

**المصادقة:** Bearer Token (JWT) في header:
```
Authorization: Bearer <token>
```

---

### 🔐 Authentication

| Method | Endpoint | الوصف | المصادقة |
|--------|----------|-------|----------|
| `POST` | `/auth/register` | تسجيل مستخدم جديد | لا |
| `POST` | `/auth/login` | تسجيل الدخول | لا |
| `GET` | `/auth/me` | بيانات المستخدم الحالي | ✅ |

**POST /auth/login — Request:**
```json
{ "email": "student1@university.edu", "password": "student123" }
```
**Response:**
```json
{
  "token": "eyJhbGci...",
  "user": { "id": 1, "name": "Mohammed", "role": "STUDENT" }
}
```

---

### 📚 Courses

| Method | Endpoint | الوصف | الدور |
|--------|----------|-------|-------|
| `GET` | `/courses` | جميع المقررات | الكل |
| `GET` | `/courses/my` | مقرراتي المسجلة | STUDENT |
| `GET` | `/courses/:id` | تفاصيل مقرر | الكل |
| `POST` | `/courses` | إضافة مقرر | ADMIN |
| `PUT` | `/courses/:id` | تعديل مقرر | ADMIN |
| `DELETE` | `/courses/:id` | حذف مقرر | ADMIN |

---

### ✅ Evaluations

| Method | Endpoint | الوصف | الدور |
|--------|----------|-------|-------|
| `POST` | `/evaluations` | إرسال تقييم | STUDENT |
| `GET` | `/evaluations/my` | تقييماتي | STUDENT |
| `GET` | `/evaluations/course/:id` | تقييمات مقرر (مجهولة) | ADMIN/INSTRUCTOR |

**POST /evaluations — Request:**
```json
{
  "courseId": 1,
  "semesterId": 1,
  "comment": "رأي اختياري",
  "answers": [
    { "questionId": 1, "rating": 4 },
    { "questionId": 2, "rating": 5 }
  ]
}
```

---

### 📊 Analytics

| Method | Endpoint | الوصف | الدور |
|--------|----------|-------|-------|
| `GET` | `/analytics/dashboard` | إحصائيات لوحة التحكم | ADMIN |
| `GET` | `/analytics/courses` | تحليل المقررات | ADMIN/INSTRUCTOR |
| `GET` | `/analytics/leaderboard` | ترتيب الطلاب | الكل |

---

### 📅 Semesters

| Method | Endpoint | الوصف | الدور |
|--------|----------|-------|-------|
| `GET` | `/semesters` | جميع الفصول | الكل |
| `GET` | `/semesters/active` | الفصل الحالي | الكل |
| `POST` | `/semesters` | إضافة فصل | ADMIN |
| `PUT` | `/semesters/:id` | تعديل فصل | ADMIN |

---

### ❓ Questions

| Method | Endpoint | الوصف | الدور |
|--------|----------|-------|-------|
| `GET` | `/questions` | أسئلة التقييم | الكل |
| `POST` | `/questions` | إضافة سؤال | ADMIN |
| `PUT` | `/questions/:id` | تعديل سؤال | ADMIN |
| `DELETE` | `/questions/:id` | حذف سؤال | ADMIN |

---

### 💬 Contact

| Method | Endpoint | الوصف | الدور |
|--------|----------|-------|-------|
| `POST` | `/contact` | إرسال رسالة | STUDENT |
| `GET` | `/contact/my` | رسائلي | STUDENT |
| `GET` | `/contact` | جميع الرسائل | ADMIN |
| `PUT` | `/contact/:id/reply` | الرد على رسالة | ADMIN |
| `PUT` | `/contact/:id/read` | تحديد كمقروءة | ADMIN |

---

## 🔒 الأمان

| الجانب | التقنية المستخدمة |
|--------|-----------------|
| تشفير كلمات المرور | bcrypt (salt rounds: 10) |
| المصادقة | JWT (انتهاء: 7 أيام) |
| التفويض | Role-Based Access Control |
| خصوصية التقييم | التقييمات مجهولة الهوية |
| منع التكرار | Unique constraint على (studentId, courseId) |

---

## 🛠️ التقنيات المستخدمة

| الطبقة | التقنية | الإصدار |
|--------|---------|---------|
| Frontend Framework | React | 18 |
| Frontend Language | TypeScript | 5 |
| HTTP Client | Axios | — |
| Charts | Recharts | — |
| Routing | React Router | v6 |
| Backend Framework | Express.js | 4 |
| Backend Language | Node.js | 24 |
| ORM | Prisma | v7 |
| Database | PostgreSQL | 18 |
| Authentication | JWT + bcryptjs | — |
| Dev Server | Nodemon | 3 |
| Fonts | IBM Plex Sans Arabic | — |

---

## 🎯 ميزات المشروع

### للطالب
- ✅ تسجيل دخول وإنشاء حساب
- ✅ عرض المقررات المسجلة
- ✅ تقييم المقررات (مجهول + تعليق نصي)
- ✅ البحث عن أي مقرر وقراءة تقييماته
- ✅ نظام الأوسمة والمكافآت (خصومات مطعم الجامعة)
- ✅ لوحة المتصدرين
- ✅ التواصل مع الإدارة والرد
- ✅ Dark/Light Mode

### للمسؤول (Admin)
- ✅ لوحة تحكم مع رسوم بيانية
- ✅ إدارة المقررات (إضافة/حذف)
- ✅ صندوق البريد (قراءة والرد على الرسائل)
- ✅ إحصائيات الاستخدام ومنحنى التقييمات
- ✅ ترتيب أعلى المقررات تقييماً
- ✅ Dark/Light Mode

---

*تم تطوير هذا المشروع باستخدام IBM Bob — جامعة الأمير سطام بن عبدالعزيز — 2025*
