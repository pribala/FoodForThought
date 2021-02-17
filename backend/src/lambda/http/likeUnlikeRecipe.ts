import 'source-map-support/register'
import { likeUnlikeRecipe } from '../../businessLogic/recipes';
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { UpdateRecipeRequest } from '../../requests/UpdateRecipeRequest';
import { createLogger } from '../../utils/logger';
const logger = createLogger('update');

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const recipeId = event.pathParameters.recipeId;
  const updatedRecipe: UpdateRecipeRequest = JSON.parse(event.body)
  logger.info(updatedRecipe);
  // Update a Recipe item with the provided id using values in the "updatedRecipe" object
  const updatedItem = await likeUnlikeRecipe(updatedRecipe, recipeId);
  logger.info(updatedItem);
    return {
      statusCode: 201,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({item: updatedItem})
  
    }
 }
