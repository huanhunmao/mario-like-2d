// Tile-based collision (axis-aligned), per-axis resolution for stability.
export class Physics {
  constructor(tilemap){
    this.map = tilemap;
    this.gravity = 2000; // px/s^2
    this.maxVy = 2000;
  }
  step(entity, dt){
    // apply gravity
    entity.vy = Math.min(this.maxVy, entity.vy + this.gravity*dt);
    // horizontal move & collide
    entity.x += entity.vx * dt;
    this.resolve(entity, true);
    // vertical move & collide
    entity.y += entity.vy * dt;
    entity.onGround = false;
    if(this.resolve(entity, false)) entity.onGround = true;
  }
  resolve(e, horizontal){
    const { tileSize } = this.map;
    const minX = Math.floor(e.x / tileSize) - 1;
    const maxX = Math.floor((e.x + e.w) / tileSize) + 1;
    const minY = Math.floor(e.y / tileSize) - 1;
    const maxY = Math.floor((e.y + e.h) / tileSize) + 1;
    let collidedGround = false;

    for(let ty=minY; ty<=maxY; ty++){
      for(let tx=minX; tx<=maxX; tx++){
        const tile = this.map.get(tx, ty);
        if(!tile || !tile.solid) continue;
        const tileRect = { x: tx*tileSize, y: ty*tileSize, w: tileSize, h: tileSize };
        if(!(e.x < tileRect.x + tileRect.w && e.x + e.w > tileRect.x && e.y < tileRect.y + tileRect.h && e.y + e.h > tileRect.y)) continue;
        // resolve by pushing out along axis we just moved
        if(horizontal){
          if(e.vx > 0){ e.x = tileRect.x - e.w; }
          else if(e.vx < 0){ e.x = tileRect.x + tileRect.w; }
          e.vx = 0;
        }else{
          if(e.vy > 0){ e.y = tileRect.y - e.h; collidedGround = true; }
          else if(e.vy < 0){ e.y = tileRect.y + tileRect.h; }
          e.vy = 0;
        }
      }
    }
    return collidedGround;
  }
}
