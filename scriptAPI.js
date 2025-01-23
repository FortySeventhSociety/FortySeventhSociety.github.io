/* // D474designs | Modifications, and fixes by JOCV-III ///////
// All Rights Reserved /////// */

// Canvas Pie Chart & CSS Bar Chart

const percentageArray = [30.63, 26.25, 14.38, 28.75];
const answerArray = ['Public transport', 'Car', 'Bicycle', 'Walking'];

$.fn.createBarchart = function (optionvariables) {
  var chartContainer = $(this);
  var defaults = {
    'maxWidth': 244
  };
  var options = $.extend({}, defaults, optionvariables);
  var self = $(this),
      graphContainer = self.parent().find('.graph-container .graph'),
      barChart = $('<ul/>', { class: 'bar-chart' });
    
  barChart.appendTo(chartContainer);
    
  $.each(answerArray, function(index, value) {
    var chartAnswer = $('<li/>', { class: 'answer-' + index }),
        answerLabel = $('<span/>', { class: 'label', text: value }),
        percentageValue = percentageArray[index].toString(),
        answerPercentage = $('<span/>', { class: 'percentage', text: percentageValue.replace('.', ',') + '%' }),
        barTrack = $('<span/>', { class: 'bar-track' }),
        bar = $('<span />', { class: 'bar', style: 'width: ' + percentageValue + '%;' });
    
    chartAnswer.appendTo(barChart);
    answerLabel.appendTo(chartAnswer);
    answerPercentage.appendTo(chartAnswer);
    barTrack.appendTo(chartAnswer);
    bar.appendTo(barTrack);
  });
  
  barChart.chart(
    {
      graphContainer: graphContainer
    }
  );
};

$.fn.chart = function (optionvariables) {
  var chart = $(this);
  var defaults = {
    'canvasSize': 220,
    'graphContainer': $('.graph-container .graph')
  };
  var options = $.extend({}, defaults, optionvariables);
  
  return chart.each(function () {
    var listItem = chart.find('li'),
        listItems = listItem.length,
        canvas = document.createElement('canvas'),
        canvasWidth = options.canvasSize,
        canvasHeight = options.canvasSize,
        graphContainer = options.graphContainer,
        total = 0,
        totalPercentage = 0,
        data = [],
        newData = [],
        i = 0,
        startingAngle,
        arcSize,
        endingAngle;

    $.each(percentageArray, function(index, value) {
      newData.push(3.6 * value);
    });
    
    function sumTo(a, i) {
      var sum = 0;
      for (var j = 0; j < i; j++) {
        sum += a[j];
      }
      return sum - 90;
    }
    
    function degreesToRadians(degrees) {
      return ((degrees * Math.PI)/180);
    }
    
    canvas.setAttribute('width', canvasWidth);
    canvas.setAttribute('height', canvasHeight);
    canvas.setAttribute('id', 'chartCanvas');
    graphContainer.append(canvas);
    
    var cvs = document.getElementById('chartCanvas'),
        ctx = cvs.getContext('2d'),
        centerX = canvasWidth / 2,
        centerY = canvasHeight / 2,
        radius = canvasWidth / 2;
    
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    
    listItem.each(function(e) {
      startingAngle = degreesToRadians(sumTo(newData, i));
      arcSize = degreesToRadians(newData[i]);
      endingAngle = startingAngle + arcSize;
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, startingAngle, endingAngle, false);
      ctx.closePath();
      ctx.fillStyle = $(this).find('.bar').css('backgroundColor');
      ctx.fill();
      ctx.restore();
      i++;
    });
    
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.arc(centerX, centerY, radius * .45, 0, 2 * Math.PI, false);
    ctx.closePath();
    ctx.fillStyle = $('body').css('backgroundColor');
    ctx.fill();
  });
};

$('#live-poll-area .answer-list').createBarchart();





// Responsive SVG Graph

$(function () {
  "use strict";
  
  var resizeTracker;

  // Counteracts all transforms applied above an element.
  // Apply a translation to the element to have it remain at a local position
  var unscale = function (el) {
    var svg = el.ownerSVGElement.ownerSVGElement;
    var xf = el.scaleIndependentXForm;
    if (!xf) {
      // Keep a single transform matrix in the stack for fighting transformations
      xf = el.scaleIndependentXForm = svg.createSVGTransform();
      // Be sure to apply this transform after existing transforms (translate)
      el.transform.baseVal.appendItem(xf);
    }
    var m = svg.getTransformToElement(el.parentNode);
    m.e = m.f = 0; // Ignore (preserve) any translations done up to this point
    xf.setMatrix(m);
  };

  [].forEach.call($("text, .tick"), unscale);

  $(window).resize(function () {
    if (resizeTracker) clearTimeout(resizeTracker);
    resizeTracker = setTimeout(function () { [].forEach.call($("text, .tick"), unscale); }, 100);
  });
})





// 






/* // D474designs | Modifications, and fixes by JOCV-III ///////
// All Rights Reserved /////// */