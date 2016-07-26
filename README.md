# d3.distanceLimitedVoronoi
D3 plugin which computes a Voronoi tesselation where each cell defines a region inside a given distance.

## Context

As stated in the first sentence of the README file of the [d3-voronoi repository](https://github.com/d3/d3/wiki/Voronoi-Geom):

> Voronoi layouts are particularly useful for invisible interactive regions, as demonstrated in Nate Vack’s [Voronoi picking](http://bl.ocks.org/njvack/1405439) example

But this cited example also shows that interactive regions should be close to each point/subjectOfMatter. In other words, if the interactive region is far away from the subject of matter, interaction becomes confusing.

In its example, Nate Vack uses SVG's clipPath technique to cut off Voronoï-based interactive regions. This plugin mimic the final result by computing the adequate distance-limited region around each subject of matter. The adequate region is the intersection area between the Voronoï cell and a max-distance circle.

## Examples

* This [block](http://bl.ocks.org/Kcnarf/6d5ace3aa9cc1a313d72b810388d1003) is an update of Nate Vack’s _Voronoi picking_ example, using the __d3.distanceLimitedVoronoi__ plugin
* This [block](http://bl.ocks.org/Kcnarf/4de291d8b2d1e6501990540d87bc1baf) uses the __d3.distanceLimitedVoronoi__ plugin in a real case study

## Installing
In your HTML file, load the plugin after loading D3. The result may look like:
```html
<script src="https://d3js.org/d3.v4.min.js"></script>
<script src="https://rawgit.com/Kcnarf/d3.distanceLimitedVoronoi/d3v4/distance-limited-voronoi.js"></script>
```

## TL;DR;
In your javascript, in order to define the layout:
```javascript
var limitedVoronoi = d3.distanceLimitedVoronoi()
  .x(...)                                     // set the x accessor (as in d3.voronoi)
  .y(...)                                     // set the y accessor (as in d3.voronoi)
  .limit(20)                                  // set the maximum distance
var limitedCells = limitedVoronoi(data)       // compute the layout; return an array of {path: , datum: }
                                                // where 'path' is the adequate region around the datum
                                                // and 'datum' is the datum
```

Finally, in your javascript, in order to draw the (interactive) regions:
```javascript
d3.selectAll("interactive-region")
  .data(limitedCells)
  .enter()
    .append("path")
      .attr("d", function(d) { return d.path; })
      .on('mouseenter', ...)
      .on('mouseout', ...)
```

## Reference
* d3-voronoi: https://github.com/d3/d3/wiki/Voronoi-Geom

## API Reference

<a name="distanceLimitedVoronoi" href="#distanceLimitedVoronoi">#</a> d3.<b>distanceLimitedVoronoi</b>()

Creates a new distanceLimitedVoronoi diagram with the default settings:
```javascript
voronoi = d3.voronoi()
limit = 20;
```


<a name="distanceLimitedVoronoi_" href="#distanceLimitedVoronoi_">#</a> <i>distanceLimitedVoronoi.</i>(data)

Computes the distanceLimitedVoronoi tesselation for the specified _data_ points.


<a name="distanceLimitedVoronoi_limit" href="#distanceLimitedVoronoi_limit">#</a> <i>distanceLimitedVoronoi.</i><b>limit</b>([radius])

If _radius_ is specified, set the _limit_ (ie. maximum distance) of each cell and returns this distanceLimitedVoronoi. If _radius_ is not specified, return the current _limit_, which defaults to ```20```.


<a name="distanceLimitedVoronoi_voronoi" href="#distanceLimitedVoronoi_voronoi">#</a> <i>distanceLimitedVoronoi.</i><b>voronoi</b>([voronoi])

If _voronoi_ is specified, set the voronoi layout used by the distanceLimitedVoronoi and returns it. If _voronoi_ is not specified, return the currently used voronoi, which defaults to ```d3.voronoi()```.


<a name="distanceLimitedVoronoi_x" href="#distanceLimitedVoronoi_x">#</a> <i>distanceLimitedVoronoi.</i><b>x</b>([callback])

If _callback_ is specified, set the _x_-coordinate accessor and returns this distanceLimitedVoronoi. If _callback_ is not specified, return the current _x_-coordinate accessor, which defaults to ```function(d) { return d.[0]; }```.


<a name="distanceLimitedVoronoi_y" href="#distanceLimitedVoronoi_y">#</a> <i>distanceLimitedVoronoi.</i><b>y</b>([callback])

If _callback_ is specified, set the _y_-coordinate accessor and returns this distanceLimitedVoronoi. If _callback_ is not specified, return the current _y_-coordinate accessor, which defaults to ```function(d) { return d.[1]; }```.


<a name="distanceLimitedVoronoi_extent" href="#distanceLimitedVoronoi_extent">#</a> <i>distanceLimitedVoronoi.</i><b>clipExtent</b>([extent])

If _extent_ is specified, set the clip extent of the layout to the specified bounds and returns this distanceLimitedVoronoi. The extent bounds are specified as an array [​[x0, y0], [x1, y1]​], where x0 is the left side of the extent, y0 is the top, x1 is the right and y1 is the bottom. If _extent_ is not specified, return the current clip extent, which defaults to ```[[-1e6, -1e6], [1e6,1e6]]```.
