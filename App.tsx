import { style } from "typestyle";
import * as React from "react";
import { Component } from "react";
import { Puzzle } from "./Puzzle";

const app = style({
  display: "flex",
  flex: 1
});

export class App extends Component {
  public render() {
    return (
      <div className={app}>
        <Puzzle />
      </div>
    );
  }
}
