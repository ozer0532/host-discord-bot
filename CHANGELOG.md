# Changelog

## Unreleased

Nothing is unreleased.. Hooray!

## [0.4.0] - 2021-04-08

### TL;DR

- Added `lyrics` command in the `music` category.
- Added `poll` command in the `utilities`category.
- `help` now displays complex arguments
- `play` search results now render correctly with special characters.

### Added

- `lyrics` command (`music` category):
  - `lyrics` to find lyrics for the current music
  - `lyrics <searchterm>` to find lyrics on a search term
- `poll` command (`utilities` category):
  - `poll <pollquestion> | {polloptions}` to create a quick reaction poll

### Changed

- `help` command (`bot-info` category):
  - Added help description for complex arguments

### Fixed

- `play` command (`music` category):
  - Fixed music titles displaying incorrectly because of being parsed as markdown
  - Fixed previous search result not cleared when running a new search

## [0.3.1] - 2021-03-09

### TL;DR

- Fixed some errors in the `changelog` command.
- Fixed error when opening a command's `help` entry.

### Fixed

- `changelog` command (`bot-info` category):
  - Fixed error where the bot does not reply anything when asked for a specific tag.
  - Fixed error where the bot doesn't send a reply when a tag is invalid.
- `help` command (`bot-info` category):
  - Fixed error when looking up a command's `help` entry.
- `queue` command (`music` category):
  - Fixed minor typo in the `help` entry.

## [0.3.0] - 2021-03-09

### TL;DR

- Added `changelog` command in the `bot-info` category.
- Added `loop` and `shuffle` command in the `music` category.
- Added `roll` command in the `utilities` category.
- `play` can now accept Youtube playlists as URLs.

### Added

- `changelog` command (`bot-info` category):
  - `changelog` to list the latest changelogs.
  - `changelog <version>` to show the changelogs of a specific thread.
- `play` command (`music` category):
  - Added the ability to get all tracks from a Youtube playlist.
- `loop` command (`music` category):
  - `loop` to loop between loop settings.
  - `loop (off|single|loop)` to select a loop setting.
- `shuffle` command (`music` category):
  - `shuffle` to loop between shuffle settings.
  - `shuffle (off|on)` to set shuffle to off/on.

### Changed

- `play` command (`music` category):
  - Added the missing usage description `play <searchresult>` to select a track from the search results.
- `help` command (`bot-info` category):
  - Moved `help` from `utility` to `bot-info`

### Fixed

- `help` command (`bot-info` category):
  - Bot now sends an error message when input is not a valid command.

## [0.2.0] - 2021-03-07

### TL;DR

- `help` can now lists commands in a category (`help <category>`).
- Other quality of life improvements.

### Added

- `help` command (`utility` category):
  - `help <category>` to list commands in a category.
  
### Changed

- `play` command (`music` category):
  - `play` now shows the playing track when the queue starts off empty.
  - `play` now highlights track titles when added to queue.
- `skip` command (`music` category):
  - Fix in `skip` argument info `range` where the format should be '`m-n`' not '`n-m`'.

### Fixed

- `play` command (`music` category):
  - Fixed error when no song has been found by the search.
  - Fixed error where the bot returns `Error: Status code: 429` in which the music player will stop working after a couple of uses.

## [0.1.0] - 2021-03-05

### TL;DR

- Added `ping` and `beep` command in the `fun` category.
- Added `play`, `skip`, `stop`, `nowplaying`, `queue`, `move` command in the `music` category.
- Added `help` command in the `utility` category.

### Added

- `ping` command (`fun` category):
  - `pong`
  - Shows the websocket heartbeat and roundtrip latency
- `beep` command (`fun` category):
  - `boop`
- `play` command (`music` category):
  - `play <url>` to play a track from a Youtube url.
  - `play <searcherm>` to search for a track on Youtube.
- `skip` command (`music` category):
  - `skip` to skip the current track.
  - `skip <index>` to skip a track in the queue.
  - `skip <range>` to skip a range of tracks in the queue.
- `stop` command (`music` category):
  - `stop` to clear the queue.
- `nowplaying` command (`music` category):
  - `nowplaying` to show details on the current track.
- `queue` command (`music` category):
  - `queue` to display the queue contents
  - `queue <page>` to show a specific page in the queue
  - `queue all` to show all tracks in the queue.
- `move` command (`music` category):
  - `move <index> <newindex>` to move a track within the queue.
- `help` command (`utility` category):
  - `help` to show all commands available.
  - `help <command>` to show details on a specific command.

[0.3.1]: https://github.com/ozer0532/host-discord-bot/compare/68727697232e3998552eb91c8f68805ad0db47f9...eaf4721a03c2c188486e4a98559282ea0c865677
[0.3.0]: https://github.com/ozer0532/host-discord-bot/compare/509a3b9f98d4f74e50877be84869b139a5d33025...68727697232e3998552eb91c8f68805ad0db47f9
[0.2.0]: https://github.com/ozer0532/host-discord-bot/compare/5000d8c49b392eba803e2f678cd518e2fb59fd74...509a3b9f98d4f74e50877be84869b139a5d33025
[0.1.0]: https://github.com/ozer0532/host-discord-bot/tree/5000d8c49b392eba803e2f678cd518e2fb59fd74
