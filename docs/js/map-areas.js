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
 * This was the alpha / beta version of MapArea that proved I could get the
 * concept working. Figuring out polygons was the hard part. I went down
 * several rabit holes like CSS clip paths but once I got the SVG idea working
 * it made sense to re-write the whole thing to use only SVG. It's cleaner and
 * has great cross browser support.
 *
 * I am an advocate of learning -- I'm currently an Adjunct Professor at the
 * time I'm writing this -- and have included this early concept in the main
 * repo in the hopes that it can be a useful resource to someone.
 *
 * @author Christopher Keers <source@caboodle.tech>
 * @version 0.0.0-rc
 * @module MapArea
 */
var MapArea = function () {
    'use strict';

    var module = {
        /**
         * Initialize a new MapArea module.
         * @method init
         * @param {object} options - An object with settings that will be used by MapArea when creating areas.
         * @param {string} options.name - The name of the map area to ingest and process.
         * @param {string} [options.className] - Class(es) to add to each area that is created.
         */
        init: function( options ){
            var map, img;
            if( options.name ){
                map = document.querySelector( 'map[name="' + options.name + '"]' );
                if( map ){
                    img = document.querySelector( 'img[usemap="#' + options.name + '"]' );
                    if( img ){
                        img.parentElement.style.position = 'relative';
                        this.processAreas( map, img, options );
                        return true;
                    }
                }
            }
            return false;
        },
        /**
         * When a user clicks on our created areas we pass the click throuh to the original area.
         * @method passthroughClick
         * @param {element} area - An HTML element.
         */
        passthroughClick: function( area ){
            area.click();
        },
        /**
         * @method processAreas
         * @param {element} map - The map element being injested.
         * @param {element} img - The image this map applies to.
         * @parma {object} options - An object with settings that will be used by MapArea when creating areas.
         * @param {string} options.name - The name of the map area to ingest and process.
         * @param {string} [options.className] - Class(es) to add to each area that is created.
         */
        processAreas: function( map, img, options ){

            // Setup variables for the loop.
            var wrapper = img.parentElement;
            var areas = map.querySelectorAll('area');
            var len = areas.length;
            var viewBox = '0 0 ' + img.width + ' ' + img.height;
            var coords, newNode, topPos, leftPos, width, height, posLen, position, flag;

            // Do we need to add a class to these areas?
            var className = '';
            if( options.className ){
                className = options.className;
            }

            // Loop and process each area.
            for( var x = 0; x < len; x++ ){

                coords = areas[x].coords;
                coords = coords.replace( / /g, '' );
                coords = coords.split(',');

                /**
                 * NOTES:
                 *
                 * If we need to process a polygon we have to make an SVG. There is
                 * no easy way to make a cross browser polygon shape that can be
                 * interacted with like a div.
                 *
                 * For the SVG creation to work properly you must use createElementNS
                 * and setAttribute to attach most things. We can not assign
                 * attributes like you would with a div.
                 */

                if( areas[x].shape !== 'poly' && areas[x].shape !== 'polygon' ){

                    newNode = document.createElement('div');
                    newNode.style.cursor = 'pointer';
                    newNode.title = areas[x].title;
                    newNode.addEventListener( 'click', this.passthroughClick.bind( null, areas[x] ) );

                } else {

                    newNode = document.createElementNS( 'http://www.w3.org/2000/svg', 'svg' );
                    newNode.setAttribute( 'viewBox', viewBox );
                    newNode.setAttribute( 'xmlns', 'http://www.w3.org/2000/svg' );

                }

                newNode.style.position = 'absolute';

                /**
                 * NOTES:
                 *
                 * All areas are hard-coded with a background color so I could see
                 * them well testing and not have to make a CSS file. In the
                 * production version this would have been removed.
                 *
                 * When making a rectangle or circle we have to watch for negative
                 * numbers. If a width or height comes our negative that means we
                 * need to jump the shape back (left or top) by the width or height.
                 */

                switch( areas[x].shape ){
                    case 'rect':
                    case 'rectangle':
                        topPos = parseInt( coords[1] );
                        leftPos = parseInt( coords[0] );
                        width = ( parseInt( coords[2] ) - parseInt( coords[0] ) );
                        if( width < 0 ){
                            width *= -1;
                            leftPos = leftPos - width;
                        }
                        height = ( parseInt( coords[3] ) - parseInt( coords[1] ) );
                        if( height < 0 ){
                            height *= -1;
                            topPos = topPos - height;
                        }
                        newNode.style.top = topPos + 'px';
                        newNode.style.left = leftPos + 'px';
                        newNode.style.width = width + 'px';
                        newNode.style.height = height + 'px';
                        newNode.className = className + ' rectangle';
                        newNode.title = areas[x].title;
                        flag = true;
                        break;
                    case 'circ':
                    case 'circle':
                        topPos = parseInt( coords[1] ) - parseInt( coords[2] );
                        leftPos = ( parseInt( coords[0] ) - parseInt( coords[2] ) );
                        width = ( parseInt( coords[2] ) * 2 );
                        if( width < 0 ){
                            width *= -1;
                            leftPos = leftPos - width;
                        }
                        height = ( parseInt( coords[2] ) * 2 );
                        if( height < 0 ){
                            height *= -1;
                            topPos = topPos - height;
                        }
                        newNode.style.top = topPos + 'px';
                        newNode.style.left = leftPos + 'px';
                        newNode.style.width = width + 'px';
                        newNode.style.height = height + 'px';
                        newNode.style.borderRadius = '50%';
                        newNode.className = className + ' circle';
                        flag = true;
                        break;
                    case 'poly':
                    case 'polygon':


                        /**
                         * NOTES:
                         *
                         * I never finished cleaning up this section because I realized
                         * we should just use SVG for everything.
                         */

                        position = '';
                        posLen = coords.length;
                        for( var y = 0; y < posLen; y += 2 ){
                            position += coords[y] + ',' + coords[y+1] + ' ';
                        }
                        position = position.trim();
                        var svgPoly = document.createElementNS( 'http://www.w3.org/2000/svg', 'polygon' );
                        svgPoly.setAttribute( 'points', position );
                        svgPoly.setAttribute( 'fill', 'transparent' );
                        svgPoly.setAttribute( 'class', className + ' polygon' );
                        svgPoly.innerHTML = '<title>' + areas[x].title + '</title>';
                        svgPoly.style.cursor = 'pointer';
                        svgPoly.addEventListener( 'click', this.passthroughClick.bind( null, areas[x] ) );
                        newNode.appendChild( svgPoly );
                        flag = true;
                        break;
                }

                if( flag ){
                    wrapper.insertBefore( newNode, wrapper.firstElementChild );
                }
            }
        },
    };
    return module;
};
