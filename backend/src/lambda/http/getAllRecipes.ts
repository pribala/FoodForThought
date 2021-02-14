import 'source-map-support/register'

//import {getUserId} from '../../lambda/utils';
import { createLogger } from '../../utils/logger';
import { getAllRecipes } from '../../businessLogic/recipes';

const logger = createLogger('auth');

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  // Get workout plan for a current user
  logger.info('Get all recipes.');
 // const userId = getUserId(event);
 console.log(event);
  const userId = 'test';
  logger.info(userId, 'userId');
  const plan = await getAllRecipes();
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({items: plan})
  }
}