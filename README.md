# Map Area
Map Area was designed to solve a common problem developers have when using HTML [\<map\>](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/map) and [\<area\>](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/area) elements. Style! As well as UX in general.

Map areas can not be styled directly in any kind of cross browser compatible way. This module solves that problem by placing SVGs over the areas so you can style them and hook to them until your hearts content. Any CSS or JavaScript code your used to using should be fine to use.

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

### Is there a demo?

You must of not read this page: [CLICK HERE TO SEE A DEMO](https://caboodle-tech.github.io/map-area/index.html).
