# 🐝 Semillero IOT E ITSS - Universidad Piloto de Colombia

## 🏗️ Arquitectura del Proyecto

Proyecto profesional con arquitectura moderna siguiendo principios SOLID, Clean Architecture y mejores prácticas de seguridad según ISO 27001 y AWS Well-Architected Framework.

```
semillero-iot-react-node/
├── backend/                    # API REST Node.js + Express + TypeScript
│   ├── src/
│   │   ├── config/            # Configuraciones (DB, env, constants)
│   │   ├── controllers/       # Controladores de rutas
│   │   ├── middlewares/       # Autenticación, validación, errores
│   │   ├── models/            # Modelos de datos (Mongoose/Sequelize)
│   │   ├── routes/            # Definición de endpoints
│   │   ├── services/          # Lógica de negocio
│   │   ├── utils/             # Helpers y utilidades
│   │   └── types/             # Tipos TypeScript
│   └── tests/                 # Pruebas unitarias e integración
│       ├── unit/
│       └── integration/
├── frontend/                   # React 18 + TypeScript + Vite
│   ├── public/                # Recursos estáticos
│   └── src/
│       ├── components/        # Componentes reutilizables
│       │   ├── common/        # Botones, Cards, etc.
│       │   ├── layout/        # Header, Footer, Layout
│       │   └── sections/      # Hero, Projects, Blog, etc.
│       ├── hooks/             # Custom React Hooks
│       ├── services/          # Llamadas API
│       ├── utils/             # Funciones auxiliares
│       ├── types/             # Tipos TypeScript
│       ├── styles/            # CSS/SCSS globales
│       └── assets/            # Imágenes, modelos 3D
└── docs/                      # Documentación técnica
```

## 🔒 Principios de Seguridad Implementados

- **Least Privilege**: Acceso mínimo necesario en todas las operaciones
- **Cifrado**: HTTPS obligatorio, secrets en variables de entorno
- **Validación**: Input validation con Joi/Zod en todas las entradas
- **Rate Limiting**: Protección contra abuso de API
- **CORS**: Configuración restrictiva por dominio
- **Helmet**: Headers de seguridad HTTP
- **SQL Injection Prevention**: Uso de ORM con prepared statements
- **XSS Protection**: Sanitización de inputs y Content Security Policy

## 🧪 Cobertura de Pruebas

- **Unitarias**: Jest para lógica de negocio
- **Integración**: Supertest para endpoints API
- **E2E**: Cypress para flujos completos
- **Cobertura mínima**: 80%

## 📊 Observabilidad

- **Logging**: Winston con niveles estructurados
- **Métricas**: Prometheus + Grafana
- **Trazabilidad**: Correlation ID en todas las peticiones
- **Health Checks**: Endpoints `/health` y `/ready`

## 🚀 Stack Tecnológico

### Backend
- **Runtime**: Node.js 20 LTS
- **Framework**: Express.js 4
- **Lenguaje**: TypeScript 5
- **Base de Datos**: PostgreSQL 16 / MongoDB 7
- **ORM**: Prisma / Mongoose
- **Validación**: Zod
- **Testing**: Jest + Supertest
- **Documentación**: Swagger/OpenAPI 3

### Frontend
- **Framework**: React 18
- **Lenguaje**: TypeScript 5
- **Build Tool**: Vite 5
- **UI Library**: Tailwind CSS 3 + ShadCN UI
- **Animaciones**: Three.js + Framer Motion
- **State Management**: Zustand / React Query
- **Testing**: Vitest + React Testing Library
- **E2E**: Cypress

### DevOps
- **Containerización**: Docker + Docker Compose
- **CI/CD**: GitHub Actions
- **Linting**: ESLint + Prettier
- **Pre-commit**: Husky + Lint-staged
- **Monitoreo**: Winston + Morgan

## 📦 Instalación

### Prerrequisitos
- Node.js >= 20.x
- npm >= 10.x
- PostgreSQL >= 16.x / MongoDB >= 7.x
- Docker (opcional)

### Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Configurar variables de entorno en .env
npm run db:migrate
npm run dev
```

### Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env
# Configurar URL del backend
npm run dev
```

### Docker Setup (Recomendado)

```bash
docker-compose up -d
```

## 🧑‍💻 Desarrollo

### Backend
```bash
npm run dev          # Modo desarrollo con hot-reload
npm run build        # Compilar TypeScript
npm run start        # Producción
npm run test         # Pruebas unitarias
npm run test:int     # Pruebas de integración
npm run lint         # Verificar código
npm run format       # Formatear código
```

### Frontend
```bash
npm run dev          # Servidor desarrollo
npm run build        # Build producción
npm run preview      # Preview build
npm run test         # Pruebas unitarias
npm run test:e2e     # Pruebas E2E
npm run lint         # Verificar código
```

## 📝 Convenciones de Código

### Git Commits (Conventional Commits)
```
feat: Nueva funcionalidad
fix: Corrección de bug
docs: Cambios en documentación
style: Formateo, punto y coma, etc.
refactor: Refactorización de código
test: Agregar o modificar pruebas
chore: Mantenimiento
```

### Nombres de Ramas
```
feature/nombre-funcionalidad
bugfix/nombre-bug
hotfix/nombre-hotfix
release/version
```

## 🔐 Variables de Entorno

### Backend (.env)
```
NODE_ENV=development
PORT=3000
DATABASE_URL=postgresql://user:pass@localhost:5432/semillero
JWT_SECRET=<<SECRET_KEY>>
JWT_EXPIRATION=7d
CORS_ORIGIN=http://localhost:5173
RATE_LIMIT_MAX=100
LOG_LEVEL=info
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:3000/api
VITE_APP_NAME=Semillero IOT E ITSS
```

## 📊 Modelo de Datos

### Post (Eventos/Blog)
- id, titulo, contenido, fecha_inicio, fecha_fin
- imagen, enlace_evento, imagenes[]

### Proyecto (Laboratorio)
- id, nombre, descripcion_corta, documentacion
- imagen, fecha_inicio, enlace_repositorio, imagenes[]

## 🎨 Diseño y UX

- **Responsive**: Mobile-first design
- **Accesibilidad**: WCAG 2.1 AA
- **Performance**: Lighthouse Score > 90
- **Animaciones**: 60fps, hardware-accelerated
- **Loading States**: Skeletons y spinners
- **Error Handling**: Mensajes amigables

## 🛡️ Seguridad y Cumplimiento

- **ISO 27001**: Controles de seguridad implementados
- **OWASP Top 10**: Mitigaciones aplicadas
- **GDPR**: Manejo seguro de datos personales
- **Auditoría**: Logs de todas las operaciones críticas

## 📖 Documentación Adicional

- [Arquitectura de Software](./docs/ARCHITECTURE.md)
- [Guía de Desarrollo](./docs/DEVELOPMENT.md)
- [API Documentation](./docs/API.md)
- [Guía de Deployment](./docs/DEPLOYMENT.md)
- [Runbook de Operaciones](./docs/RUNBOOK.md)

## 👥 Equipo

**Director de Investigación**: Luis Felipe Herrera Quintero  
**Capítulo Estudiantil**: IEEE Universidad Piloto de Colombia  
**Sesiones**: Jueves - Edificio F, Laboratorios Sótano

## 📄 Licencia

Este proyecto es propiedad de la Universidad Piloto de Colombia - Semillero IOT E ITSS.

---

**Versión**: 2.0.0  
**Última actualización**: 2026-06-18
