#!/bin/bash

# Script para verificar la estructura del carrusel

echo "🏗️  Verificando estructura del carrusel..."
echo ""

# Verificar carpeta carrousel
if [ -d "carrousel" ]; then
    echo "✅ Carpeta 'carrousel' existe"
else
    echo "❌ Carpeta 'carrousel' NO existe"
    exit 1
fi

# Verificar carpeta img
if [ -d "carrousel/img" ]; then
    echo "✅ Carpeta 'carrousel/img' existe"
    IMAGE_COUNT=$(find carrousel/img -type f \( -name "*.jpg" -o -name "*.jpeg" -o -name "*.png" -o -name "*.gif" -o -name "*.webp" \) 2>/dev/null | wc -l)
    echo "📸 Imágenes encontradas: $IMAGE_COUNT"
else
    echo "❌ Carpeta 'carrousel/img' NO existe"
    exit 1
fi

# Verificar archivos principales
echo ""
echo "Verificando archivos principales..."

files=("package.json" "server.js" "index.html" "script.js" "style.css")

for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file"
    else
        echo "❌ $file NO encontrado"
    fi
done

echo ""
echo "✨ Estructura verificada. Para iniciar el servidor ejecuta: npm start"
