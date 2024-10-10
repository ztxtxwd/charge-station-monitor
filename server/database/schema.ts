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
  latitude: text('latitude'),
  longitude: text('longitude'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull()
})