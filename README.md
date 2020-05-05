# api-crm 
## Le CRM pour Freelances et Entrepreneurs

Un CRM (Customer Relationship Management - Gestion de la Relation au Client). une api permettra aux utilisateurs de gérer leurs clients et leurs factures !

## Contribution à ce projet :

1. Duplication du projet (Fork).
```gitexclude
$ git clone https://github.com/makhloufi-lounis/api-crm.git (1)
```
2. Création d’une branche thématique à partir de la branche master,
```gitexclude
$ cd api-crm
$ git checkout -b slow-api-crm (2)
$ sed -i 's/1000/3000/' api-crm.ino (3)
```
3. Validation de quelques améliorations (commit),
```gitexclude
$ git diff --word-diff (4)
$ git commit -a -m 'commit message' (5)
```
4. Poussée de la branche thématique sur votre projet GitHub (push),
```gitexclude
git push origin slow-api-crm (6)
```
5. Ouverture d’une requête de tirage sur GitHub (Pull Request),
```gitexclude
https://github.com/<utilisateur>/<projet>/branches pour trouver votre branche et ouvrir une requête de tirage à partir de là.
```
6. Discussion et éventuellement possibilité de nouvelles validations (commit).

7. Fusionne (merge) ou ferme (close) la requête de tirage.

8. Synchronisation de la branche master mise à jour avec celle de votre propre dépôt.

