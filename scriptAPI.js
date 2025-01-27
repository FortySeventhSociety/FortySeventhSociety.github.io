/* // D474designs | Modifications, and fixes by JOCV-III ///////
// All Rights Reserved /////// */

// Canvas Pie Chart & CSS Bar Chart

/*
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
*/





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





// Analytics Dashboard

$('li.nav-item').click( function() {
   $(this).toggleClass('open');
});





// D3 Bubble Chart

(function() {

  // Fake JSON data
  var json = {"countries_msg_vol": {
    "CA": 170, "US": 393, "BB": 12, "CU": 9, "BR": 89, "MX": 192, "PY": 32, "UY": 9, "VE": 25, "BG": 42, "CZ": 12, "HU": 7, "RU": 184, "FI": 42, "GB": 162, "IT": 87, "ES": 65, "FR": 42, "DE": 102, "NL": 12, "CN": 92, "JP": 65, "KR": 87, "TW": 9, "IN": 98, "SG": 32, "ID": 4, "MY": 7, "VN": 8, "AU": 129, "NZ": 65, "GU": 11, "EG": 18, "LY": 4, "ZA": 76, "A1": 2, "Other": 254 
  }};
  
  // D3 Bubble Chart 

  var diameter = 600;

  var svg = d3.select('#graph').append('svg')
          .attr('width', diameter)
          .attr('height', diameter);

  var bubble = d3.layout.pack()
        .size([diameter, diameter])
        .value(function(d) {return d.size;})
         // .sort(function(a, b) {
        //  return -(a.value - b.value)
        // }) 
        .padding(3);
  
  // generate data with calculated layout values
  var nodes = bubble.nodes(processData(json))
            .filter(function(d) { return !d.children; }); // filter out the outer bubble
 
  var vis = svg.selectAll('circle')
          .data(nodes);
  
  vis.enter().append('circle')
      .attr('transform', function(d) { return 'translate(' + d.x + ',' + d.y + ')'; })
      .attr('r', function(d) { return d.r; })
      .attr('class', function(d) { return d.className; });
  
  function processData(data) {
    var obj = data.countries_msg_vol;

    var newDataSet = [];

    for(var prop in obj) {
      newDataSet.push({name: prop, className: prop.toLowerCase(), size: obj[prop]});
    }
    return {children: newDataSet};
  }
  
})();






/* // D474designs | Modifications, and fixes by JOCV-III ///////
// All Rights Reserved /////// */