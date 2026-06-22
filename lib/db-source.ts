export function shouldUseLocalData() {
  if (process.env.USE_LOCAL_DATA === "true") return true;
  const databaseUrl = process.env.DATABASE_URL ?? "";
  return databaseUrl.startsWith("prisma+") || databaseUrl.startsWith("prisma://");
}
