<h1 align="center">🤖 Fullstacks GuardianBot</h1>
<p>
  <img alt="Version" src="https://img.shields.io/badge/version-0.1.0-blue.svg?cacheSeconds=2592000" />
  <img src="https://img.shields.io/badge/node-%3E%3D12-blue.svg" />
  <img src="https://img.shields.io/badge/yarn-%3E%3D1-blue.svg" />
  <a href="https://github.com/full-stacks/guardian-bot/blob/master/LICENSE" target="_blank">
    <img alt="License: AGPL--3.0" src="https://img.shields.io/github/license/full-stacks/guardian-bot" />
  </a>
</p>

> Telegram bot to manage developer groups. Created to moderate [Fullstacks Community](https://t.me/fullstacks_js).

## Features

- Code syntax highlighter
- Captcha
- Ban/Unban users
- List all community groups and channels
- Notes

## Commands

| Command                    | Role     | Available at | Description                                            | Flags         |
| -------------------------- | -------- | ------------ | ------------------------------------------------------ | ------------- |
| `/del [reason]`            | Admin    | Everywhere   | Deletes replied-to message.                            |               |
| `/ban <reason>`            | Admin    | Groups       | Bans the user from all groups.                         |               |
| `/unban`                   | Admin    | Everywhere   | Removes the user from ban list.                        |               |
| `/save <name>`             | Admin    | PM           | Save replied-to message as a note.                     |               |
| `/update <name>`           | Admin    | PM           | Change a note to replied-to message.                   |               |
| `/remove <name>`           | Admin    | PM           | Remove a note.                                         |               |
| `/alias <language> <name>` | Admin    | PM           | Alias a language.                                      |               |
| `/sync`                    | Admin    | Groups       | Sync group informations.                               |               |
| `/aliass`                  | Everyone | Everywhere   | List all aliases.                                      |               |
| `/get <name>`              | Everyone | Everywhere   | Retrive a note.                                        |               |
| `/shot [language | alias]` | Everyone | Everywgere   | Syntax highlight all codeblocks in replied-to message. | filename, raw |
| `/notes <name>`            | Everyone | Everywhere   | Show list of notes.                                    |               |
| `/groups`                  | Everyone | Everywhere   | Shows a list of groups.                                |               |

## Prerequisites

- node >=12
- yarn
- docker
- docke-compose >=3

## Setup

You need [Docker](https://docs.docker.com/engine/installation/linux/docker-ce/ubuntu/#install-from-a-package) to run
this bot.

1. Clone this repository.
2. Create a bot via [@BotFather](https://t.me/BotFather) and grab a **token**.
3. Copy `.env.example` to `.env` and edit it.
4. Start bot via `docker-compose up`.

- Github: [@full-stacks](https://github.com/full-stacks)

## Contributing

Contributions, issues and feature requests are welcome!<br />Feel free to check
[issues page](https://github.com/full-stacks/guardian-bot/issues). You can also take a look at the
[contributing guide](https://github.com/full-stacks/guardian-bot/blob/master/CONTRIBUTING.md).

## Show your support

Give a ⭐️ if this project helped you!

## License

This project is [AGPL-3.0](https://github.com/full-stacks/guardian-bot/blob/master/LICENSE) licensed.

---

Created with <💛+⌨️> by [Fullstacks Community](https://t.me/fullstacks_js)
