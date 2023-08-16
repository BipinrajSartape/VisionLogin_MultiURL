
// graph js
var w = (window.screen.width)
$(document).ready(function () {
  initLineGraph();
});
var pointOptions = {
  'fill': '#ce07ad',
  'stroke': '#ce07ad',
  radius: 4
}
var lineOptions = {
  'stroke': '#ce07ad',
  'stroke-width': 3,
  'fill': '#ce07ad',
  'fill-opacity': 0.5
}
var w = window.innerWidth;
// var c = .3333;
// var valueInString = w;
// var num = parseFloat(valueInString);
// var val = num - (num * c);
// console.log(val);
console.log(w);
document.getElementById("line-graph").style.width = w;
document.getElementById("line-graph").style.position = 'absolute';
document.getElementById("line-graph").style.left = 0;
document.getElementById("line-graph").style.bottom = 0;
function initLineGraph() {

  var paper = new Raphael(document.getElementById('line-graph'), w, $('#line-graph')
    .height());
  graphData.paper = paper;


  var path = createPathString(graphData);

  var line = paper.path(path);


  line.attr(lineOptions);

  graphData.line = line;

  drawPoints(graphData, pointOptions);

  setInterval(function () {
    advanceGraph();
  }, 2500);

}
function advanceGraph() {
  if (graphData.current < graphData.charts.length - 1) {
    graphData.current++;
  } else {
    graphData.current = 1;
  }
  /* animate to new data positions */
  animatePoints(graphData, graphData.charts[graphData.current]);
}
/* draw initial points */
function drawPoints(data, options) {
  /* point radius */
  var radius = options.radius;
  /* set points to initial data set */
  var points = data.charts[0].points;
  /* iterate through points */
  for (var i = 0, length = points.length; i < length; i++) {
    var xPos = data.xOffset + (i * data.xDelta);
    var yPos = data.yOffset;
    /* draw */
    var circle = data.paper.circle(xPos, yPos, radius);
    circle.attr(pointOptions);
    /* store raphael.js point object in global data set */
    points[i].point = circle;
  }
}

function animatePoints(data, newData) {
  var newPath = '';
  var upperLimit = parseInt(newData.upper);
  if (isNaN(upperLimit)) {
    upperLimit = 1;
  }
  var lowerLimit = parseInt(newData.lower);
  if (isNaN(lowerLimit)) {
    lowerLimit = 0;
  }
  var scaleFactor = data.yOffset / (upperLimit - lowerLimit);
  var points = data.charts[0].points;

  for (var i = 0, length = points.length; i < length; i++) {
    if (i == 0) {

      newPath += 'M 0 291 L ';
      newX = data.xOffset + ' ';
      newPath += newX;
      newY = data.yOffset - ((newData.points[i].value - lowerLimit) * scaleFactor) + ' ';
      newPath += newY;
    } else {
      newPath += ' L ';
      newX = data.xOffset + (i * data.xDelta) + ' ';
      newPath += newX;
      newY = data.yOffset - ((newData.points[i].value - lowerLimit) * scaleFactor);
      newPath += newY;
    }

    /* animate raphael.js points to new positions */
    points[i].point.animate({
      cy: data.yOffset - ((newData.points[i].value - lowerLimit) * scaleFactor)
    },
      800,
      'ease-in-out'
    );
  }

  newPath += ' L w 291 Z';
  data.line.animate({
    path: newPath
  }, 800, 'ease-in-out');
}



function createPathString(data) {

  var points = data.charts[data.current].points;
  var path = 'M 0 291 L ' + data.xOffset + ' ' + (data.yOffset - points[0].value);
  var prevY = data.yOffset - points[0].value;
  for (var i = 1, length = points.length; i < length; i++) {
    path += ' L ';
    path += data.xOffset + (i * data.xDelta) + ' ';
    path += (data.yOffset - points[i].value);

    prevY = data.yOffset - points[i].value;
  }
  path += ' L w 291 Z';
  return path;
}

/**** Global Data Object *****/
var graphData = {
  current: 0,
  xDelta: w / 11,
  xOffset: 0,
  yOffset: 289,
  charts: [
    /* initial data set */
    {
      lower: 0,
      upper: 200,
      points: [{
        value: 0
      },
      {
        value: 0
      },
      {
        value: 0
      },
      {
        value: 0
      },
      {
        value: 0
      },
      {
        value: 0
      },
      {
        value: 0
      },
      {
        value: 0
      },
      {
        value: 0
      },
      {
        value: 0
      },
      {
        value: 0
      },
      {
        value: 0
      }
      ]
    },

    {
      lower: 0,
      upper: 200,
      points: [{
        value: 0
      },
      {
        value: 50
      },
      {
        value: 130
      },
      {
        value: 100
      },
      {
        value: 200
      },
      {
        value: 120
      },
      {
        value: 90
      },
      {
        value: 180
      },
      {
        value: 95
      },
      {
        value: 150
      },
      {
        value: 90
      },
      {
        value: 0
      }
      ]
    },

    {
      lower: 0,
      upper: 200,
      points: [{
        value: 0
      },
      {
        value: 130
      },
      {
        value: 100
      },
      {
        value: 150
      },
      {
        value: 90
      },
      {
        value: 200
      },
      {
        value: 130
      },
      {
        value: 150
      },
      {
        value: 60
      },
      {
        value: 190
      },
      {
        value: 50
      },
      {
        value: 0
      }
      ]
    },

    {
      lower: 0,
      upper: 200,
      points: [{
        value: 0
      },
      {
        value: 100
      },
      {
        value: 180
      },
      {
        value: 70
      },
      {
        value: 150
      },
      {
        value: 90
      },
      {
        value: 180
      },
      {
        value: 100
      },
      {
        value: 150
      },
      {
        value: 100
      },
      {
        value: 120
      },
      {
        value: 0
      }
      ]
    },

    {
      lower: 0,
      upper: 200,
      points: [{
        value: 0
      },
      {
        value: 180
      },
      {
        value: 150
      },
      {
        value: 200
      },
      {
        value: 130
      },
      {
        value: 150
      },
      {
        value: 110
      },
      {
        value: 200
      },
      {
        value: 130
      },
      {
        value: 80
      },
      {
        value: 180
      },
      {
        value: 0
      }
      ]
    },
  ]
};
