import { Physics } from '../engine/physics.js';
import { rectsOverlap } from '../engine/utils.js';
import { makePlayer, makeGoomba, makeCoin, makeFlag } from './entities.js';

export class Game {
  constructor(map){
    this.map = map;
    this.physics = new Physics(map);
    this.entities = [];
    this.player = makePlayer(64, 64);
    this.entities.push(this.player);
    this.state = { coins:0, time:0, win:false, lose:false };
    this.spawnFromMap(map);
  }
  spawnFromMap(map){
    // scan first layer for markers: 2=ground grass, 3=coin, 4=flag; spawn enemies by pattern
    for(let y=0;y<map.h;y++){
      for(let x=0;x<map.w;x++){
        const id = map.layers[0][y*map.w + x];
        if(id===3){ // coin marker
          this.entities.push(makeCoin(x*map.tileSize+7, y*map.tileSize+7));
          map.layers[0][y*map.w + x]=0;
        }else if(id===4){
          this.entities.push(makeFlag(x*map.tileSize+4, y*map.tileSize-64+map.tileSize));
          map.layers[0][y*map.w + x]=2;
        }
      }
    }
    // spawn a couple of enemies
    for(let i=6;i<map.w-4;i+=18){
      const baseY = this.findGroundY(i);
      if(baseY !== -1){
        this.entities.push(makeGoomba(i*map.tileSize+3, baseY*map.tileSize-26));
      }
    }
  }
  findGroundY(x){
    for(let y=0;y<this.map.h;y++){
      if(this.map.get(x,y).solid && !this.map.get(x,y-1).solid) return y;
    }
    return -1;
  }
  reset(){
    const startCoins = this.state.coins;
    this.entities = this.entities.filter(e=>e.type!=='goomba' && e.type!=='coin');
    this.player.x=64; this.player.y=64; this.player.vx=0; this.player.vy=0; this.player.alive=true;
    this.state = { coins: startCoins, time:0, win:false, lose:false };
    this.spawnFromMap(this.map);
  }
  update(input, dt){
    if(this.state.win || this.state.lose){
      if(input.pressed('r')) this.reset();
      return;
    }
    this.state.time += dt;
    const p = this.player;
    const acc = p.speed;
    const left = input.down('a') || input.down('arrowleft');
    const right = input.down('d') || input.down('arrowright');
    const want = (right?1:0) - (left?1:0);
    p.vx = want * p.speed;
    if(want!==0) p.dir = want;
    if((input.pressed('j') || input.pressed(' ')) && p.onGround){
      p.vy = -p.jump;
    }
    if(input.pressed('k')){
      p.vx += p.dir * p.dash;
    }

    // update physics
    for(const e of this.entities){
      if(!e.alive) continue;
      if(e.type==='goomba'){
        // simple AI: turn around on wall, small hop occasionally
        if(this.map.get(Math.floor((e.x + (e.vx>0? e.w+1 : -1))/this.map.tileSize), Math.floor((e.y+e.h+1)/this.map.tileSize)).solid===false){
          e.vx *= -1;
        }
      }
      this.physics.step(e, dt);
    }
      
   
       // —— 安全守护：位置数值异常立即复位（极端浏览器暂停/Tab切换导致）——
       if (!Number.isFinite(p.x) || !Number.isFinite(p.y)) {
         this.reset();
         return;
       }
   
       // —— 水平边界钳制，避免角色被数值积累“挤出世界” —— 
       const worldW = this.map.w * this.map.tileSize;
       const worldH = this.map.h * this.map.tileSize;
       p.x = Math.min(Math.max(0, p.x), Math.max(0, worldW - p.w));
       // 垂直不强制钳制，允许掉落判负，但若掉得太深仍触发失败

    // interactions
    for(const e of this.entities){
      if(e===p || !e.alive) continue;
      if(e.type==='coin' && !e.collected && rectsOverlap(p, e)){
        e.collected=true; e.alive=false; this.state.coins++;
      }else if(e.type==='goomba' && rectsOverlap(p, e)){
        if(p.vy>0){ // stomp
          e.alive=false; p.vy = -p.jump*0.5;
        }else{
          this.state.lose = true;
        }
      }else if(e.type==='flag' && rectsOverlap(p, e)){
        this.state.win = true;
      }
    }

    // death pit
    if(p.y > worldH + 200){
      this.state.lose = true;
    }
  }
}
