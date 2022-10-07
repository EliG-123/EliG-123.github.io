let wakeLock = null

const requestWakeLock = async () => {
  try {
    wakeLock = await navigator.wakeLock.request()
    console.log('Wake Lock is active');  
  } catch (e) {
    console.log(e)
  }
}

requestWakeLock();

const soundcheck1 = document.getElementById("soundcheck1");
const soundcheck2 = document.getElementById("soundcheck2");

console.log(soundcheck1);


const cue1 = document.getElementById("cue1"); // three beeps
const cue2 = document.getElementById("cue2"); // harp sound

const discrim1 = document.getElementById("discrim1");
const discrim2 = document.getElementById("discrim2");
const discrim3 = document.getElementById("discrim3");
const discrim4 = document.getElementById("discrim4");

let over = false;
let heard = false;
let threeBeepClicked = false;
let harpSoundClicked = false;

const thBeep = document.getElementById("threeBeeps");
const hSound = document.getElementById("harpSound");
const cantHear = document.getElementById("cantHear")



let tracker = 0;


soundObj = {
  0: soundcheck1,
  1: soundcheck2,
  2: discrim1,
  3: discrim3,
  4: discrim4,
};

cueObj = {
  0: cue1,
  1: cue2,
  2: [cue1, discrim2],
  3: [cue2, discrim2],
  4: null,
};

remObj = {
  0: true,
  1: false,
  2: true,
  3: false,
  4: null,
};

funcObj = {
  0: volTest,
  1: volTest,
  2: whichButtonFunc,
  3: whichButtonFunc,
  4: startTrainingButtonFunc,
};

volObj = [];
let avVol = 0;

function heardIt() {
  heard = true;
  return heard;
}

function avrg(ls) {
  let tot = 0;
  console.log(ls);
  for (let i = 0; i < ls.length; i++) {
    tot += ls[i];
  }
  return tot / ls.length;
}

function playIt(audioPart, rem, endFunc, ...args) {
  console.log("playIt " + tracker);
  if (rem) {
    try {
      let elem = document.getElementById("begin");
      elem.parentNode.removeChild(elem); //remove begin button
    } catch {
      try {
        let elem = document.getElementById("heardButton");
        elem.parentNode.removeChild(elem); //remove heard button
      } catch {}
    }
  }
  audioPart.volume = 1;
  audioPart.play(); //play the sound
  audioPart.addEventListener("ended", () => {
    endFunc(args);
  });
}

function whichButtonFunc() {
  console.log("whichButtonFunc " + tracker);
  setTimeout(() => {
    cueObj[tracker][0].volume = volObj[tracker - 2];
    cueObj[tracker][0].play();
    cueObj[tracker][0].addEventListener("ended", () => {
      setTimeout(() => {
        cueObj[tracker][1].play();
        cueObj[tracker][1].addEventListener("ended", () => {
          thBeep.innerHTML =
            '<button class="button-g" role="button" onclick="threeBeepFunc()">Three Beeps</button>';
          hSound.innerHTML =
            '<button class="button-p" role="button" onclick="harpSoundFunc()">Violin Sound</button>';
          cantHear.innerHTML = 
            "<button class='button-b' role='button' onclick='cantHearFunc()'>Couldn't Hear</button>";
          thBeep.style.visibility = "visible";
          hSound.style.visibility = "visible";
          cantHear.style.visibility= "visible";
        });
      }, 500);
    });
  }, 1000);

  console.log(volObj);
}

function cantHearFunc() {
  console.log("couldn't hear" + tracker);
  volObj[tracker - 2] += 0.00005;

  thBeep.style.visibility = "hidden";
  hSound.style.visibility = "hidden";
  cantHear.style.visibility= "hidden";
  // maybe add in here an audio saying this was wrong, we will try again at a higher volume...
  whichButtonFunc();
}


function threeBeepFunc() {
  if (tracker == 2) {
    // right if tracker is 2, wrong if 3
    tracker += 1;

    thBeep.style.visibility = "hidden";
    hSound.style.visibility = "hidden";
    cantHear.style.visibility= "hidden";

    playIt(
      soundObj[tracker],
      remObj[tracker],
      funcObj[tracker],
      cueObj[tracker]
    );
  } else if (tracker == 3) {
    console.log("this was wrong " + tracker);
    volObj[tracker - 2] += 0.00005;

    thBeep.style.visibility = "hidden";
    hSound.style.visibility = "hidden";
    cantHear.style.visibility= "hidden";
    // maybe add in here an audio saying this was wrong, we will try again at a higher volume...
    whichButtonFunc();
  }
}

function harpSoundFunc() {
  if (tracker == 3) {
    // right if tracker is 3, wrong if 2
    tracker += 1;

    thBeep.style.visibility = "hidden";
    hSound.style.visibility = "hidden";
    cantHear.style.visibility= "hidden";

    playIt(
      soundObj[tracker],
      remObj[tracker],
      funcObj[tracker],
      cueObj[tracker]
    );
  } else if (tracker == 2) {
    console.log("this was wrong " + tracker);
    volObj[tracker - 2] += 0.00005;

    thBeep.style.visibility = "hidden";
    hSound.style.visibility = "hidden";
    cantHear.style.visibility= "hidden";

    whichButtonFunc();
  }
}

function volTest(cuePart) {
  console.log("volTest " + tracker);
  document.getElementById("heardButton").innerHTML =
    '<button class="button-p" role="button" onclick="heardIt()">Heard It</button>';
  document.getElementById("heardButton").style.visibility = "visible";

  let vol = 0.0001;
  cuePart[0].volume = vol;
  cuePart[0].play();
  let i = 0

  let cueCheck = setInterval(() => {
    i += 1
    // play the cues at increasing volume, every **15s
    if (!heard & i % 30 == 0) {
      vol += 0.00005;
      console.log(vol)
      cuePart[0].volume = vol;
      cuePart[0].play();
      
    } else if (!heard & i % 30 != 0) {
        
    } if (heard) {
      console.log(vol);
      document.getElementById("heardButton").style.visibility = "hidden";
      clearInterval(cueCheck);
      console.log('cleared')
      heard = false;
      volObj.push(vol);
      tracker += 1;
      playIt(
        soundObj[tracker],
        remObj[tracker],
        funcObj[tracker],
        cueObj[tracker]
      );
    }
  }, 500);
}

// const releaseWakeLock = async () => {
//   if (!wakeLock) {
//     return 0
//   }
//   try {
//     await wakeLock.release()
//     wakeLock = null;
//   } catch (e) {
//     console.log(e)
//   }
// }
function startTrainingButtonFunc() {
  thBeep.parentNode.removeChild(thBeep);
  hSound.parentNode.removeChild(hSound);

  document.getElementById('volObjFrm').value = volObj

  document.getElementById("startTrainingButton").innerHTML =
    '<button type="submit" class="button-g">Start Training</button>';

  // releaseWakeLock()
}



