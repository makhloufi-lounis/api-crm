<?php


namespace App\EventListener;

use App\Entity\Invoice;
use Symfony\Component\HttpKernel\Event\ViewEvent;

class InvoiceSentDateListener
{

    /**
     * @param ViewEvent $event
     */
    public function __invoke(ViewEvent $event)
    {
        $result = $event->getControllerResult();
        $method = $event->getRequest()->getMethod();
        if ($result instanceof Invoice && $method === 'POST') {
            if (empty($result->getSentAt())) {
                $result->setSentAt(new \DateTime());
            }
        }
    }
}
