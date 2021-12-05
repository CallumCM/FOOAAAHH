// Snap the mobile movement slider to 0 when the user stops touching the screen
mobile_move_value.addEventListener("touchend", function() {
  mobile_move_value.value = 0;
});
mobile_move_value.addEventListener("mouseup", function() {
  mobile_move_value.value = 0;
});

function touchStarted() {
  if (getAudioContext().state !== "running") {
    getAudioContext().resume();
  }
}

let total_p5_loading_time = performance.now();

function preload() {
  document.getElementById("p5_loading").style.display = "none";
  print("Loading fonts...");
  time = performance.now();
  // Load the Rampart One font
  rampartone_font = loadFont("../RampartOne-Regular.ttf");
  print(`Fonts loaded in ${performance.now()-time} milliseconds`);

  print("Loading images...");
  time = performance.now();
  // Load all of the images used in the game
  main_character_image = loadImage("../pictures/man.png");
  background_images = [loadImage("../pictures/cloud.png"), loadImage("../pictures/cloud1.png"), loadImage("../pictures/cloud2.png"), loadImage("../pictures/cloud3.png"), loadImage("../pictures/cloud4.png")];
  obstacles_images = [loadImage("../pictures/airplanescrap.png"), loadImage("../pictures/airplanescrap1.png"), loadImage("../pictures/airplanescrap2.png")];
  obstacles_animations = [loadAnimation("../pictures/bird.png", "../pictures/bird1.png"), loadAnimation("../pictures/bird2.png", "../pictures/bird3.png")];
  honey_images = [loadImage("../pictures/honey.png"), loadImage("../pictures/honey1.png")];
  print(`Images loaded in ${performance.now()-time} milliseconds`);

  print("Loading sounds...");
  time = performance.now();
  // Load the sounds used in the game
  ouch_sound = loadSound("../audio/ouch.mp3");
  lets_go_sound = loadSound("../audio/lets_go.mp3");
  lets_go_sound.playMode('restart');
  honey_sounds = [loadSound("../audio/honey.mp3"), loadSound("../audio/honey1.mp3"), loadSound("../audio/honey2.mp3")];
  honey_sounds.forEach(s => {
    s.playMode('sustain');
  });
  airplanescrap_hit_sound = loadSound("../audio/hit.mp3");
  airplanescrap_hit_sound.playMode('sustain');
  splat_sound = loadSound("../audio/splat.mp3");
  splat_sound.playMode('sustain');
  soundtracks = [loadSound("../audio/soundtrack.mp3")];
  soundtracks.forEach(s => {
    s.playMode('restart');
  });
  current_soundtrack = Random.choice(soundtracks).index;
  print(`Sounds loaded in ${performance.now()-time} milliseconds`);

  // Lower the framerate of every animated obstacle
  for(let i = 0; i < obstacles_animations.length; i++) {
    obstacles_animations[i].frameDelay = 20;
  }

  if(localStorage.getItem("colortheme") == null) {
    localStorage.setItem("colortheme", "light");
  }
  if(localStorage.getItem("controloverride") == null) {
    localStorage.setItem("controloverride", "auto");
  }
}

function setup() {
  cvs = createCanvas(windowWidth, windowHeight);
  vis(() => { // When tabbed out stop game loop
    if(vis() && !cease_game_loop) {
      soundtracks[current_soundtrack].isPaused() && soundtracks[current_soundtrack].play();
      increment_score = true;
    } else {
      soundtracks[current_soundtrack].pause();
      increment_score = false;
      // Completely freeze every sprite in the scene, even stopping p5.play's built-in physics
      for(let i = 0; i < allSprites.length; i++) {
        allSprites[i].velocity.x = 0;
        allSprites[i].velocity.y = 0;
        allSprites[i].position.x = allSprites[i].position.x;
        allSprites[i].position.y = allSprites[i].position.y;
      }
    }
  });

  // Set the maxFPS to 60
  frameRate(60);
  textFont(rampartone_font, windowWidth/30);
  textAlign(CENTER);
  resetScene();
  document.getElementsByClassName("loading_gif").forEach(item => {item.style.display = "none"});
  soundtracks[current_soundtrack].loop();

  print(`Total P5.js preloading and initializing time: ${performance.now()-total_p5_loading_time}ms`);
}