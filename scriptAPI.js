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
    resizeTracker = setTimeout(function () {
      [].forEach.call($("text, .tick"), unscale);
    }, 100);
  });
});

// Analytics Dashboard

$("li.nav-item").click(function () {
  $(this).toggleClass("open");
});

// D3 Bubble Chart

(function () {
  // Fake JSON data
  var json = {
    countries_msg_vol: {
      CA: 170,
      US: 393,
      BB: 12,
      CU: 9,
      BR: 89,
      MX: 192,
      PY: 32,
      UY: 9,
      VE: 25,
      BG: 42,
      CZ: 12,
      HU: 7,
      RU: 184,
      FI: 42,
      GB: 162,
      IT: 87,
      ES: 65,
      FR: 42,
      DE: 102,
      NL: 12,
      CN: 92,
      JP: 65,
      KR: 87,
      TW: 9,
      IN: 98,
      SG: 32,
      ID: 4,
      MY: 7,
      VN: 8,
      AU: 129,
      NZ: 65,
      GU: 11,
      EG: 18,
      LY: 4,
      ZA: 76,
      A1: 2,
      Other: 254,
    },
  };

  // D3 Bubble Chart

  var diameter = 600;

  var svg = d3
    .select("#graph")
    .append("svg")
    .attr("width", diameter)
    .attr("height", diameter);

  var bubble = d3.layout
    .pack()
    .size([diameter, diameter])
    .value(function (d) {
      return d.size;
    })
    // .sort(function(a, b) {
    //  return -(a.value - b.value)
    // })
    .padding(3);

  // generate data with calculated layout values
  var nodes = bubble.nodes(processData(json)).filter(function (d) {
    return !d.children;
  }); // filter out the outer bubble

  var vis = svg.selectAll("circle").data(nodes);

  vis
    .enter()
    .append("circle")
    .attr("transform", function (d) {
      return "translate(" + d.x + "," + d.y + ")";
    })
    .attr("r", function (d) {
      return d.r;
    })
    .attr("class", function (d) {
      return d.className;
    });

  function processData(data) {
    var obj = data.countries_msg_vol;

    var newDataSet = [];

    for (var prop in obj) {
      newDataSet.push({
        name: prop,
        className: prop.toLowerCase(),
        size: obj[prop],
      });
    }
    return { children: newDataSet };
  }
})();

// Animated Skills Graph

$(document).ready(function() {
  $('.adobe').css('width', '100%');
  $('.html').css('width', '100%');
  $('.css').css('width', '100%');
  $('.lesssass').css('width', '50%');
  $('.jquery').css('width', '70%');
  $('.javascript').css('width', '55%');
  $('.bootstrap').css('width', '90%');
  $('.wordpress').css('width', '85%');
  $('.ui').css('width', '100%');
  $('.ux').css('width', '90%');
  $('.rwd').css('width', '85%');
  $('.mobile').css('width', '85%');
  $('.rapidproto').css('width', '95%');
});

// Responsive Graph Generator

// For example on how to intiate graphs, or if you want to mess around with the data / style of these graphs, check the bottom of this panel.

(function ($) {

    $.fn.graphiq = function (options) {

        // Default options
        var settings = $.extend({
            data: {},
            colorLine: "#d3a2ef",
            colorDot: "#c3ecf7",
            colorXGrid: "#7f7f7f",
            colorYGrid: "#7f7f7f",
            colorLabels: "#FFFFFF",
            colorUnits: "#FFFFFF",
            colorRange: "#FFFFFF",
            colorFill: "#533c68",
            colorDotStroke: "#FFFFFF",
            dotStrokeWeight: 0,
            fillOpacity: 0.25,
            rangeOpacity: 0.5,
            dotRadius: 3,
            lineWeight: 2,
            yLines: true,
            dots: true,
            xLines: true,
            xLineCount: 5,
            fill: true,
            height: 100,
            fluidParent: null
        }, options);

        var values = [];
        var entryDivision;
        var dataRange = settings.height + settings.dotRadius;
        var parent = this;
        var maxVal;
        var scaleFactor = settings.height / 100;
        var pathPoints = "";
        for (var key in settings.data) {
            values.push(settings.data[key]);
        }

        parent.append(
            '<div class="graphiq__graph-values"></div><div class="graphiq__graph-layout"><svg class="graphiq__graph" viewBox="0 0 960 '+ (settings.height + 10) +'" shape-rendering="geometricPrecision"><path fill="'+ settings.colorFill +'" style="opacity: '+ settings.fillOpacity +'" class="graphiq__fill-path" d="" stroke-width="0" stroke="#000" fill="cyan"/></svg><div class="graphiq__graph-key"></div></div>'
        );
            if (settings.fluidParent) {
                this.closest(".col").css("overflow", "auto");
            }
        parent.addClass('graphiq');

        var graph = this.find(".graphiq__graph");

        // Get data from table
        for (var key in settings.data) {
            this.find(".graphiq__graph-key").append('<div class="key" style="color: ' + settings.colorLabels + '">' + key + "</div>");
        }

        maxVal = Math.max.apply(Math, values);


        this.find('.graphiq__graph-values').append('<span style="color: ' + settings.colorRange + '; opacity: ' + settings.rangeOpacity + '">' + maxVal + '</span><span style="color: ' + settings.colorRange + '; opacity: ' + settings.rangeOpacity + '" >0</span>');



        // Set even spacing in the graph depending on amount of data

        var width = parent.find(".graphiq__graph-layout").width();
        
        if (settings.xLines) {
            unitLines(width, maxVal);
        }

        layoutGraph(width, true);

        $(window).on("resize", function () {
            pathPoints = "";
            width = parent.find(".graphiq__graph-layout").width();
            layoutGraph(width, false);
        });

       // buildFillPath();
   
        function percentageOf(max, current) {
            return (current / max * 100) * scaleFactor;
        }

        function layoutGraph(width, initial) {
            graph.attr({
                viewBox: "0 0 " + width + " " + (settings.height + 10),
                width: width
            });
            entryDivision = width / (values.length - 1);
            getCoordinates(initial, entryDivision);
        }

        function getCoordinates(initial, entryDivision) {


            for (i = 0; i < values.length; i++) {
           
                var offset;
       
                if (i == 0) {
                    offset = (settings.dotRadius + (settings.dotStrokeWeight)) + 1;
                } 
            
                 else if (i == values.length - 1) {
                    offset = ((settings.dotRadius + (settings.dotStrokeWeight )) * -1) - 1;
                } else {
                    offset = 0;
                }
           
                var lineOffset = i == values.length - 2 ? (settings.dotRadius + (settings.dotStrokeWeight)) / 2 : 0;

                let nextI = i + 1;
                let xAxis = (entryDivision * i) + offset;
                let xAxis2 = entryDivision * nextI;
                
                console.log(offset);
           

                let yAxis = dataRange - percentageOf(maxVal, values[i]);

                let yAxis2 = dataRange - percentageOf(maxVal, values[nextI]);

                if (i == values.length - 1) {
                    yAxis2 = yAxis;
                    xAxis2 = xAxis;
                }

              pathPoints += " L " + xAxis + " " + yAxis;
             

                if (i == values.length - 1 && settings.fill) {
                    buildFillPath(pathPoints);
                }

                if (initial) {

                    if (settings.yLines) {

                    $(document.createElementNS("http://www.w3.org/2000/svg", "line"))
                        .attr({
                            class: "graphiq__y-division",
                            x1: xAxis,
                            y1: yAxis,
                            x2: xAxis,
                            y2: settings.height + 5,
                            stroke: settings.colorYGrid,
                            "stroke-dasharray": "5 6",
                            "stroke-width": 1
                        })
                        .prependTo(graph);

                    }

                    // Draw the line
                    

                    $(document.createElementNS("http://www.w3.org/2000/svg", "line"))
                        .attr({
                            class: "graphiq__line",
                            x1: xAxis ,
                            y1: yAxis,
                            x2: xAxis2 - lineOffset,
                            y2: yAxis2 + (settings.dotStrokeWeight / 2),
                            stroke: settings.colorLine,
                            "stroke-width": settings.lineWeight,
                            "vector-effect": "non-scaling-stroke"
                        }).appendTo(graph);

                    // Draw the circle

               
                    $(document.createElementNS("http://www.w3.org/2000/svg", "circle"))
                        .attr({
                            class: "graphiq__graph-dot",
                            cx: xAxis,
                            cy: yAxis + (settings.dotStrokeWeight / 2),
                            r: settings.dots ? settings.dotRadius : 0,
                            fill: settings.colorDot,
                            stroke: settings.colorDotStroke,
                            "stroke-width": settings.dotStrokeWeight,
                            "data-value": values[i],
                            "vector-effect": "non-scaling-stroke"
                        })
                        .appendTo(graph);
                    

                    // Resize instead of draw, used in resize
                } else {

                    parent.find(".graphiq__graph-dot")
                        .eq(i)
                        .attr({
                            cx: xAxis,
                        });
                    parent.find(".graphiq__line")
                        .eq(i)
                        .attr({
                            x1: xAxis,
                            x2: xAxis2 - lineOffset,
                        });
                    parent.find(".graphiq__y-division")
                        .eq(values.length - i - 1)
                        .attr({
                            x1: xAxis,
                            x2: xAxis
                        });
                    parent.find(".graphiq__x-line").each(function () {
                        $(this).attr({
                            x2: width
                        });
                    });
                }
            }
        }

        function buildFillPath(pathPoints) {
          
          parent.find('.graphiq__fill-path').attr("d", "M  " + (4 + settings.dotStrokeWeight) + " " + (settings.height + 5 + settings.dotStrokeWeight) + pathPoints +  " L " + (width - settings.dotRadius - settings.dotStrokeWeight) + " " + (settings.height + 5 + settings.dotStrokeWeight))
        }

        function unitLines(width, maxVal) {
            // Draw the max line

            var iteration = 100 / (settings.xLineCount - 1);


                for (i=0; i < settings.xLineCount; i++) {

                        $(document.createElementNS("http://www.w3.org/2000/svg", "line"))
                        .attr({
                            class: "graphiq__x-line",
                            y1: iteration * i + (settings.dotRadius + settings.dotStrokeWeight),
                            x2: width,
                            y2: iteration * i +  (settings.dotRadius + settings.dotStrokeWeight),
                            stroke: settings.colorXGrid,
                            // "stroke-dasharray": "5 6",
                            "stroke-width": 1
                        })
                        .prependTo(graph);

                }
 
        }

        parent.hover(function () {
        
            $(this).find('.graphiq__graph-dot').each(function (index) {
                $('body').append('<span style="color: '+ settings.colorUnits +'" class="graphiq__value-dialog value-' + index + '">' + $(this).attr("data-value") + '</span>');
                $('.value-' + index).css({
                    top: $(this).position().top - 20,
                    left: $(this).position().left - ($('.value-' + index).outerWidth() / 2) + 3
                })
            })
        }, function () {
            $('.graphiq__value-dialog').remove();
        })

    };

}(jQuery));

// Initiate graphs

  var songs = {
  "Mon" : 80,
  "Tues": 40,
  "Wed" : 60,
  "Thu" : 80,
  "Fri": 40,
  "Sat" : 60,

   };

var coffees = {
  "Mon" : 3,
  "Tues": 2,
  "Wed" : 3,
  "Thu" : 2,
  "Fri" : 1.5,
  "Sat" : 1,
  "Sun" : 2
   };

var cats = {
    "10/12" : 1,
    "10/13" : 4,
    "10/14" : 15,
    "10/15" : 27,
    "10/16" : 48,
    "10/17" : 34,
    "10/18" : 12,
}

var reddit = {
    "10/12" : 3.5,
    "10/13" : 2.3,
    "10/14" : 2,
    "10/15" : 1.5,
    "10/16" : 3,
    "10/17" : 4,
    "10/18" : 7,
}

var feature = {
    "1am" : 20,
    "2am" : 15,
    "3am" : 26,
    "4am" : 23,
    "5am" : 36,
    "6am" : 48,
    "7am" : 89,
    "8am" : 109,
    "9am" : 140,
    "10am" : 162,
    "11am" : 173,
    "12pm" : 201
}


$('.graph-songs').graphiq({
    data: songs,
    fluidParent: ".col",
    height: 100,
    xLineCount: 5,
    dotRadius: 4,
    yLines: true,
    xLines: true,
    dots: true,
    fillOpacity: 0.5,
    fill: true,
    colorUnits: "#c3ecf7"
  });

  $('.graph-coffees').graphiq({
    data: coffees,
    fluidParent: ".col",
    height: 100,
    xLineCount: 3,
    dotRadius: 5,
    yLines: true,
    xLines: true,
    dots: true,
    colorLine: "#d3d1b1",
    colorDot: "#726d60",
    colorXGrid: "#634e1b",
    colorUnits: "#d3d1b1",
    colorFill: "#3a2f23",
    dotStrokeWeight: 3,

  });

    $('.graph-cats').graphiq({
    data: cats,
    fluidParent: ".col",
    yLines: false,
    xLines: false,
    dots: false,
    colorLine: "#efede5",
    colorLabels: "#efede5",
    fill: false
  });

      $('.graph-hours').graphiq({
    data: reddit,
    fluidParent: ".col",
    height: 100,
    xLineCount: 2,
    dotRadius: 5,
    yLines: false,
    xLines: true,
    dots: true,
    colorLine: "#2F9C95",
    colorDot: "#A3F7B5",
    colorXGrid: "#788476",
    colorUnits: "#A3F7B5",
    colorFill: "#2a4151"
  });

$('.graph-feature').graphiq({
    data: feature,
    fluidParent: ".col",
    colorFill: "#0B4F6C",
  colorRange: "#0B4F6C",
  colorLabels: "#0B4F6C",
    colorLine: "#145C9E",
    fillOpacity: 0.6,
    yLines: false,
    xLineCount: 2,
    dotRadius: 2,
    colorUnits: "#8ecde2",
    lineWeight: 0,
    dots: false,
    colorDot: "#ffc744",
    colorYGrid: "#041e28",
    colorXGrid: "#eeeeee",
    height: 180
})

// 3D Animated Chart

// vim: et:sts=2:sw=2

var angular = window.angular
  , console = window.console;

window.chartCtrl = ['$scope', function($scope) {
  $scope.data = new Array(9);
  
  $scope.sample = function() {
    if (!$scope.paused) {
      for (var i=0, l=$scope.data.length; i < l; i++) {
        $scope.data[i] = Math.random() * 95 + 5;
      }
    }
  };
  
  $scope.paused = false;
  
  $scope.sample();
  $scope.sampler = setInterval(function() {
    if (!$scope.paused) {
      $scope.$apply($scope.sample);
    }
  }, 2000);
}];

angular.module('myApp', []).

directive('peakChart', ['$window', function($win) {
  var PI   = Math.PI
    , sin  = Math.sin
    , cos  = Math.cos
    , tan  = Math.tan
    , atan = Math.atan
    , acos = Math.acos
    , sqrt = Math.sqrt
    , pow  = Math.pow
    , abs  = Math.abs
    , rSkRo = /^(?:sk|ro)/;
  
  return {
    link: function(scope, elm, attrs) {
      var faces  = elm[0].querySelectorAll('[face]')
        , labels = elm[0].getElementsByTagName('label')
        , r      = elm[0].offsetWidth / 2
        , charth = 1.5 * r; // max height of peaks: revisit

      scope.$watch(attrs.data, function(data) {
        var sum = 0;
        angular.forEach(data, function(d) { sum += d; });
        
        // iterate slices
        for (var i=0, face; (face = faces[2*i]); i++) {
          var bkFace   = faces[2*i + 1]
           //
           // split the peaks evenly around the graph
           //
            , slice    = 2 * PI / (faces.length/2)
            , npos     = i * slice - PI
           //
           // give the slice height based on data - assume data values are percentages
           // also, tone down the peaks in front (HACK)
           //
            , val      = (i >= 4 ? data[i] * 0.6 : data[i])
            , h        = val * charth / 100
           //
           // face angle - each face covers half the slice
           //
            , fang     = slice/2
           // 
           // we want the faces to meet at a point "h" pixels above the
           // midpoint of the slice's arc
           //
            , chord    = 2 * r * sin(fang/2)
           //
           // chord's angle with radius
           //  
            , chang    = (PI - fang) / 2
           //
           // altitude from radius to arc midpoint
           //
            , alt2mp   = chord * sin(chang)

            , slope    = atan(h / alt2mp)
            , slopeLen = sqrt(pow(h,2) + pow(alt2mp,2))
           //
           // the radial triangles are half squares so h = r
           //
            , scaleY   = slopeLen / r
            , skew     = atan(chord * cos(chang) / slopeLen)
            ;
          
          setTransform(face,
            'translateZ', 2,
            'rotateZ',    npos,
            'rotateX',    slope - Math.PI,
            'skewX',      skew,
            'scaleY',     scaleY
          );
          
          setTransform(bkFace,
            'translateZ', 2,
            'rotateZ',    npos + slice,
            'rotateX',    -slope,
            'skewX',      skew,
            'scaleY',     scaleY
          );

          var lbl = labels[i];
          lbl.textContent = Math.round(val);

          var rlbl   = r
            , nlbl   = -npos - slice/2
            , lblx   = rlbl * cos(nlbl)
            , lbly   = rlbl * sin(nlbl)
            , lblxat = lblx > 0 ? 'left'   : 'right'
            , lblyat = lbly > 0 ? 'bottom' : 'top';

          lbl.style[lblxat] = r + abs(lblx) + 'px';
          lbl.style[lblyat] = r + abs(lbly) + 15 + 'px';
          lbl.setAttribute('point', lblyat + lblxat); // e.g., [point=topleft]

          if (i < 5) {
            setTransform(lbl,
              'rotateX',    deg(-45)
            , 'translateY', -(h / sqrt(2))
            , 'translateZ', h / sqrt(2)
            );
          }
        }
        
      }, /* deep */ true);
    }
  };
  
  function rad(x) {
    return (Math.round(x * 1000) / 1000) + 'rad';
  }
  
  
  function setTransform(node) {
    var ns = node.style, trans = '';
    for (var i=1, l=arguments.length; i < l; i += 2) {
      var nm = arguments[i], val = arguments[i+1];
      trans += nm + '(' + (
          rSkRo.test(nm) ? rad(val)
        : nm.slice(0, 2) === 'tr' ? val + 'px'
        : val) + ') ';
    }
    ns.webkitTransform =
      ns.mozTransform =
      ns.msTransform =
      ns.transform = trans;
  }

  function deg(x) {
      return { valueOf: function() { return x * PI / 180; } };
  }
  
}]);





/* // D474designs | Modifications, and fixes by JOCV-III ///////
// All Rights Reserved /////// */
