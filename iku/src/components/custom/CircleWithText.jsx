import React from "react";

export default function CircleWithText(props) {
  let textGradient;
  let gradient;
  let bgColor;

  if (props.gradient != null) {
    textGradient = props.gradient + " text-transparent bg-clip-text";
  } else {
    gradient = "bg-gradient-to-br from-white/75 to-transparent";
    textGradient = gradient + " text-transparent bg-clip-text";
  }

  if (props.bgColor == null) {
    bgColor = "bg-emerald-500";
  } else {
    bgColor = props.bgColor;
  }
  
  return (
    <>
      <div class={props.class}>
        <div class={props.size + " rounded-full flex items-center justify-center p-1 " + (props.gradient || gradient)} style={{backgroundColor: props.borderColor}}>
          <div class={"w-full h-full rounded-full flex items-center justify-center " + bgColor}>
            <div class={"p-4 text-center gap-2 " + (textGradient)} style={{backgroundColor: props.textColor}}>
              <span class={props.textClass}>
                {props.children}
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
