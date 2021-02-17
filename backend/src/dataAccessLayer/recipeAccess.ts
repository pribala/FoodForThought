import { DocumentClient } from "aws-sdk/clients/dynamodb";
import * as AWS from 'aws-sdk';
const AWSXRay = require('aws-xray-sdk');
import { RecipeItem } from '../models/RecipeItem';
import { createLogger } from '../utils/logger';
const logger = createLogger('data');
const XAWS = AWSXRay.captureAWS(AWS);
export class RecipeAccess {
    constructor(
        private readonly docClient: DocumentClient = createDynamodbClient(),
        private readonly recipeTable = process.env.RECIPE_COLLECTION_TABLE,
        private readonly recipeIndex = process.env.RECIPE_INDEX,
        private readonly bucketName = process.env.IMAGES_S3_BUCKET,
        private readonly expirationTime = process.env.SIGNED_URL_EXPIRATION
    ) {

    }
    
    // add a new recipe
    async addRecipe(recipeItem: RecipeItem): Promise<RecipeItem> {
        logger.info('Creating new recipe item.');
        logger.info(this.recipeTable);
        await this.docClient.put({
            TableName: this.recipeTable,
            Item: recipeItem
        }).promise();

        return recipeItem as RecipeItem;
    }

    // get recipes for the logged in user
    async getUserRecipes(userId: string): Promise<RecipeItem[]> {
        logger.info('getUserRecipes');
        const result = await this.docClient.query({
          TableName: this.recipeTable,
          KeyConditionExpression: 'userId = :userId',
          ExpressionAttributeValues: {
            ':userId': userId
          },
          ScanIndexForward: false
        }).promise();
      
        logger.info('Recipes for a user', result.Items);
        return result.Items as RecipeItem[];
    }

    // get all recipes
    async getAllRecipes(): Promise<RecipeItem[]> {
        logger.info('getAllRecipes');
        const result = await this.docClient.scan({
          TableName: this.recipeTable,
        }).promise();
      
        logger.info('All recipes', result.Items);
        return result.Items as RecipeItem[];
    }

    // update a recipe
    async updateRecipe(recipeItem: RecipeItem): Promise<RecipeItem> {
        logger.info('Updating an existing recipe.');
        logger.info(recipeItem);
        await this.docClient.put({
            TableName: this.recipeTable,
            Item: recipeItem
        }).promise();

        return recipeItem as RecipeItem;
    }

    // get a recipe item
    async  getRecipeItem(recipeId: string, userId: string): Promise<RecipeItem> {
        const result = await this.docClient
        .query({
            TableName: this.recipeTable,
            KeyConditionExpression: 'userId = :userId AND recipeId = :recipeId',
            ExpressionAttributeValues: {
            ':userId': userId,    
            ':recipeId': recipeId
            }
        }).promise();

        return result.Items[0] as RecipeItem;
    }

   
    // delete a recipe
    async deleteRecipe(userId: string, recipeId: string): Promise<RecipeItem> {
        logger.info(recipeId);
        logger.info(userId);
        const result = await this.docClient.delete({
            TableName: this.recipeTable,
            Key:  {
              userId: userId,
              recipeId: recipeId
            },
        }).promise();
    
        logger.info('Delete a to do.', result);
        return result[0] as RecipeItem;
    }
    
    // generate upload url
    async generateUrl(recipeId: string, userId: string) {
        const url = this.getUploadUrl(recipeId)
        // add url to the recipe
        const recipeUrl: string = 'https://' + this.bucketName + '.s3.amazonaws.com/' + recipeId
            const options = {
                TableName: this.recipeTable,
                Key: {
                    userId: userId,
                    recipeId: recipeId
                },
                UpdateExpression: "set recipeUrl = :r",
                ExpressionAttributeValues: {
                    ":r": recipeUrl
                },
                ReturnValues: "UPDATED_NEW"
            };
            await this.docClient.update(options).promise()
            return url
    }

    async getUploadUrl(recipeId: string) {
        logger.info('Generate signed URL');
        const s3 = new XAWS.S3({
            signatureVersion: 'v4'
        })
        return s3.getSignedUrl('putObject', {
            Bucket: this.bucketName,
            Key: recipeId,
            Expires: parseInt(this.expirationTime)
        })
    }
}

// dynamodb client instance
function createDynamodbClient() {
    logger.info(process.env.IS_OFFLINE)
    if(process.env.IS_OFFLINE == 'true') {
        logger.info('Creating a local DynamoDb instance');
        return new XAWS.DynamoDB.DocumentClient({
            region: 'localhost',
            endpoint: 'http://localhost:8000'
        })
    } 
    return new XAWS.DynamoDB.DocumentClient();
}



