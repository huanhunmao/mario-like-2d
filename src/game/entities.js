export function makePlayer(x,y){
  return {
    type:'player', x,y, w:26, h:28, vx:0, vy:0, onGround:false,
    color:'#ff5c5c', speed: 240, jump: 620, dash: 400, controlLock:0, dir:1, alive:true,
  };
}
export function makeGoomba(x,y){
  return { type:'goomba', x,y, w:26, h:26, vx:-60, vy:0, color:'#b87333', alive:true };
}
export function makeCoin(x,y){
  return { type:'coin', x,y, w:18, h:18, vx:0, vy:0, color:'#ffd166', rotate:0, collected:false };
}
export function makeFlag(x,y){
  return { type:'flag', x,y, w:24, h:96, vx:0, vy:0, color:'#77c66e' };
}
