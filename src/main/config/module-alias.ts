import { addAlias } from "module-alias";
import { resolve } from "path";

// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
addAlias("@", resolve(process.env.TS_NODE_DEV === undefined ? "dist" : "src"));
