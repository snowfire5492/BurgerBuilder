import React, { Component } from 'react';
import Button from '../../../components/UI/Button/Button';
import classes from './ContactData.css';
import Spinner from '../../../components/UI/Spinner/Spinner';
import axios from '../../../axios-orders';
import Input from '../../../components/UI/Input/Input';

class ContactData extends Component {
    state = {
        orderForm: {
            name: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Your Name'
                },
                value: ''
            },
            street: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Street'
                },
                value: ''
            },
            postal: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Postal'
                },
                value: ''
            },
            country: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Country'
                },
                value: ''
            },
            email: {
                elementConfig: 'input',
                elementConfig: {
                    type: 'email',
                    placeholder: 'Email'
                },
                value: ''
            },
            deliveryMethod: {
                elementType: 'select',
                elementConfig: {
                    options: [{value: 'fastest', displayValue: 'Fastest'},
                              {value: 'cheapest', displayValue: 'Cheapest'}
                    ]
                },
                value: ''
            }
        },
        loading: false
    }

    orderHandler = (event) => {
        event.preventDefault();
        //console.log(this.props.ingredients);
        this.setState( {loading: true} );
        console.log(this.props.price);
        const order = {
            ingredients: this.props.ingredients,
            price: this.props.price, 
            customer: {
                name: 'Max', 
                address: {
                    street: 'Test dr.',
                    zipcode: '41351',
                    country: 'USA'
                }, 
                email: 'test@test.com',
            },
            deliveryMethod: 'overnight'
        }

        axios.post('/orders.json', order)
            .then(response => {
                this.setState({ loading: false });
                this.props.history.push('/');
            })
            .catch( error => {
                this.setState({ loading: false });
            });

    }

    inputChangedHandler = (event, inputIdentifier) => {
        const updatedOrderForm = {
            ...this.state.orderForm // cloning orderForm
        };
        const updatedFormElement = {
            ...updatedOrderForm[inputIdentifier] // deeply cloning element
        };
        updatedFormElement.value = event.target.value;  //appending new value to element
        updatedOrderForm[inputIdentifier] = updatedFormElement; // adding element to orderform
        this.setState({orderForm: updatedOrderForm});   // setting state
    }
    
    
    render (){
        const formElementsArray = [];
        for (let key in this.state.orderForm){
            formElementsArray.push({
                id: key,
                config: this.state.orderForm[key]
            });
        }

        let form = (
            <form>
                {formElementsArray.map(formElement => (
                    <Input key={formElement.id}
                    elementType={formElement.config.elementType} 
                    elementConfig={formElement.config.elementConfig}
                    value={formElement.config.value} 
                    changed={(event) => this.inputChangedHandler(event, formElement.id)}/>
                ))}
                
                <Button btnType="Success" 
                clicked={this.orderHandler}>ORDER</Button>
            </form>
        )

        if(this.state.loading) {
            form = <Spinner />; 
        }

        return (
            <div className={classes.ContactData} >
                <h4>Enter Contact Data</h4>
                {form}
              </div>  

        )
    }
}

export default ContactData;