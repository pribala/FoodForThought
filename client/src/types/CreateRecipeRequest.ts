export interface CreateRecipeRequest {
  title: string
  category: string | number | boolean | (string | number | boolean)[] | undefined
  description: string | number | undefined
}
