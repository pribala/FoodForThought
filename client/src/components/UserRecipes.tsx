import * as React from 'react'
import { History } from 'history'
import Auth from '../auth/Auth'
import { Recipe } from '../types/Recipe'
import { getUserRecipes, deleteRecipe, addRecipe, patchRecipe } from '../api/recipes-api'
import update from 'immutability-helper'

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
    disableSubmit: boolean
    disableUpdate: boolean
    position: number
}

const categoryOptions = [
    { key: 'veg', value: 'Vegetarian', text: 'Vegetarian' },
    { key: 'vgn', value: 'Vegan', text: 'Vegan' },
    { key: 'ple', value: 'Paleo', text: 'Paleo' },
    { key: 'nvg', value: 'Non-vegetarian', text: 'Non-Vegetarian' },
    { key: 'glf', value: 'Gluten-free', text: 'Gluten-Free' },
]

export class UserRecipes extends React.PureComponent<RecipeProps, RecipeState> {
    state: RecipeState = {
      recipes: [],
      loadingRecipes: true,
      title: '',
      category: '',
      description: '',
      disableSubmit: false,
      disableUpdate: true,
      position: 0
    }

    async componentDidMount() {
        try {
            const recipes = await getUserRecipes(this.props.auth.getIdToken())
            this.setState({
            recipes,
            loadingRecipes: false,
            disableSubmit: false,
            disableUpdate: true,
            position: 0
            })
        } catch (e) {
            alert(`Failed to fetch recipes: ${e.message}`)
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
        console.log(recipeId);
        this.props.history.push(`/recipes/${recipeId}/edit`)
    }

    onUpdateClick = (pos: number) => {
        console.log(pos);
        const recipe = this.state.recipes[pos];
        console.log(recipe);
        this.setState({
            title: recipe.title,
            category: recipe.category,
            description: recipe.description,
            disableSubmit: true,
            disableUpdate: false,
            position: pos
        })
    }

    handleUpdate = async (event: React.SyntheticEvent) => {
        event.preventDefault();
        const recipe = this.state.recipes[this.state.position];
      
        try {
         const newRecipe =  await patchRecipe(this.props.auth.getIdToken(), recipe.recipeId, {
                category: this.state.category,
                description: this.state.description,
                likes: 0,
                unlike: 0
            })
            this.setState({
                recipes: update(this.state.recipes, {
                    [this.state.position]: { category: { $set: newRecipe.category }, 
                    description: { $set: newRecipe.description}}
                }),
                title: '',
                category: '',
                description: '',
                position: 0,
                disableUpdate: true,
                disableSubmit: false
            })
        } catch {
            alert('Recipe updation failed')
            this.setState({
                title: '',
                category: '',
                description: '',
                position: 0,
                disableUpdate: true,
                disableSubmit: false
            })
        }
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

    handleClear = () => {
        this.setState({
            title: '',
            category: '',
            description: '',
            position: 0,
            disableUpdate: true,
            disableSubmit: false
        })
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
                        <Grid columns='3'>
                            <Grid.Column>
                                <Icon name='edit' color='green' onClick={() => this.onUpdateClick(pos)}/>
                                Edit  
                            </Grid.Column>
                            <Grid.Column>    
                                <Icon name='trash' color='red' onClick={() => this.deleteRecipeHandler(recipe.recipeId)}/>
                                Delete  
                            </Grid.Column>
                            <Grid.Column>    
                                <Icon name='file image outline' color='orange' onClick={() => this.onEditButtonClick(recipe.recipeId)}/>
                                Image  
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
            <Button type='submit' disabled={this.state.disableSubmit} onClick={this.handleSubmit}>Submit</Button>
            <Button disabled={this.state.disableUpdate} onClick={this.handleUpdate}>Update</Button>
            <Button onClick={this.handleClear}>Reset</Button>
          </Form>
          
        );
    }
}    