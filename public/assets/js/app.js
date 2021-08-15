const currentDate = new Date();
const hrs = currentDate.getHours();

let greet;
if (hrs < 12) greet = 'Goedemorgen';
else if (hrs >= 12 && hrs <= 17) greet = 'Goedemiddag';
else if (hrs >= 17 && hrs <= 24) greet = 'Goedenavond';

if (document.getElementById('daypart') !== null) {
  document.getElementById('daypart').innerHTML = greet;
}

const ssmlSwitch = document.getElementById('useSSML');
const voiceMessage = document.getElementById('voiceMessage');

ssmlSwitch.addEventListener('change', () => {
  const messageString = voiceMessage.value;

  if (ssmlSwitch.checked) {
    if (messageString.includes('<speak>') && messageString.includes('</speak>'))
      return;

    voiceMessage.value = `<speak>${messageString}</speak>`;
  } else if (!ssmlSwitch.checked) {
    const removeSpeakTag = ['<speak>', '</speak>'];

    const expStr = removeSpeakTag.join('|');
    voiceMessage.value = messageString.replace(new RegExp(expStr, 'gi'), '');
  }
});

function goBack() {
  window.history.back();
}
