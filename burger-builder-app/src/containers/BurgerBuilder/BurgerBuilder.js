import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as burgerBuilderActions from '../../store/actions/index';
import Burger from '../../components/Burger/Burger';
import Aux from '../../hoc/Auxiliary';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import axios from '../../axios-orders';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';


class BurgerBuilder extends Component {

    state = {
        purchasing: false,
        loading: false,
        error: false
    }

    componentDidMount() {
        axios.get('https://react-my-burger-ad7a1.firebaseio.com/ingredients.json')
            .then(response => {
                this.setState({ingredients: response.data});
            })
            .catch(error => {
                this.setState({error: true});
            });

        this.regInterceptor = axios.i
    }

    updatePurchaseState = (ingredients) => {
       
        const sum = Object.keys(ingredients)  // create an array of string entries "bacon, cheese,ect"
            .map(igKey => {
                return ingredients[igKey];      // array of values now
            })
            .reduce((sum, el) => {
                return sum + el; 
            }, 0);
        
        return sum > 0;
    }

    purchaseHandler = () => {
        this.setState({purchasing: true});
    }

    cancelPurchaseHandler = () => {
        this.setState({purchasing: false});
    }

    purchaseContinueHandler = () => {

        this.props.history.push('./checkout');
        // this.props.history.push('/checkout');
        
        // const queryParams = []; 
        // for (let i in this.state.ingredients){
        //     queryParams.push(encodeURIComponent(i) + '=' 
        //     + encodeURIComponent(this.state.ingredients[i]));
        // }

        // queryParams.push('price=' + this.props.price);

        // const queryString = queryParams.join('&');
        // this.props.history.push({
        //     pathname: '/checkout',
        //     search: '?' + queryString
        // });


        // this.setState({loading: true});
        
        // const order = {
        //     ingredients: this.state.ingredients,
        //     price: this.state.totalPrice,
        //     customer: {
        //         name: 'Eric',
        //         address: {
        //             street: '1214 Roundelay St',
        //             zipCode: '97123',
        //             country: 'USA'
        //         },
        //         email: 'test@test.com'
        //     },
        //     deliveryMethod: 'fastest'
        // }

        // axios.post('/orders.json', order)
        //     .then(response => {
        //         this.setState({loading: false, purchasing: false});
        //     })
        //     .catch(error => {
        //         this.setState({loading: false, purchasing: false});
        //     });

        
    }

    render(){

        const disabledInfo = {
            ...this.props.ings
        }

        for(let key in disabledInfo){
            disabledInfo[key] = disabledInfo[key] <= 0;
        }

        let orderSummary = null;
        let burger = this.state.error ? <p>Ingredients Cant Load</p> : <Spinner />;
        
        if(this.props.ings){ // non null value to be true
            burger = (
                <Aux>
                    <Burger 
                            ingredients={this.props.ings} />
                    <BuildControls 
                            ingredientAdded={this.props.onIngredientAdded}
                            ingredientRemoved={this.props.onIngredientRemoved}
                            disabled={disabledInfo}
                            price={this.props.price}
                            purchaseable={this.updatePurchaseState(this.props.ings)}
                            ordered={this.purchaseHandler}/>
                </Aux>
            );
        orderSummary = <OrderSummary 
            ingredients={this.props.ings}
            purchaseContinued={this.purchaseContinueHandler}
            purchaseCancled={this.cancelPurchaseHandler}
            price={this.props.price}/>;
        }

        if(this.state.loading){
            orderSummary = <Spinner />;
        }
        
        

        return(
            <Aux>
                <Modal 
                    show={this.state.purchasing} 
                    modalClosed={this.cancelPurchaseHandler}>
                    {orderSummary}
                </Modal>
                {burger}
            </Aux>
            
        );
    }



}

const mapStateToProps = (state) => {
    return {
        ings: state.ingredients,
        price: state.totalPrice
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
        onIngredientAdded: (ingName) => dispatch({ burgerBuilderActions.addIngredient(ingName),
                                                    ingredientName: ingName}),
        onIngredientRemoved: (ingName) => dispatch({type: burgerBuilderActions.REMOVE_INGREDIENT,
                                                    ingredientName: ingName})

    };
}

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(BurgerBuilder, axios));