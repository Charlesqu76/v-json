import Graph from "..";
import {
  EVENT_CREATE,
  EVENT_DELETE,
  EVENT_LINK,
  EVENT_MOUSEOUT,
  EVENT_MOUSEOVER,
  EVENT_SELECT,
  EVENT_UNLINK,
  EVENT_UPDATE,
} from "../event";
import ObjectBox from "../ObjectBox";
import debounce from "../utils/debounce";
import create from "./create";
import deleteItem from "./delete";
import link from "./link";
import mouseout from "./mouseout";
import mouseover from "./mouseover";
import select from "./select";
import unlink from "./unlink";

export function events(graph: Graph) {
  const update = debounce((data: ObjectBox[]) => {
    const d = data.map((item) => item.value);
    graph.valueChanged && graph.valueChanged(d);
  }, 200);

  graph.on(EVENT_UPDATE, (data) => {
    update(graph.getAllIsolateObjectBox());
  });

  graph.on(EVENT_LINK, ({ keyvalueBox, objectBox }) => {
    link(graph, { keyvalueBox, objectBox });
  });

  graph.on(EVENT_UNLINK, ({ line }) => {
    unlink(graph, line);
  });

  graph.on(EVENT_DELETE, ({ item }) => {
    deleteItem(graph, item);
  });

  graph.on(EVENT_SELECT, ({ item }) => {
    select(graph, item);
  });

  graph.on(EVENT_MOUSEOUT, ({ item }) => {
    mouseout(graph, item);
  });

  graph.on(EVENT_MOUSEOVER, ({ item }) => {
    mouseover(graph, item);
  });

  graph.on(EVENT_CREATE, ({ item }) => {
    create(graph, item);
  });

  graph.canvas?.click((event: Event) => {
    if (event.target === graph.canvas?.node) {
      if (graph.selectedItem) {
        graph.selectedItem.unselect();
        graph.selectedItem = null;
      }
    }
  });

  graph.canvas?.on("zoom", (event: any) => {
    if (graph.zoomCallback) {
      graph.zoomCallback(event.detail.level);
    }
  });

  graph.canvas?.on("panned", (event: any) => {
    console.log("panned", event);
  });
}
