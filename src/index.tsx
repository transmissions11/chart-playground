import * as Plot from "@observablehq/plot";
import "./index.css";

const AXIS_CONFIG = { x: "x", y: "y" };

let marks = [Plot.frame()];

marks.push(
  Plot.line(
    Array.from({ length: 10000 }, (_, x) => {
      return {
        x,
        y: x * Math.random()
      };
    }),

    { ...AXIS_CONFIG, stroke: "green" }
  )
);

marks.push(
  Plot.line(
    Array.from({ length: 10000 }, (_, x) => {
      return {
        x,
        y: x * -Math.random()
      };
    }),

    { ...AXIS_CONFIG, stroke: "red" }
  )
);

const plot = Plot.plot({
  width: 810,
  height: 510,

  y: {
    label: null,
    grid: true
  },

  x: {
    label: null,
    grid: true
  },

  marks
});

document.body.appendChild(plot);
