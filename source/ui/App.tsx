import { observable } from "mobx";
import { observer } from "mobx-react";
import * as React from "react";
import { Component } from "react";
import { style } from "typestyle";
import { generate } from "../generate";
import { IPuzzle } from "../model";
import { Puzzle } from "./Puzzle";

// TODO: Perlin offset
// TODO: Firefox dragging

@observer
export class App extends Component {
  @observable
  private puzzle?: IPuzzle;

  public async componentWillMount() {
    this.puzzle = await generate("https://i.redd.it/zzz4o8zgf9d21.jpg", 20);
  }

  public render() {
    const { puzzle } = this;
    return (
      <div
        className={style({
          display: "flex",
          flex: 1
        })}
      >
        {puzzle && <Puzzle puzzle={puzzle} />}
      </div>
    );
  }
}