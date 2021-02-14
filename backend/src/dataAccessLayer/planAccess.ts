import { DocumentClient } from "aws-sdk/clients/dynamodb";
import * as AWS from 'aws-sdk';
// import * as AWSXRay from 'aws-xray-sdk';
const AWSXRay = require('aws-xray-sdk');
import { PlanItem } from '../models/PlanItem';
import { createLogger } from '../utils/logger';
const logger = createLogger('data');
const XAWS = AWSXRay.captureAWS(AWS);
export class PlanAccess {
    constructor(
        private readonly docClient: DocumentClient = createDynamodbClient(),
        private readonly weeklyPlanTable = process.env.WEEKLY_PLANNER_TABLE,
       // private readonly planIndex = process.env.PLANNER_INDEX,
       // private readonly bucketName = process.env.IMAGES_S3_BUCKET,
        // private readonly expirationTime = process.env.SIGNED_URL_EXPIRATION
    ) {

    }

    // async getAllToDos(): Promise<PlanItem[]> {
    //     logger.info('Getting all to do list items.');
    //     const result = await this.docClient.scan({
    //         TableName: this.todoListTable
    //     }).promise();

    //     const items = result.Items;
    //     return items as TodoItem[];
    // }

    async createPlan(planItem: PlanItem): Promise<PlanItem> {
        logger.info('Creating new plan item.');
        logger.info(this.weeklyPlanTable);
        await this.docClient.put({
            TableName: this.weeklyPlanTable,
            Item: planItem
        }).promise();

        return planItem as PlanItem;
    }

    async getPlansForUser(userId: string): Promise<PlanItem[]> {
        logger.info('getPlansForUser', 'userId:', userId, 'table',this.weeklyPlanTable);
        const result = await this.docClient.query({
          TableName: this.weeklyPlanTable,
          KeyConditionExpression: 'userId = :userId',
          ExpressionAttributeValues: {
            ':userId': userId
          },
          ScanIndexForward: false
        }).promise();
      
        logger.info('Plan for a user', result.Items);
        return result.Items as PlanItem[];
    }

    // async  userExists(userId: string): Promise<Boolean> {
    //     const result = await this.docClient.get({
    //         TableName: this.todoListTable,
    //         Key: {
    //         userId: userId
    //         } 
    //     }).promise();
    
    //     logger.info('Check if user is valid.', result);
    //     return !!result.Item;
    // }

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

    // async deleteTodoItem(userId: string, todoId: string): Promise<TodoItem> {
    //     logger.info(todoId);
    //     logger.info(userId);
    //     const result = await this.docClient.delete({
    //         TableName: this.todoListTable,
    //         Key:  {
    //           userId: userId,
    //           todoId: todoId
    //         },
    //     }).promise();
    
    //     logger.info('Delete a to do.', result);
    //     return result[0] as TodoItem;
    // }

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



