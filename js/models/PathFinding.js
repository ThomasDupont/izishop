/**
 * Created by thomas on 23/06/2017.
 */

let PathFinding = function() {
    /**
     * The current grid
     * @type {Array}
     */
    this.grid = [];

    /**
     * The path final by position
     * @type {Array}
     */
    this.pathFinal = []
    /**
     *
     * @type {Array}
     * @private finalGrid with the path
     */
    let _finalGrid = [];

    /**
     * A* algo to find the shorest path from A point to B point
     * @param array startCoordinates, Start
     * @param array grid, The map of the shop (by reference)
     * @returns {Array} array of position or empty
     */
    this.findShortestPath = function(startCoordinates, grid) {
        var grid = grid || this.grid;
        grid = JSON.parse(JSON.stringify(grid));
        var queue = [{
            distanceFromTop: startCoordinates[0],
            distanceFromLeft: startCoordinates[1],
            path: [],
            positionPath : [],
            status: 'Start'
        }];
        var orientation = ['North', 'East', 'South', 'West'];
        //We loop on the position queu
        while (queue.length > 0) {
            // we test the first position and put off the key
            var currentLocation = queue.shift();
            // We test all the possible orientation
            for(var i = 0; i < orientation.length; i++) {
                var newLocation = _exploreInDirection(currentLocation, orientation[i], grid);
                if (newLocation.status === 2) {
                    // The location if the ending position
                    return newLocation.positionPath;
                } else if (newLocation.status === 'Valid') {


                    // We add the location to the queue to be test
                    queue.push(newLocation);
                }
            }
        }
        return [];
    };

    /**
     * Private function to test the direction for the grid and set the nex position
     * @param object currentLocation, The current position
     * @param string direction, The direction to test (North, Sud, East, West)
     * @param array grid, The map of the shop (by reference)
     * @returns {{distanceFromTop: (number|*), distanceFromLeft: (*|number), path, positionPath, status: string}}
     */
    let _exploreInDirection = function(currentLocation, direction, grid) {
        var dft = currentLocation.distanceFromTop;
        var dfl = currentLocation.distanceFromLeft;
        // we add the distance from the start position
        if (direction === 'North') {
            dft -= 1;
        } else if (direction === 'East') {
            dfl += 1;
        } else if (direction === 'South') {
            dft += 1;
        } else if (direction === 'West') {
            dfl -= 1;
        }

        var newPath = currentLocation.path.slice();
        newPath.push(direction)
        var positionPath = currentLocation.positionPath.slice();
        positionPath.push([dft, dfl]);

        var newLocation = {
            distanceFromTop: dft,
            distanceFromLeft: dfl,
            path: newPath,
            positionPath : positionPath,
            status: (dfl < 0 || dfl >= grid.length || dft < 0 || dft >= grid.length) ?
                'Invalid' : (grid[dft][dfl] === 2) ? 2 : (grid[dft][dfl] !== 0) ?  'Blocked' : 'Valid'
        };

        if (newLocation.status === 'Valid') {
            grid[newLocation.distanceFromTop][newLocation.distanceFromLeft] = 'Visited';
        }
        return newLocation;
    };
    /**
     *
     * @param array grid, the grid (mass plan) represent the shop map
     */
    this.setGrid = function(grid) {
        this.grid = grid;
    };
    /**
     *
     * @returns {Array} The final grid
     */
    this.getFinalGrid = function() {
        return _finalGrid;
    };
    /**
     *
     * @returns {Array} the Final Path
     */
    this.getPathFinal = function() {
        return this.pathFinal;
    };
    /**
     *
     * @param array list, the shopping list
     * @param array start, The starting position, default [0,0]
     * @returns {PathFinding} instance of PathFinding prototype
     */
    this.calcItenary = function(list, currentPoint = [0,0]) {
        var pathFinal = [];
        _finalGrid = JSON.parse(JSON.stringify(this.grid));
        _finalGrid[currentPoint[0]][currentPoint[1]] = 4;
        // loop on the shopping list
        while(list.length > 0) {
            var tmp = [];
            // we get all possible path for the position
            for(var i = 0; i < list.length; i++) {
                var el = list[i];
                this.grid[el.position[0]][el.position[1]] = 2;
                var path = this.findShortestPath(currentPoint);
                if(path.length > 0) {
                    tmp.push(path);
                }
                this.grid[el.position[0]][el.position[1]] = 0;
            }
            // we get the shortest path found
            var length = tmp.map(function (x) {
                return x.length;
            });
            var min = length.indexOf(Math.min.apply(Math, length));
            // we push all position of the shortest path to the final array
            var len = tmp[min].length-1;
            tmp[min].forEach(function(e, i) {
                // we set the path on the grid
                _finalGrid[e[0]][e[1]] = i === len ? 2 : 4;
                pathFinal.push(e);
            });
            // The new current Point become the position of the last element of the shopping list
            currentPoint = list[min].position;
            // We delete the traeted element of the shopping list
            list.splice(min, 1);
        }

        this.pathFinal = pathFinal;
        return this;
    };
};