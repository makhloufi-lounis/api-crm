import React, { useState, useContext } from 'react'
import AuthApi from '../services/AuthApi'
import AuthContext from '../Contexts/AuthContext'

// history est une props transmet par le composant react-router-dom (dans notre cas Route)
const LoginPage = ({ history }) => {

    const { setIsAuthenticated } = useContext(AuthContext)

    const [credentials, setCredentials] = useState({
        username: "",
        password: ""
    })

    const [error, setError] = useState("")

    /*const handleChange = event => {
        const value = event.currentTarget.value
        const name = event.currentTarget.name
        setCredentials({...credentials, [name]: value})
    }*/

    // handleChange refactorisé avec destructuration (Gestion des champs)
    const handleChange = ({currentTarget}) => {
        const {value, name} = currentTarget
        setCredentials({...credentials, [name]: value})
    }

    // Gestion de l'envoie du formulaire
    const handleSubmit = async event => {
        event.preventDefault()
        
        //try {
            await AuthApi.authenticate(credentials)
            
            // Rénitialisation des error a vide
            setError("")

            // Mise a jour de la constante isAuthenticated grace a setIsAuthenticated
            setIsAuthenticated(true)

            // Redirection vers la page des customers avec le remplacement de l'url
            history.replace("/customers")

        /*} catch(error) {
            setError("Aucun compte ne possède cette adresse ou alors les informations ne correspondent pas")
        }*/
    }

    return (
        <>
            <h1>Connexion a l'application</h1>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label 
                        htmlFor="username">
                        Adress email
                    </label>
                    <input 
                        type="email" 
                        placeholder="Adresse email de connexion" 
                        name="username"
                        id="username"
                        value={credentials.username}
                        className={"form-control" + (error && " is-invalid") }
                        onChange={event => handleChange(event)}/>
                    { 
                        error && 
                        <p className="invalid-feedback">
                            {error}
                        </p>
                    }
                </div>
                <div className="form-group">
                    <label 
                        htmlFor="password">
                        Mot de passe
                    </label>
                    <input 
                        type="password" 
                        name="password"
                        id="password"
                        value={credentials.password}
                        className="form-control" 
                        onChange={event => handleChange(event)} />
                </div>
                <div className="form-group">
                    <button 
                        type="submit" 
                        className="btn btn-success">
                        Connexion
                    </button>
                </div>
            </form>
        </>
    );
}

export default LoginPage;