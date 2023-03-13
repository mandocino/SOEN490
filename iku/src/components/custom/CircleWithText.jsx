import React from "react";

export default function CircleWithText(props) {
  let textGradient;
  let gradient;
  let bgColor;
  let shadowClass;

  if (props.gradient != null) {
    textGradient = props.gradient + " text-transparent bg-clip-text ";
  } else {
    gradient = " bg-gradient-to-br from-white/30 to-transparent ";
    textGradient = gradient + " text-transparent bg-clip-text ";
  }

  if (props.bgColor == null) {
    bgColor = "bg-transparent";
  } else {
    bgColor = props.bgColor;
  }

  if (props.shadowClass == null) {
    shadowClass = " drop-shadow-[2px_2px_2px_rgba(0,0,0,0.20)] ";
  } else {
    shadowClass = props.shadowClass;
  }
  
  return (
    <>
      <div className={props.className + shadowClass}>
        <div className={props.size + " absolute rounded-full " + (props.gradient || gradient)} style={{backgroundColor: props.borderColor, mask: `radial-gradient(circle at 50% 50%, transparent 60%, black 62.5%)`}}/>
        <div className={props.size + " rounded-full flex items-center justify-center p-1 "}>
          <div className={"w-full h-full rounded-full flex items-center justify-center " + bgColor}>
            <div className={"p-4 text-center gap-2 " + (textGradient)} style={{backgroundColor: props.textColor}}>
              <span className={props.textClass}>
                {props.children}
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
