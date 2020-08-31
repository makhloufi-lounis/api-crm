import React from "react";
import axios from "axios";

function findAll() {
  return axios
    .get("https://localhost:8002/api/customers")
    .then((response) => response.data["hydra:member"]);
}

function deleteCustomer(id) {
  return axios.delete("https://localhost:8002/api/customers/" + id);
}

function find(id) {
  return axios
    .get("https://127.0.0.1:8002/api/customers/" + id)
    .then((response) => response.data);
}

function update(id, customer) {
  return axios.put("https://127.0.0.1:8002/api/customers/" + id, customer);
}

function create(customer) {
  return axios.post("https://127.0.0.1:8002/api/customers", customer);
}

export default {
  findAll,
  delete: deleteCustomer,
  find,
  update,
  create,
};
