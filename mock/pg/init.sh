# Create dir inside container
docker exec -d greenmoons-postgres-db mkdir mockData

docker cp mock/pg/init.sql greenmoons-postgres-db:mockData/init.sql

docker exec -d greenmoons-postgres-db psql -U postgres -f ./mockData/init.sql
