import { RecipeItem } from '../models/RecipeItem';
import {RecipeAccess} from '../dataAccessLayer/recipeAccess';
import {CreateRecipeRequest} from '../requests/CreateRecipeRequest';
// import {UpdatePlanRequest} from '../requests/UpdatePlanRequest';
import * as uuid from 'uuid';
const planAccess = new RecipeAccess();
import { createLogger } from '../utils/logger';
const logger = createLogger('logic');

export async function getUserRecipes(userId: string): Promise<RecipeItem[]> {
    logger.info('recipes for user');
    return planAccess.getUserRecipes(userId);
}

export async function getAllRecipes(): Promise<RecipeItem[]> {
  logger.info('all recipes');
  return planAccess.getAllRecipes();
}

// export async function userExists(userId: string): Promise<Boolean> {
//     return todoAccess.userExists(userId);
// }

export async function addRecipe(CreateRecipeRequest: CreateRecipeRequest, userId: string): Promise<RecipeItem> {
   const recipeId = uuid.v4();
   logger.info(CreateRecipeRequest);
   logger.info(userId);
    return await planAccess.addRecipe({
    userId: userId,
    recipeId: recipeId,
    likes: 0,   
    title: CreateRecipeRequest.title,
    category: CreateRecipeRequest.category,
    description: CreateRecipeRequest.description
  });
}

// export async function updateToDoItem(UpdateTodoRequest: UpdateTodoRequest, todoId: string, userId: string): Promise<TodoItem> {
//     const todoItem = await todoAccess.getTodoItem(todoId, userId);
//     todoItem.name = UpdateTodoRequest.name ? UpdateTodoRequest.name : todoItem.name;
//     todoItem.done = UpdateTodoRequest.done != todoItem.done ? UpdateTodoRequest.done : todoItem.done;
//     todoItem.dueDate = UpdateTodoRequest.dueDate != todoItem.dueDate ? UpdateTodoRequest.dueDate : todoItem.dueDate;
//     return await todoAccess.updateTodo({
//         ...todoItem
//    });
//  }

// export async function itemExists(todoId: string, userId: string): Promise<Boolean> {
//     return todoAccess.itemExists(todoId, userId);
// }

// export async function deleteTodoItem(userId: string, todoId: string): Promise<TodoItem> {
//     return todoAccess.deleteTodoItem(userId, todoId);
// }

// export async function generateUrl(todoId: string, userId: string): Promise<string> {
//     return todoAccess.generateUrl(todoId, userId);
// }

// export async function addImage(todoId: string, userId: string): Promise<string> {
//     return await todoAccess.generateUrl(todoId, userId);
// }