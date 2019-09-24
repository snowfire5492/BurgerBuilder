import React, { Component } from 'react';
import Burger from '../../components/Burger/Burger';
import Aux from '../../hoc/Auxiliary';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import axios from '../../axios-orders';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
const INGREDIENTS_PRICES = {
    salad: 0.5, 
    cheese: 0.4,
    meat: 1.3, 
    bacon: 0.7
}


class BurgerBuilder extends Component {

    state = {
        ingredients: null,
        totalPrice: 4,
        purchaseable: false,
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


    addIngredientHandler = (type) => {
        const oldCount = this.state.ingredients[type];
        const updatedCount = oldCount + 1;
        const updatedIngredients = {
            ...this.state.ingredients
        };
        updatedIngredients[type] = updatedCount;
        const originalPrice = this.state.totalPrice;
        const addedPrice = INGREDIENTS_PRICES[type];
        const updatedPrice = originalPrice + addedPrice;
        this.setState({
            ingredients: updatedIngredients,
            totalPrice: updatedPrice
        });
        this.updatePurchaseState(updatedIngredients);

    }

    removeIngredientHandler = (type) => {
        const oldCount = this.state.ingredients[type];
        const updatedCount = oldCount - 1;
        const updatedIngredients = {
            ...this.state.ingredients
        };
        updatedIngredients[type] = updatedCount;
        const originalPrice = this.state.totalPrice;
        const subPrice = INGREDIENTS_PRICES[type];
        const updatedPrice = originalPrice - subPrice;
        this.setState({
            ingredients: updatedIngredients,
            totalPrice: updatedPrice
        });
        this.updatePurchaseState(updatedIngredients);
    }

    updatePurchaseState = (ingredients) => {
       
        const sum = Object.keys(ingredients)  // create an array of string entries "bacon, cheese,ect"
            .map(igKey => {
                return ingredients[igKey];      // array of values now
            })
            .reduce((sum, el) => {
                return sum + el; 
            }, 0);
        
        this.setState({purchaseable: sum > 0});
    }

    purchaseHandler = () => {
        this.setState({purchasing: true});
    }

    cancelPurchaseHandler = () => {
        this.setState({purchasing: false});
    }

    purchaseContinueHandler = () => {
        this.props.history.push('/checkout');
        
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
            ...this.state.ingredients
        }

        for(let key in disabledInfo){
            disabledInfo[key] = disabledInfo[key] <= 0;
        }

        let orderSummary = null;
        let burger = this.state.error ? <p>Ingredients Cant Load</p> : <Spinner />;
        
        if(this.state.ingredients){ // non null value to be true
            burger = (
                <Aux>
                    <Burger 
                            ingredients={this.state.ingredients} />
                    <BuildControls 
                            ingredientAdded={this.addIngredientHandler}
                            ingredientRemoved={this.removeIngredientHandler}
                            disabled={disabledInfo}
                            price={this.state.totalPrice}
                            purchaseable={this.state.purchaseable}
                            ordered={this.purchaseHandler}/>
                </Aux>
            );
        orderSummary = <OrderSummary 
            ingredients={this.state.ingredients}
            purchaseContinued={this.purchaseContinueHandler}
            purchaseCancled={this.cancelPurchaseHandler}
            price={this.state.totalPrice}/>;
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

export default withErrorHandler(BurgerBuilder, axios);