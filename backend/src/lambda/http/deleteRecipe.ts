import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { deleteRecipe } from '../../businessLogic/recipes';
import { createLogger } from '../../utils/logger';
import {getUserId} from '../utils';
const logger = createLogger('todos');
export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const recipeId = event.pathParameters.recipeId;
  const userId = getUserId(event);
  logger.info(recipeId);
  logger.info(userId);
  // TODO: Remove a TODO item by id
    const result = await deleteRecipe(userId, recipeId);
    logger.info(result);
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({item:result})
    }
}
