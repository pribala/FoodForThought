import { PlanItem } from '../models/PlanItem';
import {PlanAccess} from '../dataAccessLayer/planAccess';
import {CreatePlanRequest} from '../requests/CreatePlanRequest';
// import {UpdatePlanRequest} from '../requests/UpdatePlanRequest';
//import * as uuid from 'uuid';
const planAccess = new PlanAccess();
import { createLogger } from '../utils/logger';
const logger = createLogger('logic');

export async function getPlansForUser(userId: string): Promise<PlanItem[]> {
    logger.info('plan access');
    return planAccess.getPlansForUser(userId);
}

// export async function userExists(userId: string): Promise<Boolean> {
//     return todoAccess.userExists(userId);
// }

export async function createPlan(CreatePlanRequest: CreatePlanRequest, userId: string): Promise<PlanItem> {
   // const weekId = uuid.v4();
   // logger.info(weekId);
   logger.info(CreatePlanRequest);
   logger.info(userId);
    return await planAccess.createPlan({
    userId: userId,
    weekId: CreatePlanRequest.weekId,
    achieved: 0,   
    weekDay: CreatePlanRequest.weekDay,
    target: CreatePlanRequest.target,
    activities: CreatePlanRequest.activities
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