import React from "react";

export default function BoxConicGradientDisplay({values, colors, names, icons, max=100, twoCols=false}) {
  const numValues = values.length;

  let gradientLines = `${colors[0]} 90deg, `;
  for (let i=0; i<numValues-1; i++) {
    const base = values.slice(0, i+1).reduce((x,y)=>{return x+y});
    gradientLines += `${colors[i]} ${90 + 1.8 * (base - values[i]/2)}deg, `;
    gradientLines += `${colors[i+1]} ${90 + 1.8 * (base + values[i+1]/2)}deg, `;
  }
  gradientLines += `${colors[numValues-1]} 270deg`;
  const boxConicGradient = `conic-gradient(from 180deg at 50% 100%, ${gradientLines})`;

  const gridCols = twoCols ? 'grid-cols-2' : 'grid-cols-1';
  const textSize = twoCols ? 'text-xl' : 'text-xl';

  // ALTERNATIVE BOX CONIC
  // NOTE: If using this update to dynamically match values
  // boxConicGradient2 has the center of the gradient below the bottom of the box, giving a quasi-linear appearance.
  // const boxConicGradient2 = `conic-gradient(
  //   from 180deg at 50% 200%,
  //   ${frequencyColor.hex} 140deg,
  //   ${durationColor.hex} ${140 + 0.8 * (frequency)}deg,
  //   ${durationColor.hex} ${140 + 0.8 * (frequency + duration)}deg,
  //   ${walkTimeColor.hex} 220deg
  //   )`;


  let lines = [];
  for (let i=0; i<numValues; i++) {
    lines.push(
      <div className={`font-semibold ${textSize} rounded-2xl px-4 py-2 flex gap-2 justify-start items-center`} key={i}>
        {icons[i]}
        <span>{names[i]}: {values[i]}%</span>
      </div>
    )
  }

  return (
    <>
      <div className={` text-white w-full rounded-3xl p-4 grid ${gridCols}`}
           style={{background: boxConicGradient}}>
        {lines}
      </div>
    </>
  )
}
