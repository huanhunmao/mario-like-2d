import { Input } from './engine/input.js';
import { Camera } from './engine/camera.js';
import { Renderer } from './engine/renderer.js';
import { TileMap } from './engine/tilemap.js';
import { Game } from './game/game.js';

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const input = new Input();

const levelData = await fetch('./src/game/levels/level1.json').then(r=>r.json());
const tilemap = new TileMap(levelData);
const cam = new Camera(canvas.width, canvas.height);
cam.w = canvas.width; cam.h = canvas.height;
const renderer = new Renderer(canvas, cam, tilemap);
const game = new Game(tilemap);

let last = performance.now();
function loop(now){
  const dt = Math.min(0.033, (now - last)/1000);
  last = now;

  game.update(input, dt);
   if (!(game.state.win || game.state.lose)) {
       cam.follow(game.player, tilemap.w*tilemap.tileSize, tilemap.h*tilemap.tileSize);
     }

  renderer.frameBegin(dt);
  // draw entities
  for(const e of game.entities){
    if(e.alive!==false) renderer.drawEntity(e);
  }
  renderer.frameEnd();
  renderer.drawHUD(game.state);

  requestAnimationFrame(loop);
}
requestAnimationFrame(loop);

// simple resize handling for crisp pixels
addEventListener('resize', ()=>{
  const scale = Math.max(1, Math.floor(Math.min(innerWidth/960, innerHeight/540)));
  canvas.style.width = (960*scale)+'px';
  canvas.style.height = (540*scale)+'px';
});
dispatchEvent(new Event('resize'));

// reset
addEventListener('keydown', (e)=>{ if(e.key.toLowerCase()==='r'){ location.reload(); } });
