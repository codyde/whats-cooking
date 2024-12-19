import { pgTable, text, timestamp, jsonb, integer, uuid } from 'drizzle-orm/pg-core';

export const recipes = pgTable('recipes', {
  id: uuid('id').primaryKey().defaultRandom(),
  created_at: timestamp('created_at').defaultNow(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  ingredients: jsonb('ingredients').notNull().$type<string[]>(),
  instructions: jsonb('instructions').notNull().$type<string[]>(),
  cooking_time: integer('cooking_time').notNull(),
  temperature: integer('temperature').notNull(),
  user_id: uuid('user_id').notNull(),
  category: text('category').notNull(),
  status: text('status', { enum: ['draft', 'published'] }).notNull().default('draft'),
  image: text('image'),
});

export const cookingJournals = pgTable('cooking_journals', {
  id: uuid('id').primaryKey().defaultRandom(),
  created_at: timestamp('created_at').defaultNow(),
  recipe_id: uuid('recipe_id').references(() => recipes.id),
  title: text('title').notNull(),
  notes: text('notes').notNull(),
  temperature_log: jsonb('temperature_log').notNull().$type<any[]>().default([]),
  images: jsonb('images').notNull().$type<string[]>().default([]),
  user_id: uuid('user_id').notNull(),
  status: text('status', { enum: ['planned', 'in_progress', 'completed'] }).notNull(),
});

export const profiles = pgTable('profiles', {
  id: uuid('id').primaryKey(),
  created_at: timestamp('created_at').defaultNow(),
  username: text('username').notNull(),
  full_name: text('full_name').notNull(),
  avatar_url: text('avatar_url'),
});

// Types
export type Recipe = typeof recipes.$inferSelect;
export type NewRecipe = typeof recipes.$inferInsert;

export type CookingJournal = typeof cookingJournals.$inferSelect;
export type NewCookingJournal = typeof cookingJournals.$inferInsert;

export type Profile = typeof profiles.$inferSelect;
export type NewProfile = typeof profiles.$inferInsert;
