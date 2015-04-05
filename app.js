var WebSocket = require('faye-websocket'),
    ws        = new WebSocket.Client('wss://wss.redditmedia.com/thebutton?h=739be6ff3871b5be07babfc4236b279fd4e2c02f&e=1428267932');

ws.on('open', function(event) {
  console.log('opened connection to reddit the button ws serve');
});
 
ws.on('message', function(event) {
  var data = JSON.parse(event.data);

  if(data.type === 'ticking'){
    handleTick(data.payload)
  }
});
 
ws.on('close', function(event) {
  console.log('close', event.code, event.reason);
  ws = null;
});

function write (msg){
  process.stdout.write(msg);
};

var numPressedTotal = 0;
var interval;
var lastPress = new Date();
var lastSecsLeft = 0;

function handleTick (payload) {
  var newSecsLeft = payload.seconds_left,
      numPressedNew = parseInt(payload.participants_text.replace(',', ''));


  if(numPressedNew > numPressedTotal){
    onPress(newSecsLeft);

    numPressedTotal = numPressedNew;
  }
};

function onPress (newSecsLeft){
  var pressedDate = new Date(),
      diff = (lastPress - pressedDate)/1000;

  lastPress = pressedDate;
  resetCountdown();

  write((lastSecsLeft+diff).toFixed(2) + '\n');

  lastSecsLeft = newSecsLeft;
};

function startCountdown (){
  interval = setInterval(function processLoop () {
    write('.');
  }, 200);
}

function resetCountdown (){
  clearInterval(interval);
  startCountdown();
}