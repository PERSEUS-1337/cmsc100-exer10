import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';

// import Home from './components/Home';
// import About from './components/About';
// import Contact from './components/Contact';
import Login from './login'

function App() {
  return (
    <BrowserRouter>
        <Route exact path="/" component={Login} />
        {/* <Route path="/about" component={About} />
        <Route path="/contact" component={Contact} /> */}
    </BrowserRouter>
  );
}

export default App;
