# Инструкция по развертыванию на VM

## Шаг 1: Подключитесь к VM (10.0.0.184)

```bash
ssh user@10.0.0.184
```

## Шаг 2: Клонируйте или обновите проект

```bash
cd /path/to/project
git pull origin main
```

**Или** загрузите ZIP файл и разархивируйте.

## Шаг 3: Остановите старые контейнеры

```bash
docker compose down
```

## Шаг 4: Пересоберите и запустите

```bash
docker compose -f docker-compose.prod.yml up -d --build
```

## Шаг 5: Проверьте статус

```bash
docker compose ps
docker compose logs -f
```

## Шаг 6: Проверьте работу

Откройте http://chat.it4.iktim.no в браузере.

## Настройка Nginx Proxy Manager

В вашем Nginx Proxy Manager для `chat.it4.iktim.no`:

### Destination:
- **Forward Hostname/IP:** 10.0.0.184
- **Forward Port:** 80
- **Scheme:** http

### Custom locations (важно для WebSocket):

**Location:** `/socket.io/`

```
proxy_set_header Upgrade $http_upgrade;
proxy_set_header Connection "upgrade";
proxy_set_header Host $host;
proxy_set_header X-Real-IP $remote_addr;
proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
proxy_set_header X-Forwarded-Proto $scheme;
proxy_http_version 1.1;
proxy_read_timeout 86400;
```

## Отладка

### Проверить логи на VM:
```bash
docker compose logs app --tail 50
docker compose logs nginx --tail 50
```

### Проверить подключение к портам:
```bash
curl http://localhost
curl http://localhost:3001/socket.io/
```

### Перезапуск без пересборки:
```bash
docker compose restart
```
