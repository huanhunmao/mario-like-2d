export class TileMap {
  constructor(data){
    this.w = data.width;
    this.h = data.height;
    this.tileSize = data.tileSize || 32;
    this.layers = data.layers || [];
    this.solidIds = new Set(data.solid || [1]);
    this.colors = data.colors || { 0:'#00000000', 1:'#3a3a4a', 2:'#6dbb30', 3:'#bbaa33', 4:'#ffcc00' };
  }
  get(x, y){
    if(x<0 || y<0 || x>=this.w || y>=this.h) return { id:1, solid:true }; // bounds solid
    const id = this.layers[0][y*this.w + x] || 0;
    return { id, solid: this.solidIds.has(id) };
  }
  draw(ctx, cam){
    const {tileSize} = this;
    const startX = Math.max(0, Math.floor(cam.x/tileSize)-1);
    const endX = Math.min(this.w-1, Math.floor((cam.x+cam.w)/tileSize)+1);
    const startY = Math.max(0, Math.floor(cam.y/tileSize)-1);
    const endY = Math.min(this.h-1, Math.floor((cam.y+cam.h)/tileSize)+1);
    for(let y=startY; y<=endY; y++){
      for(let x=startX; x<=endX; x++){
        const id = this.layers[0][y*this.w + x];
        if(id===0) continue;
        ctx.fillStyle = this.colors[id] || '#999';
        ctx.fillRect(x*tileSize, y*tileSize, tileSize, tileSize);
      }
    }
  }
}
