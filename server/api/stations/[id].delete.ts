import { eq, and } from 'drizzle-orm'
import { useValidatedParams, zh } from 'h3-zod'

export default eventHandler(async (event) => {
  const { id } = await useValidatedParams(event, {
    id: zh.intAsString
  })

  // List stations for the current user
  const deletedStation = await useDB().delete(tables.stations).where(and(
    eq(tables.stations.id, id)
  )).returning().get()

  if (!deletedStation) {
    throw createError({
      statusCode: 404,
      message: 'Station not found'
    })
  }
  return deletedStation
})
