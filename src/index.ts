import app from "./app";
import { env } from "./config/env";
import { prisma } from "./config/prisma";

await prisma.$connect();
console.log("DB connected");

app.listen(env.PORT, () => {
  console.log(`🚀 Server running on http://localhost:${env.PORT} [${env.NODE_ENV}]`);
});
