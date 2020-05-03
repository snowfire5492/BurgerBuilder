import React from 'react';
import {configure, shallow} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import NavigationItems from './NavigationItems';
import Navigationitem from './NavigationItem/NavigationItem';

configure({adapter: new Adapter()})

describe('<Navigation Items />', () => {
    it('should render two <NavigationItems /> elements if not authenticated', () => {
        const wrapper = shallow(<NavigationItems />);

        expect(wrapper.find(NavigationItem)).toHaveLength(2)
    })
})