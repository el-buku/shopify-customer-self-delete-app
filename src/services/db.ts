import { TypedJsonDB, ContentBase, Dictionary } from "ts-json-db";


export type TCustomerRemoveReq = {
    customerId: string;
    status: "SUCCESS" | "FAILED";
};

export type TShopData = { shop: string, token: string, storefrontAccessToken: string }

interface ContentDef extends ContentBase {
    paths: {
        '/customerRemoveReq': {
            entryType: "array",
            valueType: TCustomerRemoveReq
        },
        '/shops': {
            entryType: "array",
            valueType: TShopData
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
        this.db = new TypedJsonDB<ContentDef>(`${baseDataPath}.json`, false, true, true);
    }

    async saveResource(resource: R) {
        const { db, resourcePath } = this
        const data = await db.get(resourcePath)
        db.set(resourcePath, [...(data || []), resource])
    }

    async getData(): Promise<R[]> {
        const { db, resourcePath } = this
        //@ts-ignore

        return await db.get(resourcePath)
    }
}

export const TokenDBClient = new DbClient("data/s", "/shops")

export default new DbClient("data/ccr", "/customerRemoveReq")

