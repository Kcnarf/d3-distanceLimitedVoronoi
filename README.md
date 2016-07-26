# d3.distanceLimitedVoronoi
D3 plugin which computes a Voronoi tesselation where each cell defines a region inside a given distance

#### Context

As stated in the first sentence of the README file of the [d3-voronoi repository](https://github.com/d3/d3/wiki/Voronoi-Geom):

> Voronoi layouts are particularly useful for invisible interactive regions, as demonstrated in Nate Vack’s [Voronoi picking](http://bl.ocks.org/njvack/1405439) example

But this cited example also shows that interactive regions should be close to each point/subjectOfMatter. In other words, if the interactive region is far away from the subject of matter, interaction becomes confusing.

In its example, Nate Vack uses SVG's clipPath technique to cut off Voronoï-based interactive regions. This plugin mimic the final result by computing the adequate distance-limited region around each subject of matter. The adequate region is the intersection area between the Voronoï cell and a max-distance circle.

#### Examples

* This [block](http://bl.ocks.org/Kcnarf/6d5ace3aa9cc1a313d72b810388d1003) is an update of Nate Vack’s _Voronoi picking_ example, using the __d3.limitedDistanceVoronoi__ plugin
* This [block](http://bl.ocks.org/Kcnarf/4de291d8b2d1e6501990540d87bc1baf) uses the __d3.limitedDistanceVoronoi__ plugin in a real case study

#### Usages
In your HTML file, load the plugin after loading D3. The result may look like:
```html
<script src="https://d3js.org/d3.v3.min.js"></script>
<script src="https://rawgit.com/Kcnarf/d3.geom.distanceLimitedVoronoi/master/distance-limited-voronoi.js"></script>
```

Later, in your javascript, in order to define the layout:
```javascript
var limitedVoronoi = d3.distanceLimitedVoronoi()
  .x(...)                                     // set the x accessor (as in d3.geom.voronoi)
  .y(...)                                     // set the y accessor (as in d3.geom.voronoi)
  .limit(20)                                  // set the maximum distance
var limitedCells = limitedVoronoi(data)       // compute the layout; return an array of {path: , point: }
                                                // where 'path' is the adequate region around the datum
                                                // and 'point' is the datum (as in d3.geom.voronoi)
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

#### Reference
* d3-voronoi: https://github.com/d3/d3/wiki/Voronoi-Geom
