import React from 'react';
import classes from './NavigationItems.css';
import NavigationItem from './NavigationItem/NavigationItem';

const navigationItems = (props) => (
    <ul className={classes.navigationItems}>
        <NavigationItem link="/">BurgerBuilder</NavigationItem>
        <NavigationItem link="/orders">Orders</NavigationItem>
        {!props.isAuthenicated ? 
            <NavigationItem link="/auth">Authenticate</NavigationItem> :
            <NavigationItem link="/logout">Logout</NavigationItem>}
    </ul>
)

export default navigationItems;