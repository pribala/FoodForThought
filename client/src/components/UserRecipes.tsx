import * as React from 'react'
import { History } from 'history'
import Auth from '../auth/Auth'
import { Recipe } from '../types/Recipe'
import { getUserRecipes } from '../api/recipes-api'
import  { AddRecipe }  from './AddRecipe'
import {
    Button,
    Grid,
    Header,
    Icon,
    Input,
    Image,
    Loader,
    Card,
    CardHeader,
    CardContent,
    Segment
  } from 'semantic-ui-react'
interface RecipeProps {
    auth: Auth
    history: History
}

interface RecipeState {
    recipes: Recipe[]
    loadingRecipes: boolean
}

export class UserRecipes extends React.PureComponent<RecipeProps, RecipeState> {
    state: RecipeState = {
      recipes: [],
      loadingRecipes: true
    }

    async componentDidMount() {
        try {
            const recipes = await getUserRecipes(this.props.auth.getIdToken())
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
          <Header as="h1">My Cookbook</Header>
            {this.renderRecipes()}
            <Segment>
                <Header as='h3'>Let's try a new recipe...</Header>
                <AddRecipe history= {this.props.history} auth={this.props.auth}/>
            </Segment>
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
                
                <Card raised key={recipe.recipeId}>
                    <Card.Content>
                        <Card.Header>{recipe.title}</Card.Header>
                        <Card.Description>
                        {recipe.description}
                        </Card.Description>
                    </Card.Content>
                    <Card.Content extra>
                        <Grid columns='3'>
                            <Grid.Column>
                                <Icon name='thumbs up' color='red' />
                                {recipe.likes} Likes
                            </Grid.Column>
                            <Grid.Column>    
                                <Icon name='trash' color='red' />
                                Delete  
                            </Grid.Column>
                            <Grid.Column>    
                                <Icon name='edit' color='green' />
                                Edit  
                            </Grid.Column>
                        </Grid>
                    </Card.Content>
                </Card>
             
                )
            })}
        </Card.Group>
      )
    }
}    