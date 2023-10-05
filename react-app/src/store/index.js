import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import session from './session'
import marketsReducer from './markets'
import watchlistsReducer from './watchlists';
import portfolioReducer from './portfolio';
import newsReducer from './news';

const rootReducer = combineReducers({
  session,
  markets: marketsReducer,
  watchlists: watchlistsReducer,
  portfolio: portfolioReducer,
  news: newsReducer
});


let enhancer;

if (process.env.NODE_ENV === 'production') {
  enhancer = applyMiddleware(thunk);
} else {
  const logger = require('redux-logger').default;
  const composeEnhancers =
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  enhancer = composeEnhancers(applyMiddleware(thunk, logger));
}

const configureStore = (preloadedState) => {
  return createStore(rootReducer, preloadedState, enhancer);
};

export default configureStore;
