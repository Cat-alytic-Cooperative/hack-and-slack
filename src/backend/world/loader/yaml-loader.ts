import { basename, extname, join } from "path";
import { cwd } from "process";
import { readFileSync, readdirSync } from "fs";
import Yaml from "js-yaml";
import { World } from "../../world";
import { Area } from "../entities/area";
import { Exit, ItemPrototype, Room, WeaponItemPrototype } from "../entities";
import { DamageTypeTable, DEFAULT_DIRECTIONS, Dice, DirectionLookup } from "../data-types";

function loadYaml(path: string) {
  return Yaml.load(readFileSync(path, "utf8")) as any;
}

function loadRaces() {}

function loadSkills() {}

function loadTables() {}

function loadArea(path: string) {
  const area = loadYaml(path);

  // Validate area

  return area;
}

function validateRoom(room: any, area: any, areas: any) {
  const problems: string[] = [];

  // Validate exits
  for (let [direction, exit] of Object.entries<any>(room.exits || {})) {
    if (!exit.to) {
      problems.push(`Exit '${direction}' does not have a destination.`);
      continue;
    }

    let [toArea, toRoom] = exit.to.split(/\./);
    if (!toArea) {
      problems.push(`Exit '${direction}' does not have a valid destination.`);
      continue;
    }

    if (!toRoom) {
      toRoom = toArea;
      toArea = area.id;
    }
    if (!areas[toArea].rooms[toRoom]) {
      problems.push(`Exit '${direction}': destination room '${toRoom}' does not exist in '${toArea}`);
    }
  }

  return problems;
}

function validateArea(area: any, areas: any) {
  const problems: string[] = [];

  // Validate Rooms
  console.log(area.rooms);
  for (let room of Object.values(area.rooms)) {
    problems.push(...validateRoom(room, area, areas));
  }

  return problems;
}

function validateAreas(areas: any) {
  const problems: string[] = [];
  for (let area of Object.values(areas)) {
    problems.push(...validateArea(area, areas));
  }
  return problems;
}

function instantiateRoom(world: World, data: any) {
  const room = new Room();

  room.name = data.name;
  room.description = data.description;
  for (let [direction, exitData] of Object.entries<any>(room.exits || {})) {
    const exit = new Exit();
    let matches = DirectionLookup.getMatchingPhrases(direction);
    if (matches.length > 0) {
      if (matches.length > 1) {
        console.warn(`Direction ${direction} matches default directions: ${matches.join(", ")}`);
      }
      direction = matches[0];
    }
    exit.name = exitData.name ?? "";
    exit.shortDescription = exitData.shortDescription ?? "";
    exit.description = exitData.description ?? "";
    exit.destinationId = exitData.to;

    room.exits.set(direction, exit);
  }

  return room;
}

function instantiateItemPrototype(world: World, data: any) {
  const problems = [];
  const type = data.type;
  let item: ItemPrototype;

  switch (type) {
    case "weapon":
      item = new WeaponItemPrototype();
      item.damage = Dice.from(data.damage);
      item.damageType = data.damageType;
      break;
    default:
      throw new Error(`Invalid item type: ${type}`);
  }

  return item;
}

function instantiateArea(world: World, data: any) {
  const area = new Area();

  area.id = data.id;
  area.name = data.name ?? "";
  area.description = data.description ?? "";
  area.data = data;

  for (let [roomId, roomData] of Object.entries(data.rooms)) {
    const room = instantiateRoom(world, roomData);
    room.id = roomId;
    area.rooms.set(room.id, room);
  }

  for (let [itemId, itemData] of Object.entries(data.items)) {
    const item = instantiateItemPrototype(world, itemData);
    item.id = itemId;
    area.items.set(item.id, item);
  }

  return area;
}

function connectExits(world: World, data: any) {
  for (let area of world.areas.values()) {
    for (let room of area.rooms.values()) {
      for (let [direction, exit] of room.exits.entries()) {
        const to = world.rooms.get(exit.destinationId);
        if (!to) {
          console.warn(`Exit ${area.id}.${room.id}.${direction} go to an invalid place.`);
          continue;
        }

        exit.destination = to;
      }
    }
  }
}

function instantiateWorld(areas: any) {
  const world = new World();

  for (let [areaId, areaData] of Object.entries(areas)) {
    const area = instantiateArea(world, areaData);
    area.id = area.id || areaId;

    world.areas.set(area.id, area);
    for (let [roomId, room] of area.rooms.entries()) {
      world.rooms.set(`${area.id}.${roomId}`, room);
    }
  }

  connectExits(world, areas);

  console.log(world);

  return world;
}

export function loadWorld() {
  const dataPath = join(cwd(), "data");
  console.log({ dataPath });

  const areas: { [name: string]: any } = {};
  const entries = readdirSync(join(dataPath, "areas"));
  entries.forEach((entry) => {
    if (!entry.endsWith(".yaml") && !entry.endsWith(".yml")) {
      return;
    }
    console.log(`Processing area file ${entry}`);
    const areaPath = join(dataPath, "areas", entry);
    const areaExt = extname(entry);
    const areaId = basename(entry, areaExt);
    console.log(areaPath, entry, areaExt, areaId);
    const area = loadArea(areaPath);
    area.id = area.id ?? areaId;
    area.name = area.name ?? areaId;
    area.description = area.description ?? "";
    area.rooms = area.rooms ?? {};
    area.items = area.items ?? {};
    area.mobs = area.mobs ?? {};

    areas[area.id] = area;
  });

  // Validate world
  const problems = validateAreas(areas);

  if (problems.length > 0) {
    problems.forEach((problem) => console.error);
    throw new Error(`${problems.length} problems in area files.`);
  }

  // Instantiate world
  return instantiateWorld(areas);
}

function loadDamageTypes(path: string) {
  const data = loadYaml(join(path, "damage-types.yaml"));
  for (let [name, verb] of Object.entries<string>(data)) {
    const damageType = {
      name,
      verb,
    };
    DamageTypeTable.set(name, damageType);
  }
  console.log(`Damage types:`, DamageTypeTable);
}

export function loadDatabase() {
  const dataPath = join(cwd(), "data");
  console.log({ dataPath });

  loadDamageTypes(dataPath);
}
