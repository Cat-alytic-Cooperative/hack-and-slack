export interface Thing {
  id: number;
  name: string;
  description: string;
}

export class ThingMap<K, V extends Thing> extends Map<K, V> {
  getAllByName(name: string) {
    const things: V[] = [];
    name = name.toLowerCase();
    for (let thing of this.values()) {
      if (thing.name.toLowerCase() === name) {
        things.push(thing);
      }
    }
    return things;
  }

  getByName(name: string) {
    return this.getAllByName(name)[0];
  }
}
