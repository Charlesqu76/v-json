import { G } from "@svgdotjs/svg.js";
import NormalRect from "./NormalReact";
import Graph from "..";

interface IProps {
  x: number;
  y: number;
  width: number;
  height: number;
  style?: Record<string, string | number>;
}

export type TGroupRect = GroupRect;

export default class GroupRect {
  group: G;
  container: NormalRect;
  constructor({ x, y, width, height, style = {} }: IProps, graph: Graph) {
    if (!graph.canvas) throw new Error("Canvas is not initialized");
    this.group = graph.canvas.group();
    this.group?.draggable();
    this.container = new NormalRect(
      {
        x: x,
        y: y,
        width: width,
        height: height,
      },
      graph
    );

    this.container.rect.attr({
      stroke: "black",
      "stroke-width": 1,
      rx: 5,
      ry: 5,
      ...style,
    });

    this.group.add(this.container.rect);
  }
  add(SVGElement: any) {
    if (!SVGElement) return;
    this.group?.add(SVGElement);
  }
  move(x: number, y: number) {
    this.group?.move(x, y);
  }

  setWidth(width: number) {
    this.container.setWidth(width);
  }
  setHeight(height: number) {
    this.container.setHeight(height);
  }

  delete() {
    this.group.remove();
    this.container.remove();
  }

  front() {
    this.group.front();
    this.container.front();
  }

  highlight() {
    this.container.highlight();
  }

  unHighlight() {
    this.container.unHighlight();
  }
}
