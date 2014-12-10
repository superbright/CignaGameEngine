# CIGNA STEP UP #
Node.js Game Engine

## INSTALLATION ##

* `git clone`
* `cd directory`
* `npm install`

## RUN ##

* Compile front-end files with gulp: `gulp`
* Run node server `npm start`
* Open [http://localhost:3000](http://localhost:3000)


### Documentation

The core controller of the system is `GameController`. This exposes the following methods:

#### `GameController.addPlayers()`

Takes an object representing a player and adds them to the upcoming game. This method will complain if 
you try to add more than two players or if there is already a game in progress.


#### `GameController.startGame()`

Start the game! Uses previously added players.



### API

Both of those methods are callable via an API

#### POST `/add-player`

Will expects a json object like

`
{
    "player": {
        "name": "Matthew",
        "email": "mpconlen@gmail.com"
    }
}
`

#### POST `/start-game`

Starts the game
