import 'source-map-support/register'

import {getUserId} from '../../lambda/utils';
import { createLogger } from '../../utils/logger';
import { getUserRecipes } from '../../businessLogic/recipes';

const logger = createLogger('auth');

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  // Get recipes for current user
  logger.info('Get user recipes.');
  const userId = getUserId(event);
  console.log(event);
  logger.info(userId, 'userId');
  const recipes = await getUserRecipes(userId);
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({items: recipes})
  }
}