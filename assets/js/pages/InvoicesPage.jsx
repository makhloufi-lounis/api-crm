import moment from 'moment'
import React, { useEffect, useState } from 'react'
import Pagination from '../components/Pagination'
import InvoicesApi from '../services/InvoicesApi'


const STATUS_CLASSES = {
    PAID: "success",
    SENT: "info",
    CANCELLED: "danger"
}

const STATUS_LABELS = {
    PAID: "Payée",
    SENT: "Envoyer",
    CANCELLED: "Annulée"
}

const InvoicesPage = () => {
    
    const [invoices, setInvoices] = useState([])
    const [currentPage, setCurrentPage] = useState(1)
    const [search, setSearch] = useState("")

    // Permet d'aller récupérer les invoices
    const fetchInvoices = async () => {
        try {
            const data = await InvoicesApi.findAll()
            setInvoices(data)
        } catch(error) {
            console.log(error.response)
        }
    }

    // Au chargement du composant, on va chercher les invoices
    useEffect(() => {
        fetchInvoices()
    }, [])

    // Gestion de la supprission d'une facture
    const handleDelete = async id => {

        const selfInvoices = [...invoices]
        setInvoices(invoices.filter(invoice => invoice.id !== id))

        try {
            await InvoicesApi.delete(id)
            .then(response => console.log("invoice has been deleted"))
        } catch(error){
            setInvoices(selfInvoices)
            console.log(error.response)
        }
        
    }

    // Permet de formater la date
    const formatDate = (str) => {
        return moment(str).format('DD/MM/YYYY')
    }
    
    // Gestion du changement de page
    const handlePageChange = page => setCurrentPage(page)

    // Gestion de la recherche (filtrage)
    const handleSearch = event => {
        const value = event.currentTarget.value
        setSearch(value)
        setCurrentPage(1)
    }

    // filtrage des invoices en fonction de la recherche
    const filteredCustomers = invoices.filter(
        invoice => 
        invoice.customer.firstName.toLowerCase().includes(search.toLowerCase())
        ||
        invoice.customer.lastName.toLowerCase().includes(search.toLowerCase())
        ||
        STATUS_LABELS[invoice.status].toLowerCase().includes(search.toLowerCase())
        ||
        invoice.amount.toString().startsWith(search.toLowerCase())
    )


    // Pagination des données
    const itemsPerPage = 10;
    const paginatedInvoices = Pagination.getData(
        invoices, 
        currentPage, 
        itemsPerPage
    )

    return ( 
        <>
            <h1> Liste des factures </h1>
            
            <div className="form-group">
                <input className="form-control" value={search} placeholder="Rechercher ..." onChange={handleSearch} />
            </div>

            <table className="table table-hover">
                <thead>
                    <tr>
                        <th>Numero</th>
                        <th>Client</th>
                        <th className="text-center">Date d'envoi</th>
                        <th className="text-center">Statut</th>
                        <th className="text-center">Montant</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                     { filteredCustomers.map(invoice => (
                                <tr key={invoice.id}>
                                
                                    <td>{invoice.chrono}</td>
                                    <td>
                                        <a href="#">{invoice.customer.firstName} {invoice.customer.lastname}</a>
                                    </td>
                                    <td className="text-center">{formatDate(invoice.sentAt)}</td>
                                    <td>
                                        <span className={"badge badge-" + STATUS_CLASSES[invoice.status] + " text-center"}>{STATUS_LABELS[invoice.status]}</span>
                                    </td>
                                    <td className="text-center">{invoice.amount.toLocaleString()} €</td>
                                    <td>
                                        <button className="btn btn-sm btn-primary mr-1">Editer</button>
                                        <button 
                                            onClick={() => handleDelete(invoice.id)}
                                            className="btn btn-sm btn-danger">
                                                Supprimer
                                        </button>
                                    </td>
                                    
                                </tr>
                            )
                        )
                    }  
                </tbody>
            </table>
            <Pagination  
                currentPage={currentPage}
                itemsPerPage={itemsPerPage}
                length={filteredCustomers.length}
                onPageChange ={handlePageChange} />
        </>
     );
}
 
export default InvoicesPage;