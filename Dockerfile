# المرحلة الأولى: البناء
FROM node:20-alpine AS builder

# تحديد مجلد العمل داخل الحاوية
WORKDIR /app

# نسخ ملفات المشروع
COPY . .

# تثبيت التبعيات
RUN npm install

# بناء المشروع (ينتج مجلد .output)
RUN npm run build

# المرحلة الثانية: التشغيل
FROM node:20-alpine

# مجلد العمل في الحاوية النهائية
WORKDIR /app

# نسخ فقط ملفات التشغيل من المرحلة السابقة
COPY --from=builder /app/.output .output
COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules

# فتح المنفذ الذي يستخدمه Nuxt
EXPOSE 3000

# أمر التشغيل
CMD ["node", ".output/server/index.mjs"]
