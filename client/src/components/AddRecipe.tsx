import React from 'react';  
import ReactDOM from 'react-dom'; 
import { History } from 'history';
import Auth from '../auth/Auth';
import { addRecipe } from '../api/recipes-api';
import {
    Button,
    Input,
    TextArea,
    Select,
    Form,
    TextAreaProps,
    DropdownProps
  } from 'semantic-ui-react'

const categoryOptions = [
    { key: 'veg', value: 'vegetarian', text: 'Vegetarian' },
    { key: 'vgn', value: 'vegan', text: 'Vegan' },
    { key: 'ple', value: 'paleo', text: 'Paleo' },
    { key: 'nvg', value: 'non-vegetarian', text: 'Non-Vegetarian' },
    { key: 'glf', value: 'gluten-free', text: 'Gluten-Free' },
  ]  

interface AddRecipeProps {
    auth: Auth
    history: History
}  
interface AddRecipeState {
    title: string
    category: string | number | boolean | (string | number | boolean)[] | undefined
    description: string | number | undefined
}

export class AddRecipe extends React.PureComponent<AddRecipeProps, AddRecipeState> {
    state: AddRecipeState = {
        title: '',
        category: '',
        description: ''
    }
    handleSubmit = async (event: React.SyntheticEvent) => {
        event.preventDefault()
        try {
            const newRecipe = await addRecipe(this.props.auth.getIdToken(), {
              title: this.state.title,
              category: this.state.category,
              description: this.state.description,
            })
        } catch {
            alert('Recipe creation failed')
        }
    }

    handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        console.log(event.target.value)
        this.setState({title: event.target.value})
        console.log(this.state)
    }

    handleDesChange = (event: React.FormEvent<HTMLTextAreaElement>, data: TextAreaProps) => {
        console.log(data.value)
        this.setState({description: data.value})
        console.log(this.state)
    }

    handleCategoryChange = (event: React.SyntheticEvent<HTMLElement>, data: DropdownProps) => {
        console.log(data.value)
        this.setState({category: data.value})
    }
    render() {
        return (
            <Form>
                <Form.Field>
                    <label>Title</label>
                    <input placeholder='Title' onChange={this.handleTitleChange}/>
                </Form.Field>
                <Form.Field>
                    <label>Category</label>
                    <Select placeholder='Select category' options={categoryOptions} onChange={this.handleCategoryChange}/>
                </Form.Field>
                <Form.Field>
                    <label>Description</label>
                    <TextArea placeholder='Recipe...' style={{ minHeight: 100 }} onChange={this.handleDesChange}/>
                </Form.Field>
            <Button type='submit' onClick={this.handleSubmit}>Submit</Button>
          </Form>
          
        );
    }
}
