# SOPA Frontend

This is a Next.js application for the SOPA (Sistema de Organización de Programación Académica) system.

## 🚀 Quick Start

### Local Development

```bash
npm install
npm run dev
```

### Docker Development

```bash
# Windows
start.bat dev

# Linux/Mac
./start.sh dev
```

## 🐳 Docker Setup

This project includes a complete Docker setup for both development and production environments.

### Prerequisites

- Docker Desktop installed and running
- Docker Compose

### Development with Docker

1. **Start development environment:**

   ```bash
   docker-compose up sopa-dev 
   ```

   Or use the startup script:

   ```bash
   # Windows
   start.bat dev

   # Linux/Mac
   ./start.sh dev
   ```

2. **Access the application:**
   - Open [http://localhost:3000](http://localhost:3000) in your browser
   - Changes to your code will automatically reload the application

### Production with Docker

1. **Start production environment:**

   ```bash
   docker-compose -f docker-compose.prod.yml up --build sopa-frontend
   ```

   Or use the startup script:

   ```bash
   # Windows
   start.bat prod

   # Linux/Mac
   ./start.sh prod
   ```

2. **Start production with Nginx (recommended):**

   ```bash
   docker-compose -f docker-compose.prod.yml --profile with-nginx up --build
   ```

   Or use the startup script:

   ```bash
   # Windows
   start.bat nginx

   # Linux/Mac
   ./start.sh nginx
   ```

### Docker Commands Reference

| Command                                                      | Description                        |
| ------------------------------------------------------------ | ---------------------------------- |
| `docker-compose up sopa-dev`                                 | Start development server           |
| `docker-compose -f docker-compose.prod.yml up sopa-frontend` | Start production server            |
| `docker-compose down`                                        | Stop all containers                |
| `docker-compose logs sopa-dev`                               | View development logs              |
| `docker-compose exec sopa-dev sh`                            | Access development container shell |

## 🏗️ Architecture

### Tech Stack

- **Framework:** Next.js 15
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** HeroUI
- **Icons:** Heroicons
- **State Management:** TanStack Query
- **HTTP Client:** Axios

### Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── academic-program/   # Academic program management
│   ├── academic-schedule/  # Schedule management
│   ├── classrooms/        # Classroom management
│   ├── groups/            # Group management
│   ├── pensum/            # Curriculum management
│   └── subjects/          # Subject management
├── components/            # Reusable UI components
├── hooks/                 # Custom React hooks
├── services/              # API services
├── interfaces/            # TypeScript interfaces
└── utils/                 # Utility functions
```

## 📝 Environment Variables

Create a `.env.local` file in the root directory:

```env
NODE_ENV=development
API_URL=http://localhost:8080
DATABASE_URL=postgresql://user:password@localhost:5432/sopa
```

## 🔧 Development

### Available Scripts

| Script          | Description              |
| --------------- | ------------------------ |
| `npm run dev`   | Start development server |
| `npm run build` | Build for production     |
| `npm run start` | Start production server  |
| `npm run lint`  | Run ESLint               |

### Docker Development Features

- **Hot reloading:** Changes are automatically reflected
- **Volume mounting:** Source code is mounted for instant updates
- **Port mapping:** Access the app on `localhost:3000`
- **Network isolation:** Containers run in their own network

## 🚀 Production Deployment

### Docker Production Features

- **Multi-stage builds:** Optimized image size
- **Security:** Non-root user execution
- **Health checks:** Automatic container health monitoring
- **Nginx proxy:** Optional reverse proxy with caching
- **SSL ready:** Easy HTTPS setup with certificate mounting

### Deployment Steps

1. **Build production image:**

   ```bash
   docker build -t sopa-frontend:prod .
   ```

2. **Run production container:**

   ```bash
   docker run -p 3000:3000 --name sopa-prod sopa-frontend:prod
   ```

3. **With Nginx (recommended):**
   ```bash
   docker-compose -f docker-compose.prod.yml --profile with-nginx up -d
   ```

## 📊 Monitoring

### Health Check

The application includes a health check endpoint at `/api/health` that provides:

- Application uptime
- Environment information
- Timestamp
- Version information

### Logs

Access container logs:

```bash
docker-compose logs -f sopa-dev
```

## 🔒 Security

- **Non-root user:** Production containers run as non-root
- **Security headers:** Nginx adds security headers
- **Rate limiting:** API rate limiting via Nginx
- **Image scanning:** Use `docker scan` for vulnerability checks

## 📦 Docker Images

- **Development:** `node:18-alpine` with development dependencies
- **Production:** Multi-stage build with optimized image size
- **Nginx:** `nginx:alpine` for reverse proxy

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Troubleshooting

### Common Issues

1. **Docker not starting:**

   - Ensure Docker Desktop is running
   - Check system resources (RAM, disk space)

2. **Port already in use:**

   - Stop other services using port 3000
   - Use different port: `docker run -p 3001:3000 ...`

3. **Permission issues:**

   - On Linux/Mac: `chmod +x start.sh`
   - Run Docker as administrator on Windows

4. **Build failures:**
   - Clear Docker cache: `docker system prune -a` 
   - Check network connectivity for package downloads

### Getting Help

- Check the [DOCKER.md](./DOCKER.md) for detailed Docker instructions
- Review container logs: `docker-compose logs [service-name]`
- Access container shell: `docker-compose exec [service-name] sh`
