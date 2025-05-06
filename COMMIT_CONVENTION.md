# Commit Message Convention

This project follows [Conventional Commits](https://www.conventionalcommits.org/), a specification for adding human and machine-readable meaning to commit messages.

## Format

Each commit message consists of a **header**, a **body**, and a **footer**. The header has a special format that includes a **type**, an optional **scope**, and a **subject**:

```plaintext
<type>(<scope>): <subject>
<BLANK LINE>

<body>
<BLANK LINE>
<footer>
```

The **header** is mandatory, and the **scope** of the header is optional.

### Type

Must be one of the following:

- **feat**: A new feature
- **fix**: A bug fix
- **docs**: Documentation only changes
- **style**: Changes that do not affect the meaning of the code (white-space, formatting, etc)
- **refactor**: A code change that neither fixes a bug nor adds a feature
- **perf**: A code change that improves performance
- **test**: Adding missing tests or correcting existing tests
- **build**: Changes that affect the build system or external dependencies
- **ci**: Changes to our CI configuration files and scripts
- **chore**: Other changes that don't modify src or test files
- **revert**: Reverts a previous commit

### Scope

The scope should be the name of the npm package affected (as perceived by the person reading the changelog generated from commit messages).

### Subject

The subject contains a succinct description of the change:

- use the imperative, present tense: "change" not "changed" nor "changes"
- don't capitalize the first letter
- no dot (.) at the end

### Body

The body should include the motivation for the change and contrast this with previous behavior.

### Footer

The footer should contain any information about **Breaking Changes** and is also the place to reference GitHub issues that this commit **Closes**.

## Examples

```plaintext
feat(helpers): add new PartialType helper

Add a new helper function that creates a type with all properties of the original type set to optional.

Closes #123
```

```plaintext
fix(utils): handle edge case in inheritValidationMetadata

The function was not properly handling cases where the parent class had no validation metadata.

Fixes #456
```

```plaintext
docs(readme): update installation instructions

Update the README with more detailed installation instructions and examples.
```

```plaintext
chore(deps): update dependency typescript to v5.0.4
```

## Commit Message Examples

Here are some examples of valid commit messages:

- `feat: add new PickType helper`
- `fix: handle null values in inheritPropertyInitializers`
- `docs: update README with API documentation`
- `style: format code with prettier`
- `refactor: simplify inheritance logic`
- `test: add tests for OmitType helper`
- `chore: update dependencies`
- `build: configure tsup for bundling`
- `ci: add GitHub Actions workflow`

## How to Commit

You can use the following command to commit your changes:

```bash
git commit -m "type(scope): subject"
```

For example:

```bash
git commit -m "feat(helpers): add new PartialType helper"
```

Or use the interactive commit tool:

```bash
npm run commit
