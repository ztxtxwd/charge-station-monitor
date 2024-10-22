import { eq } from 'drizzle-orm'

export default eventHandler(async (event) => {

  // List stations for the current user
  const stationStatuses = await useDB().select().from(tables.stationStatus).all()
  
  return stationStatuses
})
