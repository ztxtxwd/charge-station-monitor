import { eq } from 'drizzle-orm'

export default eventHandler(async (event) => {

  // List stations for the current user
  const stations = await useDB().select().from(tables.stations).all()

  return stations
})
