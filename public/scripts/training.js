let wakeLock = null

const AudioContext = window.AudioContext || window.webkitAudioContext;

const audioContext = new AudioContext();

const requestWakeLock = async () => {
  try {
    wakeLock = await navigator.wakeLock.request()
    // wakeLock.addEventListener('release', () => {
    //   console.log('Wake Lock was released');
    // });
    console.log('Wake Lock is active');  
  } catch (e) {
    console.log(e)
  }
}

// const releaseWakeLock = async () => {
//   if (!wakeLock) {
//     return;
//   }
//   try {
//     await wakeLock.release()
//     wakeLock = null;
//   } catch (e) {
//     console.log (e)
//   }
// }

requestWakeLock();

const training1 = document.getElementById("training1");
const training2 = document.getElementById('training2')
const cue1a = document.getElementById("cue1");
const cue1 = audioContext.createMediaElementSource(cue1a)
let gainNode = audioContext.createGainNode();
cue1.connect(gainNode).connect(audioContext.destination);
const guidance = document.getElementById("guidance");
const stopGuidance = document.getElementById("stopGuidance")


const beginButton = document.getElementById("beginButton");
const doneForm = document.getElementById('done-form')

let times = [
  [30000, guidance], // this has an extra to make it faster. delete 0 when done (nevermind)
  [105000, guidance], // its quicker because the guidance takes longer, have to add that into the time difference.
  [180000, guidance],
  [255000, guidance],
  // --- stop guidance now --- //
  [345000, stopGuidance],
  [395000],
  [450000],
  [515000],
  [585000],
  [655000],
  [720000],
  [780000],
  [855000],
  [930000],
  [1020000],
  [1140000],
  [21855000, 0, 0] // this is the actual sleep cue
];

function guide(ls, vol) {
  console.log("starting");
  for (let i = 0; i < ls.length; i++) {
    console.log(i)
    setTimeout(() => {
      console.log('timeout', i)
      if (ls[i].length == 2) {
        gainNode.gain.value = vol
        cue1.play();
        cue1.addEventListener("ended", () => {
          setTimeout(() => {
            console.log(i, ls[i])
            console.log(i, ls[i][1])
            try {
              ls[i][1].volume = 0.5;
              ls[i][1].play();
              } catch {}
            ls[i].shift()

          }, 700);
        });
      } else if (ls[i].length == 3) {
        cue1.volume = vol;
        cue1.play();
        cue1.addEventListener('ended', () => {
          //releaseWakeLock() // releasing toooo early????
          doneForm.submit()
        })
      } else {
        cue1.volume = vol
        cue1.play();
      }
    }, ls[i][0]);
  }
}

function playIntro(voluu) {
  beginButton.parentNode.removeChild(beginButton);
  training1.play();
  training1.addEventListener("ended", () => {
    training2.play();
    training2.addEventListener("ended", () => {
      guide(times, voluu);
     })
  });
}