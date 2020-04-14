/*!
 * MapArea
 * https://github.com/caboodle-tech/map-area
 *
 * Version: 1.0.3
 *
 * Copyright Christopher Keers (Caboodle Tech Inc)
 * https://github.com/blizzardengle (https://github.com/caboodle-tech)
 *
 * Released under the MIT license.
 * Date: 2020-03-31
 */

/**
 *  Ingests HTML map areas and creates an SVG clone.
 *
 *  HTML map areas can not be styled directly in any kind of cross browser compatible way.
 *  This module solves that problem by placing SVGs over the areas so you can style them
 *  and hook to them until your hearts content. Any CSS meant for SVGs or JavaScript code
 *  your used to using should be fine to use on the SVG areas.
 *
 * @author Christopher Keers <source@caboodle.tech>
 * @version 1.0.3
 * @module MapArea
 */
var MapArea = function () {
    'use strict';

    /**
     * Module global variables.
     *
     * @private
     */
    var lastResize;
    var maps = [];
    var resizeInterval;

    /**
     * Checked on an interval to handle rebuilding the SVG areas on page resize.
     *
     * @private
     */
    var handleResize = function(){
        var date = new Date();
        if( lastResize != undefined ){
            if( date.getTime() > ( lastResize + 50 ) ){
                // Stop the interval and go ahead and resize existing maps.
                clearInterval( resizeInterval );
                resizeInterval = '';
                lastResize = '';
                var x, remake = [];
                // Loop through all the recorded maps and remove their SVG element.
                for( x = 0; x < maps.length; x++ ){
                    // Remove the old SVG from the page.
                    maps[x][0].parentNode.removeChild( maps[x][0] );
                    maps[x][0] = null; // Dereference the old SVG area so it is garbage collected.
                    remake.push( [ maps[x][1], maps[x][2], maps[x][3] ] );
                }
                // Insure garbage collection happens by dereferencing the whole maps array.
                maps = [];
                // Now loop and recreate the SVG's for all the maps.
                for( x = 0; x < remake.length; x++ ){
                    processAreas( remake[x][0], remake[x][1], remake[x][2] );
                }
            }
        }
        lastResize = date.getTime();
    };

    /**
     * When a user clicks on our created areas we pass the click throuh to the original area.
     *
     * @private
     * @param {element} area - An HTML element.
     */
    var passthroughClick = function( area ){
        area.click();
    };

    /**
     * Ingest a map element and create shapes on a SVG element for each area found. This will then
     * place the SVG above the image with a view box set to the images size so the shapes in the
     * SVG are perfectly aligned over their HTML map area counterparts.
     *
     * @private
     * @param {element} map - The map element being ingested.
     * @param {element} img - The image this map applies to.
     * @parma {object} options - An object with settings that will be used by MapArea when creating areas.
     * @param {string} options.name - The name of the map area to ingest and process.
     * @param {string} [options.className] - Class(es) to add to each area that is created.
     */
    var processAreas = function( map, img, options ){

        // Setup variables for the loop.
        var wrapper = img.parentElement;
        var areas = map.querySelectorAll('area');
        var len = areas.length;
        var viewBox = '0 0 ' + img.naturalWidth + ' ' + img.naturalHeight;
        var style = 'width: ' + img.naturalWidth + 'px; height: ' + img.naturalHeight + 'px;';
        var coords, position, posLen, y, flag;

        var topPos, leftPos, width, height;

        var shape;

        // Do we need to add a class to these areas?
        var className = '';
        if( options.className ){
            className = options.className;
        }

        /**
         * Scale the coordinates if the image is not at it's natural size.
         *
         * This idea comes from a post by {@link https://stackoverflow.com/a/56701877/3193156|Nagy Zoltán} on StackOverflow.
         */
        var scale = img.offsetWidth / ( img.naturalWidth || img.width );

        // Create the SVG wrapper.
        var svg = document.createElementNS( 'http://www.w3.org/2000/svg', 'svg' );
        svg.setAttribute( 'viewBox', viewBox );
        svg.setAttribute( 'xmlns', 'http://www.w3.org/2000/svg' );
        svg.setAttribute( 'style', 'position: absolute; z-index: 9000; overflow: visible; ' + style );

        // Keep a record of the SVG and original settings in case there is a window resize.
        maps.push( [ svg, map, img, options ] );

        // Loop and process each area.
        var x, y;
        for( x = 0; x < len; x++ ){

            // Record the original map area coordinates if we have not already and then get the coordinates.
            if( areas[x].dataset.coords ){
                coords = areas[x].dataset.coords;
            } else {
                coords = areas[x].coords;
                areas[x].dataset.coords = coords;
            }

            // Turn the coordinates string into an array.
            coords = coords.replace( / /g, '' );
            coords = coords.split(',');

            // Scale all the coordinates as needed.
            for( y = 0; y < coords.length; y++ ){
                coords[y] = Math.ceil( coords[y] * scale );
            }

            // Update the map area coordinates to their scaled value.
            areas[x].coords = coords.join(',');

            switch( areas[x].shape ){
                case 'rect':
                case 'rectangle':

                    // We must create the visual width by subtracting the width from the left offset.
                    leftPos = parseInt( coords[0] );
                    width = ( parseInt( coords[2] ) - parseInt( coords[0] ) );
                    if( width < 0 ){
                        // If our width is negative change it to positive and move the left (x) point.
                        width *= -1;
                        leftPos = leftPos - width;
                    }

                    // We must create the visual height by subtracting the height from the top offset.
                    topPos = parseInt( coords[1] );
                    height = ( parseInt( coords[3] ) - parseInt( coords[1] ) );
                    if( height < 0 ){
                        // If our height is negative change it to positive and move the top (y) point.
                        height *= -1;
                        topPos = topPos - height;
                    }

                    // Build a rectangle.
                    shape = document.createElementNS( 'http://www.w3.org/2000/svg', 'rect' );
                    shape.setAttribute( 'x', leftPos );
                    shape.setAttribute( 'y', topPos );
                    shape.setAttribute( 'width', width );
                    shape.setAttribute( 'height', height );
                    shape.setAttribute( 'class', className + ' rectangle' );
                    flag = true;
                    break;
                case 'circ':
                case 'circle':

                    // Build a circle.
                    shape = document.createElementNS( 'http://www.w3.org/2000/svg', 'circle' );
                    shape.setAttribute( 'cx', coords[0] );
                    shape.setAttribute( 'cy', coords[1] );
                    shape.setAttribute( 'r', coords[2] );
                    shape.setAttribute( 'class', className + ' circle' );
                    flag = true;
                    break;
                case 'poly':
                case 'polygon':

                    // Coordinates need to be put into pairs for a polygon.
                    position = '';
                    posLen = coords.length;
                    for( y = 0; y < posLen; y += 2 ){
                        position += coords[y] + ',' + coords[y+1] + ' ';
                    }
                    position = position.trim();

                    // Build a polygon shape.
                    shape = document.createElementNS( 'http://www.w3.org/2000/svg', 'polygon' );
                    shape.setAttribute( 'points', position );
                    shape.setAttribute( 'class', className + ' polygon' );
                    flag = true;
                    break;
            }

            // Only add the shape if we have a proper element to add.
            if( flag ){

                // Add the click event, hover effect, and title to this shape.
                shape.addEventListener( 'click', passthroughClick.bind( null, areas[x] ) );
                shape.setAttribute( 'style', 'cursor: pointer;' );
                shape.innerHTML = '<title>' + areas[x].title + '</title>';
                svg.appendChild( shape );
            }
        }

        // Add the SVG element before (in front of) the image.
        wrapper.insertBefore( svg, wrapper.firstElementChild );

        // Add an event listener to the window that will resize SVG maps as needed.
        window.addEventListener( 'resize', triggerResize );
    };

    /**
     * Start an interval when a page resize is detected. This will insue only
     * we do not trigger thousands of events waiting for the resize to stop so
     * we can recreate the SVG maps.
     *
     * @private
     */
    var triggerResize = function(){
        if( resizeInterval == undefined || resizeInterval == '' ){
            resizeInterval = setInterval( handleResize, 50 );
        }
    };

    var module = {
        /**
         * Initialize a new MapArea module.
         * @method init
         * @param {object} options - An object with settings that will be used by MapArea when creating areas.
         * @param {string} options.name - The name of the map area to ingest and process.
         * @param {string} options.className - Class(es) to add to each area that is created.
         * @returns {boolean} True if it appears we have everything for MapArea to work, false if an element is missing.
         */
        init: function( options ){
            var map, img;
            if( options.name ){
                map = document.querySelector( 'map[name="' + options.name + '"]' );
                if( map ){
                    img = document.querySelector( 'img[usemap="#' + options.name + '"]' );
                    if( img ){
                        img.parentElement.style.position = 'relative';
                        processAreas( map, img, options );
                        return true;
                    }
                }
            }
            return false;
        }
    };
    return module;
};
