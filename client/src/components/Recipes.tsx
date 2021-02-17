import * as React from 'react'
import { History } from 'history'
import Auth from '../auth/Auth'
import { Recipe } from '../types/Recipe'
import { getRecipes, likeUnlikeRecipe } from '../api/recipes-api'
import update from 'immutability-helper'
import {
    Button,
    Checkbox,
    Divider,
    Grid,
    Header,
    Icon,
    Input,
    Image,
    Loader,
    Card,
    CardHeader,
    CardContent
  } from 'semantic-ui-react'
interface RecipeProps {
    auth: Auth
    history: History
}

interface RecipeState {
    recipes: Recipe[]
    loadingRecipes: boolean
    userId: string
}

export class Recipes extends React.PureComponent<RecipeProps, RecipeState> {
    state: RecipeState = {
      recipes: [],
      loadingRecipes: true,
      userId: ''
    }

    async componentDidMount() {
      console.log(this.props.auth.getUserId());
       this.setState({userId: this.props.auth.getUserId()});
        try {
            const recipes = await getRecipes(this.props.auth.getIdToken())
            this.setState({
            recipes,
            loadingRecipes: false
            })
        } catch (e) {
            alert(`Failed to fetch todos: ${e.message}`)
        }
    } 

    onLike = async (pos: number) => {
      console.log(pos);
      console.log(this.props.auth.getIdToken())
      const recipe = this.state.recipes[pos];
      console.log(recipe);
      try {
            await likeUnlikeRecipe(this.props.auth.getIdToken(), recipe.recipeId, {
                category: recipe.category,
                description: recipe.description,
                userId: recipe.userId,
                likes: 1,
                unlike: 0
            })
            this.setState({
                recipes: update(this.state.recipes, {
                    [pos]: { likes: { $set: recipe.likes + 1 }} 
                }),
            })
        } catch {
            alert('Recipe updation failed')
        }
    }

    onUnLike = async (pos: number) => {
      console.log(pos);
      const recipe = this.state.recipes[pos];
      console.log(recipe);
      try {
            await likeUnlikeRecipe(this.props.auth.getIdToken(), recipe.recipeId, {
                category: recipe.category,
                description: recipe.description,
                userId: recipe.userId,
                likes: 0,
                unlike: 1
            })
            this.setState({
                recipes: update(this.state.recipes, {
                    [pos]: { likes: { $set: recipe.likes - 1 }} 
                }),
            })
        } catch {
            alert('Recipe updation failed')
        }
    }

    render() {
      return (
        <div>
          <Header as="h1">Recipes</Header>
           {this.renderRecipes()}
        </div>
      )
    }

    renderRecipes() {
      if (this.state.loadingRecipes) {
        return this.renderLoading()
      }

      return this.renderRecipeList()
    }

    renderLoading() {
      return (
        <Grid.Row>
          <Loader indeterminate active inline="centered">
            Loading Recipes
          </Loader>
        </Grid.Row>
      )
    }

    renderRecipeList() {
      return (
        <Card.Group itemsPerRow={3}>
        {this.state.recipes.map((recipe, pos) => {
          return (
            <Card  raised  key={recipe.recipeId}>
              {recipe.recipeUrl && (
                <Image src={recipe.recipeUrl} fluid />
              )}
              <Card.Content>
                <Card.Header>{recipe.title}</Card.Header>
                <Card.Meta>
                    <span>{recipe.category}</span>
                </Card.Meta>
                <Card.Description>
                  {recipe.description}
                </Card.Description>
              </Card.Content>
              <Card.Content extra>
                { this.state.userId != recipe.userId ?
                (
                  <Grid centered columns={3}>
                    <Grid.Column>
                      <Icon name='thumbs up' color='green' onClick={() => this.onLike(pos)}/>
                    </Grid.Column>
                    <Grid.Column>
                      {recipe.likes} Likes
                    </Grid.Column>
                    <Grid.Column>
                      <Icon name='thumbs down' color='red' onClick={() => this.onUnLike(pos)}/>
                    </Grid.Column>
                  </Grid>
                ) : 
                (
                  <Grid centered columns={1}>
                 
                  <Grid.Column>
                    {recipe.likes} Likes
                  </Grid.Column>
                 
                  </Grid>
                ) 
              }
              </Card.Content>
            </Card>
          )
        })
     
      }
      </Card.Group>
    )
  }
}    