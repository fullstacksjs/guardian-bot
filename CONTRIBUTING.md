# Contributing

## Branch Organization

We will keep the `master` branch with test passing at all times,

If you send a pull request, please do it against the `staging` branch, We will squash-merge all the changes.

## Contribution Prerequisites

* Yarn v1.20+
* Git
* Dokcer

## Development Workflow

After cloning React, run `yarn` to fetch its dependencies.
Then, you can run several commands:

* `yarn lint` checks the code style.
* `yarn commit` create a conventional commit.
* `yarn test` runs the complete test suite.
* `yarn start:dev` start development container.
* `yarn stop:dev` stop development container.

## Commit message Style Guide

We use [commitlint](https://commitlint.js.org/) to keep commit history clean and standard, to create a standard commit message we use [commitizen](https://github.com/commitizen/cz-cli) as a command-line utitlity, So if you want to commit your changes please use `yarn commit` command.

## Style Guide

We run an automatic code formatter ([Prettier](https://prettier.io/)) and linter ([Eslint](https://eslint.org/)) before each commit. The linter will catch most issues that may exist in your code.

## Get in Touch

Telegram: [fullstacks][fullstacks-group]

[fullstacks-group]: https://t.me/fullstacks_js
