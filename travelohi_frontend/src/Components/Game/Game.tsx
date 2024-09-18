import { useRef, useEffect, useState } from "react";
import "./Game.css";
import useAuthChecker from "../AuthChecker";
import { useNavigate } from "react-router-dom";
// import backgroundMusic from "/game-assets/background music 1.mp3";

const Game = () => {
  const navigate = useNavigate();
  const authenticated = useAuthChecker();
  let time = 3600;
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [c, setC] = useState<CanvasRenderingContext2D | null>(null);
  const gravity = 0.8;
  // const keyPresses = useRef<any>();
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const connectionID = useRef<any>();
  const backgroundMusicRef = useRef<HTMLAudioElement | null>(null);

  const tieImageURL = "/game-assets/draw.png";
  const tieImage = new Image();
  tieImage.src = tieImageURL;

  const winImageURL = "/game-assets/win.png";
  const winImage = new Image();
  winImage.src = winImageURL;

  const loseImageURL = "/game-assets/lose.png";
  const loseImage = new Image();
  loseImage.src = loseImageURL;

  useEffect(() => {
    const music = new Audio("/game-assets/background music 2.mp3");
    music.loop = true;
    music.volume = 0.5;
    backgroundMusicRef.current = music;

    return () => {
      if (backgroundMusicRef.current) {
        backgroundMusicRef.current.pause();
        backgroundMusicRef.current.currentTime = 0;
      }
    };
  }, []);

  useEffect(() => {
    if (backgroundMusicRef.current) {
      backgroundMusicRef.current.play();
    }
  }, []);

  // useEffect(() => {
  //   const newSocket = new WebSocket("ws://localhost:8000/websocket");
  //   newSocket.onopen = () => {
  //     console.log("WebSocket connection established");
  //     connectionID.current = 1;
  //     setSocket(newSocket);
  //   };

  //   newSocket.addEventListener("message", (e) => {
  //     const receivedData = JSON.parse(e.data);
  //     console.log(receivedData);
  //     // enemyKeys = receivedData;
  //   })
  //   return () => {
  //     newSocket.close();
  //   };
  // }, []);

  //when page is loaded
  useEffect(() => {
    // if(!authenticated){
    //   navigate("/home")
    // }

    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");
      if (context) {
        setC(context);
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        context.fillRect(0, 0, canvas.width, canvas.height);
      }
    }
  }, [authenticated]);

  //sprite 'class'
  type Sprite = {
    health: number;
    image: any;
    position: {
      x: number;
      y: number;
    };
    velocity: {
      x: number;
      y: number;
    };
    height: number;
    jumps: number;
    attackbox: {
      position: {
        x: number;
        y: number;
      };
      width: number;
      height: number;
    };
    width: number;
    isAttacking: boolean;
    isFrontKick: boolean;
    framesMax: number;
    frameInterval: number;
    currentFrame: number;
    lastAnimationFrameTime: number;
    walkAnimationFrameInterval: number;
    lastWalkAnimationFrameTime: number;
    draw: () => void;
    update: () => void;
    attack: () => void;
    frontKick: () => void;
    updateIdleAnimation: () => void;
  };

  //background sprite class
  type bgSprite = {
    position: {
      x: number;
      y: number;
    };
    // height: number;
    // width: number;

    image: any;

    draw: () => void;
    update: () => void;
  };

  const background: bgSprite = {
    position: {
      x: 0,
      y: 0,
    },
    image: new Image(),
    draw: () => {
      if (c) {
        c.drawImage(
          background.image,
          background.position.x,
          background.position.y,
          window.innerWidth,
          window.innerHeight
        );
      }
    },
    update: () => {
      if (c) {
        background.draw();
        c.font = "bold 70px 'Press Start 2P', cursive";
        c.fillStyle = "white";
        c.textAlign = "center";
        c.fillText(`${Math.floor(time / 60)}`, c.canvas.width / 2, 100);
      }

      if (time <= 0) {
        if (c) {
          const imageSize = 400;
          const imageX = c.canvas.width / 2 - imageSize / 2;
          const imageY = c.canvas.height / 2 - imageSize / 2;
          if (player2.health <= 0) {
            if (winImage.complete) {
              c.drawImage(winImage, imageX, imageY, imageSize, imageSize);
            } else {
              winImage.onload = () => {
                c.drawImage(winImage, imageX, imageY, imageSize, imageSize);
              };
            }
          } else if (player1.health > 0 && player2.health > 0) {
            if (tieImage.complete) {
              c.drawImage(tieImage, imageX, imageY, imageSize, imageSize);
            } else {
              tieImage.onload = () => {
                c.drawImage(tieImage, imageX, imageY, imageSize, imageSize);
              };
            }
          }
        }
      } else {
        if (player2.health <= 0) {
          time = 0;
        }
      }
    },
  };
  function clamp(value: number, max: number) {
    return Math.max(0, Math.min(value, max));
  }

  //player 1
  const player1: Sprite = {
    health: 100,
    position: { x: window.innerWidth * 0.05, y: 100 },
    velocity: { x: 0, y: 10 },
    height: 300,
    width: 251.25,
    jumps: 0,
    framesMax: 6,
    frameInterval: 130,
    currentFrame: 1,
    lastAnimationFrameTime: 0,
    walkAnimationFrameInterval: 130,
    lastWalkAnimationFrameTime: 0,
    attackbox: {
      position: {
        x: 0,
        y: 0,
      },
      width: 50,
      height: 60,
    },
    isAttacking: false,
    isFrontKick: false,
    image: new Image(),
    draw: () => {
      if (c) {
        player1.attackbox.position.x = player1.position.x + 200;
        player1.attackbox.position.y = player1.position.y + 200;

        // c.fillStyle = "red";
        // c.fillRect(
        //   player1.position.x,
        //   player1.position.y,
        //   player1.width,
        //   player1.height
        // );

        // c.fillStyle = "blue";
        // c.fillRect(
        //   player1.attackbox.position.x,
        //   player1.attackbox.position.y,
        //   player1.attackbox.width,
        //   player1.attackbox.height
        // );

        // player1.velocity = 0.5

        const healthBarHeight = 10;
        const healthBarWidth = 550;
        c.fillStyle = "grey";
        c.fillRect(
          c.canvas.width - 1270,
          c.canvas.height - 640,
          healthBarWidth,
          healthBarHeight
        );
        c.fillStyle = "green";
        c.fillRect(
          c.canvas.width - 1270,
          c.canvas.height - 640,
          clamp((player1.health / 100) * healthBarWidth, 100 * healthBarWidth),
          healthBarHeight
        );

        c.drawImage(
          player1.image,
          player1.position.x,
          player1.position.y,
          player1.width,
          player1.height
        );
      }
    },
    updateIdleAnimation: () => {
      // if (player1.isAttacking) {
      //   return;
      // }

      const currentTime = Date.now();
      if (
        currentTime - player1.lastAnimationFrameTime >
        player1.frameInterval
      ) {
        player1.lastAnimationFrameTime = currentTime;

        player1.currentFrame = (player1.currentFrame % 6) + 1;

        player1.image.src = `/game-assets/sword impulse/idle/sword-impulse_0${player1.currentFrame}.png`;
      }
    },
    update: () => {
      if (c) {
        //idle and attack
        if (
          !player1.isAttacking &&
          !player1.isFrontKick &&
          player1.velocity.x === 0
        ) {
          player1.updateIdleAnimation();
        } else if (player1.isFrontKick) {
          player1.image.src = `/game-assets/sword impulse/front kick/sword-impulse_03.png`;
        } else if (player1.isAttacking) {
          player1.image.src = `/game-assets/sword impulse/low kick/sword-impulse_01.png`;
        } else if (player1.jumps == 1) {
          player1.image.src = `/game-assets/sword impulse/jumping/sword-impulse_jump_04.png`;
        } else if (player1.jumps == 2) {
          player1.image.src = `/game-assets/sword impulse/jumping/sword-impulse_jump_05.png`;
        }
        //walking
        else if (player1.velocity.x > 0) {
          const currentTime = Date.now();
          if (
            currentTime - player1.lastWalkAnimationFrameTime >
            player1.walkAnimationFrameInterval
          ) {
            player1.lastWalkAnimationFrameTime = currentTime;

            player1.currentFrame = (player1.currentFrame % 10) + 1;

            player1.image.src = `/game-assets/sword impulse/walking/sword-impulse_${player1.currentFrame}.png`;
          }
        }
        //walking back
        else if (player1.velocity.x < 0) {
          const currentTime = Date.now();
          if (
            currentTime - player1.lastWalkAnimationFrameTime >
            player1.walkAnimationFrameInterval
          ) {
            player1.lastWalkAnimationFrameTime = currentTime;

            player1.currentFrame = (player1.currentFrame % 10) + 1;

            player1.image.src = `/game-assets/sword impulse/backward/sword-impulse_${player1.currentFrame}.png`;
          }
        }

        player1.draw();

        if (
          player1.position.y + player1.height + player1.velocity.y >=
          c.canvas.height
        ) {
          player1.jumps = 0;
          player1.velocity.y = 0;
        } else {
          player1.velocity.y += gravity;
        }

        player1.position.y += player1.velocity.y;
        player1.position.x += player1.velocity.x;
      }
    },
    attack: () => {
      if (c) {
        player1.isAttacking = true;
        setTimeout(() => {
          player1.isAttacking = false;
        }, 200);
      }
    },
    frontKick: () => {
      if (c) {
        player1.isFrontKick = true;
        setTimeout(() => {
          player1.isFrontKick = false;
        }, 200);
      }
    },
  };
  const player2: Sprite = {
    health: 100,
    position: { x: window.innerWidth * 0.75, y: 100 },
    velocity: { x: 0, y: 10 },
    height: 300,
    width: 251.25,
    jumps: 0,
    framesMax: 6,
    frameInterval: 130,
    currentFrame: 1,
    lastAnimationFrameTime: 0,
    attackbox: {
      position: {
        x: 0,
        y: 0,
      },
      width: 100,
      height: 40,
    },
    isAttacking: false,
    isFrontKick: false,
    image: new Image(),
    draw: () => {
      if (c) {
        // c.fillStyle = "blue";
        // c.fillRect(
        //   player2.position.x,
        //   player2.position.y,
        //   player2.width,
        //   player2.height
        // );

        // c.fillStyle = "green";
        // c.fillRect(
        //   player2.attackbox.position.x,
        //   player2.attackbox.position.y,
        //   player2.attackbox.width,
        //   player2.attackbox.height
        // );

        c.drawImage(
          player2.image,
          player2.position.x,
          player2.position.y,
          player2.width,
          player2.height
        );

        const healthBarHeight = 10;
        const healthBarWidth = 550;
        c.fillStyle = "grey";
        c.fillRect(
          c.canvas.width - 570,
          c.canvas.height - 640,
          healthBarWidth,
          healthBarHeight
        );
        c.fillStyle = "red";
        c.fillRect(
          c.canvas.width - 570,
          c.canvas.height - 640,
          clamp((player2.health / 100) * healthBarWidth, 100 * healthBarWidth),
          healthBarHeight
        );
      }
    },
    updateIdleAnimation: () => {
      if (player2.isAttacking) {
        return;
      }

      const currentTime = Date.now();
      if (
        currentTime - player2.lastAnimationFrameTime >
        player2.frameInterval
      ) {
        player2.lastAnimationFrameTime = currentTime;

        player2.currentFrame = (player2.currentFrame % 6) + 1;

        player2.image.src = `/game-assets/blast impulse/idle mirrored/idle ${player2.currentFrame}.png`;
      }
    },
    update: () => {
      if (c) {
        if (!player2.isAttacking) {
          player2.updateIdleAnimation();
          if (player2.jumps > 0) {
            player2.image.src = `/game-assets/blast impulse/jump mirrored/1.png`;
          }
        } else {
        }
        player2.draw();
        player2.position.y += player2.velocity.y;
        player2.position.x += player2.velocity.x;
        if (
          player2.position.y + player2.height + player2.velocity.y >=
          c.canvas.height
        ) {
          player2.velocity.y = 0;
        } else {
          player2.velocity.y += gravity;
        }
      }
    },
    attack: () => {
      if (c) {
        player2.isAttacking = true;
        setTimeout(() => {
          player2.isAttacking = false;
        }, 100);
      }
    },
    frontKick: () => {
      if (c) {
        player2.isFrontKick = true;
        setTimeout(() => {
          player2.isFrontKick = false;
        }, 10);
      }
    },
    walkAnimationFrameInterval: 0,
    lastWalkAnimationFrameTime: 0,
  };

  //movement control helpers
  let keys = {
    a: {
      pressed: false,
    },
    d: {
      pressed: false,
    },
    space: {
      pressed: false,
    },
    s: {
      pressed: false,
    },
    w: {
      pressed: false,
    },
  };
  let lastkey: string;

  // let enemyKeys = {
  //   a: {
  //     pressed: false,
  //   },
  //   d: {
  //     pressed: false,
  //   },
  //   space: {
  //     pressed: false,
  //   },
  //   s: {
  //     pressed: false,
  //   },
  //   w: {
  //     pressed: false,
  //   }
  // };

  //listen for keys
  window.addEventListener("keydown", (event) => {
    socket?.send(JSON.stringify(keys));
    if (time > 1) {
      switch (event.key) {
        case "d":
          keys.d.pressed = true;
          lastkey = "d";
          break;
        case "a":
          keys.a.pressed = true;
          lastkey = "a";
          break;
        case "w":
          keys.w.pressed = true;
          if (player1.jumps < 2) {
            player1.velocity.y = -20;
            player1.jumps += 1;
          }
          break;
        case " ":
          keys.space.pressed = true;
          if (!player1.isAttacking) {
            player1.attack();
          }
          break;
        case "g":
          keys.space.pressed = true;
          if (!player1.isFrontKick) {
            player1.frontKick();
          }
          break;
      }
    }
  });

  //listen for key release
  window.addEventListener("keyup", (event) => {
    socket?.send(JSON.stringify(keys));
    // console.log(event.key);
    switch (event.key) {
      case "d":
        keys.d.pressed = false;
        break;
      case "a":
        keys.a.pressed = false;
        break;
      case "w":
        keys.w.pressed = false;
        break;
      case " ":
        keys.space.pressed = false;
        // player1.isAttacking = false;
        break;
    }
  });

  let lastTimestamp = 0;
  const fps = 60;
  const frameInterval = 1000 / fps;

  //infinite loop for update per frame
  function animate(timestamp: DOMHighResTimeStamp) {
    const deltaTime = timestamp - lastTimestamp;
    if (deltaTime >= frameInterval) {
      // keys = keyPresses.current
      if (time > 0) {
        time -= 1;
      } else {
      }

      lastTimestamp = timestamp - (deltaTime % frameInterval);
      window.requestAnimationFrame(animate);

      console.log(time);

      if (c) {
        // c.fillRect(0, 0, c.canvas.width, c.canvas.height);
        background.update();
      }

      // Player movements and updates
      player1.velocity.x = 0;
      if (keys.a.pressed && lastkey === "a") {
        player1.velocity.x = -5;
      } else if (keys.d.pressed && lastkey === "d") {
        player1.velocity.x = 7;
      }

      player1.update();
      player2.update();

      // detect collision
      if (
        player1.attackbox.position.x + player1.attackbox.width >=
          player2.position.x &&
        player1.attackbox.position.x <= player2.position.x + player2.width &&
        player1.attackbox.position.y + player1.attackbox.height >=
          player2.position.y &&
        player1.attackbox.position.y <= player2.position.y + player2.height &&
        player1.isAttacking
      ) {
        player2.health = player2.health - 1.21;
        console.log(player2.health);
      }

      if (
        player1.attackbox.position.x + player1.attackbox.width >=
          player2.position.x &&
        player1.attackbox.position.x <= player2.position.x + player2.width &&
        player1.attackbox.position.y + player1.attackbox.height >=
          player2.position.y &&
        player1.attackbox.position.y <= player2.position.y + player2.height &&
        player1.isFrontKick
      ) {
        player2.health = player2.health - 0.81;
        console.log(player2.health);
      }
      // window.requestAnimationFrame(animate);
    } else {
      window.requestAnimationFrame(animate);
    }
  }

  background.image.src = "/game-assets/background/background.png";
  background.image.onload = () => {
    animate(0);
  };

  return (
    <div className="maingame">
      {authenticated ? (
        <div className="game-container">
          <canvas className="canvas" ref={canvasRef}></canvas>
        </div>
      ) : (
        <div style={{minHeight: "80vh", display: "flex", alignItems: "center", flexDirection: "column", justifyContent: "center"}}>
          <p>Please log in to use this feature</p>
          <button onClick={() => navigate("/login")}>Log In</button>
        </div>
      )}
    </div>
  );
};

export default Game;
