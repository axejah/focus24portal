const currentDate = new Date();
const hrs = currentDate.getHours();

let greet;
if (hrs < 12) greet = 'Goedemorgen';
else if (hrs >= 12 && hrs <= 17) greet = 'Goedemiddag';
else if (hrs >= 17 && hrs <= 24) greet = 'Goedenavond';

if (document.getElementById('daypart') !== null) {
  document.getElementById('daypart').innerHTML = greet;
}
