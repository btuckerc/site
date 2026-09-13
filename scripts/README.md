# Public content maintenance

`npm run stats:about` retains its historical name for local compatibility. It now validates the reviewed About fields and public project selection. It does not collect statistics, read local application state, call authenticated APIs, or rewrite content. `node scripts/update-github-stats.js` uses the same validator.

Update `data/about.json` and `data/projects.json` deliberately. Keep internal project inventory, private repository details, employment context not approved for publication, operational notes, identifiers, credentials, and token/runtime metrics outside the site source and build inputs. Review prose as well as fields; the validator is a structural guard, not an editorial review.

Before deployment, run lint, tests relevant to changed behavior, and the production build; inspect all exported HTML, JSON and JavaScript. Confirm public links and initial route metadata. Deployment requires the owner's approval of the specific output.
