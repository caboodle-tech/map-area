function runDemo(){

    // Get a new instance of MapArea.
    var map = new MapArea();

    // Setup the options for this MapArea.
    var options = {
        name: 'image-map',
        className: 'demo-highlight'
    }

    // Initialize the MapArea instance.
    map.init( options );

    // NOTE: init() will return true if it worked or false if an error occurred.
}
