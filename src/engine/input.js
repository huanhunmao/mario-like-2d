export class Input {
  constructor(){
    this.keys = new Map();
    this.once = new Set();
    addEventListener('keydown', e=>{
      this.keys.set(e.key.toLowerCase(), true);
      this.once.add(e.key.toLowerCase());
    });
    addEventListener('keyup', e=>this.keys.set(e.key.toLowerCase(), false));
  }
  down(k){ return !!this.keys.get(k.toLowerCase()); }
  pressed(k){ const key = k.toLowerCase(); const had = this.once.has(key); if(had) this.once.delete(key); return had; }
}
