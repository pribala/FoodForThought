export interface Recipe {
  recipeId: string
  userId: string
  title: string
  category: string
  description: string
  likes: number
  unlike: number
  recipeUrl?: string
}
