import React, { Component } from 'react';
import Button from '../../../components/UI/Button/Button';
import classes from './ContactData.css';
import Spinner from '../../../components/UI/Spinner/Spinner';
import axios from '../../../axios-orders';

class ContactData extends Component {
    state = {
        name: '', 
        email: '',
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
                email: 'test@test.com'
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
                <input className={classes.Input} type="text"
                    name="name" placeholder="name" />
                <input className={classes.Input} type="email"
                    name="email" placeholder="email" />
                <input className={classes.Input} type="text"
                    name="street" placeholder="street" />
                <input className={classes.Input} type="text"
                    name="zipcode" placeholder="zipcode" />
                <Button btnType="Success" clicked={this.orderHandler}>ORDER</Button>
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