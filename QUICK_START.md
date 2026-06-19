# 🚀 Guía de Inicio Rápido - Semillero IOT E ITSS

## 📋 Estado de tu Sistema

- ✅ **PostgreSQL**: Instalado (v15.18)
- ❌ **Node.js**: NO instalado (requerido v20+)
- ❌ **Docker**: NO instalado (opcional)

---

## ⚡ Opción 1: Instalación Rápida (Recomendado)

### Paso 1: Instalar Node.js 20 LTS

**Opción A: Con Homebrew (recomendado)**
```bash
# Si tienes Homebrew instalado
brew install node@20

# Agregar a PATH
echo 'export PATH="/usr/local/opt/node@20/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc

# Verificar instalación
node --version  # Debe mostrar v20.x.x
npm --version   # Debe mostrar v10.x.x
```

**Opción B: Instalador oficial**
1. Ve a: https://nodejs.org/en/download/
2. Descarga el instalador para macOS (LTS)
3. Ejecuta el instalador
4. Reinicia la terminal

### Paso 2: Configurar Base de Datos PostgreSQL

```bash
# Crear base de datos
createdb semillero_iot

# O si necesitas usuario/contraseña:
psql postgres
CREATE DATABASE semillero_iot;
CREATE USER postgres WITH ENCRYPTED PASSWORD 'postgres';
GRANT ALL PRIVILEGES ON DATABASE semillero_iot TO postgres;
\q
```

### Paso 3: Configurar y Ejecutar Backend

```bash
cd /Users/KSANC27/Documents/semillero-iot-react-node/backend

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env

# Editar .env con tus configuraciones
nano .env

# IMPORTANTE: Configurar estas variables:
# DATABASE_URL=postgresql://postgres:postgres@localhost:5432/semillero_iot?schema=public
# JWT_SECRET=un_secret_muy_seguro_de_al_menos_32_caracteres

# Generar cliente Prisma
npx prisma generate

# Ejecutar migraciones
npx prisma migrate dev --name init

# Iniciar backend en desarrollo
npm run dev
```

El backend estará corriendo en: **http://localhost:3000**

### Paso 4: Configurar y Ejecutar Frontend (En otra terminal)

```bash
cd /Users/KSANC27/Documents/semillero-iot-react-node/frontend

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env

# Editar si es necesario
nano .env

# Iniciar frontend en desarrollo
npm run dev
```

El frontend estará corriendo en: **http://localhost:5173**

---

## 🎯 Verificación Rápida

### Backend Health Check
```bash
curl http://localhost:3000/health
# Debe retornar: {"status":"ok", ...}
```

### Frontend
Abre tu navegador en: **http://localhost:5173**

---

## 🐳 Opción 2: Instalar Docker (Opcional)

Si prefieres usar Docker para evitar configuraciones manuales:

```bash
# Descargar Docker Desktop para Mac
open https://www.docker.com/products/docker-desktop/

# Después de instalar, verifica:
docker --version
docker compose version

# Ejecutar el proyecto con Docker
cd /Users/KSANC27/Documents/semillero-iot-react-node
docker compose up -d

# Ver logs
docker compose logs -f

# Detener
docker compose down
```

---

## ⚠️ Troubleshooting

### Error: "Cannot find module"
```bash
cd backend && npm install
cd frontend && npm install
```

### Error: "Port 3000 already in use"
```bash
# Encontrar proceso usando el puerto
lsof -ti:3000
# Matar el proceso
kill -9 $(lsof -ti:3000)
```

### Error: "Database connection failed"
```bash
# Verificar que PostgreSQL está corriendo
brew services list | grep postgresql

# Iniciar PostgreSQL si está detenido
brew services start postgresql@15

# O manualmente:
pg_ctl -D /usr/local/var/postgres start
```

### Error: "JWT_SECRET debe tener al menos 32 caracteres"
```bash
# Generar un secret seguro
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Copiar el resultado y pegarlo en .env como JWT_SECRET
```

---

## 📚 Comandos Útiles

### Backend
```bash
npm run dev          # Desarrollo con hot-reload
npm run build        # Compilar TypeScript
npm run start        # Producción
npm run test         # Ejecutar tests
npm run lint         # Verificar código
```

### Frontend
```bash
npm run dev          # Desarrollo
npm run build        # Build producción
npm run preview      # Preview del build
npm run test         # Tests con Vitest
npm run lint         # ESLint
```

### Base de Datos
```bash
npx prisma studio    # UI visual de la BD
npx prisma migrate dev    # Crear migración
npx prisma db seed   # Poblar datos de prueba
```

---

## 🎨 Próximos Pasos

Una vez que ambos servicios estén corriendo:

1. **Visita** http://localhost:5173 para ver la aplicación
2. **Explora** la animación 3D del Hero
3. **Prueba** crear proyectos y posts desde el admin (si implementas)
4. **Revisa** la documentación en `/docs`

---

## 💡 Datos de Prueba (Opcional)

Si quieres poblar la base de datos con datos de ejemplo, crea un archivo seed:

```bash
# backend/prisma/seed.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Crear proyecto de ejemplo
  await prisma.project.create({
    data: {
      name: 'Sistema IoT de Monitoreo Ambiental',
      shortDesc: 'Plataforma de sensores para medir calidad del aire en tiempo real',
      documentation: 'Proyecto que integra sensores Arduino con conectividad IoT...',
      mainImage: 'https://via.placeholder.com/400x250?text=IoT+Project',
      repoUrl: 'https://github.com/semillero-iot/proyecto-1',
    },
  });

  // Crear post de ejemplo
  await prisma.post.create({
    data: {
      title: 'Feria Andina Traffic 2024',
      content: 'El semillero participó en la feria con 3 proyectos innovadores...',
      mainImage: 'https://via.placeholder.com/400x250?text=Evento',
      eventLink: 'https://example.com/evento',
    },
  });

  console.log('✅ Datos de prueba creados');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
```

Ejecutar seed:
```bash
cd backend
npx tsx prisma/seed.ts
```

---

**¿Necesitas ayuda?**
- 📧 Email: semillero@unipiloto.edu.co
- 📚 Documentación completa: Ver README.md
