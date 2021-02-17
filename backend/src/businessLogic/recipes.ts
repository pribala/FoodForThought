import { RecipeItem } from '../models/RecipeItem';
import {RecipeAccess} from '../dataAccessLayer/recipeAccess';
import {CreateRecipeRequest} from '../requests/CreateRecipeRequest';
import {UpdateRecipeRequest} from '../requests/UpdateRecipeRequest';
import * as uuid from 'uuid';
const recipeAccess = new RecipeAccess();
import { createLogger } from '../utils/logger';
const logger = createLogger('logic');

export async function getUserRecipes(userId: string): Promise<RecipeItem[]> {
    logger.info('recipes for user');
    return recipeAccess.getUserRecipes(userId);
}

export async function getAllRecipes(): Promise<RecipeItem[]> {
  logger.info('all recipes');
  return recipeAccess.getAllRecipes();
}

export async function addRecipe(CreateRecipeRequest: CreateRecipeRequest, userId: string): Promise<RecipeItem> {
   const recipeId = uuid.v4();
   logger.info(CreateRecipeRequest);
   logger.info(userId);
    return await recipeAccess.addRecipe({
    userId: userId,
    recipeId: recipeId,
    likes: 0,   
    title: CreateRecipeRequest.title,
    category: CreateRecipeRequest.category,
    description: CreateRecipeRequest.description
  });
}

export async function updateRecipe(UpdateRecipeRequest: UpdateRecipeRequest, recipeId: string, userId: string): Promise<RecipeItem> {
    logger.info(UpdateRecipeRequest);
    const recipeItem = await recipeAccess.getRecipeItem(recipeId, userId);
    logger.info(recipeItem);
    recipeItem.description = UpdateRecipeRequest.description ? UpdateRecipeRequest.description : recipeItem.description;
    recipeItem.category = UpdateRecipeRequest.category ? UpdateRecipeRequest.category : recipeItem.category;
    recipeItem.likes = recipeItem.likes + UpdateRecipeRequest.likes - UpdateRecipeRequest.unlike;
    logger.info(recipeItem)
    return await recipeAccess.updateRecipe({
        ...recipeItem
   });
 }

 export async function likeUnlikeRecipe(UpdateRecipeRequest: UpdateRecipeRequest, recipeId: string): Promise<RecipeItem> {
  logger.info(UpdateRecipeRequest);
  const recipeItem = await recipeAccess.getRecipeItem(recipeId, UpdateRecipeRequest.userId);
  logger.info(recipeItem);
  recipeItem.likes = recipeItem.likes + UpdateRecipeRequest.likes - UpdateRecipeRequest.unlike;
  logger.info(recipeItem)
  return await recipeAccess.updateRecipe({
      ...recipeItem
 });
}

export async function deleteRecipe(userId: string, recipeId: string): Promise<RecipeItem> {
    return recipeAccess.deleteRecipe(userId, recipeId);
}

export async function generateUrl(recipeId: string, userId: string): Promise<string> {
    return recipeAccess.generateUrl(recipeId, userId);
}

