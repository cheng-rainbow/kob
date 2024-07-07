let ac_game_object = [];

export class AcGameObject {
  constructor() {
    ac_game_object.push(this);

    this.timedelta = 0;
    this.has_called_start = false;
  }

  start() {}

  update() {}

  on_destroy() {}

  destroy() {
    this.on_destroy();

    for (let i in ac_game_object) {
      const obj = ac_game_object[i];
      if (obj === this) {
        ac_game_object.splice(i);
        break;
      }
    }
  }
}

let laststamp = 0;
const step = (timestamp) => {
  for (let obj of ac_game_object) {
    if (obj.has_called_start === false) {
      obj.has_called_start = true;
      obj.start();
    } else {
      obj.timedelta = timestamp - laststamp;
      obj.update();
    }
  }
  laststamp = timestamp;
  requestAnimationFrame(step);
};

requestAnimationFrame(step);
