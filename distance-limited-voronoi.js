d3.distanceLimitedVoronoi = function () {
  /////// Internals ///////
  var voronoi = d3.voronoi().extent([[-1e6,-1e6], [1e6,1e6]]);
  var limit = 20;             // default limit

  function _distanceLimitedVoronoi (data) {
    return voronoi.polygons(data).map(function(cell) {
      return {
        path: distanceLimitedCell (cell, limit),
        datum: cell.data
      };
    });
  }

  ///////////////////////
  ///////// API /////////
  ///////////////////////

  _distanceLimitedVoronoi.limit = function(_) {
    if (!arguments.length) { return limit; }
    if (typeof _ === "number") {
      limit = Math.abs(_);
    }

    return _distanceLimitedVoronoi;
  };

  _distanceLimitedVoronoi.x = function(_) {
    if (!arguments.length) { return voronoi.x(); }
    voronoi.x(_);

    return _distanceLimitedVoronoi;
  };

  _distanceLimitedVoronoi.y = function(_) {
    if (!arguments.length) { return voronoi.y(); }
    voronoi.y(_);

    return _distanceLimitedVoronoi;
  };

  _distanceLimitedVoronoi.extent = function(_) {
    if (!arguments.length) { return voronoi.extent(); }
    voronoi.extent(_);

    return _distanceLimitedVoronoi;
  };

  //exposes the underlying d3.geom.voronoi
  //eg. allows to code 'limitedVoronoi.voronoi().triangle(data)'
  _distanceLimitedVoronoi.voronoi = function(_) {
    if (!arguments.length) { return voronoi; }
    voronoi = _;

    return _distanceLimitedVoronoi;
  };

  ///////////////////////
  /////// Private ///////
  ///////////////////////

  function distanceLimitedCell (cell, r) {
    var seed = [voronoi.x()(cell.data), voronoi.y()(cell.data)];
    if (allVertecesInsideMaxDistanceCircle(cell, seed, r)) {
      return "M"+cell.join("L")+"Z";
    } else {
      var path = "";
      var firstPointTooFar = pointTooFarFromSeed(cell[0], seed, r);
      var p0TooFar = firstPointTooFar;
      var p0, p1, intersections;
      var openingArcPoint, lastClosingArcPoint;

      //begin: loop through all segments to compute path
      for (var iseg=0; iseg<cell.length; iseg++) {
        p0 = cell[iseg];
        p1 = cell[(iseg+1)%cell.length];
        // compute intersections between segment and maxDistance circle
        intersections = segmentCircleIntersections (p0, p1, seed ,r);
        // complete the path (with lines or arc) depending on:
        	// intersection count (0, 1, or 2)
        	// if the segment is the first to start the path
        	// if the first point of the segment is inside or outside of the maxDistance circle
        if (intersections.length===2) {
          if (p0TooFar) {
            if (path==="") {
              // entire path will finish with an arc
              // store first intersection to close last arc
              lastClosingArcPoint = intersections[0];
              // init path at 1st intersection
              path += "M"+intersections[0];
            } else {
            	//close arc at first intersection
              path += largeArc(openingArcPoint, intersections[0], seed)+" 0 "+intersections[0];
            }
            // then line to 2nd intersection, then initiliaze an arc
            path += "L"+intersections[1];
            path += "A "+r+" "+r+" 0 ";
            openingArcPoint = intersections[1];
          } else {
            // THIS CASE IS IMPOSSIBLE AND SHOULD NOT ARISE
            console.error("What's the f**k");
          }
        } else if (intersections.length===1) {
          if (p0TooFar) {
            if (path==="") {
              // entire path will finish with an arc
              // store first intersection to close last arc
              lastClosingArcPoint = intersections[0];
              // init path at first intersection
              path += "M"+intersections[0];
            } else {
              // close the arc at intersection
            	path += largeArc(openingArcPoint, intersections[0], seed)+" 0 "+intersections[0];
            }
            // then line to next point (1st out, 2nd in)
            path += "L"+p1;
          } else {
            if (path==="") {
              // init path at p0
              path += "M"+p0;
            }
            // line to intersection, then initiliaze arc (1st in, 2nd out)
            path += "L"+intersections[0];
            path += "A "+r+" "+r+" 0 ";
            openingArcPoint = intersections[0];
          }
          p0TooFar = !p0TooFar;
        } else {
          if (p0TooFar) {
            // entire segment too far, nothing to do
            true;
          } else {
            // entire segment in maxDistance
            if (path==="") {
              // init path at p0
              path += "M"+p0;
            }
            // line to next point
            path += "L"+p1;
          }
        }
      }//end: loop through all segments

      if (path === '') {
        // special case: no segment intersects the maxDistance circle
        // cell perimeter is entirely outside the maxDistance circle
        // path is the maxDistance circle, drawing 2 1/2-circles as mbostock does for its d3.svg.symbol.type("circle")
        path = "M"+[seed[0]+r,seed[1]]+"A "+r+" "+r+" 0 0 0 "+[seed[0]-r,seed[1]]+"A "+r+" "+r+" 0 0 0 "+[seed[0]+r,seed[1]]+"Z";
      } else {
        // if final segment ends with an opened arc, close it
        if (firstPointTooFar) {
          path += largeArc(openingArcPoint, lastClosingArcPoint, seed)+" 0 "+lastClosingArcPoint;
        }
        path+="Z";
      }

      return path;
    }

    function allVertecesInsideMaxDistanceCircle (cell, seed, r) {
      var result = true;
      var p;
      for (var ip=0; ip<cell.length; ip++) {
        result = result && !pointTooFarFromSeed(cell[ip], seed, r);
      }
      return result;
    }

    function pointTooFarFromSeed(p, seed, r) {
      return (Math.pow(p[0]-seed[0],2)+Math.pow(p[1]-seed[1],2)>Math.pow(r, 2));
    }

    function largeArc(p0, p1, seed) {
      var v1 = [p0[0] - seed[0], p0[1] - seed[1]],
          v2 = [p1[0] - seed[0], p1[1] - seed[1]];
      // from http://stackoverflow.com/questions/2150050/finding-signed-angle-between-vectors
      var angle = Math.atan2( v1[0]*v2[1] - v1[1]*v2[0], v1[0]*v2[0] + v1[1]*v2[1] );
      return (angle<0)? 0 : 1;
    }
  }

  function segmentCircleIntersections (A, B, C, r) {
    /*
    from http://stackoverflow.com/questions/1073336/circle-line-segment-collision-detection-algorithm
    */
		var Ax = A[0], Ay = A[1],
        Bx = B[0], By = B[1],
        Cx = C[0], Cy = C[1];

    // compute the euclidean distance between A and B
    var LAB = Math.sqrt(Math.pow(Bx-Ax, 2)+Math.pow(By-Ay, 2));

    // compute the direction vector D from A to B
    var Dx = (Bx-Ax)/LAB;
    var Dy = (By-Ay)/LAB;

    // Now the line equation is x = Dx*t + Ax, y = Dy*t + Ay with 0 <= t <= 1.

    // compute the value t of the closest point to the circle center (Cx, Cy)
    var t = Dx*(Cx-Ax) + Dy*(Cy-Ay);

    // This is the projection of C on the line from A to B.

    // compute the coordinates of the point E on line and closest to C
    var Ex = t*Dx+Ax;
    var Ey = t*Dy+Ay;

    // compute the euclidean distance from E to C
    var LEC = Math.sqrt(Math.pow(Ex-Cx, 2)+Math.pow(Ey-Cy, 2));

    // test if the line intersects the circle
    if( LEC < r )
    {
      // compute distance from t to circle intersection point
      var dt = Math.sqrt(Math.pow(r, 2)-Math.pow(LEC, 2));
			var tF = (t-dt); // t of first intersection point
      var tG = (t+dt); // t of second intersection point

      var result = [];
      if ((tF>0)&&(tF<LAB)) { // test if first intersection point in segment
        // compute first intersection point
        var Fx = (t-dt)*Dx + Ax;
        var Fy = (t-dt)*Dy + Ay;
        result.push([Fx, Fy]);
      }
      if ((tG>0)&&(tG<LAB)) { // test if second intersection point in segment
        // compute second intersection point
        var Gx = (t+dt)*Dx + Ax;
        var Gy = (t+dt)*Dy + Ay;
        result.push([Gx, Gy]);
      }
      return  result;
    } else {
      	// either (LEC === r), tangent point to circle is E
      	// or (LEC < r), line doesn't touch circle
      	// in both cases, returning nothing is OK
      return [];
    }
  }

  return _distanceLimitedVoronoi;
};
