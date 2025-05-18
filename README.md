# RSSchool NodeJS websocket task template
> Static http server and base task packages. 
> By default WebSocket client tries to connect to the 3000 port.

## Installation
1. Clone/download repo
2. `npm install`

## Usage
**Development**

`npm run start:dev`

* App served @ `http://localhost:8181` with nodemon

**Production**

`npm run start`

* App served @ `http://localhost:8181` without nodemon

---

**All commands**

Command | Description
--- | ---
`npm run start:dev` | App served @ `http://localhost:8181` with nodemon
`npm run start` | App served @ `http://localhost:8181` without nodemon

**Note**: replace `npm` with `yarn` in `package.json` if you use yarn.

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
