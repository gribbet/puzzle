import { observable } from "mobx";
import { observer } from "mobx-react";
import * as React from "react";
import { Component } from "react";
import { style } from "typestyle";
import { generate } from "../generate";
import { IPuzzle } from "../model";
import { Puzzle } from "./Puzzle";

@observer
export class App extends Component {
  @observable
  private puzzle?: IPuzzle;

  public async componentWillMount() {
    this.puzzle = await generate("https://i.redd.it/4st67jvypha21.jpg", 1000);
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
