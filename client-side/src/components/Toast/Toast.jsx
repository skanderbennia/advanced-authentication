import React from "react";
import "./Toast.scss";
function Toast({ reference }) {
  return (
    <div className="toast" ref={reference}>
      <h4>Authentication completed ! </h4>
      <span>you have logged in as Mohamed Skander Bennia</span>
    </div>
  );
}

export default Toast;
