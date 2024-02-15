## without using docker

```bash
$ npm install
```

## Running the db

```bash
# 
$ npx prisma generate

# execute migrations
$ npx prisma db push
```
## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Using docker
```bash
# prod
$ docker-compose up -d 

```

## Swagger Link = localhost:3000/swagger-doc