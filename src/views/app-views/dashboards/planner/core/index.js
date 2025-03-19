import { getPaddingSize } from './helper';
import Item from './item';
import { defaultOptions } from '../constant';

class Core {
  root;
  canvas;
  ctx;
  objects = [];
  option = null;
  currentItem = null;
  resizeObserver;
  snapshot = null;
  metrics = {
    left: 0,
    top: 0,
    width: 0,
    height: 0,
    dpr: 1,
    scrollX: 0,
    scrollY: 0,
    zoom: 1,
  };
  action = null;

  mount(root) {
    this.root = root;
    this.canvas = document.createElement("canvas");
    this.root.appendChild(this.canvas);

    window.addEventListener("resize", this.resize);
    this.canvas.addEventListener("mousedown", this.onMouseDown);
    this.canvas.addEventListener("mousemove", this.onMouseMove);
    this.canvas.addEventListener("mouseup", this.onMouseUp);
    this.canvas.addEventListener("wheel", this.onMouseWheel);

    this.ctx = this.canvas.getContext("2d", {
      willReadFrequently: true,
      alpha: false,
    });
    if (this.ctx) {
      this.ctx.imageSmoothingEnabled = false;
      this.resize();
      this.reDraw();
    }
  }

  unmount() {
    if (this.canvas) {
      window.removeEventListener("resize", this.resize);
      this.canvas.removeEventListener("mousedown", this.onMouseDown);
      this.canvas.addEventListener("mousemove", this.onMouseMove);
      this.canvas.addEventListener("mouseup", this.onMouseUp);
      this.canvas.removeEventListener("wheel", this.onMouseWheel);
      if (this.root) this.root.removeChild(this.canvas);
      this.canvas = null;
      this.ctx = null;
    }
  }

  resize = () => {
    if (this.root && this.canvas && this.ctx) {
      const rect = this.root.getBoundingClientRect();
      const { paddingTop, paddingRight, paddingBottom, paddingLeft } =
        getPaddingSize(this.root);
      this.metrics.left = rect.left + paddingLeft;
      this.metrics.top = rect.top + paddingTop;
      this.metrics.width = rect.width - paddingRight - paddingLeft;
      this.metrics.height = rect.height - paddingTop - paddingBottom;
      this.metrics.dpr = window.devicePixelRatio;
      // Физический размер канвы с учётом плотности пикселей (т.е. канва может быть в разы больше)
      this.canvas.width = this.metrics.width * this.metrics.dpr;
      this.canvas.height = this.metrics.height * this.metrics.dpr;

      // Общая трансформация - все координаты будут увеличиваться на dpr, чтобы фигуры рисовались в увеличенном (в физическом) размере
      this.ctx.scale(this.metrics.dpr, this.metrics.dpr);
      this.canvas.style.width = `${this.metrics.width}px`;
      this.canvas.style.height = `${this.metrics.height}px`;
    }
  }

  scroll({ x, y, dx, dy }) {
    if (x) this.metrics.scrollX = x;
    if (y) this.metrics.scrollY = y;
    if (dx) this.metrics.scrollX += dx; //добавляется смещение по горизонтали
    if (dy) this.metrics.scrollY += dy; //добавляется смещение по вертикали
  }

  zoom({ center, zoom, delta }) {
    // Центр масштабирования с учётом текущего смещения и масштабирования
    const centerReal = {
      x: (center.x + this.metrics.scrollX) / this.metrics.zoom,
      y: (center.y + this.metrics.scrollY) / this.metrics.zoom,
    };
    // Точная установка масштаба
    if (zoom) this.metrics.zoom = zoom;
    // Изменение масштабирования на коэффициент
    if (delta) this.metrics.zoom += delta * this.metrics.zoom;
    // Корректировка минимального масштаба
    this.metrics.zoom = Math.max(0.1, this.metrics.zoom);
    // Центр масштабирования с учётом нового масштаба
    const centerNew = {
      x: centerReal.x * this.metrics.zoom,
      y: centerReal.y * this.metrics.zoom,
    };
    // Корректировка смещения
    this.scroll({
      x: centerNew.x - center.x,
      y: centerNew.y - center.y,
    });
  }

  changeOption(option) {
    this.option = option;
  }

  draw(x, y) {
    if (this.canvas && this.ctx) {
      //Получение пиксельных данных для контекста
      this.snapshot = this.ctx.getImageData(
        0,
        0,
        this.canvas.width,
        this.canvas.height
      );
      this.currentItem = new Item(x, y, this.option.id, this.option.src);
      this.objects.push(this.currentItem);
      this.reDraw()
    }
  }

  onMouseDown = (e) => {
    const point = this.transformPoint(e);
    if (this.option) {
      this.draw(point.x, point.y);
    } else {
      for (let object of this.objects.reverse()) {
        if (object.mouseInItem(point.x, point.y)) {
          this.action = {
            name: "drag",
            x: point.x,
            y: point.y,
            targetX: object.startX,
            targetY: object.startY,
            element: object,
          };
          break;
        } else {
          this.action = {
            name: "scroll",
            // Координата, с которой начинаем расчёт смещения (учитывать зум не нужно)
            x: e.clientX - this.metrics.left,
            y: e.clientY - this.metrics.top,
            // Запоминаем исходное смещение, чтобы к нему добавлять расчётное
            targetX: this.metrics.scrollX,
            targetY: this.metrics.scrollY,
          };
        }
      }
      this.objects.reverse();
    }
  };

  onMouseUp = () => {
    if (this.option) {
      this.option = null;
    }
    this.action = null;
  };

  onMouseMove = (e) => {
    const point = this.transformPoint(e);
    if(this.action){
      if (this.action.name === "drag" && this.action.element && this.canvas) {
        this.dragItem(
          this.action.element,
          this.action.targetX + point.x - this.action.x,
          this.action.targetY + point.y - this.action.y
        );
      } else if (this.action.name === "scroll") {
        // Скролл использует не масштабированную точку, так как сам же на неё повлиял бы
        this.scroll({
          x:
            this.action.targetX -
            (e.clientX - this.metrics.left - this.action.x),
          y:
            this.action.targetY -
            (e.clientY - this.metrics.top - this.action.y),
        });
      }
    }
  };

  onMouseWheel = (e) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.1 : -0.1;
    if (e.ctrlKey) {
      // Масштабирование
      this.zoom({ center: { x: e.offsetX, y: e.offsetY }, delta });
    } else {
      // Прокрутка по вертикали
      this.scroll({ dy: delta * 300 });
    }
  };

  dragItem(element, x, y) {
    if (this.ctx) {
      this.ctx.save();
      element.move(x, y);
      this.reDraw();
      this.ctx.restore();
    }
  }
  
  reDraw = () => {
    if (this.ctx) {
      this.ctx.save();
      this.ctx.fillStyle = "#fff";
      this.ctx.fillRect(0, 0, this.metrics.width, this.metrics.height);
      this.ctx.translate(-this.metrics.scrollX, -this.metrics.scrollY);
      this.ctx.scale(this.metrics.zoom, this.metrics.zoom);
      for (let object of this.objects) {
        this.ctx.save();
        object.draw(this.ctx, object.src, object.startX, object.startY);
        this.ctx.restore();
      }
      this.ctx.restore();
      requestAnimationFrame(this.reDraw);
    }
  }

  transformPoint(e) {
    return {
      x: Math.round(
        (e.clientX - this.metrics.left + this.metrics.scrollX) /
          this.metrics.zoom
      ),
      y: Math.round(
        (e.clientY - this.metrics.top + this.metrics.scrollY) /
          this.metrics.zoom
      ),
    };
  }

  onClear() {
    if (this.ctx && this.canvas) {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.objects = [];
    }
  }

  onSave() {
    const data = this.objects.map(({ id, startX, startY }) => ({ id, x: startX, y: startY }));
    const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'layout.json';
    a.click();
  }

  onLoad(e) {
    this.onClear();
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      const loadedData = JSON.parse(event.target.result);
      const updatedObjects = loadedData.map((item) => {
        const original = defaultOptions.find((obj) => obj.id === item.id);
        return original ? new Item(item.x, item.y, original.id, original.src) : null;
      }).filter(Boolean);
      this.objects = updatedObjects;
      this.reDraw();
    };
    reader.readAsText(file);
  }
}

export default Core;