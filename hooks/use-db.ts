import { useSupabase } from './use-supabase';
import { db } from '@/lib/db';
import { recipes } from '@/lib/db/schema';
import { type Recipe } from '@/lib/db/schema';
import { sql } from 'drizzle-orm';

export function useDb() {
  const { session } = useSupabase();

  const getRecipes = async (searchTerm?: string) => {
    try {
      let baseQuery = db.select().from(recipes);

      // Build conditions
      let conditions = [];

      if (searchTerm) {
        conditions.push(sql`${recipes.title} ILIKE ${`%${searchTerm}%`}`);
      }

      if (session?.user?.id) {
        conditions.push(sql`(${recipes.status} = 'published' OR (${recipes.status} = 'draft' AND ${recipes.user_id} = ${session.user.id}))`);
      } else {
        conditions.push(sql`${recipes.status} = 'published'`);
      }

      // Combine conditions with AND
      if (conditions.length > 0) {
        // @ts-ignore
        baseQuery = baseQuery.where(sql.join(conditions, sql` AND `));
      }

      const result = await baseQuery.orderBy(sql`${recipes.created_at} DESC`);
      return result;
    } catch (error) {
      console.error('Error fetching recipes:', error);
      throw error;
    }
  };

  const createRecipe = async (data: Omit<Recipe, 'id' | 'created_at'>) => {
    if (!session?.user?.id) throw new Error('User not authenticated');

    try {
      const [recipe] = await db.insert(recipes)
        .values({
          ...data,
          user_id: session.user.id,
        })
        .returning();

      return recipe;
    } catch (error) {
      console.error('Error creating recipe:', error);
      throw error;
    }
  };

  const updateRecipe = async (id: string, data: Partial<Omit<Recipe, 'id' | 'created_at'>>) => {
    if (!session?.user?.id) throw new Error('User not authenticated');

    try {
      const [recipe] = await db.update(recipes)
        .set(data)
        .where(sql`${recipes.id} = ${id} AND ${recipes.user_id} = ${session.user.id}`)
        .returning();

      return recipe;
    } catch (error) {
      console.error('Error updating recipe:', error);
      throw error;
    }
  };

  const deleteRecipe = async (id: string) => {
    if (!session?.user?.id) throw new Error('User not authenticated');

    try {
      await db.delete(recipes)
        .where(sql`${recipes.id} = ${id} AND ${recipes.user_id} = ${session.user.id}`);
    } catch (error) {
      console.error('Error deleting recipe:', error);
      throw error;
    }
  };

  return {
    session,
    getRecipes,
    createRecipe,
    updateRecipe,
    deleteRecipe,
  };
}
