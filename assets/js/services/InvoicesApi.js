import axios from "axios";
import Cache from "./Cache";
import { INVOICES_API } from "../config";

async function findAll() {
  const cachedInvoices = await Cache.get("invoices");
  if (cachedInvoices !== null) return cachedInvoices;
  return axios
    .get(INVOICES_API)
    .then((response) => {
      const invoices = response.data["hydra:member"];
      Cache.set("invoices", invoices);
      return invoices;
    });
}

function deleteInvoice(id) {
  return axios.delete(INVOICES_API + "/" + id)
  .then(async response => {
    const cachedInvoices = await Cache.get("invoices");
    if(cachedInvoices){
      Cache.invalidate("invoices")
    }
    return response;
  })
}

async function find(id) {
  const cachedInvoice = await Cache.get("invoice." + id);
  if(cachedInvoice) return cachedInvoice;
  return axios
    .get(INVOICES_API + "/" + id)
    .then((response) => {
      const invoice = response.data;
      Cache.set("invoice." + id, invoice);
      return invoice;
    });
}

function update(id, invoice) {
  return axios.put(INVOICES_API + "/" + id, {
    ...invoice,
    customer: `/api/customers/${invoice.customer}`,
  }).then(async response => {
    const cachedInvoices = await Cache.get("invoices");
    if(cachedInvoices){
      Cache.invalidate("invoices")
    }
    return response;
  })
}

function create(invoice) {
  return axios.post(INVOICES_API, {
    ...invoice,
    customer: `/api/customers/${invoice.customer}`,
  }).then(async response => {
    const cachedInvoices = await Cache.get("invoices");
    if(cachedInvoices){
      Cache.invalidate("invoices")
    }
    return response;
  })
}

export default {
  findAll,
  delete: deleteInvoice,
  find,
  update,
  create,
};
