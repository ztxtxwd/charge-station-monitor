import { eq } from 'drizzle-orm'
import { useValidatedParams, zh } from 'h3-zod'

export default eventHandler(async (event) => {
  const { id } = await useValidatedParams(event, {
    id: zh.intAsString
  })

  // 根据stationId查询所有stationStatus
  const stationStatuses = await useDB()
    .select()
    .from(tables.stationStatus)
    .where(eq(tables.stationStatus.stationId, id))
    .all()

  if (!stationStatuses.length) {
    throw createError({
      statusCode: 404,
      message: '未找到该站点的状态记录'
    })
  }

  return stationStatuses
})
