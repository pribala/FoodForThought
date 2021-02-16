import * as React from 'react'
import { History } from 'history'
import Auth from '../auth/Auth'
import { Recipe } from '../types/Recipe'
import { getUserRecipes, deleteRecipe, addRecipe } from '../api/recipes-api'

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
    Segment,
    TextArea,
    Select,
    Form,
    TextAreaProps,
    DropdownProps
  } from 'semantic-ui-react'
interface RecipeProps {
    auth: Auth
    history: History
}

interface RecipeState {
    recipes: Recipe[]
    loadingRecipes: boolean
    title: string
    category: string | number | boolean | (string | number | boolean)[] | undefined
    description: string | number | undefined
}

const categoryOptions = [
    { key: 'veg', value: 'vegetarian', text: 'Vegetarian' },
    { key: 'vgn', value: 'vegan', text: 'Vegan' },
    { key: 'ple', value: 'paleo', text: 'Paleo' },
    { key: 'nvg', value: 'non-vegetarian', text: 'Non-Vegetarian' },
    { key: 'glf', value: 'gluten-free', text: 'Gluten-Free' },
]

export class UserRecipes extends React.PureComponent<RecipeProps, RecipeState> {
    state: RecipeState = {
      recipes: [],
      loadingRecipes: true,
      title: '',
      category: '',
      description: ''
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

    deleteRecipeHandler = async (id: string) => {
        try {
            const newRecipe = await deleteRecipe(this.props.auth.getIdToken(), id)
            this.setState({
                recipes: this.state.recipes.filter(recipe => recipe.recipeId != id)
            })
        } catch {
            alert('Recipe deletion failed')
        }
    } 

    onEditButtonClick = (recipeId: string) => {
        this.props.history.push(`/recipes/${recipeId}/edit`)
    }

    handleSubmit = async (event: React.SyntheticEvent) => {
        event.preventDefault()
        try {
            const newRecipe = await addRecipe(this.props.auth.getIdToken(), {
              title: this.state.title,
              category: this.state.category,
              description: this.state.description,
            })
            this.setState({
                recipes: [...this.state.recipes, newRecipe],
                title: '',
                category: '',
                description: ''
            })
        } catch {
            alert('Recipe creation failed')
        }
    }

    handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({title: event.target.value})
    }

    handleDesChange = (event: React.FormEvent<HTMLTextAreaElement>, data: TextAreaProps) => {
        this.setState({description: data.value})
    }

    handleCategoryChange = (event: React.SyntheticEvent<HTMLElement>, data: DropdownProps) => {
        this.setState({category: data.value})
    }

    render() {
      return (
        <div>
          <Header as="h1">My Cookbook</Header>
            {this.renderRecipes()}
            <Segment>
                <Header as='h3'>Let's try a new recipe...</Header>
                {this.renderAddRecipe()}
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
                                <Icon name='trash' color='red' onClick={() => this.deleteRecipeHandler(recipe.recipeId)}/>
                                Delete  
                            </Grid.Column>
                            <Grid.Column>    
                                <Icon name='edit' color='green' onClick={() => this.onEditButtonClick(recipe.recipeId)}/>
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

    renderAddRecipe() {
        return (
            <Form>
                <Form.Field>
                    <label>Title</label>
                    <input placeholder='Title' onChange={this.handleTitleChange} value={this.state.title}/>
                </Form.Field>
                <Form.Field>
                    <label>Category</label>
                    <Select placeholder='Select category' options={categoryOptions} onChange={this.handleCategoryChange} value={this.state.category}/>
                </Form.Field>
                <Form.Field>
                    <label>Description</label>
                    <TextArea placeholder='Recipe...' style={{ minHeight: 100 }} onChange={this.handleDesChange} value={this.state.description}/>
                </Form.Field>
            <Button type='submit' onClick={this.handleSubmit}>Submit</Button>
          </Form>
          
        );
    }
}    