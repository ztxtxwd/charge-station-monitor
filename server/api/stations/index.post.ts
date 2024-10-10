import { useValidatedBody, z } from 'h3-zod'

export default eventHandler(async (event) => {
  const { stationCode } = await useValidatedBody(event, {
    stationCode: z.string().min(1).max(100)
  })

  // Insert station for the current user
  const station = await useDB().insert(tables.stations).values({
    stationCode,
    createdAt: new Date()
  }).returning().get()

  return station
})
