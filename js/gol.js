const LIFE = '⬛️';
const DEATH = '⬜️';

// this function is used when reading from the html DOM

function readGrid() {
    var mybody      = document.getElementById("main");
    var mytable     = mybody.getElementsByTagName("table")[0];
    var mytablebody = mytable.getElementsByTagName("tbody")[0];

    var temp_grid = [];

    for (var i = 0; i < mytablebody.getElementsByTagName("tr").length; i++) {
        var myrow = mytablebody.getElementsByTagName("tr")[i];
        temp_grid[i] = [];

        for (var j = 0; j < myrow.getElementsByTagName("td").length; j++) {
            var mycel = myrow.getElementsByTagName("td")[j];

            // if mouse goes over a cell creates life, just like god!
            document.getElementById("cell_" + i + "_" + j).onclick = function() {
                this.childNodes[0].data = LIFE;
            };

            temp_grid[i][j] = mycel.childNodes[0].data;
        }
    }

    return temp_grid;
}

// replace current elements of grid with new values

function writeGrid(grid) {
    for (var i = 0; i < grid.length; i++) {
        for (var j = 0; j < grid[i].length; j++) {
            document.getElementById("cell_" + i + "_" + j).innerHTML = grid[i][j];
        }
    }
}

// print the matrix value in input to the HTML DOM

function generateGrid(grid) {
    // get the reference for the body
    var body = document.getElementById("main");

    // creates a <table> element and a <tbody> element
    var tbl = document.createElement("table");
    var tblBody = document.createElement("tbody");

    // creating all cells
    for (var i = 0; i < grid.length; i++) {
        // creates a table row
        var row = document.createElement("tr");

        for (var j = 0; j < grid[i].length; j++) {
            // Create a <td> element and a text node, make the text
            // node the contents of the <td>, and put the <td> at
            // the end of the table row
            var cell = document.createElement("td");
            cell.id = "cell_" + i + "_" + j;

            var cellText = document.createTextNode(grid[i][j]);

            cell.appendChild(cellText);
            row.appendChild(cell);
        }

        // add the row to the end of the table body
        tblBody.appendChild(row);
    }

    // put the <tbody> in the <table>
    tbl.appendChild(tblBody);
    // appends <table> into div main
    body.appendChild(tbl);
    // sets the border attribute of tbl to 2;
    tbl.setAttribute("border", "1");
}

function mod(n, m) {
    return ((n % m) + m) % m;
}

function copyGrid(grid) {
    var tempGrid = [];

    for (var i = 0; i < grid.length; i++) {
        tempGrid[i] = [];
        for (var j = 0; j < grid[i].length; j++) {
            tempGrid[i][j] = grid[i][j];
        }
    }

    return tempGrid;
}

function generateRandom(width, height) {
    var tempGrid = [];

    for (var i = 0; i < height; i++) {
        tempGrid[i] = [];
        for (var j = 0; j < width; j++) {
            //tempGrid[i][j] = DEATH;
            tempGrid[i][j] = Math.floor(Math.random() * 2) == 0 ? DEATH : LIFE;
        }
    }

    return tempGrid;
}

$(document).ready(function() {
    var refresh_time = 100;
    var paused = false;
    var stepped = false;

    // when resizing window change the
    $(window).resize(function(){location.reload();});

    $("#player").click(function(){
        paused = !paused;

        if (paused)
            $(this).text("play");
        else
            $(this).text("pause");
    });

    $("#step").click(function(){
        stepped = true;
        paused = false;

        $("#player").text("play");
    });

    $("#slower").click(function(){
        if (refresh_time < 10000) {
            refresh_time += 10;
        }
    });

    $("#faster").click(function(){
        if (refresh_time > 10) {
            refresh_time -= 10;
        }
    })

    var grid = generateRandom($(window).width()/30,$(window).height()/35);
    generateGrid(grid);

    (function loop() {
        window.setTimeout(function() {
            if (!paused) {
                var new_grid = readGrid();

                for (var i = 0; i < grid.length; i++) {
                    for (var j = 0; j < grid[i].length; j++) {

                        var life_forms = 0;

                        var neighbors = []

                        // find the neighbor cells to the current one.
                        // the grid closes in itself due to the modulus operator
                        neighbors.push(grid[mod(i - 1, grid.length)][mod(j - 1, grid[i].length)]);
                        neighbors.push(grid[mod(i - 1, grid.length)][j]);
                        neighbors.push(grid[mod(i - 1, grid.length)][mod(j + 1, grid[i].length)]);
                        neighbors.push(grid[i][mod(j - 1, grid[i].length)]);
                        neighbors.push(grid[i][mod(j + 1, grid[i].length)]);
                        neighbors.push(grid[mod(i + 1, grid.length)][mod(j - 1, grid[i].length)]);
                        neighbors.push(grid[mod(i + 1, grid.length)][j]);
                        neighbors.push(grid[mod(i + 1, grid.length)][mod(j + 1, grid[i].length)]);

                        for (var k = 0; k < neighbors.length; k++)
                            if (neighbors[k] == LIFE)
                                life_forms += 1;

                        if (grid[i][j] == DEATH) {
                            // check if I can spawn a new cell
                            if (life_forms == 3) {
                                new_grid[i][j] = LIFE;
                            }
                        } else { // else current cell lives
                            // check if cell must die of over-population or under-population
                            if (life_forms < 2 || life_forms > 3) {
                                new_grid[i][j] = DEATH;
                            }
                        }
                    }
                }

                // write new grid to HTML DOM
                writeGrid(new_grid);

                // copy grid with new generations to the one
                // previously created
                grid = copyGrid(new_grid);

                if (stepped) {
                    paused = true;
                    stepped = false;
                }
            }
            console.log(refresh_time);
            loop();
        }, refresh_time);
    }());
});
