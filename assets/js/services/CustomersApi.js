import axios from "axios";
import Cache from "./Cache";
import { CUSTOMERS_API} from '../config';

async function findAll() {
  const cachedCustomers = await Cache.get("customers");
  if (cachedCustomers !== null) return cachedCustomers;
  return axios.get(CUSTOMERS_API).then((response) => {
    const customers = response.data["hydra:member"];
    Cache.set("customers", customers);
    return customers;
  });
}

async function deleteCustomer(id) {
  return axios
    .delete(CUSTOMERS_API + "/" + id)
    .then(async (response) => {
      const cachedCustomers = await Cache.get("customers");
      if (cachedCustomers) {
        Cache.set(
          "customers",
          cachedCustomers.filter((customer) => customer.id !== id)
        );
        return response;
      }
    });
}

async function find(id) {
  const cachedCustomer = await Cache.get("customer." + id);
  if(cachedCustomer) return cachedCustomer;
  return axios
    .get(CUSTOMERS_API + "/" + id)
    .then((response) => {
      const customer = response.data;
      Cache.set("customer." + id, customer);
      return customer;
    });
}

function update(id, customer) {
  return axios
    .put(CUSTOMERS_API + "/" + id, customer)
    .then(async (response) => {
      const cachedCustomers = await Cache.get("customers");
      const cachedCustomer = await Cache.get("customer");

      if(cachedCustomer) {
        Cache.set("customer." +id, response.data);
      }

      if (cachedCustomers) {
        // On utilise le + devant id dans (customer.id === +id)
        // pour modifier id si c'est une chaine de caractere en nombre
        const index = cachedCustomers.findIndex(
          (customer) => customer.id === +id
        );
        cachedCustomers[index] = response.data;
        Cache.set("customers", cachedCustomers);
      }
    });
}

function create(customer) {
  return axios
    .post(CUSTOMERS_API, customer)
    .then(async (response) => {
      const cachedCustomers = await Cache.get("customers");
      if (cachedCustomers) {
        Cache.set("customers", [...cachedCustomers, response.data]);
      }
      // A la plasse de tous le traitement de cache on peut utiliser tous simplement
      // la function invalidate pour vider carément le cache
      // Cache.invalidate("customers");
      return response;
    });
}

export default {
  findAll,
  delete: deleteCustomer,
  find,
  update,
  create,
};
