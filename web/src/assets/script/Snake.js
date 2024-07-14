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
    this.speed = 5; // 蛇每秒走5个格子
    this.direction = -1; // -1表示没有指令, 0、1、2、3表示上右下左
    this.status = "idle"; // idle表示静止, move表示移动, die表示死亡

    this.dr = [-1, 0, 1, 0];
    this.dc = [0, 1, 0, -1];
    this.step = 0; // 表示回合数

    this.eps = 1e-2; // 允许的误差

    this.eye_direction = 0;
    if (this.id === 1) this.eye_direction = 2; //  右上角的蛇头初始向下

    this.eye_dx = [
      [-1, 1],
      [1, 1],
      [1, -1],
      [-1, -1],
    ];
    this.eye_dy = [
      [-1, -1],
      [-1, 1],
      [1, 1],
      [1, -1],
    ];
  }

  start() {}

  next_step() {
    // 执行next_step的前提的 双方都有下一步的输入
    const d = this.direction;
    this.eye_direction = d;
    this.next_cell = new Cell(this.cells[0].r + this.dr[d], this.cells[0].c + this.dc[d]); // 创建下一个cell, cell对象中包含x, y, 即下一个cell的园点x, y坐标
    this.step++;
    this.direction = -1;
    this.status = "move"; // 移动的状态

    const k = this.cells.length; // 实现蛇的 变长
    for (let i = k; i > 0; i--) {
      this.cells[i] = JSON.parse(JSON.stringify(this.cells[i - 1]));
    }

    // if (!this.gamemap.check_valid(this.next_cell)) {
    //   // 下一步不合法的话 死亡
    //   this.status = "die";
    // }
  }

  set_direction(d) {
    // 设置蛇的下次走的方向
    this.direction = d;
  }

  check_tail_increasing() {
    if (this.step <= 10) return true;
    if (this.step % 3 === 0) return true;

    return false;
  }

  update_move() {
    const dx = this.next_cell.x - this.cells[0].x;
    const dy = this.next_cell.y - this.cells[0].y;
    const distance = Math.sqrt(dx * dx + dy * dy); // 蛇头移动的距离

    if (distance < this.eps) {
      this.cells[0] = this.next_cell;
      this.next_cell = null;
      this.status = "idle";

      if (!this.check_tail_increasing()) {
        // 蛇不变长的话，砍掉蛇尾
        this.cells.pop();
      }
    } else {
      const move_distance = (this.speed * this.timedelta) / 1000;
      this.cells[0].x += (move_distance * dx) / distance; // 加上x上的偏移量
      this.cells[0].y += (move_distance * dy) / distance; // 加上y上的偏移量

      if (!this.check_tail_increasing()) {
        const k = this.cells.length;
        const tail = this.cells[k - 1];
        const tail_target = this.cells[k - 2];
        const tail_dx = tail_target.x - tail.x;
        const tail_dy = tail_target.y - tail.y;
        this.x += (move_distance * tail_dx) / distance;
        this.y += (move_distance * tail_dy) / distance;
      }
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
    if (this.status === "die") {
      ctx.fillStyle = "white";
    }

    for (const cell of this.cells) {
      ctx.beginPath();
      ctx.arc(cell.x * L, cell.y * L, (L / 2) * 0.8, 0, Math.PI * 2);
      ctx.fill();
    }

    for (let i = 1; i < this.cells.length; i++) {
      const a = this.cells[i - 1],
        b = this.cells[i];
      if (Math.abs(a.x - b.x) < this.eps && Math.abs(a.y - b.y) < this.eps) continue;
      if (Math.abs(a.x - b.x) < this.eps) {
        ctx.fillRect((a.x - 0.4) * L, Math.min(a.y, b.y) * L, L * 0.8, Math.abs(a.y - b.y) * L);
      } else {
        ctx.fillRect(Math.min(a.x, b.x) * L, (a.y - 0.4) * L, Math.abs(a.x - b.x) * L, L * 0.8);
      }
    }

    ctx.fillStyle = "black";
    for (let i = 0; i < 2; i++) {
      const eye_x = (this.cells[0].x + this.eye_dx[this.eye_direction][i] * 0.15) * L;
      const eye_y = (this.cells[0].y + this.eye_dy[this.eye_direction][i] * 0.15) * L;
      ctx.beginPath();
      ctx.arc(eye_x, eye_y, L * 0.05, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}
