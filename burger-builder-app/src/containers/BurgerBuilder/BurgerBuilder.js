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
        purchasing: false
    }

    componentDidMount() {

        console.log(this.props);

        this.props.onInitIngredients();
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
        if( this.props.isAuthenticated ){
            this.setState({purchasing: true});
        }else{
            this.props.onSetAuthRedirectPath('/checkout');
            this.props.history.push('/auth');
        }

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
        
        let burger = this.props.error ? <p>Ingredients Cant Load</p> : <Spinner />;
        
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
                            isAuth={this.props.isAuthenticated}
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
        ings: state.burgerBuilder.ingredients,
        price: state.burgerBuilder.totalPrice,
        error: state.burgerBuilder.error,
        isAuthenticated: state.auth.token !== null
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
        onIngredientAdded: (ingName) => dispatch( burgerBuilderActions.addIngredient(ingName)),
        onIngredientRemoved: (ingName) => dispatch(burgerBuilderActions.removeIngredient(ingName)),
        onInitIngredients: () => dispatch(burgerBuilderActions.initIngredients()),
        onSetAuthRedirectPath: (path) => dispatch(actions.onSetAuthRedirectPath(path))

    };
}

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(BurgerBuilder, axios));