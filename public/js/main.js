

function setupGame(){
  window.loader = new THREE.TextureLoader();
  //Initial setup
  window.scene = new THREE.Scene();
  window.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  window.renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.getElementById('grey-out').appendChild(renderer.domElement);

  window.liveGame = false
  window.numberOfVillains = 10
  window.movingForward = false
  window.movingBackward = false
  window.turningLeft = false
  window.turningRight = false
  window.shooting = false
  // Meshes
  let cubeGeometry = new THREE.BoxGeometry( 0.5, 0.5, 1 )
  window.sphereGeometry = new THREE.IcosahedronGeometry(0.25, 4);
  let heroMaterial = new THREE.MeshLambertMaterial( { color: 0x336699 } );
  window.bulletMaterial = new THREE.MeshNormalMaterial( { wireframe: true } );
  window.cube = new THREE.Mesh( cubeGeometry, heroMaterial );
  cube.health = 100
  cube.score = 0
  cube.position.x = -20
  cube.position.z = 20
  cube.add(camera);
  camera.position.z = 1;
  camera.position.y = 1;
  camera.position.x = 0;
  scene.add( cube );

  // scene.add(villain)

  window.villains = []
  window.spheres = []
  window.evilSpheres = []
  window.evilTrajectories = []
  window.bulletYAngles = []

  let pointLight1 = new THREE.PointLight(0xFFFFFF);
  window.ambientLight = new THREE.AmbientLight(0xFFFFFF, 0.7);

  pointLight1.position.set(10, 50, -130)
  scene.add(pointLight1);
  scene.add(ambientLight);
  scene.fog = new THREE.FogExp2(0xD6F1FF, 0.01);
}




function setupVillains(number){
  let villainGeometry = new THREE.IcosahedronGeometry( 1.25, 3 )
  for(let i = 0; i < number; i++){
    let villainTexture = loader.load('/images/webs.jpg');
    // villainTexture.offset(0.5)
    let villainMaterial = new THREE.MeshLambertMaterial( { map: villainTexture } );
    let villain = new THREE.Mesh( villainGeometry, villainMaterial );
    villain.position.x = Math.random() * 22
    villain.position.z = Math.random() * 22
    villain.rotation.y = Math.random() * 2 * Math.PI
    villain.hits = 0
    villain.shooting = false
    villain.countTimer = 0
    scene.add(villain)
    villains.push(villain)
  }
}

function render() {
  requestAnimationFrame( render );
  if(liveGame){
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
      if(Math.abs(sphere.position.x > 25) || Math.abs(sphere.position.z > 25)) {
        scene.remove(sphere);
        spheres.splice(index, 1)
        bulletYAngles.splice(index, 1)
        sphere = null
      }
    })
    evilSpheres.forEach((sphere, index) => {
      sphere.position.x -= Math.sin(evilTrajectories[index])
      sphere.position.z -= Math.cos(evilTrajectories[index])
      if(detectCollision(cube, sphere)){
        cube.health -= 1
        manageHit()
      }
    })

    villains.forEach((villain) => {
      if(Math.abs(villain.position.x) > 21 || Math.abs(villain.position.z) > 21){
        resetPosition(villain)
        villain.rotation.y += Math.random() * Math.PI
      }
      if(distance(villain.position.x, villain.position.z, cube.position.x, cube.position.z) < 15){
        // villain.shooting = true
        villain.countTimer +=1
        if(villain.countTimer % 100 === 0){
          let villainSphere = new THREE.Mesh(sphereGeometry, bulletMaterial);
          villainSphere.position.set(villain.position.x, villain.position.y, villain.position.z)
          let trajectory = Math.atan2(-(cube.position.x - villain.position.x), -(cube.position.z - villain.position.z)) + ((Math.random() - 0.5) * 0.2)
          villain.rotation.y = trajectory - Math.PI/2
          scene.add(villainSphere)
          evilSpheres.push(villainSphere)
          evilTrajectories.push(trajectory)
        }
      } else {
        villain.translateX(-0.05)
      }
    })

    if(turningLeft){
      cube.rotation.y += 0.05
    }
    if(turningRight){
      cube.rotation.y -= 0.05
    }
    if(movingForward){
      if (Math.abs(cube.position.x) <= 22) {
        cube.position.x -= Math.sin(cube.rotation.y)/6
      } else if (cube.position.x >= 22) {
        cube.position.x = 21.99999999;
      } else if (cube.position.x <= 22) {
        cube.position.x = -21.99999999;
      }

      if (Math.abs(cube.position.z) <= 22) {
        cube.position.z -= Math.cos(cube.rotation.y)/6
      } else if (cube.position.z >= 22) {
        cube.position.z = 21.99999999;
      } else if (cube.position.z <= 22) {
        cube.position.z = -21.99999999;
      }
    }
    if(movingBackward){
      if (Math.abs(cube.position.x) < 22) {
        cube.position.x += Math.sin(cube.rotation.y)/6
      } else if (cube.position.x >= 22) {
        cube.position.x = 21.99999999;
      } else if (cube.position.x <= -22) {
        cube.position.x = -21.99999999;
      }

      if (Math.abs(cube.position.z) < 22) {
        cube.position.z += Math.cos(cube.rotation.y)/6
      } else if (cube.position.z >= 22) {
        cube.position.z = 21.99999999;
      } else if (cube.position.z <= -22) {
        cube.position.z = -21.99999999;
      }
    }


  }
  renderer.render( scene, camera );
}

function manageHit(){
  document.getElementById("health").innerHTML = cube.health
  ambientLight.color.setHex(0xFF0000)
  setTimeout(()=> ambientLight.color.setHex(0xFFFFFF), 1)
  let redLight = new THREE.AmbientLight()
  if(cube.health <= 0){ gameOver() }
}

function manageScore(){
  document.getElementById("score").innerHTML = cube.score
  if(cube.score >= numberOfVillains){gameOver()}
}


function resetPosition(object){
  if(object.position.x > 21) {object.position.x -= 0.05}
  if(object.position.z > 21) {object.position.z -= 0.05}
  if(object.position.x < 21) {object.position.x += 0.05}
  if(object.position.z < 21) {object.position.z += 0.05}
}



window.onkeydown = (e) => {
  let key = e.keyCode ? e.keyCode : e.which;

  if (key === 37) {
    window.turningLeft = true;
    // cube.rotation.y += 0.1
  } else if (key === 38) {
    window.movingForward = true;
    // if (Math.abs(cube.position.x) <= 22) {
    //   cube.position.x -= Math.sin(cube.rotation.y)/2
    // } else if (cube.position.x >= 22) {
    //   cube.position.x = 21.99999999;
    // } else if (cube.position.x <= 22) {
    //   cube.position.x = -21.99999999;
    // }

    // if (Math.abs(cube.position.z) <= 22) {
    //   cube.position.z -= Math.cos(cube.rotation.y)/2
    // } else if (cube.position.z >= 22) {
    //   cube.position.z = 21.99999999;
    // } else if (cube.position.z <= 22) {
    //   cube.position.z = -21.99999999;
    // }
  } else if (key === 39){
    window.turningRight = true;
    // cube.rotation.y -= 0.1
  } else if (key === 40){
    window.movingBackward = true;
    // if (Math.abs(cube.position.x) < 22) {
    //   cube.position.x += Math.sin(cube.rotation.y)/2
    // } else if (cube.position.x >= 22) {
    //   cube.position.x = 21.99999999;
    // } else if (cube.position.x <= -22) {
    //   cube.position.x = -21.99999999;
    // }
    //
    // if (Math.abs(cube.position.z) < 22) {
    //   cube.position.z += Math.cos(cube.rotation.y)/2
    // } else if (cube.position.z >= 22) {
    //   cube.position.z = 21.99999999;
    // } else if (cube.position.z <= -22) {
    //   cube.position.z = -21.99999999;
    // }
  }

  if (key === 32){
    let sphere = new THREE.Mesh(sphereGeometry, bulletMaterial);
    sphere.position.set(cube.position.x, cube.position.y, cube.position.z)
    sphere.rotation.set(3.28, 3.28, 3.28)

    scene.add(sphere)
    spheres.push(sphere)

    bulletYAngles.push(cube.rotation.y)
  }
}

window.onkeyup = (e) => {
  let key = e.keyCode ? e.keyCode : e.which;
  if (key === 37) {
    window.turningLeft = false
  } else if (key === 38) {
    window.movingForward = false
  } else if (key === 39){
    window.turningRight = false
  } else if (key === 40){
    window.movingBackward = false
  }
}

const mapWidth = 50
const mapHeight = 5

function setupMap (){
  let map = [ // 1  2  3  4  5  6  7  8  9 10
             [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1], // 0
             [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1], // 1
             [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1], // 2
             [1, 0, 0, 2, 2, 2, 2, 2, 0, 0, 1], // 3
             [1, 0, 0, 4, 0, 0, 0, 3, 0, 0, 1], // 4
             [1, 0, 0, 4, 0, 0, 0, 3, 0, 0, 1], // 5
             [1, 0, 0, 0, 0, 2, 2, 2, 0, 0, 1], // 6
             [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1], // 7
             [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1], // 8
             [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1], // 9
             [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1] // 10
           ]
  let outerWallCube = new THREE.CubeGeometry(5, mapHeight, 5);
  let innerWallCube1 = new THREE.CubeGeometry(0.5, mapHeight, 5);
  let innerWallCube2 = new THREE.CubeGeometry(9.5, mapHeight, 5);
  let innerWallCube3 = new THREE.CubeGeometry(9.5, mapHeight, 0.5);
  let wallCubes = [null, outerWallCube, innerWallCube1, innerWallCube2, innerWallCube3]



  var wallTexture = loader.load('/images/spaceshipTexture.jpg');
  let wallMaterial = new THREE.MeshLambertMaterial({map: wallTexture})

  for(let i = 0; i < map.length; i++) {
    for(let j = 0, length = map[i].length; j < length; j++){
      if  (map[i][j]){
        let wall = new THREE.Mesh(wallCubes[map[i][j]], wallMaterial);
        wall.position.set((i - 5) * 5, 2, (j - 5) * 5)
        scene.add(wall)
      }
    }
  }

  var floorTexture = loader.load('/images/floorAlt.jpg');
  floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping;
  floorTexture.repeat.set(5,10)
  let floor = new THREE.Mesh(
    new THREE.CubeGeometry(mapWidth, 0.0001, mapWidth),
    new THREE.MeshLambertMaterial({map: floorTexture })
  )
  floor.position.y = -0.5
  scene.add(floor)

  var ceilingTexture = loader.load('/images/newspace.png');
  let ceiling = new THREE.Mesh(
    new THREE.CubeGeometry(mapWidth, 0.0001, mapWidth),
    new THREE.MeshLambertMaterial({map: ceilingTexture })
  )
  ceiling.position.y = 4
  scene.add(ceiling)

  setupVillains(numberOfVillains)
}


function distance(x1, y1, x2, y2) {
	return Math.sqrt((x2-x1)*(x2-x1)+(y2-y1)*(y2-y1));
}

function detectCollision(object1, object2){
  return (Math.abs(object1.position.x - object2.position.x) < 1) &&
  (Math.abs(object1.position.z - object2.position.z) < 1)
}

function removeIntro(e){
  e.preventDefault();
  modal.style.height = "0";
  modal.style.display = "none";
  gameArea.style.opacity = "1"
  liveGame = true
}

function gameOver(){
  liveGame = false;
  let outro = document.getElementById('outro-screen');
  let status = cube.health > 0 ? "<h1>Congratulations, you WIN!!!</h1>" : "<h1>You Lose</h1>";
  outro.innerHTML += status;
  outro.innerHTML += "<h2>Refresh the page to play again!</h2>";

  outro.style.display = "block";
}

let modal = document.getElementById('intro-screen');
let gameArea = document.getElementById('grey-out');
let thingy = document.getElementById('start-game').onclick = removeIntro;


setupGame();
setupMap();
render();
