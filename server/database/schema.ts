import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'

export const todos = sqliteTable('todos', {
  id: integer('id').primaryKey(),
  userId: integer('user_id').notNull(), // GitHub Id
  title: text('title').notNull(),
  completed: integer('completed').notNull().default(0),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull()
})

export const stations = sqliteTable('stations', {
  id: integer('id').primaryKey(),
  stationCode: text('station_code'),
  name: text('name'),
  total: integer('total'),
  latitude: text('latitude'),
  longitude: text('longitude'),
  policies: text('policies'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull()
})

export const stationStatus = sqliteTable('station_status', {
  id: integer('id').primaryKey(),
  stationId: integer('station_id'),
  idle: integer('idle'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull()
})
