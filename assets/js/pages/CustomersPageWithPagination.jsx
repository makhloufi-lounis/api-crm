import React, { useEffect, useState } from "react";
import axios from "axios";
import Pagination from "../components/Pagination";

const CustomersPageWithPagination = (props) => {
  const [customers, setCustomers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(true);

  const itemsPerPage = 10;

  useEffect(() => {
    axios
      .get(
        `https://localhost:8002/api/customers?pagination=true&count=${itemsPerPage}&page=${currentPage}`
      )
      .then((response) => {
        setCustomers(response.data["hydra:member"]);
        setTotalItems(response.data["hydra:totalItems"]);
        setLoading(false);
      })
      .catch((error) => console.log(error.response));
  }, [currentPage]);

  const handleDelete = (id) => {
    const selfCustomers = [...customers];

    // 1. L'approche optimiste
    setCustomers(customers.filter((customer) => customer.id !== id));

    // 2. L'aproche pessimiste
    axios
      .delete("https://localhost:8002/api/customers/" + id)
      .then((response) => console.log("customer has been deleted"))
      .catch((error) => {
        setCustomers(selfCustomers);
        console.log(error.response);
      });
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    setLoading(true);
  };

  return (
    <>
      <h1>Liste des clients (pagination)</h1>
      <table className="table table-hover">
        <thead>
          <tr>
            <th>Id.</th>
            <th>Client</th>
            <th>Email</th>
            <th>Entreprise</th>
            <th className="text-center">Factures</th>
            <th className="text-center">Montant total</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {loading && (
            <tr>
              <td>Chargement ...</td>
            </tr>
          )}
          {!loading &&
            customers.map((customer) => (
              <tr key={customer.id}>
                <td>{customer.id}</td>
                <td>
                  <a href="#">
                    {customer.firstName} {customer.lastName}
                  </a>
                </td>
                <td>
                  <a href="mailto:makhloufi.lounis@gmail.com">
                    {customer.email}
                  </a>
                </td>
                <td>{customer.company}</td>
                <td className="text-center">
                  <span className="badge badge-dark">
                    {customer.invoices.length}
                  </span>
                </td>
                <td className="text-center">
                  {customer.totalAmount.toLocaleString()} €
                </td>
                <td>
                  <button
                    onClick={() => handleDelete(customer.id)}
                    disabled={customer.invoices.length > 0}
                    className="btn btn-sm btn-danger"
                  >
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
      <Pagination
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        length={totalItems}
        onPageChange={handlePageChange}
      />
    </>
  );
};

export default CustomersPageWithPagination;
