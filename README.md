# RSSchool NodeJS websocket task

## Installation

1. Clone/download repo

2. Install dependencies:

    ```bash
    npm install
    ```

3. Start Static http server
   * `http://localhost:8181` with nodemon:

    ```bash
    npm run start
    ```

    * OR without nodemon:

    ```bash
    npm run start:dev
    ```

4. Start Websocket server:

    ```bash
    npm run startWS
    ```

5. App available for test, continue to <http://localhost:8181>

## All commands

Command | Description
--- | ---
`npm run start:dev` | App served @ `http://localhost:8181` with nodemon
`npm run start` | App served @ `http://localhost:8181` without nodemon
`npm run startWS` | Websocket server on 3000 port by default

### Requests and responses

personal response
`reg` - player registration/login
response for the game room
`create_game` - game id and player id (unique id for user in this game)
`start_game` - information about game and player's ships positions
`turn` - who is shooting now
`attack` - coordinates of shot and status
`finish` - id of the winner
response for all
`update_room` - list of rooms and players in rooms
`update_winners` - send score table to players
