<?php


namespace App\Doctrine;

use ApiPlatform\Core\Bridge\Doctrine\Orm\Extension\QueryCollectionExtensionInterface;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Extension\QueryItemExtensionInterface;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Util\QueryNameGeneratorInterface;
use App\Entity\Customer;
use App\Entity\Invoice;
use App\Entity\User;
use Doctrine\ORM\QueryBuilder;
use Symfony\Component\Security\Core\Authorization\AuthorizationCheckerInterface;
use Symfony\Component\Security\Core\Security;

class CurrentUserExtension implements QueryCollectionExtensionInterface, QueryItemExtensionInterface
{

    /**
     * @var Security
     */
    private $security;
    /**
     * @var AuthorizationCheckerInterface
     */
    private $auth;

    public function __construct(Security $security, AuthorizationCheckerInterface $checker)
    {
        $this->security = $security;
        $this->auth = $checker;
    }

    /**
     * @param QueryBuilder $queryBuilder
     * @param string $resourceClass
     */
    private function andWhere(QueryBuilder $queryBuilder, string $resourceClass)
    {
        // Get user logged in
        $user = $this->security->getUser();

        // If we ask for invoices or customers then,
        // act on the request so that it takes account of the logged in user
        if ($resourceClass !== User::class && !$this->auth->isGranted('ROLE_ADMIN') && $user instanceof User) {
            // get alias for resource class entity from query builder
            $rootAlias = $queryBuilder->getRootAliases()[0];
            switch ($resourceClass) {
                case Customer::class:
                    $queryBuilder->andWhere("$rootAlias.user = :user");
                    break;
                case Invoice::class:
                    $queryBuilder->join("$rootAlias.customer", "c")
                        ->andWhere("c.user = :user");
                    break;
                default:
                    break;
            }
            $queryBuilder->setParameter("user", $user);
        }
    }
    /**
     * @param QueryBuilder $queryBuilder
     * @param QueryNameGeneratorInterface $queryNameGenerator
     * @param string $resourceClass
     * @param string|null $operationName
     * @return mixed
     */
    public function applyToCollection(
        QueryBuilder $queryBuilder,
        QueryNameGeneratorInterface $queryNameGenerator,
        string $resourceClass,
        string $operationName = null
    ) {
        $this->andWhere($queryBuilder, $resourceClass);
    }

    /**
     * @param QueryBuilder $queryBuilder
     * @param QueryNameGeneratorInterface $queryNameGenerator
     * @param string $resourceClass
     * @param array $identifiers
     * @param string|null $operationName
     * @param array $context
     * @return mixed
     */
    public function applyToItem(
        QueryBuilder $queryBuilder,
        QueryNameGeneratorInterface $queryNameGenerator,
        string $resourceClass,
        array  $identifiers,
        string $operationName = null,
        array $context = []
    ) {
        $this->andWhere($queryBuilder, $resourceClass);
    }
}
