echo "Building docker-compose"
docker-compose build --no-cache

echo "Bringing up docker-compose"
docker-compose up -d