# Docker Commands Reference

## Development

### Build and run development container

```bash
docker-compose up sopa-dev
```

### Build development image only

```bash
docker-compose build sopa-dev
```

### Run development container in detached mode

```bash
docker-compose up -d sopa-dev
```

## Production

### Build and run production container

```bash
docker-compose --profile production up sopa-prod
```

### Build production image only

```bash
docker-compose --profile production build sopa-prod
```

### Run production container in detached mode

```bash
docker-compose --profile production up -d sopa-prod
```

## Direct Docker Commands

### Development

```bash
# Build development image
docker build -f Dockerfile.dev -t sopa-frontend:dev .

# Run development container
docker run -p 3000:3000 -v ${PWD}:/app -v /app/node_modules --name sopa-dev sopa-frontend:dev
```

### Production

```bash
# Build production image
docker build -t sopa-frontend:prod .

# Run production container
docker run -p 3000:3000 --name sopa-prod sopa-frontend:prod
```

## Utility Commands

### Stop all containers

```bash
docker-compose down
```

### Remove all containers and images

```bash
docker-compose down --rmi all
```

### View logs

```bash
docker-compose logs sopa-dev
# or
docker-compose logs sopa-prod
```

### Access container shell

```bash
docker-compose exec sopa-dev sh
# or
docker-compose exec sopa-prod sh
```

### Clean up Docker system

```bash
docker system prune -a
```

## Environment Variables

You can create a `.env` file in the project root to set environment variables:

```env
NODE_ENV=development
API_URL=http://localhost:8080
DATABASE_URL=postgresql://user:password@localhost:5432/sopa
```

## Notes

- The development container uses volume mounting for hot reloading
- The production container uses a multi-stage build for optimized image size
- Both containers expose port 3000
- The application runs on `http://localhost:3000`
