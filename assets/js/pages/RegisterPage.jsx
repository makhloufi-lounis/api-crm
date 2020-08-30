import React, { useState } from "react";
import Field from "../components/forms/Field";
import { Link } from "react-router-dom";
import axios from "axios";
import UsersApi from "../services/UsersApi";

const RegisterPgae = ({ history }) => {

  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    passwordConfirm: "",
  });

  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    passwordConfirm: "",
  });

  // Gestion des changements des inputs dans le formulaire
  const handleChange = ({ currentTarget }) => {
    const { name, value } = currentTarget;
    setUser({ ...user, [name]: value });
  };

  // Gestion de la soumission du formulaire
  const handleSubmit = async (event) => {
    event.preventDefault();

    const apiErrors = {};
    if (user.password !== user.passwordConfirm) {
        apiErrors.passwordConfirm = "Votre confirmation de mot de passe n'est pas valide";
        setErrors(apiErrors);
        return;
    }

    try {
      await UsersApi.create(user);
        setErrors({});
        // TODO : Flash success
        history.replace("/login");
    } catch ({response}) {
      console.log(error.response);
      const { violations } = response.data;
      if (violations) {
        violations.map((violation) => {
          apiErrors[violation.propertyPath] = violation.message;
        });
        setErrors(apiErrors);
         // TODO : Flash erreurs
      }
    }
  };

  return (
    <>
      <h1>Formulaire d'inscription</h1>
      <form onSubmit={handleSubmit}>
        <Field
          name="firstName"
          label="Prénom"
          placeholder="Votre prénom"
          value={user.firstName}
          onChange={handleChange}
          error={errors.firstName}
        />

        <Field
          name="lastName"
          label="Nom"
          placeholder="Votre Nom"
          value={user.lastName}
          onChange={handleChange}
          error={errors.lastName}
        />

        <Field
          name="email"
          type="email"
          label="Adresse émail"
          placeholder="Votre adresse émail"
          value={user.email}
          onChange={handleChange}
          error={errors.email}
        />

        <Field
          name="password"
          type="password"
          label="Mot de passe"
          placeholder="Votre mot de passe"
          value={user.password}
          onChange={handleChange}
          error={errors.password}
        />

        <Field
          name="passwordConfirm"
          type="password"
          label="Confirmation de mot de passe"
          placeholder="Confirmation de mot de passe"
          value={user.passwordConfirm}
          onChange={handleChange}
          error={errors.passwordConfirm}
        />

        <div className="form-group">
          <button type="submit" className="btn btn-success">
            Confirmation
          </button>
          <Link to="/login" className="btn btn-link">
            J'ai déjà un compte
          </Link>
        </div>
      </form>
    </>
  );
};

export default RegisterPgae;
