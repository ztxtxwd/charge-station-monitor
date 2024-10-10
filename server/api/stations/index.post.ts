import { useValidatedBody, z } from 'h3-zod'

export default eventHandler(async (event) => {
  const { code } = await useValidatedBody(event, {
    code: z.string().min(1).max(100)
  })

  // Insert station for the current user
  const station = await useDB().insert(tables.stations).values({
    code: code,
  }).returning().get()

  return station
})
