export interface UpdateRecipeRequest {
  category: string | number | boolean | (string | number | boolean)[] | undefined
  description: string | number | undefined
  likes?: number
  unlike?: number
  userId?: string
}