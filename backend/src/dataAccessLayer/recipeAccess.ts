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
       // private readonly bucketName = process.env.IMAGES_S3_BUCKET,
        // private readonly expirationTime = process.env.SIGNED_URL_EXPIRATION
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

    // async updateTodo(todoItem: TodoItem): Promise<TodoItem> {
    //     logger.info('Updating an existing to do item.');
        
    //     await this.docClient.put({
    //         TableName: this.todoListTable,
    //         Item: todoItem
    //     }).promise();

    //     return todoItem as TodoItem;
    // }

    // async  getTodoItem(todoId: string, userId: string): Promise<TodoItem> {
    //     const result = await this.docClient
    //     .query({
    //         TableName: this.todoListTable,
    //         KeyConditionExpression: 'userId = :userId AND todoId = :todoId',
    //         ExpressionAttributeValues: {
    //         ':userId': userId,    
    //         ':todoId': todoId
    //         }
    //     }).promise();

    //     return result.Items[0] as TodoItem;
    // }

    // async itemExists(todoId: string, userId: string): Promise<Boolean> {
    //     const result = await this.docClient.query({
    //         TableName: this.todoListTable,
    //         IndexName: this.imageIdIndex,
    //         KeyConditionExpression: 'userId = :userId AND todoId = :todoId',
    //         ExpressionAttributeValues: {
    //         ':todoId': todoId,
    //         ':userId': userId
    //         }
    //     }).promise();
    
    //     logger.info('Check if item is valid.', result);
    //     return result.Count != 0;
    // }

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

    // async generateUrl(todoId: string, userId: string) {
    //     const url = this.getUploadUrl(todoId)
    //     // add url to the todo
    //     const attachmentUrl: string = 'https://' + this.bucketName + '.s3.amazonaws.com/' + todoId
    //         const options = {
    //             TableName: this.todoListTable,
    //             Key: {
    //                 userId: userId,
    //                 todoId: todoId
    //             },
    //             UpdateExpression: "set attachmentUrl = :r",
    //             ExpressionAttributeValues: {
    //                 ":r": attachmentUrl
    //             },
    //             ReturnValues: "UPDATED_NEW"
    //         };
    //         await this.docClient.update(options).promise()
    //         return url
    // }

    // async getUploadUrl(todoId: string) {
    //     logger.info('Generate signed URL');
    //     const s3 = new XAWS.S3({
    //         signatureVersion: 'v4'
    //     })
    //     return s3.getSignedUrl('putObject', {
    //         Bucket: this.bucketName,
    //         Key: todoId,
    //         Expires: this.expirationTime
    //     })
    // }
}

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



