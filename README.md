#Bang Bang Pew Pew

##Background
A first person shooter is a classic style of computer game in which a player has a health meter that enemies can decrement. The player wanders 3d scenes populated with enemies and attempts to destroy them before the health meter runs out. Variations on this theme may introduce additional goals beyond enemy destruction such as finding and toggling other objects placed into the scene in order to unlock additional features or new scenes.

##Functionality and MVP

This game will allow users to:
- Start a game which renders a 3d scene
- Move their perspective within the 3d scene using their keyboard and/or mouse
- Encounter one or more enemies within the scene which shoot projectiles
- Have a health meter that is decremented when the user is hit by an enemy projectile
- Shoot projectiles within the scene and destroy enemies by hitting them with the projectiles
- Win by destroying all the enemies before the health meter gets to 0

Additionally this project will include:
- A production Readme
- An About modal describing the rules and controls

##Wireframes
![Intro](./assets/images/wf2.jpg)
![Game](./assets/images/wf1.jpg)

##Architecture and Technologies
This project will be implemented with the following Technologies:
- Vanilla Javascript and jquery for overall structure and game logic
- Three.js with WebGL for rendering 3d scenes

##Implementation Timeline

Day 1: Setup all necessary Node modules, including getting webpack up and running and three.js installed. Create webpack.config.js as well as package.json. Write a basic entry file and the bare script. Learn the basics of three.js. Goals for the day:

Get a green bundle with webpack
Learn enough three.js to render an object to the Canvas element and get some basic movement of the object on the screen.

Day 2: Dedicate this day to learning the three.js API. First, build out the main character object, the projectile objects, and the enemy objects. Then get them all rendering and able to move around the 3d scene by listening for keydown events. Goals for the day:
- Get basic objects rendering in the scene and interacting with the user controls

Day 3: Create basic landscape for the scene (walls, sky, ground, obstacles etc) and start building the game logic and AI logic for the enemies. Goals for the day:
- Have enemy objects populated on the scene and corralled in by the space limitations of my walls and/or obstacles.
- Have basic game functionality (projectiles can hit user and/or enemies, health that decrements accordingly, enemies shooting at you etc)

Day 4: Game Story, styling objects and surroundings, user controls modal, write Readme. Goals for the day:
- Clean everything up to where it is somewhat fun to play and ready to show off


##Bonus Features
This game can be improved/enhanced in a number of ways. Possible updates include:
- Improved enemy AI
- Improved 3d mesh design of the enemies, user-character, bullets, etc
- Added features like ammunition, health bonuses, varying weapons
- Increased map size and detailed scene design to simulate particular real-world locations
- Animation/effects for destruction of enemies
