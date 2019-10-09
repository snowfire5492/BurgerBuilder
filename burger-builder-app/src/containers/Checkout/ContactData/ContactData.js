import React, { Component } from 'react';
import Button from '../../../components/UI/Button/Button';
import classes from './ContactData.css';
import Spinner from '../../../components/UI/Spinner/Spinner';
import axios from '../../../axios-orders';
import Input from '../../../components/UI/Input/Input';

class ContactData extends Component {
    state = {
        name: '', 
        email: '',
        price: '',
        address: {
            street: '',
            zipcode: '',
            country: ''
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
    
    
    render (){

        let form = (
            <form>
                <Input inputtype="input" type="text" 
                    name="name" placeholder="name"/>
                <Input inputtype="input" type="email" 
                    name="email" placeholder="email" />
                <Input inputtype="input" type="text" 
                    name="street" placeholder="street"  />
                <Input inputtype="input" type="text" 
                    name="postal" placeholder="postal"  />
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