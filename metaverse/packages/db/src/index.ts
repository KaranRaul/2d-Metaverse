// const { PrismaClient } = require("");
// const { PrismaClient } = require("@prisma/client");
// exports.default = new PrismaClient();
// import { PrismaClient } from "@prisma/client";
// export const client = new PrismaClient(); // Named export
// export { PrismaClient }; // Optional, if you need the class elsewhere

// Object.defineProperty(exports, "__esModule", { value: true });
// const client_1 = require("@prisma/client");
// exports.default = new client_1.PrismaClient();

import { PrismaClient } from "@prisma/client"

export default new PrismaClient();
