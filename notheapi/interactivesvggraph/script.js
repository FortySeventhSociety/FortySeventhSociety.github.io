var xmlns = "http://www.w3.org/2000/svg",
  xlinkns = "http://www.w3.org/1999/xlink",
  select = function(s) {
    return document.querySelector(s);
  },
  selectAll = function(s) {
    return document.querySelectorAll(ds);
  },
  mainSVG = select('.mainSVG'),
  box = select('.box'),
  connector = select('#connector'),
  connectorGroup = select('#connectorGroup'),
  dragger = select('#dragger'),
  graphDot = select('#graphDot'),
  boxLabel = select('#boxLabel'),
  nullDot = select('#nullDot'),
  graphLine = select('#graphLine'),
  graphBezier = MorphSVGPlugin.pathDataToBezier(graphLine.getAttribute('d')),
  perc,
  boxPos = {
    x: 0,
    y: 0
  },
  //pt = mainSVG.createSVGPoint(),
  isPressed = false

TweenMax.set('svg', {
  visibility: 'visible'
})

TweenMax.set([dragger, graphDot, nullDot], {
  transformOrigin: '50% 50%'

})
TweenMax.set([box], {
  transformOrigin: '50% 100%'

})

var tl = new TimelineMax({
  onUpdate: updateGraph,
  paused: true
});
tl.to([graphDot, dragger], 5, {
  bezier: {
    type: "cubic",
    values: graphBezier,
    autoRotate: false
  },
  ease: Linear.easeNone
})

function updateTimeline() {

  perc = nullDot._gsTransform.x / 770;
  //console.log(perc)

  //tl.progress(perc)  ;
  TweenMax.to(tl, 0.5, {
    progress: perc
  })

}

function updateGraph() {

  boxPos.x = dragger._gsTransform.x - (box.getBBox().width / 2);
  boxPos.y = dragger._gsTransform.y - (box.getBBox().height * 3);
  TweenMax.to(box, 1, {
    x: boxPos.x,
    y: boxPos.y,
    ease: Elastic.easeOut.config(0.7, 0.7)
  })

  boxLabel.textContent = parseInt(600 - dragger._gsTransform.y) - 118 //.toFixed(2);
}

function graphPress() {
  isPressed = true;

  TweenMax.to(dragger, 1, {
    attr: {
      r: 30
    },
    ease: Elastic.easeOut.config(1, 0.7)
  })

  TweenMax.to(connector, 0.6, {
    attr: {
      x1: dragger._gsTransform.x,
      x2: dragger._gsTransform.x,
      y1: boxPos.y,
      y2: dragger._gsTransform.y
    }
  })
  TweenMax.to(connector, 0.1, {
    attr: {
      x1: box._gsTransform.x + 40,
      x2: boxPos.x + 40,
      y1: box._gsTransform.y + 20,
      y2: graphDot._gsTransform.y
    },
    onComplete: function() {
      //TweenMax.ticker.addEventListener('tick', connectLine);
      TweenMax.to(box, 0.8, {
        scale: 1,
        alpha: 1,
        y: boxPos.y,
        ease: Elastic.easeOut.config(1.2, 0.7)
      })
    }
  })

}

function graphRelease() {

  isPressed = false;

  TweenMax.to(dragger, 0.3, {
    attr: {
      r: 15
    },
    ease: Elastic.easeOut.config(0.7, 0.7)
  })
  TweenMax.to(box, 0.2, {
    scale: 0,
    alpha: 0,
    y: boxPos.y + 30,
    ease: Anticipate.easeOut
  })

  //TweenMax.ticker.removeEventListener("tick", connectLine);

}

updateTimeline();
tl.progress(0.000001);
//updateGraph();
//graphRelease();

var introTl = new TimelineMax({
  onComplete: init,
  delay: 1
});
introTl.staggerFrom('#horizontalLinesGroup line', 1, {
    drawSVG: '100% 100%',
    alpha: 1,
    //scaleX:-1,
    transformOrigin: '0% 100%'
  }, 0.1)
  .staggerFrom('#graphTextGroup text', 1, {

    alpha: 0
  }, 0.1, '-=0.5')

.from([graphDot, dragger], 0.71, {
    attr: {
      r: 0
    },
    ease: Power1.easeOut
  }, '-=1.3')
  .from(graphLine, 2.3, {
    drawSVG: '0% 0%',
    ease: Power3.easeInOut
  }, '-=1.73')

/* // Get point in global SVG space
function cursorPoint(e) {
  pt.x = e.clientX;
  pt.y = e.clientY;
  return pt.matrixTransform(mainSVG.getScreenCTM().inverse());
}
 */
function connectLine() {

  if (isPressed) {
    TweenMax.set(connector, {
      attr: {
        x1: box._gsTransform.x + 40,
        x2: boxPos.x + 40,
        y1: box._gsTransform.y + 43,
        y2: graphDot._gsTransform.y
      }
    })
  } else {

    TweenMax.to(connector, 0.1, {
      attr: {
        x1: graphDot._gsTransform.x,
        x2: graphDot._gsTransform.x,
        y1: graphDot._gsTransform.y,
        y2: graphDot._gsTransform.y
      }
    })
  }
}

function init() {

  Draggable.create(nullDot, {
    type: 'x',
    trigger: dragger,
    onPress: graphPress,
    bounds: {
      minX: 0,
      maxX: 770
    },
    zIndexBoost:false,
    onDrag: updateTimeline,
    onRelease: graphRelease,
    
    //throwProps:true,
    onThrowUpdate: updateTimeline
      //snap:[0,200, 400, 700, 770]
  })
  TweenMax.ticker.addEventListener('tick', connectLine);
  graphRelease();
}

/* var isDevice = (/android|webos|iphone|ipad|ipod|blackberry/i.test(navigator.userAgent.toLowerCase()));
if (isDevice) {
  //select('#uiGroup').setAttribute('filter', '')
} */
/* TweenMax.globalTimeScale(0.5) */