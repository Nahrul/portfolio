#!/bin/bash

# ==========================================
# Portfolio Installation Script
# ==========================================
# Script ini membantu setup database untuk portfolio

echo "========================================="
echo "Portfolio Database Installation"
echo "========================================="
echo ""

# Check if MySQL is available
if ! command -v mysql &> /dev/null; then
    echo "❌ MySQL tidak ditemukan. Silakan install MySQL terlebih dahulu."
    exit 1
fi

# Prompt for database credentials
read -p "MySQL Username (default: root): " DB_USER
DB_USER=${DB_USER:-root}

read -sp "MySQL Password: " DB_PASS
echo ""

read -p "MySQL Host (default: localhost): " DB_HOST
DB_HOST=${DB_HOST:-localhost}

# Create database and import SQL
echo ""
echo "📦 Creating database and importing data..."

if [ -z "$DB_PASS" ]; then
    mysql -h "$DB_HOST" -u "$DB_USER" < database.sql
else
    mysql -h "$DB_HOST" -u "$DB_USER" -p"$DB_PASS" < database.sql
fi

if [ $? -eq 0 ]; then
    echo "✅ Database berhasil dibuat!"
    echo ""
    echo "📝 Credentials yang digunakan:"
    echo "   Host: $DB_HOST"
    echo "   User: $DB_USER"
    echo ""
    echo "🔑 Demo Account:"
    echo "   Username: admin"
    echo "   Password: admin123"
    echo ""
    echo "📍 Akses aplikasi:"
    echo "   Public: http://localhost/portfolio/"
    echo "   Admin: http://localhost/portfolio/admin/login.php"
else
    echo "❌ Gagal membuat database. Periksa credentials Anda."
    exit 1
fi
