# Momentum

Momentum est un projet pour apprendre Angular : la page Home explique l’idée et permet de choisir les catégories de citations et le thème Light ou Dark.
La page Quotes affiche une citation, sa catégorie et la date, avec une flèche pour passer à la suivante parmi les catégories choisies.

## Step 1 — Learning Angular

- Un composant contient une partie de l’interface, avec une classe TypeScript pour son comportement, du HTML pour l’affichage et du SCSS pour le style.
- Le layout est la structure autour des pages. On a séparé la sidebar dans `core/layout` parce qu’elle appartient à toute l’application. Ce dossier est notre choix d’organisation, pas une obligation Angular.
- Les routes relient une URL à une page : `/home` affiche Home et `/quote` affiche Quotes. Le contenu change dans `router-outlet`, mais la sidebar reste parce qu’elle est en dehors.
- Un service regroupe une logique utilisée à plusieurs endroits. Notre service `Preferences` gère les catégories sélectionnées, le thème et leur sauvegarde.
- `@Injectable({ providedIn: 'root' })` permet à Angular de fournir une même instance du service dans l’application. Avec `inject(Preferences)`, Home et Quotes accèdent à ce même objet, on n’injecte pas un fichier.
- Les signals gardent les valeurs actuelles en mémoire et permettent à Angular de réagir quand elles changent. Home modifie les catégories dans le service et Quotes les lit pour choisir une citation.
- `localStorage` garde les choix dans le navigateur après sa fermeture. À la prochaine visite, le constructeur du service les récupère, sinon il utilise Light et Discipline par défaut. Ce stockage est indépendant des cookies et ne se partage pas entre appareils.
- `src` contient le code qu’on modifie. `npm run build` génère `dist/momentum` avec les fichiers prêts à être hébergés : ce n’est pas un historique et on ne le modifie pas à la main.

## Run locally

Use Node 24.19.0 (recorded in `.nvmrc`) and npm 11.17.0. With NVM installed:

```bash
# If nvm is not already available in your shell:
source "$HOME/.nvm/nvm.sh"
nvm install
nvm use
npm ci
npm start
```

Open http://localhost:4200. Edit `src/app/app.html` to see the page update. Stop the server with Ctrl+C.

```bash
npm run build           # Optimized production files in dist/momentum/browser
npm test -- --watch=false # Run the tests once
```

The development server rebuilds on edits and supports live updates. The production build creates static browser assets for later Nginx deployment; it does not start a server.

## Step 2 — Quality commands and local hooks

Le lint vérifie les règles TypeScript et Angular, Prettier s’occupe de la présentation du code, et les tests vérifient le comportement. On utilise les tests Vitest déjà intégrés à Angular.

| Commande               | Rôle                                                                                                                                        |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| `npm run lint`         | Vérifie TypeScript et les templates Angular, y compris les règles d’accessibilité. Une erreur ou un avertissement fait échouer la commande. |
| `npm run format`       | Formate les fichiers du projet avec Prettier.                                                                                               |
| `npm run format:check` | Vérifie le format sans modifier les fichiers.                                                                                               |
| `npm test`             | Lance les tests en mode interactif.                                                                                                         |
| `npm run test:ci`      | Lance les tests une seule fois et retourne un code d’échec si un test échoue.                                                               |
| `npm run build`        | Génère les fichiers de production.                                                                                                          |

ESLint utilise les règles recommandées, sans imposer de format qui entre en conflit avec Prettier. Les blocs `catch` vides sont autorisés pour que les préférences restent utilisables si le stockage du navigateur est indisponible.

`npm ci` lance aussi `prepare`, qui installe le hook Husky. Avant un commit, Husky appelle lint-staged : les fichiers TypeScript et HTML de `src` passent par ESLint puis Prettier, et les autres fichiers texte configurés passent par Prettier. Les corrections sont ajoutées au contenu préparé pour le commit ; les changements non préparés restent séparés. Une erreur non corrigée bloque le commit. Les tests complets et le build ne sont pas lancés dans ce hook.

Utiliser la version Node de `.nvmrc` avant de committer, avec `nvm use`. Git doit pouvoir trouver Node et npm, y compris quand le commit est lancé depuis un éditeur.

Les hooks aident en local mais ne remplacent pas Jenkins. Dans la CI, on peut désactiver leur installation, puis lancer les vérifications séparément :

```bash
HUSKY=0 npm ci
npm run lint
npm run format:check
npm run test:ci
npm run build
```

Les dépendances, fichiers générés, caches, rapports de couverture et le `plan.md` local sont exclus du formatage. Le lockfile reste géré par npm.
