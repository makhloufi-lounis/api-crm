import React from 'react'
import axios from 'axios'

function findAll() {
    return axios
    .get("https://localhost:8002/api/customers")
    .then(response => response.data['hydra:member'])
}

function deleteCustomer(id) {
    return  axios.delete("https://localhost:8002/api/customers/" + id)
}

export default {
    findAll,
    delete: deleteCustomer
}