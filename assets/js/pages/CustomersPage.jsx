import React, { useEffect, useState } from "react";
import Pagination from "../components/Pagination";
import CustomersApi from "../services/CustomersApi";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import TableLoader from "../components/loaders/TableLoader";

const CustomersPage = (props) => {
  const [customers, setCustomers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // Permet d'aller récupérer les customers
  const fetchCustomers = async () => {
    try {
      const data = await CustomersApi.findAll();
      setCustomers(data);
      setLoading(false);
    } catch (error) {
      toast.error("Erreur impossible de charger les clients !");
    }
  };

  // Au chargement du composant, on va chercher les customers
  useEffect(() => {
    fetchCustomers();
  }, []);

  // Gestion de la supprission d'un customer
  const handleDelete = async (id) => {
    const selfCustomers = [...customers];
    setCustomers(customers.filter((customer) => customer.id !== id));

    try {
      await CustomersApi.delete(id);
      toast.success("Le client a bien été supprimer");
    } catch (error) {
      setCustomers(selfCustomers);
      toast.error("Erreur lors de la supprission du client !");
    }
  };

  // Gestion du changement de page
  const handlePageChange = (page) => setCurrentPage(page);

  // Gestion de la recherche (filtrage)
  const handleSearch = (event) => {
    const value = event.currentTarget.value;
    setSearch(value);
    setCurrentPage(1);
  };

  // filtrage des customers en fonction de la recherche
  const filteredCustomers = customers.filter(
    (customer) =>
      customer.firstName.toLowerCase().includes(search.toLowerCase()) ||
      customer.lastName.toLowerCase().includes(search.toLowerCase()) ||
      customer.email.toLowerCase().includes(search.toLowerCase())
  );

  // Pagination des données
  const itemsPerPage = 10;
  const paginatedCustomers = Pagination.getData(
    filteredCustomers,
    currentPage,
    itemsPerPage
  );

  return (
    <>
      <div className="mb-3 d-flex justify-content-between align-items-center">
        <h1>Liste des clients</h1>
        <Link to="/customers/new" className="btn btn-primary">
          {" "}
          Créer un client{" "}
        </Link>
      </div>

      <div className="form-group">
        <input
          className="form-control"
          value={search}
          placeholder="Rechercher ..."
          onChange={handleSearch}
        />
      </div>

      {!loading && (
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
            {paginatedCustomers.map((customer) => (
              <tr key={customer.id}>
                <td>{customer.id}</td>
                <td>
                  <Link to={"/customers/" + customer.id}>
                    {customer.firstName} {customer.lastName}
                  </Link>
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
      )}
      {loading && <TableLoader />}
      {itemsPerPage < filteredCustomers.length && (
        <Pagination
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          length={filteredCustomers.length}
          onPageChange={handlePageChange}
        />
      )}
    </>
  );
};

export default CustomersPage;
