import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'

import { CreateRecipeRequest } from '../../requests/CreateRecipeRequest'

import {getUserId} from '../utils';
import { createLogger } from '../../utils/logger';
import { addRecipe } from '../../businessLogic/recipes';
const logger = createLogger('add');

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const newRecipe: CreateRecipeRequest = JSON.parse(event.body)
  const userId = getUserId(event);
  logger.info(userId);
  // add a new recipe
  logger.info('Create a new recipe item: ', event);
  logger.info(newRecipe);
  const newItem = await addRecipe(newRecipe, userId);
  logger.info(newItem);
  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true

    },
    body: JSON.stringify({item: newItem})

  }
}
