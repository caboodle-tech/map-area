/**
 * Copyright 2020 Caboodle Tech, Inc. https://caboodle.tech/
 *
 * Permission is hereby granted, free of charge, to any person obtaining
 * a copy of this software and associated documentation files (the
 * "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to
 * the following conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

/**
 *  Ingests HTML map areas and creates an SVG clone.
 *
 *  HTML map areas can not be styled directly in any kind of cross browser compatible way.
 *  This module solves that problem by placing SVGs over the areas so you can style them
 *  and hook to them until your hearts content. Any CSS or JavaScript code your used to
 *  using should be fine to use on the SVG areas.
 *
 * @author Christopher Keers <source@caboodle.tech>
 * @version 1.0.0
 * @module MapArea
 */
var MapArea = function () {
    'use strict';

    /**
     * When a user clicks on our created areas we pass the click throuh to the original area.
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
        var viewBox = '0 0 ' + img.width + ' ' + img.height;
        var coords, position, posLen, y, flag;

        var topPos, leftPos, width, height;

        var shape;

        // Do we need to add a class to these areas?
        var className = '';
        if( options.className ){
            className = options.className;
        }

        // Create the SVG wrapper.
        var svg = document.createElementNS( 'http://www.w3.org/2000/svg', 'svg' );
        svg.setAttribute( 'viewBox', viewBox );
        svg.setAttribute( 'xmlns', 'http://www.w3.org/2000/svg' );
        svg.setAttribute( 'style', 'position: absolute;' );

        // Loop and process each area.
        for( var x = 0; x < len; x++ ){

            // Turn the coordinates string into an array.
            coords = areas[x].coords;
            coords = coords.replace( / /g, '' );
            coords = coords.split(',');

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
                    shape.setAttribute( 'fill', 'transparent' );
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
    };

    var module = {
        /**
         * Initialize a new MapArea module.
         * @method init
         * @param {object} options - An object with settings that will be used by MapArea when creating areas.
         * @param {string} options.name - The name of the map area to ingest and process.
         * @param {string} [options.className] - Class(es) to add to each area that is created.
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
