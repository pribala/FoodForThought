import 'source-map-support/register'

import { createLogger } from '../../utils/logger';
import { getAllRecipes } from '../../businessLogic/recipes';

const logger = createLogger('auth');

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  // Get all recipes
  logger.info('Get all recipes.');
  console.log(event);
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