<?php


namespace App\EventListener;

use App\Entity\User;
use Symfony\Component\HttpKernel\Event\ViewEvent;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;

class PasswordEncoderListener
{

    /**
     * @var UserPasswordEncoderInterface
     */
    private $encoder;

    public function __construct(UserPasswordEncoderInterface $encoder)
    {
        $this->encoder = $encoder;
    }

    public function onKernelView(ViewEvent $event)
    {
        $result = $event->getControllerResult();
        $method = $event->getRequest()->getMethod(); //POST, GET, PUT, ...
        if ($result instanceof User && $method === 'POST') {
            $hash = $this->encoder->encodePassword($result, $result->getPassword());
            $result->setPassword($hash);
        }
    }
}
