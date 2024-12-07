import { Svg } from "@svgdotjs/svg.js";
import ObjectBox from "./ObjectBox";
import TextBox from "./TextBox";
import ObjectSign from "./ObjectSign";
import { Box } from "./box";
import Graph from "./graph";
import DraggableRect from "./DraggableRect";

interface Props {
  x: number;
  y: number;
  key: string;
  value: string | Object;
}

export default class KeyValueBox extends DraggableRect implements Box {
  protected keyBox: TextBox;
  protected valueBox: ObjectSign;
  protected origin: { x: number; y: number } | null = null;
  constructor(protected draw: Svg, { x, y, key, value }: Props, graph: Graph) {
    super(draw, { x, y, width: 0, height: 0 }, graph);
    this.rect.fill("white");
    this.graph.addKeyValueBox(this);
    // keyBox
    this.keyBox = new TextBox(draw, { text: key, x, y }, graph);
    // this.keyBox.text.text.fill('#A31515');
    const { width } = this.keyBox.boundary;
    // valyeBox
    this.valueBox = new ObjectSign(
      draw,
      {
        x: x + width,
        y: y,
        value: value,
        parent: this,
      },
      graph
    );
    this.setHeight();
    this.setWidth();
    this.initEvnet();
  }

  get value() {
    return {
      [this.keyBox.value]: this.valueBox.value,
    };
  }

  get child() {
    if (this.valueBox instanceof ObjectSign) {
      return this.valueBox.child;
    }
    return null;
  }

  get showChild() {
    if (this.valueBox instanceof ObjectSign) {
      return this.valueBox.showChild;
    }
    return false;
  }

  initEvnet = () => {
    this.rect.on("mouseover", () => {
      this.front();
      this.rect.attr({ "stroke-width": 3, stroke: "red" });
    });

    this.rect.on("mouseout", () => {
      this.rect.attr({ "stroke-width": 1, stroke: "black" });
    });

    this.rect.on("dragmove", (event) => {
      const { box } = (event as CustomEvent).detail;
      if (!this.origin) {
        this.origin = this.boundary;
      }
      this.move(box.x, box.y);
      if (this instanceof ObjectBox) return;
      this.graph.objectBoxes.forEach((child) => {
        if (this.isOverlapping(box, child.rect.bbox())) {
          child.rect.attr({ "stroke-width": 3, stroke: "red" });
        } else {
          child.rect.attr({ "stroke-width": 1, stroke: "black" });
        }
      });
    });

    this.rect.on("dragend", (event) => {
      const box = this.rect.bbox();
      for (const objectBox of this.graph.objectBoxes) {
        const overlap = this.isOverlapping(box, objectBox.rect.bbox());
        if (overlap) {
          if (this.parent !== objectBox) {
            // @ts-ignore
            this.parent?.removeChildren(this);
            objectBox.addChildren(this);
            objectBox.rect.attr({ "stroke-width": 1, stroke: "black" });
          } else {
            console.log("asdfasdfsdf");
            if (this.origin) {
              this.move(this.origin.x, this.origin.y);
            }
          }
        } else {
          if (this.parent === objectBox) {
            objectBox.removeChildren(this);
          }
        }
      }
      this.origin = null;
    });

    this.keyBox.text.text.on("dblclick", () => {
      const v = window.prompt("dblclick");
      if (!v) return;
      this.keyBox.updateText(v);
      const { width, x, y } = this.keyBox.boundary;
      this.valueBox.move(x + width, y);
      this.setWidth();
      this.setHeight();
      this.parent?.setWidth();
      this.parent?.setHeight();
      this.parent?.move(this.boundary.x, this.boundary.y);
    });
  };

  front = () => {
    this.rect.front();
    this.keyBox.front();
    this.valueBox.front();
  };

  move = (x: number, y: number) => {
    this.rect.move(x, y);
    this.keyBox.move(x, y);
    this.valueBox?.move(x + this.keyBox.boundary.width, y);
    this.eventEmitter.emit("move");
  };

  setWidth = () => {
    const width = this.keyBox.boundary.width + this.valueBox.boundary.width + 2;
    this.rect.width(width);
  };

  setHeight = () => {
    this.rect.height(
      Math.max(
        this.keyBox.boundary.height + 2,
        this.valueBox.boundary.height + 2
      )
    );
  };

  show = () => {
    this.rect.show();
    this.keyBox.show();
    this.valueBox.show();
  };

  hide = () => {
    this.rect.hide();
    this.keyBox.hide();
    this.valueBox.hide();
  };

  delete = () => {};
}
