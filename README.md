# Introduction
This project projects the remainder of the current MLB season and provides up to date postseason odds
and projections for the current day's games. A website will be set up once deployed to production.

# To run locally
1. Connect a local MongoDB for the data
2. Create a .env file in `mlb-backend`. This file should contain
    `MONGODB_IP={local mongo ip}` and `PORT={port number}`
3. In `mlb-backend`, run `npm run simulate` to load today's data to the mongoDB. Note
    that this should be run before any games are played and locally must be run once a day.
4. In `mlb-backend`, run `yarn startdev` to start the local backend server.
5. In `mlb-frontend`, run `ng serve`.