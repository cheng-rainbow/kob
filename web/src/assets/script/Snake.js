import { Cell } from "./Cell";

import { AcGameObject } from "./AcGameObject";

export class Snake extends AcGameObject {
  constructor(info, gamemap) {
    super();

    this.id = info.id;
    this.color = info.color;
    this.gamemap = gamemap;

    this.cells = [new Cell(info.r, info.c)];

    this.next_cell = null;
    this.speed = 5;
    this.direction = -1; // -1表示没有指令, 0、1、2、3表示上右下左
    this.status = "idle"; // idle表示静止, move表示移动, die表示死亡

    this.dr = [-1, 0, 1, 0];
    this.dc = [0, 1, 0, -1];
    this.step = 0;

    this.eps = 1e-2;
  }

  start() {}

  next_step() {
    // 执行next_step的前提的 双方都有下一步的输入
    const d = this.direction;
    this.next_cell = new Cell( // 创建下一个cell, cell对象中包含x, y, 即下一个cell的园点x, y坐标
      this.cells[0].r + this.dr[d],
      this.cells[0].c + this.dc[d]
    );
    this.step++;
    this.direction = -1;
    this.status = "move"; // 移动的状态

    const k = this.cells.length; // 实现蛇的 变长
    for (let i = k; i > 0; i--) {
      this.cells[i] = JSON.parse(JSON.stringify(this.cells[i - 1]));
    }
  }

  set_direction(d) {
    // 设置蛇的下次走的方向
    this.direction = d;
  }

  update_move() {
    const dx = this.next_cell.x - this.cells[0].x;
    const dy = this.next_cell.y - this.cells[0].y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < this.eps) {
      this.cells[0] = this.next_cell;
      this.next_cell = null;
      this.status = "idle";
    } else {
      const move_distance = (this.speed * this.timedelta) / 1000;
      this.cells[0].x += (move_distance * dx) / distance;
      this.cells[0].y += (move_distance * dy) / distance;
    }
  }

  update() {
    if (this.status === "move") {
      this.update_move();
    }
    this.render();
  }

  render() {
    const ctx = this.gamemap.ctx;
    const L = this.gamemap.L;

    ctx.fillStyle = this.color;
    for (const cell of this.cells) {
      ctx.beginPath();
      ctx.arc(cell.x * L, cell.y * L, L / 2, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}
