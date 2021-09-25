type Constructor = new (...args: any[]) => {};

let ids = new Map<Constructor, number>();

export function currentId(type: Constructor) {
  return ids.get(type) || 0;
}

export function nextId(type: Constructor) {
  let id = currentId(type);
  id = id + 1;
  ids.set(type, id);
  return String(id);
}
