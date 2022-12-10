import { TypedJsonDB, ContentBase, Dictionary } from "ts-json-db";


export type TCustomerRemoveReq = {
    customerId: string;
    status: "SUCCESS" | "FAILED";
};


interface ContentDef extends ContentBase {
    paths: {
        '/customerRemoveReq': {
            entryType: "array",
            valueType: TCustomerRemoveReq
        }
    }
}

export type ResourcePath = keyof ContentDef['paths']
export type R = ContentDef['paths'][ResourcePath]['valueType']

class DbClient {
    public db: TypedJsonDB<ContentDef>
    public baseDataPath: string;
    public resourcePath: ResourcePath;

    constructor(baseDataPath: string = "data", resourcePath: ResourcePath) {
        this.resourcePath = resourcePath
        this.baseDataPath = baseDataPath
        this.db = new TypedJsonDB<ContentDef>(`${baseDataPath}.json`);
    }

    async saveResource(resource: R) {
        const { db, resourcePath } = this
        db.push(resourcePath, resource)
    }

    async getData() {
        const { db, resourcePath } = this
        return await db.get(resourcePath)
    }
}

export default new DbClient("db", "/customerRemoveReq")

