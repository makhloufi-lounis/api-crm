import React, { useState, useContext } from "react";
import AuthApi from "../services/AuthApi";
import AuthContext from "../Contexts/AuthContext";
import Field from "../components/forms/Field";
import { toast } from "react-toastify";

// history est une props transmet par le composant react-router-dom (dans notre cas Route)
const LoginPage = ({ history }) => {
  const { setIsAuthenticated } = useContext(AuthContext);

  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });

  const [error, setError] = useState("");

  /*const handleChange = event => {
        const value = event.currentTarget.value
        const name = event.currentTarget.name
        setCredentials({...credentials, [name]: value})
    }*/

  // handleChange refactorisé avec destructuration (Gestion des champs)
  const handleChange = ({ currentTarget }) => {
    const { value, name } = currentTarget;
    setCredentials({ ...credentials, [name]: value });
  };

  // Gestion de l'envoie du formulaire
  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      await AuthApi.authenticate(credentials);

      // Rénitialisation des error a vide
      setError("");

      // Mise a jour de la constante isAuthenticated grace a setIsAuthenticated
      setIsAuthenticated(true);

      toast.success("Vous êtes désormais connecté");

      // Redirection vers la page des customers avec le remplacement de l'url
      history.replace("/customers");
    } catch (error) {
      setError(
        "Aucun compte ne possède cette adresse ou alors les informations ne correspondent pas"
      );
      toast.error("Une erreur est survenue lors de la connexion !");
    }
  };

  return (
    <>
      <h1>Connexion a l'application</h1>
      <form onSubmit={handleSubmit}>
        <Field
          name="username"
          type="email"
          label="Adress email"
          value={credentials.username}
          onChange={(event) => handleChange(event)}
          placeholder="Adresse email de connexion"
          error={error}
        />
        <Field
          name="password"
          type="password"
          label="Mot de passe"
          value={credentials.password}
          onChange={(event) => handleChange(event)}
        />
        <div className="form-group">
          <button type="submit" className="btn btn-success">
            Connexion
          </button>
        </div>
      </form>
    </>
  );
};

export default LoginPage;
