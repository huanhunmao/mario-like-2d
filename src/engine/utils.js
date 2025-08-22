export const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
export const sign = (v) => (v>0)-(v<0);
export const lerp = (a,b,t)=>a+(b-a)*t;

export class RNG {
  constructor(seed=1){ this.s = seed>>>0 || 1; }
  next(){
    // xorshift32
    let x = this.s;
    x ^= x<<13; x ^= x>>>17; x ^= x<<5;
    this.s = x>>>0;
    return this.s/0xffffffff;
  }
}

export function rectsOverlap(a,b){
  return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
}
