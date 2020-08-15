//On importe les import important
import React, { useState, useContext } from 'react'
import ReactDom from 'react-dom'
/*
 * Welcome to your app's main JavaScript file!
 *
 * We recommend including the built version of this JavaScript file
 * (and its CSS file) in your base layout (base.html.twig).
 */

// any CSS you import will output into a single css file (app.css in this case)
import '../css/app.css';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import { HashRouter, Switch, Route, withRouter } from "react-router-dom"
import CustomersPage from './pages/CustomersPage';
import CustomersPageWithPagination from './pages/CustomersPageWithPagination';
import InvoicesPage from './pages/InvoicesPage';
import LoginPage from './pages/LoginPage';
import AuthApi from './services/AuthApi';
import AuthContext from './Contexts/AuthContext'
import PrivateRoute from './components/PrivateRoute'

// Need jQuery? Install it with "yarn add jquery", then uncomment to import it.
// import $ from 'jquery';

console.log('Hello Webpack Encore! Edit me in assets/js/app.js');

AuthApi.setup()

const App = () => {

    // Il faudrait par défaut qu'on demande a notre AuthApi si on est connecté ou non 
    // on utilisant la fonction isAuthenticated
    const [isAuthenticated, setIsAuthenticated] = useState(
        AuthApi.isAuthenticated()
    )

    // cette instruction permet d'ajouter toute les props de Router de react-router-dom a notre composant Navbar
    // ce qui donne un nouveau composant qui possede toute les props de Router et qu'on vas utiliser a la place de Navbar
    const NavbarWithRouter = withRouter(Navbar)

    return (
        <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
            <HashRouter>
                {/* Utilisation de NavbarWithRouter a la place de Navbar pour avoir la props history */}
                <NavbarWithRouter />
                <main className="container pt-5">
                    <Switch>
                        <Route path="/login" component={LoginPage}/>
                        <PrivateRoute path="/invoices" component={InvoicesPage} />
                        <PrivateRoute path="/customers" component={CustomersPage} />
                        <Route path="/" component={HomePage} />                    
                    </Switch>
                </main>
            </HashRouter>
        </AuthContext.Provider>
    )
    
}

const rootElement = document.querySelector("#app")
ReactDom.render(<App />, rootElement)
