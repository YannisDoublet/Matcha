import React from 'react'
import ReactDOM from 'react-dom'
import {BrowserRouter} from 'react-router-dom'
import {createStore, applyMiddleware} from 'redux'
import {Provider} from 'react-redux'
import promiseMiddleware from 'redux-promise'
import ReduxThunk from 'redux-thunk'
import './CSS/normalize.css'
import './CSS/global.css'

import Routes from './routes'
import Reducers from './reducers'

const createStoreWithMiddleware = applyMiddleware(promiseMiddleware, ReduxThunk)(createStore);

ReactDOM.render(<Provider store={createStoreWithMiddleware(Reducers)}>
    <BrowserRouter>
        <Routes />
    </BrowserRouter>
</Provider>, document.getElementById('root'));
