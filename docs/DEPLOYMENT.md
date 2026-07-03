# 🚀 Guía de Deployment

## Prerequisitos para Producción

- [ ] **Secrets**: Reemplazar todos los placeholders `<<...>>` con secrets corporativos aprobados
- [ ] **Infraestructura**: Validar módulos IaC/CloudFormation aprobados
- [ ] **Red**: Revisar VPC, Security Groups, Load Balancers con Seguridad/Red
- [ ] **Certificados**: Solicitar certificados SSL/TLS válidos (ACM o PKI interna)
- [ ] **Monitoreo**: Configurar CloudWatch/Datadog/Splunk según estándar
- [ ] **Backups**: Activar RDS automated backups, retention según política
- [ ] **DR**: Validar estrategia de Disaster Recovery (RPO/RTO)
- [ ] **Compliance**: Revisar con Compliance/Legal si hay datos sensibles

## Opciones de Deployment

### 1. Docker Compose (Desarrollo/Testing)

```bash
# Copiar archivo de entorno
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# Configurar secrets (NO USAR DEFAULTS EN PRODUCCIÓN)
nano backend/.env

# Iniciar servicios
docker-compose up -d

# Ver logs
docker-compose logs -f

# Detener servicios
docker-compose down
```

### 2. AWS ECS/Fargate (Recomendado para Producción)

```bash
# 1. Crear repositorio ECR
aws ecr create-repository --repository-name semillero-backend
aws ecr create-repository --repository-name semillero-frontend

# 2. Build y push de imágenes
./scripts/build-and-push.sh

# 3. Deploy con CloudFormation/Terraform
# Usar módulos aprobados del repositorio interno
aws cloudformation deploy \
  --template-file infrastructure/ecs-stack.yaml \
  --stack-name semillero-prod \
  --parameter-overrides \
    Environment=production \
    VpcId=<<VPC_ID>> \
    SubnetIds=<<SUBNET_IDS>> \
    CertificateArn=<<ACM_CERT_ARN>>
```

### 3. Kubernetes (EKS)

```bash
# 1. Configurar kubectl
aws eks update-kubeconfig --name cluster-name

# 2. Crear namespace
kubectl create namespace semillero-prod

# 3. Aplicar manifiestos
kubectl apply -f k8s/

# 4. Verificar deployment
kubectl get pods -n semillero-prod
kubectl get svc -n semillero-prod
```

## Checklist Pre-Deployment

### Seguridad
- [ ] Secrets en AWS Secrets Manager / Parameter Store (NO en código/env files)
- [ ] IAM Roles con least privilege
- [ ] Security Groups con reglas mínimas necesarias
- [ ] Activar encryption at rest (RDS, EBS, S3)
- [ ] Activar encryption in transit (TLS 1.2+)
- [ ] WAF configurado (rate limiting, SQL injection, XSS)
- [ ] Escaneo de vulnerabilidades (SCA/SAST) aprobado

### Base de Datos
- [ ] RDS Multi-AZ habilitado
- [ ] Automated backups configurados (retention: 7-30 días)
- [ ] Encryption at rest habilitado
- [ ] Connection pooling configurado
- [ ] Migraciones probadas en staging

### Networking
- [ ] ALB con certificado SSL válido
- [ ] DNS configurado (Route 53)
- [ ] CORS origins restrictivos
- [ ] Security Headers (CSP, HSTS, etc.)

### Observabilidad
- [ ] CloudWatch Logs configurados
- [ ] Métricas personalizadas enviadas
- [ ] Alarmas configuradas (CPU, memoria, errores)
- [ ] X-Ray habilitado para tracing
- [ ] Dashboard de monitoreo creado

### Continuidad
- [ ] Strategie de DR documentada
- [ ] Runbook operativo creado
- [ ] Rollback plan definido
- [ ] Health checks funcionando
- [ ] Graceful shutdown implementado

## Variables de Entorno - Producción

### Backend (AWS Systems Manager Parameter Store)

```bash
# Crear parámetros seguros
aws ssm put-parameter \
  --name /semillero/prod/DATABASE_URL \
  --value "postgresql://..." \
  --type SecureString

aws ssm put-parameter \
  --name /semillero/prod/JWT_SECRET \
  --value "<<SOLICITAR_A_SEGURIDAD>>" \
  --type SecureString
```

### Frontend

```bash
# Variables de build
VITE_API_URL=https://api.semillero.unipiloto.edu.co
VITE_APP_NAME=Semillero IOT E ITSS
```

## Monitoreo Post-Deployment

### Verificar Health Checks

```bash
# Backend health
curl https://api.semillero.unipiloto.edu.co/health
curl https://api.semillero.unipiloto.edu.co/ready

# Frontend
curl -I https://semillero.unipiloto.edu.co
```

### Revisar Métricas Iniciales

1. **Performance**
   - Response time < 200ms (p95)
   - Error rate < 0.1%
   - Throughput según carga esperada

2. **Infraestructura**
   - CPU usage < 70%
   - Memory usage < 80%
   - Disk usage < 75%

3. **Base de Datos**
   - Connection pool usage < 80%
   - Query time < 100ms (p95)
   - No deadlocks

## Rollback

En caso de problemas críticos:

```bash
# Docker Compose
docker-compose down
git checkout <previous-version>
docker-compose up -d

# AWS ECS
aws ecs update-service \
  --cluster semillero-prod \
  --service backend \
  --task-definition backend:previous-version \
  --force-new-deployment

# Kubernetes
kubectl rollout undo deployment/backend -n semillero-prod
kubectl rollout status deployment/backend -n semillero-prod
```

## Contactos de Escalamiento

- **Aplicación**: Equipo Desarrollo Semillero
- **Infraestructura**: Arquitectura Cloud / DevOps
- **Seguridad**: CISO / Equipo Seguridad
- **Base de Datos**: DBA Team
- **Networking**: Equipo Redes

---

**IMPORTANTE**: Este deployment debe ser revisado y aprobado por:
1. Arquitectura (validación de diseño)
2. Seguridad (validación de controles)
3. Compliance (si aplica, según datos manejados)
4. Operaciones (validación de runbook y monitoreo)
