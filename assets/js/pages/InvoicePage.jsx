import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Field from "../components/forms/Field";
import Select from "../components/forms/Select";
import CustomersApi from "../services/CustomersApi";
import InvoicesApi from "../services/InvoicesApi";
import { toast } from "react-toastify";
import FormContentLoader from "../components/loaders/FormContentLoader";

const InvoicePage = ({ history, match }) => {
  const { id = "new" } = match.params;
  const [invoice, setInvoice] = useState({
    amount: "",
    customer: "",
    status: "SENT",
  });
  const [errors, setErrors] = useState({
    amount: "",
    customer: "",
    status: "",
  });
  const [customers, setCustomers] = useState([]);
  const [editting, setEditting] = useState(false);

  // Gestion des changements des inputs dans le formulaire
  const handleChange = ({ currentTarget }) => {
    const { name, value } = currentTarget;
    setInvoice({ ...invoice, [name]: value });
  };
  const [loading, setLoading] = useState(true);

  // Gestion de la soumission du formulaire
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setErrors({});
      if (editting) {
        await InvoicesApi.update(id, invoice);
        toast.success("La facture a bien été modifiée");
      } else {
        await InvoicesApi.create(invoice);
        toast.success("La facture a bien été enregistrée");
        history.replace("/invoices");
      }
    } catch ({ response }) {
      const { violations } = response.data;
      if (violations) {
        const apiErrors = {};
        violations.map(({ propertyPath, message }) => {
          apiErrors[propertyPath] = message;
        });
        setErrors(apiErrors);
        toast.error("Des erreurs dans votre formulaire !");
      }
    }
  };

  // Récupération d'une facture
  const fetchInvoice = async (id) => {
    try {
      const { amount, status, customer } = await InvoicesApi.find(id);
      setCustomers([customer]);
      setInvoice({ amount, status, customer: customer.id });
      setLoading(false);
    } catch (error) {
      toast.error("Impossible de charger la facture demandée !");
      history.replace("/invoices");
    }
  };

  // Récupération des clients
  const fetchCustomers = async () => {
    try {
      const data = await CustomersApi.findAll();
      setCustomers(data);
      setLoading(false);
      // modifier le customer de l'invoice au chargement si le customer est vide
      if (!invoice.customer) setInvoice({ ...invoice, customer: data[0].id });
    } catch (error) {
      toast.error("Impossible de charger les clients !");
      history.replace("/invoices");
    }
  };

  // Dans le cas d'une modification
  // Récupération de la bonne facture quand l'identifiant de l'url change
  useEffect(() => {
    if (id !== "new") {
      setEditting(true);
      fetchInvoice(id);
    }
  }, [id]);

  // Dans le cas d'une création d'une nouvelle facture
  // Récupération de la liste des clients a chaque chargement du composant
  useEffect(() => {
    if (id === "new") {
      fetchCustomers();
    }
  }, []);

  return (
    <>
      {(!editting && <h1>Création d'une facture</h1>) || (
        <h1>Modification d'une facture</h1>
      )}
      {loading && <FormContentLoader />}
      {!loading && (
        <form onSubmit={handleSubmit}>
          <Field
            name="amount"
            type="number"
            placeholder="Montant de la facture"
            label="Montant"
            value={invoice.amount}
            onChange={handleChange}
            error={errors.amount}
          />

          <Select
            name="customer"
            label="Client"
            value={invoice.customer}
            onChange={handleChange}
            error={errors.customer}
          >
            {customers.map((customer) => (
              <option key={customer.id} value={customer.id}>
                {customer.firstName} {customer.lastName}
              </option>
            ))}
          </Select>

          <Select
            name="status"
            label="Statut"
            value={invoice.status}
            onChange={handleChange}
            error={errors.status}
          >
            <option value="SENT">Envoyée</option>
            <option value="PAID">Payée</option>
            <option value="CANCELLED">Annulée</option>
          </Select>

          <div className="form-group">
            <button type="submit" className="btn btn-success">
              Enregistrer
            </button>
            <Link to="/invoices" className="btn btn-link">
              Retour aux factures
            </Link>
          </div>
        </form>
      )}
    </>
  );
};

export default InvoicePage;
