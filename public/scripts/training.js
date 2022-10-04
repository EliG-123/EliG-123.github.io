let wakeLock = null

const requestWakeLock = async () => {
  try {
    wakeLock = await navigator.wakeLock.request()
    wakeLock.addEventListener('release', () => {
      console.log('Wake Lock was released');
    });
    console.log('Wake Lock is active');  
  } catch (e) {
    console.log(e)
  }
}

const releaseWakeLock = async () => {
  if (!wakeLock) {
    return;
  }
  try {
    await wakeLock.release()
    wakeLock = null;
  } catch (e) {
    console.log (e)
  }
}

requestWakeLock();

const training1 = document.getElementById("training1");
const cue1 = document.getElementById("cue1");
const guidance = document.getElementById("guidance");
const stopGuidance = document.getElementById("stopGuidance")


const beginButton = document.getElementById("beginButton");
const doneForm = document.getElementById('done-form')

let times = [
  [30000, guidance, 0], // this has an extra to make it faster. delete 0 when done
  [105000, guidance],
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
    setTimeout(() => {
      if (ls[i].length == 2) {
        cue1.volume = vol
        cue1.play();
        cue1.addEventListener("ended", () => {
          setTimeout(() => {
            ls[i][1].play();
          }, 700);
        });
      } else if (ls[i].length == 3) {
        cue1.volume = vol;
        cue1.play();
        cue1.addEventListener('ended', () => {
          releaseWakeLock()
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
    guide(times, voluu);
  });
}