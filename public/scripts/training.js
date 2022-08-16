const training1 = document.getElementById("training1");
const cue1 = document.getElementById("cue1");
const guidance = document.getElementById("guidance");


const beginButton = document.getElementById("beginButton");

let times = [
  [30000, guidance],
  [105000, guidance],
  [180000, guidance],
  [255000, guidance],
  // --- stop guidance now --- //
  [345000],
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
];

function guide(ls, vol) {
  console.log("starting");
  for (let i = 0; i < ls.length; i++) {
    setTimeout(() => {
      if (ls[i].length > 1) {
        cue1.volume = vol
        cue1.play();
        cue1.addEventListener("ended", () => {
          setTimeout(() => {
            ls[i][1].play();
          }, 700);
        });
      } else {
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