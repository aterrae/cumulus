import React from 'react';
import { Route, IndexRoute } from 'react-router';

import myFirstContainer from './containers/myFirstContainer';

export default function getRoutes(store) {
    return (
        <Route path="/">
            <IndexRoute component={myFirstContainer} />
            <Route path="path" component={myFirstContainer} />
        </Route>
    )
}
