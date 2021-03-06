import { apiEndpoint } from '../config'
import { Recipe } from '../types/Recipe';
import { CreateRecipeRequest } from '../types/CreateRecipeRequest';
import Axios from 'axios'
import { UpdateRecipeRequest } from '../types/UpdateRecipeRequest';

export async function getRecipes(idToken: string): Promise<Recipe[]> {
  console.log('Fetching recipes')

  const response = await Axios.get(`${apiEndpoint}/allrecipes`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    },
  })
  console.log('Recipes:', response.data)
  return response.data.items
}

export async function getUserRecipes(idToken: string): Promise<Recipe[]> {
  console.log('Fetching recipes')

  const response = await Axios.get(`${apiEndpoint}/userrecipes`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    },
  })
  console.log('Recipes:', response.data)
  return response.data.items
}

export async function addRecipe(
  idToken: string,
  newRecipe: CreateRecipeRequest
): Promise<Recipe> {
  const response = await Axios.post(`${apiEndpoint}/recipes`,  JSON.stringify(newRecipe), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
  return response.data.item
}

export async function patchRecipe(
  idToken: string,
  recipeId: string,
  updatedRecipe: UpdateRecipeRequest
): Promise<Recipe> {
  const response = await Axios.patch(`${apiEndpoint}/recipes/${recipeId}`, JSON.stringify(updatedRecipe), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
  return response.data.item
}

export async function likeUnlikeRecipe(
  idToken: string,
  recipeId: string,
  updatedRecipe: UpdateRecipeRequest
): Promise<Recipe> {
  const response = await Axios.patch(`${apiEndpoint}/likerecipe/${recipeId}`, JSON.stringify(updatedRecipe), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
  return response.data.item
}

export async function deleteRecipe(
  idToken: string,
  recipeId: string
): Promise<void> {
  await Axios.delete(`${apiEndpoint}/recipes/${recipeId}`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
}

export async function getUploadUrl(
  idToken: string,
  recipeId: string
): Promise<string> {
  console.log(recipeId)
  const response = await Axios.post(`${apiEndpoint}/recipes/${recipeId}/attachment`, '', {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
  return response.data.uploadUrl
}

export async function uploadFile(uploadUrl: string, file: Buffer): Promise<void> {
  await Axios.put(uploadUrl, file)
}
