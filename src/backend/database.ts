import { Pool, Client, QueryResult, QueryResultRow } from "pg";
import { range } from "./util";
// pools will use environment variables
// for connection information

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || "",
  ssl: { rejectUnauthorized: false },
});

/*
pool.on("error", (err, client) => {
  console.error(err);
});
*/
export function getDatabase() {
  return pool.connect();
}

export async function performQuery(sql: string, parameters?: any[]) {
  try {
  //  const client = await getDatabase();
    console.log("<=", sql);
    console.log("<=", parameters);
  const queryResult = await pool.query(sql, parameters);
  console.log(3);
  //  console.log("=>", queryResult);
  //  client.release();
  return queryResult;
  } catch(e) {
    console.error("db error", e);
    throw e;
  }
}

export interface QueryInsertOptions {
  update?: string;
  returning?: string | string[] | null;
}

export interface BaseQueryObject<T extends QueryResultRow> {
  getAll(): Promise<QueryResult<T>>;
  getById(id: number): Promise<QueryResult<T>>;
  getByExample(object: Partial<T>): Promise<QueryResult<T>>;
  insert(object: Partial<T>, options?: QueryInsertOptions): Promise<QueryResult<T>>;
  deleteById(id: number): Promise<QueryResult<T>>;
  deleteByExample(object: Partial<T>): Promise<QueryResult<T>>;
}

export function queryObjectBuilder<T extends QueryResultRow, R = BaseQueryObject<T>>(table: string, overrideObject?: R) {
  return Object.assign({
    async getAll() {
      return performQuery(`SELECT * FROM ${table}`);
    },
    async getById(id: number) {
      return performQuery(`SELECT * FROM ${table} WHERE id = $1`, [id]);
    },
    async getByExample(object: Partial<T>) {
      const keys = Object.keys(object);
      const parameters = keys.map((key) => (object as any)[key]);
      const args = [...range(1, keys.length)].map((value) => `${keys[value - 1]} = $${value}`).join(" AND ");
      const sql = `SELECT * FROM ${table} WHERE ${args}`;
      return performQuery(sql, parameters);
    },
    async insert(object: Partial<T>, options?: QueryInsertOptions) {
      const keys = Object.keys(object);
      const parameters = keys.map((key) => (object as any)[key]);
      const fields = keys.join(", ");
      const args = [...range(1, keys.length)].map((value) => `$${value}`).join(", ");

      let sql = `INSERT INTO ${table}(${fields}) VALUES (${args})`;
      if (!!options?.update) {
        sql =
          sql +
          ` ON CONFLICT ${options.update} DO UPDATE SET ` +
          keys.map((field) => `${field} = excluded.${field}`).join(", ");
      }
      const returning = options?.returning;
      if (returning === undefined) {
        sql = sql + " RETURNING id";
      } else if (returning !== null) {
        if (Array.isArray(returning)) {
          sql = sql + ` RETURNING ${returning.join(", ")}`;
        } else {
          sql = sql + ` RETURNING ${returning}`;
        }
      }

      return performQuery(sql, parameters);
    },
    async deleteById(id: number) {
      return performQuery(`DELETE FROM ${table} WHERE id = $1`, [id]);
    },
    async deleteByExample(object: Partial<T>) {
      const keys = Object.keys(object);
      const parameters = keys.map((key) => (object as any)[key]);
      const args = [...range(1, keys.length)].map((value) => `${keys[value - 1]} = $${value}`).join(" AND ");
      const sql = `DELETE FROM ${table} WHERE ${args}`;
      return performQuery(sql, parameters);
    },
  }) as R;
}

