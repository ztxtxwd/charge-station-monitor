import { stations, stationStatus } from '../database/schema'
import { eq } from 'drizzle-orm'

export default defineTask({
  meta: {
    name: "获取充电站状态",
    description: "获取充电站状态",
  },
  async run({ payload, context }) {
    console.log("正在运行获取充电站状态任务...");

    try {
      // 从数据库获取所有充电站
      const allStations = await useDB().select().from(stations);

      for (const station of allStations) {
        const response: { data: { policies: object[], stationName: string, connectorInfo: { fastConnectorCount: number,fastConnectorIdleCount: number } } } = await $fetch('https://chongdian-travel.17u.cn/chargeapi/query/api/station/detail', {
          method: 'POST',
          headers: {
            'x-member': '42nBCw8nodlgdhu9s3Gzj9s5RFBGxpqCh4O3L7-a9tSPtKpgP6hNQNmMJvppfL6AhXdIXX3GW4kaXt2tSYDfqLmMM_-96JxDfDA7lXbmHQTO1GjoY-yxxt6j2fAVV18Pa2',
            'Content-Type': 'application/json',
            'Accept': '*/*',
            'Host': 'chongdian-travel.17u.cn',
            'Connection': 'keep-alive'
          },
          body: JSON.stringify({
            stationCode: station.stationCode,
            traceId: '24d53661-7343-44a2-9721-197438905359'
          })
        });

        // 暂停5秒
        await new Promise(resolve => setTimeout(resolve, 5000));

        if(station.name !== response.data.stationName) {
          await useDB().update(stations).set({ name: response.data.stationName,total:response.data.connectorInfo.fastConnectorCount }).where(eq(stations.id, station.id))
        }

        if(station.policies !== JSON.stringify(response.data.policies)) {
          await useDB().update(stations).set({ policies: JSON.stringify(response.data.policies) }).where(eq(stations.id, station.id))
        }

        // 解析响应并存入stationStatus表
        if (response && response.data && response.data.connectorInfo) {
          await useDB().insert(stationStatus).values({
            stationId: station.id,
            idle: response.data.connectorInfo.fastConnectorIdleCount || 0,
            createdAt: new Date()
          });
        }
      }

      return { result: "成功更新所有充电站状态" };
    } catch (error) {
      console.error("更新充电站状态时出错:", error);
      return { result: "更新充电站状态失败" };
    }
  },
});
