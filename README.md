# Map Area
Map Area was designed to solve two common problems developers have when using HTML [\<map\>](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/map) and [\<area\>](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/area) elements.

1. You can not use CSS styles on map areas in any consistent cross-browser friendly way.
2. Map areas are linked to the images size and break if that changes. Users resizing their web browser often break your map areas.

Map Area solves these problems for you by:

1. Redrawing your map areas in Scalable Vector Graphics (SVGs) that can be styled with CSS.
2. Keeping an eye on the image and resizing the map areas and SVGs automatically for you.

Now you should be free to add CSS or JavaScript code to map areas to your hearts content.

### tl;dr ([demo](https://caboodle-tech.github.io/map-area/index.html))
This is a JavaScript module that fixes the styling problem with HTML [\<map\>](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/map) and [\<area\>](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/area) elements by placing SVGs over them. A demo is worth a thousand words though so [check the demo](https://caboodle-tech.github.io/map-area/index.html) for more information.

### What are HTML map areas?

The HTML [\<map\>](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/map) element uses [\<area\>](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/area) elements to draw interactive shapes over an image on web pages. Web developers usually use these elements to draw any circular, rectangular, or polygonal shape on top of an image that users can then interact with. In the simplest form these areas become clickable links, if JavaScript is added they can be used to trigger events on the current page. Here is what the HTML markup looks like:

```html
<!-- Image Map Generated by http://www.image-map.net/ -->
<img src="tahquitz_map_2019.jpg" usemap="#image-map">
<map name="image-map">
    <area target="" alt="Craft Lodge" title="Craft Lodge" href="" coords="131,135,191,180" shape="rect">
</map>
```

HTML map areas are commonly used as a form of navigation. For example, you could highlight areas of a digital menu and link to more information or pictures of a menu item. Another common use is for maps. You can highlight countries, regions, or points of interest and load content or navigate to a page based on what a user clicks on.

Take a look at the [live demo](https://caboodle-tech.github.io/map-area/index.html) for a real world example.

### How Do I Use Map Area?
After you have added the MapArea JavaScript file to your site or project you will need to initialize it like so:

```javascript
// Get a new instance of MapArea.
var map = new MapArea();

// Setup the options for this MapArea.
var options = {
    name: 'image-map',
    className: 'demo-highlight'
}

// Initialize the MapArea instance.
map.addMap( options );
```
You can also initialize MapArea in a condensed way:

```javascript
map.addMap( {
    name: 'image-map',
    className: 'demo-highlight'
} );
```
Or for the truly lazy, after you have a new instance of MapArea just call:

```javascript
map.addAll( {
    className: 'demo-highlight'
} );
```

In every case except when calling `addAll()` you must supply an options object where `name` is the name of your image map. `className` is optional and will default to a class of `map-area` if not provided. You may provide a string with a single class, or classes separated by spaces, that you want added to the SVGs with `className`; this is what allows you to style these areas with CSS.

### Is there a demo?

You must not have read this page: [CLICK HERE TO SEE A DEMO](https://caboodle-tech.github.io/map-area/index.html).