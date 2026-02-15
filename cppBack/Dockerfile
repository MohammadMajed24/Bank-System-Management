# 1. استخدام أوبونتو
FROM ubuntu:latest

# 2. تحديث النظام وتثبيت المترجم ومكتبات MariaDB
# حذفنا wget لأننا لم نعد نحتاجه
RUN apt-get update && apt-get install -y \
    g++ \
    build-essential \
    libmariadb-dev \
    libssl-dev

# 3. تحديد مجلد العمل
WORKDIR /app

# (تم حذف خطوة تحميل Crow من هنا)
# سنعتمد على الملفات الموجودة في مجلد libs الذي سينسخ في الخطوة التالية

# 4. نسخ ملفات المشروع (بما فيها مجلد libs)
COPY . .

# 5. تجميع الكود
# بما أنك نسخت libs، المترجم سيجد Crow داخل ./libs/crow
RUN g++ -o my_server *.cpp Classes/*.cpp \
    -std=c++17 \
    -I. \
    -I./libs/crow -I./libs/asio \
    -I/usr/include/mariadb \
    -lpthread -lmariadb \
    -DCROW_USE_STANDALONE_ASIO

# 6. فتح البورت
EXPOSE 10000

# 7. التشغيل
CMD ["./my_server"]