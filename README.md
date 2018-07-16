## App Name 

* AnteUp

## Install dependencies 

```sh
npm install
```

## Create .env file

* copy the .env.sample file to a file named .env and add your FaceBook ID and secret key

## Database set-up

```sh
createdb ante-up
knex migrate:latest
```

## Development server

```sh
npm run dev
```
