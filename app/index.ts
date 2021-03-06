import * as React from "react";
import * as ReactDOM from "react-dom";
import { cssRule } from "typestyle";
import { App } from "./ui/App";

cssRule("html", {
  display: "flex",
  height: "100%"
});
cssRule("body", {
  display: "flex",
  flex: 1,
  margin: 0
});
cssRule("#app", {
  display: "flex",
  flex: 1
});

ReactDOM.render(React.createElement(App), document.getElementById("app"));
