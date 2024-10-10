import { sql } from 'drizzle-orm'

export default eventHandler(async () => {
  // Count the total number of stations
  return await useDB().select({
    stations: sql<number>`count(*)`,
  }).from(tables.stations).get()
})
