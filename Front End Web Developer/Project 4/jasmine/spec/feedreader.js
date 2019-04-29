/* feedreader.js
 *
 * This is the spec file that Jasmine will read and contains
 * all of the tests that will be run against your application.
 */

/* We're placing all of our tests within the $() function,
 * since some of these tests may require DOM elements. We want
 * to ensure they don't run until the DOM is ready.
 */
$(function() {
    /* This is our first test suite - a test suite just contains
    * a related set of tests. This suite is all about the RSS
    * feeds definitions, the allFeeds variable in our application.
    */
    describe('RSS Feeds', function() {

        // Test to ensure allFeeds is defined and not empty
        it('are defined', function() {
            expect(allFeeds).toBeDefined();
            expect(allFeeds.length).not.toBe(0);
        });

        // Test to ensure each feed in allFeeds contains a non-empty url.
        it('should have a url', function() {
            for (let feed of allFeeds) {
                expect(feed.url).toBeDefined();
                expect(feed.url.length).not.toBe(0);
                expect(typeof feed.url).toBe("string");
            }
        });

        // Test to ensure each feed in allFeeds contains a non-empty name.
        it('should have a name', function() {
            for (let feed of allFeeds) {
                expect(feed.name).toBeDefined();
                expect(feed.name.length).not.toBe(0);
                expect(typeof feed.name).toBe("string");
            }
        });
    });


    // Test suite for the nav menu of each feed in allFeeds.
    describe('The menu', function() {

        // Test to ensure the menu element is hidden by default
        it('should be hidden by default', function() {
            expect(document.querySelector('body')).toHaveClass('menu-hidden');
        });

        // Test to ensure the menu changes visibility when menu icon is clicked
        it('should change visibility when clicked', function() {
            let menuIconLink = document.querySelector(".menu-icon-link");
            
            // Menu should display when clicked
            menuIconLink.click();
            expect(document.querySelector('body')).not.toHaveClass('menu-hidden');

            // Menu should hide when clicked again
            menuIconLink.click();
            expect(document.querySelector('body')).toHaveClass('menu-hidden');
        });

    });

    // Test suite for Initial RSS Feed Entries
    describe('Initial Entries', function() {

        beforeEach(function(done) {
            loadFeed(0, function() {
                done();
            });
        });

        // Test to ensure there is at least one .entry element within the .feed container when loadFeed is called
        it('contains at least one entry', function(done) {
            expect(document.querySelectorAll('.entry-link').length).toBeGreaterThanOrEqual(1);
            done();
        });

    });

    // Tests for when the feed changes
    describe('New Feed Selection', function() {

    });

        /* TODO: Write a test that ensures when a new feed is loaded
         * by the loadFeed function that the content actually changes.
         * Remember, loadFeed() is asynchronous.
         */
}());
