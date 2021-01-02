const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
const fontSize = 32;
const MAX_AMPLITUDE = 32;
const MAX_FONT_ZOOM = 1.5;
const MIN_FONT_ZOOM = 0.9;

const emojis = [];

const textProperties = {
  // font: `${fontSize}px monospace`,
  // fillStyle: '#ff9840',
  textAlign: 'center',
  textBaseline: 'middle'
}

canvas.width = canvas.getBoundingClientRect().width;
canvas.height = canvas.getBoundingClientRect().height;

window.addEventListener('resize', () => {
  canvas.width = canvas.getBoundingClientRect().width;
  canvas.height = canvas.getBoundingClientRect().height;
})

let intPosition = {
  x: (canvas.getBoundingClientRect().width - fontSize) / 2,
  y: canvas.getBoundingClientRect().height
}
let amplitude = 0;
let grades = 0;
let direction = 1;
let diff = 0;

let nextFontSize = fontSize;
let fontZoomDirection = 1; // values: 1 or -1
let zoom = 1; // between MIN_FONT_ZOOM and MAX_FONT_ZOOM


const interpolation = (x1, x2, y1, y2, x) => {
  if(x < x1 || x > x2) throw Error('X value is out of range')

  const rangeX = x2 - x1;
  const percentX = x / rangeX;

  const rangeY = y2 - y1;

  return rangeY * percentX;
}

const update = () => {

  ctx.clearRect(0,0, canvas.width, canvas.height)
  requestAnimationFrame(update);

  for(let option in textProperties) {
    ctx[option] = textProperties[option]
  }

  emojis.forEach(emoji => {
    emoji.zoom += emoji.fontZoomDirection * 0.01;

    if(emoji.zoom > MAX_FONT_ZOOM || emoji.zoom < MIN_FONT_ZOOM) {
      emoji.fontZoomDirection *= -1; 
    }

    emoji.nextFontSize = fontSize * emoji.zoom;
    ctx['font'] = `${emoji.nextFontSize}px monospace`;



    emoji.grades += 0.08;

    emoji.diff += emoji.diffDirection * emoji.diffInc

    emoji.posY -= emoji.incY;

    if(emoji.posY < 0) return;
    // disappear effect
    emoji.opacity = interpolation(0, intPosition.y, 0, 1, emoji.posY);
    ctx['fillStyle'] = `rgba(255, 255, 255, ${emoji.opacity})`;

    ctx.fillText(emoji.value, intPosition.x +  Math.cos(emoji.grades) * MAX_AMPLITUDE + emoji.diff, emoji.posY)
  })

}

update()

let nextDiffIndex = 0;
let nextDiffDirection = 1;
const diffIncs = [-3,-2, -1.2, -1, -0.9, -0.8, -0.5, -0.3, 0.3, 0.5, 0.8, 0.9, 1, 1.2, 2, 3]

const setNextDiffIndex = () => {
  nextDiffIndex += nextDiffDirection;

  if(nextDiffIndex === diffIncs.length) {
    nextDiffIndex = diffIncs.length -2;
    nextDiffDirection *= -1;
  }

  if(nextDiffIndex < 0) {
    nextDiffIndex = 1;
    nextDiffDirection *= -1;
  }

  console.log(nextDiffIndex)
}

document.getElementById('addEmoji').addEventListener('click', () => {
  const emoji = document.getElementById('emoji').value;

  if(emoji){
    const newEmoji = {
      value: emoji,
      zoom: 1,
      fontZoomDirection: 1,
      nextFontSize: fontSize,
      direction: 1,
      amplitude: 0,
      grades: 0,
      diff: 0, // to simulate moving an emoji in angle
      diffDirection: Math.round(2*Math.random() - 1),
      diffInc: diffIncs[nextDiffIndex],

      posY: intPosition.y,
      incY: 1.2,

      opacity: 1
    };

    emojis.push(newEmoji)

    setNextDiffIndex();
  } 
})