import { Welo, Database, createWelo } from "welo";
import { createHelia } from "helia";
import { interfaceDatastoreTests } from "interface-datastore-tests";
import { DatastoreWelo, KeyvalueDB } from "../src/index.js";
import { before, after } from "mocha";
import type { Helia } from "@helia/interface";
import type { Libp2p } from "@libp2p/interface-libp2p";
import type { PubSub } from "@libp2p/interface-pubsub";

describe("DatastoreWelo", () => {
	describe("interface-datastore compliance tests", () => {
		let ipfs: Helia<Libp2p<{ pubsub: PubSub }>>;
		let welo: Welo;
		let database: Database;

		before(async () => {
			ipfs = await createHelia();
			welo = await createWelo({ ipfs });
		});

		after(async () => {
			await welo?.stop();
			await ipfs?.stop();
		});

		interfaceDatastoreTests({
			async setup () {
				const manifest = await welo.determine({ name: "test" + Math.random() });

				database = await welo.open(manifest);

				return new DatastoreWelo(database as KeyvalueDB);
			},

			async teardown () {
				await database.close();
			}
		});
	});
});
