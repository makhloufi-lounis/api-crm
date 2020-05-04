<?php


namespace App\Controller;

use App\Entity\Invoice;
use Doctrine\Common\Persistence\ObjectManager;
use Doctrine\Persistence\ManagerRegistry;
use Symfony\Component\Routing\Annotation\Route;

class InvoiceIncrementationController
{

    /**
     * @var ManagerRegistry
     */
    private $entityManager;

    /**
     * InvoiceIncrementationController constructor.
     * @param ManagerRegistry $entityManager
     */
    public function __construct(ManagerRegistry $entityManager)
    {
        $this->entityManager = $entityManager;
    }

    /**
     * @param Invoice $data
     */
    public function __invoke(Invoice $data): Invoice
    {
        $data->setChrono($data->getChrono() + 1);
        $this->entityManager->getManager()->flush();
        return $data;
    }
}
