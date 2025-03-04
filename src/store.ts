import { create } from "zustand";
import data from "../data.json";
import Graph from "./garph/graph";

type State = {
  jsons: any[];
  graph: Graph;
  zoom?: number;
  searchText: string;
};

type Actions = {
  setJsons: (jsons: string[]) => void;
  setZoom: (zoom: number) => void;
  setSearchText: (text: string) => void;
};

export const useStore = create<State & Actions>((set, get) => ({
  searchText: "",
  jsons: [data],
  graph: new Graph(),
  zoom: undefined,
  setJsons: (jsons) => set(() => ({ jsons: jsons })),
  setZoom: (zoom) => set(() => ({ zoom: zoom * 100 })),
  setSearchText: (text) => set(() => ({ searchText: text })),
}));
