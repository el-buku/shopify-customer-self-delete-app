"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ts_json_db_1 = require("ts-json-db");
class DbClient {
    constructor(baseDataPath = "data", resourcePath) {
        this.resourcePath = resourcePath;
        this.baseDataPath = baseDataPath;
        this.db = new ts_json_db_1.TypedJsonDB(`${baseDataPath}.json`);
    }
    async saveResource(resource) {
        const { db, resourcePath } = this;
        db.push(resourcePath, resource);
    }
    async getData() {
        const { db, resourcePath } = this;
        return await db.get(resourcePath);
    }
}
exports.default = new DbClient("db", "/customerRemoveReq");
