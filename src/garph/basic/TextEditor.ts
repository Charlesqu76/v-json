import { Text } from "@svgdotjs/svg.js";
import { Tspan } from "@svgdotjs/svg.js";
import Graph from "../graph";
import { EVENT_UPDATE } from "@/garph/event";

const size = 16;
const DEFAULT_MAX_WIDTH = 400;

export default class TextEditor {
  graph: Graph;
  text: Text;
  constructor(text: string, x: number, y: number, graph: Graph) {
    this.graph = graph;
    this.text = this.graph.canvas
      ?.text((add) => this.addLine(add, String(text)))
      .move(x, y)
      .font({ size: size });
  }

  setWidth() {}
  setHeight() {}

  addLine = (add: Tspan | Text, text: string) => {
    const words = String(text)?.split(" ");
    let currentLine = "";

    words.forEach((word, index) => {
      const testLine = currentLine ? currentLine + " " + word : word;
      const tempText = this.graph.canvas.text(testLine).font({ size: 16 });
      const lineWidth = tempText.length();
      tempText.remove();
      if (lineWidth > DEFAULT_MAX_WIDTH) {
        if (currentLine) {
          add.tspan(currentLine).newLine();
        }
        currentLine = word;
      } else {
        currentLine = testLine;
      }
      if (index === words.length - 1) {
        add.tspan(currentLine).newLine();
      }
    });
  };

  updateText(newText: string) {
    this.text.clear();
    this.text.build(true);
    this.addLine(this.text, newText);
    this.move(this.boundary.x, this.boundary.y);
    this.text.build(false);
    this.graph.emit(EVENT_UPDATE, { name: "updateText", value: newText });
  }

  move(x: number, y: number) {
    this.text.move(x, y);
  }

  get boundary() {
    const { width, height, x, y } = this.text.bbox();
    return { x, y, width, height };
  }

  get value() {
    return this.text.text();
  }

  front() {
    this.text.front();
  }

  show() {
    this.text.show();
  }

  hide() {
    this.text.hide();
  }
}
