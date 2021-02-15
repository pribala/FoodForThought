import React from 'react';  
import ReactDOM from 'react-dom'; 
import {
    Button,
    Input,
    TextArea,
    Select,
    Form,
    TextAreaProps
  } from 'semantic-ui-react'

const categoryOptions = [
    { key: 'veg', value: 'veg', text: 'Vegetarian' },
    { key: 'vgn', value: 'vgn', text: 'Vegan' },
    { key: 'ple', value: 'ple', text: 'Paleo' },
    { key: 'nvg', value: 'nvg', text: 'Non-Vegetarian' },
    { key: 'glf', value: 'glf', text: 'Gluten-Free' },
  ]  


interface AddRecipeState {
}  

export class AddRecipe extends React.Component {
    state = {
        title: '',
        category: '',
        description: ''
    }
    addRecipeHandler = (data: any) => {
        console.log(data)
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

    handleCategoryChange = (event:React.SyntheticEvent<HTMLElement, Event>) => {
        
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
            <Button type='submit' onClick={this.addRecipeHandler}>Submit</Button>
          </Form>
          
        );
    }
}
