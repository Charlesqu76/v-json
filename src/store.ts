import { create } from "zustand";
import data from "../data.json";
import Graph from "./graph";

type State = {
  jsons: any[];
  graph: Graph;
  zoom?: number;
  searchText: string;
  isFull: boolean;
};

type Actions = {
  setJsons: (jsons: string[]) => void;
  setZoom: (zoom: number) => void;
  setSearchText: (text: string) => void;
  setFull: (full: boolean) => void;
};

export const useStore = create<State & Actions>((set, get) => ({
  searchText: "",
  jsons: [data],
  isFull: false,
  graph: new Graph({
    zoomCallback: (zoom) => {
      set(() => ({ zoom: zoom * 100 }));
    },
    valueChanged: (value) => {
      set(() => ({ jsons: value }));
    },
  }),
  zoom: undefined,
  setJsons: (jsons) => set(() => ({ jsons: jsons })),
  setZoom: (zoom) => set(() => ({ zoom: zoom * 100 })),
  setSearchText: (text) => set(() => ({ searchText: text })),
  setFull: (full) => set(() => ({ isFull: full })),
}));
