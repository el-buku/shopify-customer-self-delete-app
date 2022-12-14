"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenDBClient = void 0;
const ts_json_db_1 = require("ts-json-db");
class DbClient {
    constructor(baseDataPath = "data", resourcePath) {
        this.resourcePath = resourcePath;
        this.baseDataPath = baseDataPath;
        this.db = new ts_json_db_1.TypedJsonDB(`${baseDataPath}.json`, false, true, true);
    }
    async saveResource(resource) {
        const { db, resourcePath } = this;
        const data = await db.get(resourcePath);
        db.set(resourcePath, [...(data || []), resource]);
    }
    async getData() {
        const { db, resourcePath } = this;
        //@ts-ignore
        return await db.get(resourcePath);
    }
}
exports.TokenDBClient = new DbClient("data/s", "/shops");
exports.default = new DbClient("data/ccr", "/customerRemoveReq");
