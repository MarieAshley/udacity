# Feed Reader Project

## How to load

Open index.html in a web browser.


## Unit Tests

### RSS Feeds

1. `are defined` tests to ensure allFeeds is defined and not empty
1. `should have a url` tests to ensure each feed in allFeeds contains a non-empty url.
1. `should have a name` tests to ensure each feed in allFeeds contains a non-empty name.

### The menu

1. `should be hidden by default` tests to ensure the menu element is hidden by default
1. `should change visibility when clicked` tests to ensure the menu changes visibility when menu icon is clicked

### Initial Entries

1. `contains at least one entry` tests to ensure there is at least one .entry element within the .feed container when loadFeed is called.

### New Feed Selection

1. `contains different content` tests that the content changes when the feed is switched.
