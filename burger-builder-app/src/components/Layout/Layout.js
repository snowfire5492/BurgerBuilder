import React from 'react';
import Aux from '../../hoc/Auxiliary';

const layout = (props) => ( // essentially a return statement
    <Aux>
        <div>Toolbar, SideDrawer, BackDrop</div>
        <main>
            {props.children}
        </main>
    </Aux>
)

export default layout;