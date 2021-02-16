import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { generateUrl } from '../../businessLogic/recipes';
import {getUserId} from '../../lambda/utils';
import { createLogger } from '../../utils/logger';

const logger = createLogger('url');
export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const recipeId = event.pathParameters.recipeId
  console.log(event, recipeId);
  const userId = getUserId(event);
  logger.info(recipeId);
  logger.info(userId);
  // Return a presigned URL to upload a file for a recipe item with the provided id
  
  const url = await generateUrl(recipeId, userId);
  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true

    },
    body: JSON.stringify({
      uploadUrl: url
    })

  }
}
