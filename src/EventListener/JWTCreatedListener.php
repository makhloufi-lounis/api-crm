<?php


namespace App\EventListener;

use App\Entity\User;
use Lexik\Bundle\JWTAuthenticationBundle\Event\JWTCreatedEvent;
use Symfony\Component\HttpFoundation\RequestStack;

class JWTCreatedListener
{

    /**
     * @var RequestStack
     */
    private $requestStack;

    /**
     * @param RequestStack $requestStack
     */
    public function __construct(RequestStack $requestStack)
    {
        $this->requestStack = $requestStack;
    }

    /**
     * @param JWTCreatedEvent $event
     *
     * @return void
     */
    public function onJWTCreated(JWTCreatedEvent $event)
    {
        // Get current request
        $request = $this->requestStack->getCurrentRequest();

        // Grab user currently logged in ( to have his firstName and lastName )
        /** @var User $user **/
        $user = $event->getUser();

        // Get array data payload
        $payload = $event->getData();
        // Enrich the payload so that it contains this data
        $payload['firstName'] = $user->getFirstName();
        $payload['lastName'] = $user->getLastName();
        // Update event data
        $event->setData($payload);

        $header = $event->getHeader();
        $header['cty'] = 'JWT';

        $event->setHeader($header);
    }

}
