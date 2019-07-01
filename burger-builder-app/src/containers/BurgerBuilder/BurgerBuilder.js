import React, { Component } from 'react';
import Burger from '../../components/Burger/Burger';
import Aux from '../../hoc/Auxiliary';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';

const INGREDIENTS_PRICES = {
    salad: 0.5, 
    cheese: 0.4,
    meat: 1.3, 
    bacon: 0.7
}


class BurgerBuilder extends Component {

    state = {
        ingredients: {
            salad: 0,
            bacon: 0,
            cheese: 0,
            meat: 0
        },
        totalPrice: 4,
        purchaseable: false
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

    render(){

        const disabledInfo = {
            ...this.state.ingredients
        }

        for(let key in disabledInfo){
            disabledInfo[key] = disabledInfo[key] <= 0;
        }

        return(
            <Aux>
                <Burger 
                    ingredients={this.state.ingredients} />
                <BuildControls 
                    ingredientAdded={this.addIngredientHandler}
                    ingredientRemoved={this.removeIngredientHandler}
                    disabled={disabledInfo}
                    price={this.state.totalPrice}
                    purchaseable={this.state.purchaseable}/>
            </Aux>
            
        );
    }



}

export default BurgerBuilder;