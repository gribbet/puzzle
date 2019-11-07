import { observable } from "mobx";
import { observer } from "mobx-react";
import * as React from "react";
import { Component } from "react";
import { style } from "typestyle";
import { generate } from "../generate";
import { IPuzzle } from "../model";
import { Puzzle } from "./Puzzle";

// TODO: Perlin offset

const className = style({
  display: "flex",
  flex: 1
});

@observer
export class App extends Component {
  @observable
  private puzzle?: IPuzzle;

  public async componentDidMount() {
    this.puzzle = await generate("https://i.imgur.com/VrA2kh1.jpg", 100);
  }

  public render() {
    const { puzzle } = this;
    return (
      <div className={className}>{puzzle && <Puzzle puzzle={puzzle} />}</div>
    );
  }
}
