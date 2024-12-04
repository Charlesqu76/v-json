import { Svg } from "@svgdotjs/svg.js";
import KeyValueBox from "./KeyValueBox";
import { Graph } from "./graph";
import ChildrenBox from "./ChildrenBox";

const lineHeight = 30;

interface Props {
  x: number;
  y: number;
  value: Object;
}

export default class ObjectBox extends ChildrenBox<KeyValueBox> {
  isArray = false;
  constructor(draw: Svg, { x, y, value }: Props, graph: Graph) {
    super(
      draw,
      { x, y, width: 0, height: 0, config: { ActiveStrokeColor: "red" } },
      graph
    );
    this.rect.fill("red");
    if (Array.isArray(value)) {
      this.isArray = true;
    }
    this.rect.on("mouseover", () => {
      this.rect.attr({
        cursor: "grab",
        "stroke-width": 5,
        stroke: "red",
      });
    });
    graph.addChildBox(this);
    const entries = Object.entries(value);
    let previous = null as KeyValueBox | null;
    const children = entries.map(([key, value], index) => {
      const box = new KeyValueBox(
        draw,
        {
          x: x,
          y: (previous?.boundary.y ?? y) + (previous?.boundary.height ?? 0),
          key: key,
          value: value,
        },
        graph
      );
      previous = box;
      return box;
    });

    this.addChildren(children);

    this.graph.layout();
  }

  get value() {
    if (this.isArray) {
      const m = [] as any;
      this.children.forEach((child) => {
        m.push(Object.values(child.value)[0]);
      });
      return m;
    }
    const m = {};
    this.children.forEach((child) => {
      Object.assign(m, child.value);
    });
    return m;
  }
}
