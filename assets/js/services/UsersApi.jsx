import axios from 'axios'

function create(user) {
    return axios.post("https://127.0.0.1:8002/api/users", user);
}

export default {
    create
}