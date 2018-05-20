
var canvas = document.getElementById('canvas');
var form = document.getElementById('formContainer');
var range = document.getElementById('range');
var output = document.getElementById('output');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight - form.clientHeight;
canvas.style.backgroundColor = '#232B2B';
var ctx = canvas.getContext('2d');
var raf;
var planetArray = [];
planetColorArray = ['rgba(77,11,3,1)',
                    'rgba(181,59,19,1)',
                    'rgba(249,122,34,1)',
                    'rgba(252,191,45,1)',
                    'rgba(117,70,39,1)',
                    'rgba(193,132,77,1)',
                    'rgba(185,203,213,1)',
                    'rgba(231,235,236,1)'
                ]

function inputChange(val){
    if(planetArray.length < val){
        createConstellation(val - planetArray.length);
    }
    else if(planetArray.length > val) {
        removePlanets( planetArray.length - val);
    }
    output.innerText = val;
}

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

function getRandomIntRange(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

function calcDistance(mouseX, mouseY, planetX, planetY){
    var deltaX = mouseX - planetX;
    var deltaY = mouseY - planetY;
    return Math.sqrt( deltaX * deltaX + deltaY * deltaY );
}

function setBorderOpacity(str){
    // takes a string as defined in planetColorArray and changes the opacity.
    var opacity = getRandomInt(10) / 10;
    return str.replace('1)', '' + opacity + ')');
}

function createConstellation(n){
    // fill planetArray with planets
    for(var i=0; i< n; i++){
        planetArray.push(new Planet);
    }
    // sort the array from small to large so the larger planets move in front of the smaller ones
    planetArray.sort(function (a, b) {
        return a.radius - b.radius;
    });
}

function removePlanets(n){
    var set = new Set;
    while (set.size < n ){
        set.add(getRandomInt(planetArray.length));
    }
    var removeArray = Array.from(set).sort(function (a, b) {
        return b - a;
    });
    removeArray.forEach(function(n){
        planetArray.splice(n, 1);
    })
}

function Planet () {
    if(98 <= getRandomInt(100) ){
        // Add a few big planets
        this.radius= getRandomIntRange(40, 85);
    }
    else{
        //Rest is smaller
        this.radius= getRandomInt(30);
    }
    this.x= getRandomInt(canvas.width),
    this.y= getRandomInt(canvas.height),
    this.vx= (this.radius / 15),
    this.vy= 0,
    this.color= planetColorArray[getRandomInt(planetColorArray.length)],
    this.borderColor= setBorderOpacity(planetColorArray[getRandomInt(planetColorArray.length)]),
    this.border= getRandomInt(this.radius),
    this.draw= function() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.lineWidth = this.border;
        ctx.strokeStyle = this.borderColor;
        ctx.stroke();
      }
};

(function() {

    createConstellation(range.value);
    var resizeId;
    window.addEventListener('resize', function(){
        clearTimeout(resizeId);
        resizeId = setTimeout(resizeCanvas, 100);
    });

    function resizeCanvas(){
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight - form.clientHeight;
    }

    canvas.addEventListener('mousemove', function(e) {
        var mouseX = e.clientX;
        var mouseY = e.clientY;
        planetArray.forEach(function(planet){
            planet.vy = planet.radius / calcDistance(mouseX, mouseY, planet.x, planet.y);
            if(mouseY < planet.y + planet.radius){
                planet.vy = -planet.vy;
            }
        })
    });

    function draw() {
      ctx.clearRect(0,0, canvas.width, canvas.height);
      planetArray.forEach(function(planet){
          planet.x += planet.vx;
          planet.y += planet.vy;
          if (planet.x - planet.radius + planet.vx > canvas.width){
              planet.x = 0 - planet.radius;
          }
          else if (planet.x + planet.radius + planet.vx < 0) {
              planet.x = canvas.width + planet.radius;
          }
        planet.draw();
       })
       raf = window.requestAnimationFrame(draw);
   }
    draw();
})();
