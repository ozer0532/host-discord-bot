# Changelog

## Unreleased

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

## [0.0.2] - 2021-03-07

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

## [0.0.1] - 2021-03-05

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

[0.0.2]: https://github.com/ozer0532/host-discord-bot/compare/5000d8c49b392eba803e2f678cd518e2fb59fd74...509a3b9f98d4f74e50877be84869b139a5d33025
[0.0.1]: https://github.com/ozer0532/host-discord-bot/tree/5000d8c49b392eba803e2f678cd518e2fb59fd74
