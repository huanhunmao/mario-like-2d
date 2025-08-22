export class Renderer {
  constructor(canvas, camera, tilemap){
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.cam = camera;
    this.map = tilemap;
  }
  clear(){
    const ctx = this.ctx;
    const w = this.canvas.width, h = this.canvas.height;
    const g = ctx.createLinearGradient(0,0,0,h);
    g.addColorStop(0, '#14213d');
    g.addColorStop(1, '#282b36');
    ctx.fillStyle = g;
    ctx.fillRect(0,0,w,h);
  }
  worldToScreen(x,y){ return { x: x - this.cam.x, y: y - this.cam.y }; }
  drawEntity(e){
    const ctx = this.ctx;
    const p = this.worldToScreen(e.x, e.y);
    ctx.fillStyle = e.color || '#fff';
    ctx.fillRect(p.x, p.y, e.w, e.h);
  }
  drawHUD(state){
    document.getElementById('coins').textContent = state.coins.toString();
    document.getElementById('time').textContent = state.time.toFixed(1);
  }
  frameBegin(dt){
    this.clear();
    const ctx = this.ctx;
    ctx.save();
    this.cam.pre(ctx, dt);
    // parallax simple background
    const sky = this.ctx;
    ctx.globalAlpha = 0.15;
    for(let i=0;i<8;i++){
      ctx.fillStyle = '#ffffff';
      const x = Math.sin(i*12.9898)*43758.5453 % 1;
      ctx.fillRect(((i*200) - (this.cam.x*0.3)%2000), 60+i*20, 60, 8);
    }
    ctx.globalAlpha = 1;
    this.map.draw(ctx, this.cam);
  }
  frameEnd(){
    const ctx = this.ctx;
    ctx.restore();
  }
}
