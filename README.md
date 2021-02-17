# Serverless Food for Thought

A Recipe Collection application using AWS Lambda and Serverless framework.  

# Functionality of the application

This application will allow users to view and add recipes. Each user only has access to edit/delete recipes that he/she has created. User can optionally attach an image to their recipes. They can view recipes added by other users and like or unlike them. The recipe collection view will show the number of likes for each recipe. Like/Unlike options are only available for recipes added by another user. 

# Specification

The application stores Recipe items, and each Recipe item contains the following fields:

* `recipeId` (string) - a unique id for an item
* `userId` (string) - id of a user who created the recipe item
* `title` (string) - title of a Recipe item 
* `description` (string) - recipe description
* `category` (string) - category the recipe belongs to (veg, vegan etc)
* `recipeUrl` (string) (optional) - a URL pointing to an image attached to a recipe item
  `likes` (number) - number of likes for the recipe

# Functions

The following functions are configured in the `serverless.yml` file:

* `Auth` - this function implements a custom authorizer for API Gateway that is added to all other functions.

* `GetAllRecipes` - returns all Recipes. The `scan` method is used to return all recipes added (not specific to any user)

It returns data that looks like this:

```json
{
  "items": [
    {
      "recipeId": "123",
      "userId": "123",
      "title": "Recipe 1",
      "category": "vegetarian",
      "description": "xyz",
      "recipeUrl": "http://example.com/image.png",
      "likes": 2
    },
    {
      "recipeId": "456",
      "userId": "yxz",
      "title": "Recipe 2",
      "category": "non-vegetarian",
      "description": "lorem ipsum",
      "recipeUrl": "http://example2.com/image.png",
      "likes": 2
    },
  ]
}
```
* `GetUserRecipes` - Recipes for a current user. A user id is extracted from a JWT token that is sent by the frontend.
`query()` method is used to get recipes for the logged in user using hash and range keys.

* `AddRecipe` - creates a new Recipe for a current user. A shape of data send by a client application to this function can be found in the `CreateRecipeRequest.ts` file

It receives a new Recipe item to be created in JSON format that looks like this:

```json
{
  "title": "xyz",
  "category": "paleo",
  "description": "lorem ipsum",
  "likes": 5,
  "recipeUrl": "http://example.com/image.png"
}
```

It returns a new Recipe item that looks like this:

```json
{
  "item": {
      "recipeId": "456",
      "userId": "yxz",
      "title": "Recipe 2",
      "category": "non-vegetarian",
      "description": "lorem ipsum",
      "recipeUrl": "http://example2.com/image.png",
      "likes": 0
  }
}
```

* `UpdateRecipe` - updates a Recipe item created by a current user. A shape of data send by a client application to this function can be found in the `UpdateRecipeRequest.ts` file

It receives an object that contains five fields that can be updated in a Recipe item:

```json
{
  "category": "Recipe 3",
  "description": "test",
  "likes": 2,
  "unlike": 1,
  "userId?": "yuyuyu"
}
```

The id of an item to be updated is passed as a URL parameter.

It returns an empty body.

* `DeleteRecipe` - deletes a Recipe item created by a current user. Expects an id of a Recipe item to remove.

It returns an empty body.

* `GenerateUploadUrl` - returns a pre-signed URL that can be used to upload an attachment file for a Recipe item.

It returns a JSON object that looks like this:

```json
{
  "uploadUrl": "https://s3-bucket-name.s3.eu-west-2.amazonaws.com/image.png"
}
```

All functions are connected to appropriate events from API Gateway.

An id of a user can be extracted from a JWT token passed by a client.

All necessary resources are defined in the `resources` section of the `serverless.yml` file such as DynamoDB table and S3 bucket.

# Frontend

Frontend is designed in REACTJS. The `client` folder contains a web application that uses the API developed in the project.

This frontend works with the serverless application. The `config.ts` file in the `client` folder configures your client application and contains an API endpoint and Auth0 configuration:

```ts
const apiId = '...' API Gateway id
export const apiEndpoint = `https://${apiId}.execute-api.us-east-1.amazonaws.com/dev`

export const authConfig = {
  domain: '...',    // Domain from Auth0
  clientId: '...',  // Client id from an Auth0 application
  callbackUrl: 'http://localhost:3000/callback'
}
```

## Authentication

To implement authentication in the application, you would have to create an Auth0 application and copy "domain" and "client id" to the `config.ts` file in the `client` folder. We recommend using asymmetrically encrypted JWT tokens.

# Best practices

## Logging

The starter code comes with a configured [Winston](https://github.com/winstonjs/winston) logger that creates [JSON formatted](https://stackify.com/what-is-structured-logging-and-why-developers-need-it/) log statements. You can use it to write log messages like this:

```ts
import { createLogger } from '../../utils/logger'
const logger = createLogger('auth')

// additional information can be provided with every log statement
// This information can then be used to search for log statements in a log storage system
logger.info('User was authorized', {
  // Additional information stored with a log statement
  key: 'value'
})
```

# Suggestions

To store Recipe items, we have used a DynamoDB table with local secondary index(es). 

```yml

TodosTable:
  Type: AWS::DynamoDB::Table
  Properties:
    AttributeDefinitions:
      - AttributeName: partitionKey
        AttributeType: S
      - AttributeName: sortKey
        AttributeType: S
      - AttributeName: indexKey
        AttributeType: S
    KeySchema:
      - AttributeName: partitionKey
        KeyType: HASH
      - AttributeName: sortKey
        KeyType: RANGE
    BillingMode: PAY_PER_REQUEST
    TableName: ${self:provider.environment.RECIPE_TABLE}
    LocalSecondaryIndexes:
      - IndexName: ${self:provider.environment.INDEX_NAME}
        KeySchema:
          - AttributeName: partitionKey
            KeyType: HASH
          - AttributeName: indexKey
            KeyType: RANGE
        Projection:
          ProjectionType: ALL # What attributes will be copied to an index

```

To query an index you need to use the `query()` method like:

```ts
await this.dynamoDBClient
  .query({
    TableName: 'table-name',
    IndexName: 'index-name',
    KeyConditionExpression: 'paritionKey = :paritionKey',
    ExpressionAttributeValues: {
      ':paritionKey': partitionKeyValue
    }
  })
  .promise()
```

# How to run the application

## Backend

To deploy the application run the following commands:

```
cd backend
npm install
sls deploy -v
```

## Frontend

To run a client application first edit the `client/src/config.ts` file to set correct parameters. And then run the following commands:

```
cd client
npm install
npm run start
```

This should start a development server with the React application that will interact with the serverless Recipe application.

