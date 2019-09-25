import React, { Component } from 'react';
import Button from '../../../components/UI/Button/Button';
import classes from './ContactData.css';

class ContactData extends Component {
    state = {
        name: '', 
        email: '',
        address: {
            street: '',
            zipcode: ''
        }
    }
    
    
    render (){
        return (
            <div className={classes.ContactData} />
                <h4>Enter Contact Data</h4>
                <form>
                    <input className={classes.Input} type="text"
                        name="name" placeholder="name" />
                    <input className={classes.Input} type="email"
                        name="email" placeholder="email" />
                    <input className={classes.Input} type="text"
                        name="street" placeholder="street" />
                    <input className={classes.Input} type="text"
                        name="zipcode" placeholder="zipcode" />
                    <Button btnType="Danger">CANCEL</Button>
                    <Button btnType="Success">ORDER</Button>
                </form>

        )
    }
}

export default ContactData;