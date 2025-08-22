export class Camera {
  constructor(w, h){
    this.w=w; this.h=h; this.x=0; this.y=0; this.shakeT=0; this.shakeMag=0;
  }
  follow(target, worldW, worldH){
    const marginX = this.w*0.35;
    const marginY = this.h*0.25;
    const tx = target.x+target.w/2, ty = target.y+target.h/2;
    if(tx < this.x + marginX) this.x = Math.max(0, tx - marginX);
    if(tx > this.x + this.w - marginX) this.x = Math.min(worldW - this.w, tx - (this.w - marginX));
    if(ty < this.y + marginY) this.y = Math.max(0, ty - marginY);
    if(ty > this.y + this.h - marginY) this.y = Math.min(worldH - this.h, ty - (this.h - marginY));
    
      
      // 离屏保护：若目标完全离开当前视口（含少量缓冲），直接把相机居中到目标
      const pad = 48;
      const offscreen =
        tx < this.x - pad || tx > this.x + this.w + pad ||
        ty < this.y - pad || ty > this.y + this.h + pad;
      if (offscreen) {
        this.x = Math.min(Math.max(0, tx - this.w/2), Math.max(0, worldW - this.w));
        this.y = Math.min(Math.max(0, ty - this.h/2), Math.max(0, worldH - this.h));
      }
  }
  shake(mag=6, dur=0.2){ this.shakeMag=mag; this.shakeT=dur; }
  pre(ctx, dt){
    if(this.shakeT>0){ this.shakeT-=dt; ctx.translate((Math.random()-0.5)*this.shakeMag, (Math.random()-0.5)*this.shakeMag); }
    ctx.translate(-this.x, -this.y);
  }
  post(ctx){ /* placeholder */ }
}
