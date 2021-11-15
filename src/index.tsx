import * as Plot from "@observablehq/plot";
import "./index.css";

let states: any = [];

let initialRvTokenSupply = 100;
let harvestDelay = 21600;
let feePercent = 0.1;

// We want to start with a 1:1 exchange rate.
let totalHoldings = initialRvTokenSupply;
let rvTokenSupply = initialRvTokenSupply;
let lastHarvest = 0; // We'll start with no prior harvests.
let lockedProfit = 0; // We'll start with no profit.

let totalSecondsToSimulate = 200000;

for (
  let secondsElapsed = 0;
  secondsElapsed < totalSecondsToSimulate;
  secondsElapsed++
) {
  // If we can harvest:
  if (secondsElapsed >= lastHarvest + harvestDelay) {
    // Choose a random amount of profit to make.
    let profitThisHarvest = Math.random() * 50;

    rvTokenSupply += // Accrue fees.
      (profitThisHarvest * feePercent) / (totalHoldings / rvTokenSupply);

    // Update total holdings.
    totalHoldings += profitThisHarvest;

    // Update locked profit, properly subtracting fees.
    lockedProfit = profitThisHarvest - profitThisHarvest * feePercent;

    // Update the last harvest timestamp.
    lastHarvest = secondsElapsed;
  }

  let currentLockedProfit = // Compute the current amount of locked profit.
    lockedProfit -
    (lockedProfit * (secondsElapsed - lastHarvest)) / harvestDelay;

  states.push({
    variable: "Total Holdings",
    x: secondsElapsed,
    y: totalHoldings - currentLockedProfit
  });

  states.push({
    variable: "Total Strategy Holdings",
    x: secondsElapsed,
    y: totalHoldings
  });

  states.push({
    variable: "Locked Profit",
    x: secondsElapsed,
    y: currentLockedProfit
  });

  states.push({
    variable: "rvToken Total Supply",
    x: secondsElapsed,
    y: rvTokenSupply
  });

  states.push({
    variable: "Exchange Rate x 100",
    x: secondsElapsed,
    y: ((totalHoldings - currentLockedProfit) / rvTokenSupply) * 100
  });

  states.push({
    variable: "rvTokens Accrued As Fees",
    x: secondsElapsed,
    y: rvTokenSupply - initialRvTokenSupply
  });
}

const plot = Plot.plot({
  width: 810,
  height: 510,

  y: {
    label: null,
    grid: true
  },

  x: {
    label: "Time (s) →",
    grid: false
  },

  marks: [
    Plot.frame(),

    Plot.ruleX(
      Array.from(
        { length: totalSecondsToSimulate / harvestDelay + 1 },
        (_, x) => harvestDelay * x
      ),
      { strokeOpacity: 0.1 }
    ),

    Plot.line(states, {
      x: "x",
      y: "y",
      stroke: "variable"
    }),

    Plot.text(
      states,
      Plot.selectLast({
        x: "x",
        y: "y",
        z: "variable",
        text: "variable",
        textAnchor: "start",
        stroke: "variable",
        dx: 3
      })
    )
  ]
});

document.body.appendChild(plot);
