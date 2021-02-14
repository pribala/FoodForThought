import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'

import { CreatePlanRequest } from '../../requests/CreatePlanRequest'

//import {getUserId} from '../utils';
import { createLogger } from '../../utils/logger';
import { createPlan } from '../../businessLogic/weeklyplan';
const logger = createLogger('plan');

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const newPlan: CreatePlanRequest = JSON.parse(event.body)
  // const userId = getUserId(event);
 // logger.info(userId);
  // TODO: Implement creating a new plan item
  logger.info('Create a new plan item: ', event);
  logger.info(newPlan);
  const userId = 'test';
  const newItem = await createPlan(newPlan, userId);
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
