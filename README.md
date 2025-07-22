# SOPA Frontend

Esta es una aplicación Next.js para el sistema SOPA (Sistema de Organización de Programación Académica).

## 🚀 Inicio Rápido

### Desarrollo Local

```bash
npm install
npm run dev
```

### Desarrollo con Docker

```bash
# Windows
start.bat dev

# Linux/Mac
./start.sh dev
```

## 🐳 Configuración de Docker

Este proyecto incluye una configuración completa de Docker para entornos de desarrollo y producción.

### Requisitos Previos

- Docker Desktop instalado y ejecutándose
- Docker Compose

### Desarrollo con Docker

1. **Iniciar entorno de desarrollo:**

   ```bash
   docker-compose up sopa-dev
   ```

   O usar el script de inicio:

   ```bash
   # Windows
   start.bat dev

   # Linux/Mac
   ./start.sh dev
   ```

2. **Acceder a la aplicación:**
   - Abrir [http://localhost:3000](http://localhost:3000) en su navegador
   - Los cambios en el código se recargarán automáticamente en la aplicación

### Producción con Docker

1. **Iniciar entorno de producción:**

   ```bash
   docker-compose -f docker-compose.prod.yml up --build sopa-frontend
   ```

   O usar el script de inicio:

   ```bash
   # Windows
   start.bat prod

   # Linux/Mac
   ./start.sh prod
   ```

2. **Iniciar producción con Nginx (recomendado):**

   ```bash
   docker-compose -f docker-compose.prod.yml --profile with-nginx up --build
   ```

   O usar el script de inicio:

   ```bash
   # Windows
   start.bat nginx

   # Linux/Mac
   ./start.sh nginx
   ```

### Referencia de Comandos Docker

| Comando                                                      | Descripción                     |
| ------------------------------------------------------------ | ------------------------------- |
| `docker-compose up sopa-dev`                                 | Iniciar servidor de desarrollo  |
| `docker-compose -f docker-compose.prod.yml up sopa-frontend` | Iniciar servidor de producción  |
| `docker-compose down`                                        | Detener todos los contenedores  |
| `docker-compose logs sopa-dev`                               | Ver logs de desarrollo          |
| `docker-compose exec sopa-dev sh`                            | Acceder al shell del contenedor |

## 🏗️ Arquitectura

### Stack Tecnológico

- **Framework:** Next.js 15
- **Lenguaje:** TypeScript
- **Estilos:** Tailwind CSS
- **Componentes UI:** HeroUI
- **Iconos:** Heroicons
- **Gestión de Estado:** TanStack Query
- **Cliente HTTP:** Axios

### Estructura del Proyecto

```
src/
├── app/                    # Next.js App Router
│   ├── academic-program/   # Gestión de programas académicos
│   ├── academic-schedule/  # Gestión de horarios
│   ├── classrooms/        # Gestión de aulas
│   ├── groups/            # Gestión de grupos
│   ├── pensum/            # Gestión de currículos
│   └── subjects/          # Gestión de materias
├── components/            # Componentes UI reutilizables
├── hooks/                 # Hooks personalizados de React
├── services/              # Servicios de API
├── interfaces/            # Interfaces de TypeScript
└── utils/                 # Funciones utilitarias
```

## 📝 Variables de Entorno

Crear un archivo `.env.local` en el directorio raíz:

```env
NODE_ENV=development
API_URL=http://localhost:8080
DATABASE_URL=postgresql://user:password@localhost:5432/sopa
```

## 🔧 Desarrollo

### Scripts Disponibles

| Script          | Descripción                    |
| --------------- | ------------------------------ |
| `npm run dev`   | Iniciar servidor de desarrollo |
| `npm run build` | Construir para producción      |
| `npm run start` | Iniciar servidor de producción |
| `npm run lint`  | Ejecutar ESLint                |

### Características de Desarrollo con Docker

- **Recarga en caliente:** Los cambios se reflejan automáticamente
- **Montaje de volúmenes:** El código fuente se monta para actualizaciones instantáneas
- **Mapeo de puertos:** Acceso a la aplicación en `localhost:3000`
- **Aislamiento de red:** Los contenedores se ejecutan en su propia red

## 🚀 Despliegue en Producción

### Características de Producción con Docker

- **Construcciones multi-etapa:** Tamaño de imagen optimizado
- **Seguridad:** Ejecución de usuario no root
- **Verificaciones de salud:** Monitoreo automático de salud del contenedor
- **Proxy Nginx:** Proxy reverso opcional con caché
- **Listo para SSL:** Configuración fácil de HTTPS con montaje de certificados

### Pasos de Despliegue

1. **Construir imagen de producción:**

   ```bash
   docker build -t sopa-frontend:prod .
   ```

2. **Ejecutar contenedor de producción:**

   ```bash
   docker run -p 3000:3000 --name sopa-prod sopa-frontend:prod
   ```

3. **Con Nginx (recomendado):**
   ```bash
   docker-compose -f docker-compose.prod.yml --profile with-nginx up -d
   ```

## 📊 Monitoreo

### Verificación de Salud

La aplicación incluye un endpoint de verificación de salud en `/api/health` que proporciona:

- Tiempo de actividad de la aplicación
- Información del entorno
- Marca de tiempo
- Información de versión

### Logs

Acceder a los logs del contenedor:

```bash
docker-compose logs -f sopa-dev
```

## 🔒 Seguridad

- **Usuario no root:** Los contenedores de producción se ejecutan como no root
- **Headers de seguridad:** Nginx agrega headers de seguridad
- **Limitación de velocidad:** Limitación de velocidad de API vía Nginx
- **Escaneo de imágenes:** Usar `docker scan` para verificaciones de vulnerabilidades

## 📦 Imágenes Docker

- **Desarrollo:** `node:18-alpine` con dependencias de desarrollo
- **Producción:** Construcción multi-etapa con tamaño de imagen optimizado
- **Nginx:** `nginx:alpine` para proxy reverso

## 🤝 Contribuir

1. Hacer fork del repositorio
2. Crear tu rama de característica (`git checkout -b feature/CaracteristicaIncreible`)
3. Hacer commit de tus cambios (`git commit -m 'Agregar alguna CaracteristicaIncreible'`)
4. Hacer push a la rama (`git push origin feature/CaracteristicaIncreible`)
5. Abrir un Pull Request

## 🆘 Solución de Problemas

### Problemas Comunes

1. **Docker no inicia:**

   - Asegurar que Docker Desktop esté ejecutándose
   - Verificar recursos del sistema (RAM, espacio en disco)

2. **Puerto ya en uso:**

   - Detener otros servicios usando el puerto 3000
   - Usar puerto diferente: `docker run -p 3001:3000 ...`

3. **Docker Compose not found:**

   - Install docker-compose: `sudo apt install docker-compose`
   - Or use Docker Compose V2: `docker compose` (with space instead of hyphen)

4. **Build failures:**
   - Clear Docker cache: `docker system prune -a`
   - Check network connectivity for package downloads
   - Ensure you're on the correct branch with latest code: `git pull origin production/v1`

### Getting Help

- Check the [DOCKER.md](./DOCKER.md) for detailed Docker instructions
- Review container logs: `docker-compose logs [service-name]`
- Access container shell: `docker-compose exec [service-name] sh`
