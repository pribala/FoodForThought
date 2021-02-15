import * as React from 'react'
import { History } from 'history'
import Auth from '../auth/Auth'
import { Recipe } from '../types/Recipe'
import { getRecipes } from '../api/recipes-api'
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
   // newTodoName: string
    loadingRecipes: boolean
}

export class Recipes extends React.PureComponent<RecipeProps, RecipeState> {
    state: RecipeState = {
      recipes: [],
     // newTodoName: '',
      loadingRecipes: true
    }

    async componentDidMount() {
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
              <Card.Content>
                <Card.Header>{recipe.title}</Card.Header>
                <Card.Description>
                  {recipe.description}
                </Card.Description>
              </Card.Content>
              <Card.Content extra>
                <Icon name='thumbs up' color='red' />
                  {recipe.likes} Likes
              </Card.Content>
            </Card>
          )
        })
     
      }
      </Card.Group>
    )
  }
}    