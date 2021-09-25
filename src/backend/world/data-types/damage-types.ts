export interface DamageType {
  name: string;
  verb: string;
}

export const DEFAULT_DAMAGE_TYPE: DamageType = {
  name: "none",
  verb: "none",
};

export const DamageTypeTable = new Map<string, DamageType>();
DamageTypeTable.set(DEFAULT_DAMAGE_TYPE.name, DEFAULT_DAMAGE_TYPE);
