import { Delaunay } from 'd3-delaunay';
import './style.css';

const SIZE = (window.innerWidth + window.innerHeight) / 2 / 50;
const FORCE = 3;
let points = [];
let width = window.innerWidth;
let height = window.innerHeight;
let time = 0;
let globalMouseX = width / 2;
let globalMouseY = height / 2; 

function updatePoints() {
  console.log('updatePoints')
  const newPoints = []
  const columns = Math.floor(width / SIZE);
  const rows = Math.floor(width / SIZE);


  for(let i = 0; i < columns; i++) {
    for(let j = 0; j < rows; j++) {
      newPoints.push([
        Math.round(width / columns * i + Math.random() * width / columns),
        Math.round(height / rows * j + Math.random() * height / rows)
      ]);
    }
  }

  points = newPoints;
}

function isPointInCircle({ dx, dy, radius }) {
  if (dx > radius || dy > radius) {
    return false
  }

  if (dx + dy <= radius) {
    return true
  }

  if (dx^2 + dy^2 <= radius^2) {
    return true
  }

  return false
}

function update ({ parent, mouseX = width / 2, mouseY = height / 2 }) {
  const delaunay = Delaunay.from(points.map(([x, y]) => {
    const radius = 160
    const dx = Math.abs(x - mouseX)
    const dy = Math.abs(y - mouseY)

    if (isPointInCircle({dx, dy, radius})) {
      const force = FORCE * 1 - (dx / radius + dy / radius) / 2
      return [x, y].map(value => value + ((-0.5 + Math.random()) * force))
    }

    return [x, y]
  }));
  const voronoi = delaunay.voronoi([0, 0, width, height]);
  const svgString = voronoi.render()
  parent.innerHTML = `
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
      <path
        fill="none"
        d="${svgString}"
        style="stroke:rgb(255,255,255); stroke-width:0.5"
      />
    </svg>
  `

  setTimeout(() => {
    window.requestAnimationFrame(() => update({
      parent: app,
      mouseX: globalMouseX,
      mouseY: globalMouseY
    }));
  }, 10)
}


const app = document.getElementById('app');
app.addEventListener('mouseup', evt => {
  evt.preventDefault();

  updatePoints();
})
updatePoints();
update({
  parent: app
});

document.addEventListener("mousemove", evt => {
  // window.requestAnimationFrame(() => update({
  //   parent: app,
  //   mouseX: evt.clientX,
  //   mouseY: evt.clientY
  // }));
  globalMouseX = evt.clientX;
  globalMouseY = evt.clientY;
});

// function throttle(type, name, target = window) {
//   let running = false;

//   target.addEventListener(type, () => {
//     if (running) {
//       return;
//     }

//     running = true;

//     window.requestAnimationFrame(() => {
//       target.dispatchEvent(new CustomEvent(name));
//       running = false;
//     });
//   });
// };

// throttle("resize", "optimizedResize");

// window.addEventListener("optimizedResize", update);


