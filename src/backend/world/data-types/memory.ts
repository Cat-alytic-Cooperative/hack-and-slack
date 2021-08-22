export enum MemoryReactions {
  Customer,
  Seller,
  Hostile,
  Afraid,
}

export class MobileMemory {
  when = Date.now();
  id = 0;
  reaction = new Set<MemoryReactions>();
}
