import axios from "axios";
import jwtDecode from "jwt-decode";

/**
 * Déconnexion (suppression du token du localStorage et sur Axios)
 */
function logout() {
  window.localStorage.removeItem("authToken");
  delete axios.defaults.headers["Authorization"];
}

/**
 * Requête Http d'authentification et stockage du token dans le storage et sur Axios
 * @param {Object} credentials
 */
function authenticate(credentials) {
  return axios
    .post("https://127.0.0.1:8002/api/login_check", credentials)
    .then((response) => response.data.token)
    .then((token) => {
      // Stockage du token dons le localStorage
      window.localStorage.setItem("authToken", token);

      // prévention de axios qu'il existe maintenant
      // un header par defaut sur toutes les futures requetes HTTP
      setAxiosToken(token);
    });
}

/**
 * Mise en place lors du chargement de l'application
 */
function setup() {
  // 1. Voir si on a un token ?
  const token = window.localStorage.getItem("authToken");

  // 2. Vérifier si le token est encore valid
  if (token) {
    // Decodage du token jwt
    //const jwtData = jwtDecode(token)
    // Destructuration jwtData.exp
    const { exp: expiration } = jwtDecode(token);

    // Verification de la date d'experation du token ( * 1000 pour convertir les segonde en mili segonde)
    if (expiration * 1000 > new Date().getTime()) {
      // 3. Donner le token a axios (Mise a jour le header Authorization de axios)
      setAxiosToken(token);
      return true;
    }
  }

  return false;
}

/**
 * Positionne le token JWT sur axios
 * @param {string} token
 */
function setAxiosToken(token) {
  axios.defaults.headers["Authorization"] = "Bearer " + token;
}

/**
 * Permet de savoir si on est authentifié ou pas
 * @returns boolean
 */
function isAuthenticated() {
  // 1. Voir si on a un token ?
  const token = window.localStorage.getItem("authToken");

  // 2. Vérifier si le token est encore valid
  if (token) {
    // Decodage du token jwt et destructuration jwtData.exp
    const { exp: expiration } = jwtDecode(token);

    // Verification de la date d'experation du token ( * 1000 pour convertir les segonde en mili segonde)
    if (expiration * 1000 > new Date().getTime()) {
      return true;
    }
  }

  return false;
}

export default {
  authenticate,
  logout,
  setup,
  isAuthenticated,
};
