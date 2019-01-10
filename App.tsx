import { style } from "typestyle";
import * as React from "react";
import { Component } from "react";

const app = style({
  display: "flex",
  flex: 1
});

export class App extends Component {
  public render() {
    return <div className={app}>Test</div>;
  }
}
