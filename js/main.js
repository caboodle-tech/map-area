function runDemo(){
    // Get a new instance of MapArea.
    var map = new MapArea();

    // Setup the options for this MapArea.
    var options = {
        name: 'image-map',
        className: 'demo-highlight'
    }

    // Initialize the MapArea instance.
    map.addMap( options );

    /**
     * NOTES:
     *
     * init() will return true if it worked or false if an error occurred.
     *
     * You could do this in a shorthand way where the options object is
     * placed straight inside the addMap() call like so:
     *
     * map.addMap( {
     *   name: 'image-map',
     *   className: 'demo-highlight'
     * } );
     */
}
