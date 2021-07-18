import { Room } from "./room";

export interface Thing {
  id: number;
  name: string;
  description: string;

  location?: Room | Thing;
}

export class ThingMap<K, V extends Thing> extends Map<K, V> {
  getAllByName(name: string) {
    name = name.toLowerCase();
    return [...this.values()].filter((thing) => thing.name.toLowerCase() === name);
  }

  getByName(name: string) {
    return this.getAllByName(name)[0];
  }
}
