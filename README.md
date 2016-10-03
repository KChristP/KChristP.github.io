# GhostBlaster

GhostBlaster is a 3D first person shooter game designed for web browsers that is implemented entirely on the front end. It uses Three.js to render the 3D scene and vanilla JavaScript for the game logic and DOM manipulation.

## Features & Implementation

### Filling out the 3D Scene

With three.js a scene is populated by adding a variety of `THREE.Mesh` objects which are given specific geometries and materials which affect how they will display in the scene. In order to see these objects, a camera is placed in the scene. Here a `THREE.PerspectiveCamera` was chosen and given a field of vision that fills the screen.
GhostBlaster uses `THREE.BoxGeometry` for the main player and the walls, floor, and ceiling, and `THREE.IcosahedronGeometry` for the villains and bullets.
In order to see everything, three.js provides a renderer which paints the scene onto the 2D screen. A helper function requestAnimationFrame was used which essentially is a setTimeout which is used to call a `render` function which ultimately calls the renderer. 

![Ghostblaster](images/Screen%20Shot%202016-09-16%20at%208.57.33%20AM.png)

### First Person Perspective

In order to create the user experience expected of a first person style game, a `THREE.camera` was made a child of the main player's (`cube`) mesh. This causes the camera's position and rotation values to be relative to the parent mesh's internal position and rotation values, making positioning and moving the camera relative to the main player fairly simple. The camera was then placed slightly above (y-axis) and behind (z-axis) the main player so that the player is visible within the camera's field of view.

### Movement

Movement is triggered by keydown events, and turned off by keyup events. The event toggles a variable tracking the direction of movement or rotation, and the renderer then checks to see if the variable has been toggled, and if so, translates the object's current position or rotation using some simple trigonometry: 
```
...
if(turningLeft){
      cube.rotation.y += 0.05
    }
    if(turningRight){
      cube.rotation.y -= 0.05
    }
    if(movingForward){
      if (Math.abs(cube.position.x) <= 22) {
        cube.position.x -= Math.sin(cube.rotation.y)/6
      }
...
if (Math.abs(cube.position.z) <= 22) {
        cube.position.z -= Math.cos(cube.rotation.y)/6
      } 
...
```

### Firing Bullets

Bullets are `Three.Mesh`'s which are created on keydown events at the position of the player, or when fired by villains, at the position of the villain.  In order to ensure they fly in the proper direction, bullets are stored in an array, and the y orientation of the firer of the bullet at the time it was fired is kept in a second trajectories array at a matching index. 
movement of bullets is treated much like movement of the main character, except that now in order to find the x and y movement must be calculated according to the y rotation from the trajectories array.

### Collision Detection and Map Limitations

In order to stop characters from wandering off the map, they had to have movement limited based on position but not so limited as to disturb game play. The solution used here was to check if the current position was near the map boundary, and if so, to reset it, very slightly, more within the boundary:
```
...
else if (cube.position.x >= 22) {
        cube.position.x = 21.99999999;
      } else if (cube.position.x <= -22) {
        cube.position.x = -21.99999999;
      }
...
```

To find out whether or not a bullet has collided with a villain or the user, the position of the bullet and each character were checked against eachother on each animation frame.

```
function detectCollision(object1, object2){
  return (Math.abs(object1.position.x - object2.position.x) < 1) &&
  (Math.abs(object1.position.z - object2.position.z) < 1)
}
...
spheres.forEach((sphere, index) => {
      sphere.position.x -= Math.sin(bulletYAngles[index])
      sphere.position.z -= Math.cos(bulletYAngles[index])
      villains.forEach((villain) => {
        if(detectCollision(villain, sphere)){
          villain.hits += 1
          if(villain.hits > 10){
            scene.remove(villain)
            villains.splice(villains.indexOf(villain), 1)
            villain = null
            cube.score += 1
            manageScore()
          } else {
            villain.material.color.setRGB(
              1/(villain.hits/4) * villain.material.color.r,
              1/(villain.hits/5) * villain.material.color.g,
              1/(villain.hits/5) * villain.material.color.b
            )
          }
        }
      })
    })
````

### Game Logic

Hit counts and health information for villains and the user were placed as properties directly on the mesh objects that represented them and incremented/decrimented when collisions occurred

## Future Developments
The next steps of this project ar outlined below:

### Short-Term Features
- radar tracking the position of villains
- health bonuses
- effects for destruction of villains
- extend the map to include more rooms

### Larger Features
- allow movement of user and villains and bullets in the y direction
- create game physics to regulate movement and allow jumping/falling

