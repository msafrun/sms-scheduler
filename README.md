# SMS Scheduler

System that supposed to send SMS to a list of Schedules.

## Installation

```bash
npm install
```

## Usage

```bash
# create .env
BASE_URL = # api_url

# migrate db
# create db according to config.json
sequelize db:migrate

# run
npm start

# run test
npm run test # or
npm run coverage

# list of routes
api/v1/schedule/ # POST
api/v1/recepient/ # POST
api/v1/schedule/ # GET
api/v1/listSms/ # GET
```
