import { style } from "typestyle";
import * as React from "react";
import { Component } from "react";
import { Puzzle } from "./Puzzle";
import { IPuzzle } from "./model";
import { observable } from "mobx";
import { observer } from "mobx-react";
import { generate } from "./generate";

@observer
export class App extends Component {
  @observable
  private puzzle?: IPuzzle;

  public async componentWillMount() {
    this.puzzle = await generate("https://i.redd.it/4st67jvypha21.jpg", 100);
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
