import React from "react";
import { ReactComponent as IkuLogo } from "./../../assets/iku_logo.svg";

export default function Logo(props) {
  return (
    <IkuLogo className={props.className}/>
  );
}