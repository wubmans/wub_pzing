let S = 
{
    line: function (ax, ay, bx, by, f = 0.0)
    {
        for (let i = 0; i < 2; i++)
        {
            let alpha = random() * TWO_PI
            let beta = random() * TWO_PI

            let dx = bx - ax
            let dy = by - ay
            // ax

            // let steps = 10

            strokeWeight(1.5)
            // stroke(100, 255)
            // noFill()

            let x = ax + sin(alpha) * f
            let y = ay + cos(alpha) * f

            let p = random() * 0.2 + 0.65  // tussen 65 en 85% vd lengte
            
            f = 0.5

            beginShape();
        
            curveVertex(ax, ay)
            curveVertex(ax + sin(alpha) * f, ay + cos(alpha) * f)
            curveVertex(ax + dx * p + f, ay + dy * p - f)
            curveVertex(bx + sin(beta) * f, by + cos(beta) * f)
            curveVertex(bx, by)
            endShape()
        }
        

        // for (let i = 0; i < steps; i++)
        // {   
        //     x = ax + dx * (i / steps) + randomGaussian(0, d * 0.008)
        //     y = ay + dy * (i / steps) + randomGaussian(0, d * 0.008)
        //     vertex(x, y)
        // }

        
    },

    intersect_vector_vector: function(ax, ay, vax, vay, bx, by, vbx, vby)
    {
        let d = vbx * vay - vby * vax

        if (d == 0 )
        {
            return
        }

        let m = ((by - ay) * vax - (bx - ax) * vay) / d
        let l = ((bx - ax) + m * vbx) / vax

        let x = bx + m * vbx
        let y = by + m * vby

        return { x: x, y: y}
    },

    intersect_vector_line: function(ax, ay, vax, vay, cx, cy, dx, dy)
    {
        let bx = cx;
        let by = cy;

        let vbx = dx - cx
        let vby = dy - cy

        let d = vbx * vay - vby * vax

        if (d == 0 )
        {
            return
        }

        let m = ((by - ay) * vax - (bx - ax) * vay) / d

        let x = bx + m * vbx
        let y = by + m * vby

        if (
            x >= min(cx, dx) && x <= max(cx, dx) && y >= min(cy, dy) && y <= max(cy, dy)
        )
        {
            return { x: x, y: y}
        }

        
    },

    sortClockwise: function (points)
    {
        let h = []

        points.sort((a, b) => a.x - b.x)

        let start = points.shift();
        h.push(start)

        let c = start;

        do 
        {
            let s = null

            for (let p of points)
            {
                if (s == null)
                {
                    s = p;
                    continue;
                }

                let cp = (p.x - c.x) * (s.y - c.y) - (p.y - c.y) * (s.x - c.x)

                if (cp < 0)
                {
                    s = p;
                }
            }

            c = s;

            h.push(s)
            points.splice(points.indexOf(s), 1)
        }   
        while (points.length > 1);

        h.push(points[0])

        return h

    }, 

    rect: function(x, y, w, h, f)
    {
        this.line(x, y, x + w, y, f)
        this.line(x, y + h, x + w, y + h, f)
        this.line(x, y, x, y + h, f)
        this.line(x + w, y, x + w, y + h, f)
    },

    quad: function (ax, ay, bx, by, cx, cy, dx, dy, f)
    {
        let points = this.sortClockwise([
            {x : ax, y: ay},
            {x : bx, y: by},
            {x : cx, y: cy},
            {x : dx, y: dy},
        ])

        for (let i = 0; i < 4; i++)
        {
            this.line(points[i].x, points[i].y, points[(i + 1) % 4].x, points[(i + 1 )% 4].y, f)
        }

        beginShape()
        points.forEach(p => vertex(p.x, p.y))
        endShape()
    },

    hatch: function (ax, ay, bx, by, cx, cy, dx, dy, r = 0, s = 1, f = 1)
    {
        let points = this.sortClockwise([
            {x : ax, y: ay},
            {x : bx, y: by},
            {x : cx, y: cy},
            {x : dx, y: dy},
        ])
        
        r = r % PI

        for (let p of points)
        {
            p.c = (- p.y * cos(r) - p.x * sin(r))
        }

        let pcs = [...points].sort((a, b) => a.c - b.c)

        let ebx = pcs[0].x
        let eby = pcs[0].y

        let eex = pcs[3].x
        let eey = pcs[3].y

        let d = Math.sqrt((eby - eey) * (eby - eey) + (ebx - eex) * (ebx - eex))

        let g = s / d
        let vx = cos(r)
        let vy = - sin(r)

        let vix
        let viy

        for (let i = 0; i < 1; i += g)
        {
            
            vix = ebx + (eex - ebx) * i
            viy = eby + (eey - eby) * i

            let ps = []

            for (let pi = 0; pi < points.length; pi++) 
            {
                let p = this.intersect_vector_line(vix, viy, vx, vy, points[pi].x, points[pi].y, points[(pi + 1) % points.length].x, points[(pi + 1) % points.length].y)
 
                if (p)
                {
                    ps.push(p)
                }
            }
                
            if (ps.length == 2)
            {
                this.line(ps[0].x, ps[0].y, ps[1].x, ps[1].y, f)
            }
        }
    }
}

let ax
let ay
let bx
let by

let grid

function createGrid(x, y)
{
    let grid = []
    for (let j = 0; j < y; j++)
        {
        for (let i = 0; i < x; i++)
        {
            if (!grid[i])
            {
                grid[i] = []
            }

            grid[i][y] = -1
            
        }
    }

    return grid
}

function draw()
{
    // clear()    
    // circle(ax, ay, 4)
    // circle(bx, by, 4)

    // let dx = ax - bx
    // let dy = ay - by

    // line(ax, ay, bx, by)

    // ax += 0.01 * dy
    // ay -= 0.01 * dx

   
}

let l = 30
let o

function Translate(c)
{
    if (!c.z)
    {
        c.z = 0
    }

    return {
        x: l * (c.x - c.y) + o.x,
        y: 0.5 * l * (c.x + c.y - 2 * c.z) + o.y
    }
}

function drawTile(c)
{
    S.quad(
        c.x - l, c.y,
        c.x + l, c.y,
        c.x, c.y - 0.5 * l,
        c.x, c.y + 0.5 * l
        )
}

function drawCube(c, z, cc  = 1)
{
    let cx = c.x
    let cy = c.y
    c = Translate(c)

    let ccl = l * cc

    fill("white")


    stroke(40)

    let A = { x: c.x - ccl,     y: c.y - z * ccl }
    let B = { x: c.x,           y: c.y - z * ccl + 0.5 * ccl}
    let C = { x: c.x + ccl,     y: c.y - z * ccl }
    let D = { x: c.x,           y: c.y - z * ccl - 0.5 * ccl}
    let E = { x: c.x - ccl,     y: c.y }
    let F = { x: c.x,           y: c.y + 0.5 * ccl }
    let G = { x: c.x + ccl,     y: c.y }


    S.quad(A.x, A.y, B.x, B.y, C.x, C.y, D.x, D.y)
    S.quad(A.x, A.y, B.x, B.y, E.x, E.y, F.x, F.y)
    S.quad(B.x, B.y, C.x, C.y, F.x, F.y, G.x, G.y)


    stroke(200)
    if (random() > 0.9)
    {
        S.hatch(A.x, A.y, B.x, B.y, C.x, C.y, D.x, D.y, atan(0.5), random() * 2 + 2, 1.5)
    }
    if (random() > 0.9)
    {
        S.hatch(A.x, A.y, B.x, B.y, C.x, C.y, D.x, D.y, - atan(0.5), random() * 2 + 2, 1.5)
    }


    stroke(random() * 80 + 120)
    if (random() > 0.8)
    {
        let p = random() * 10 + 2
        S.hatch(A.x, A.y, B.x, B.y, E.x, E.y, F.x, F.y, 0.5 * PI, p, 1.1)
        S.hatch(B.x, B.y, C.x, C.y, F.x, F.y, G.x, G.y, 0.5 * PI, p, 1.1)
    }
    if (random() > 0.8)
    {
        let p = random() * 10 + 2
        S.hatch(A.x, A.y, B.x, B.y, E.x, E.y, F.x, F.y, - atan(0.5), p, 1.6)
        S.hatch(B.x, B.y, C.x, C.y, F.x, F.y, G.x, G.y, atan(0.5), p, 1.6)
    }
    // S.hatch(c.x - l * cc, c.y - z * l, c.x + l * cc, c.y - z * l, c.x, c.y - z * l - 0.5 * l * cc, c.x, c.y - z * l + 0.5 * l * cc, atan(0.5), 2, 1.5)
    // S.hatch(c.x - l * cc, c.y - z * l, c.x - l * cc, c.y  + l * cc, c.x, c.y + 1.5 * l * cc, c.x, c.y - z * l + 0.5 * l * cc, - atan(0.5), random() * 5, 1)
    // stroke(128)
    // S.hatch(c.x - l * cc, c.y - z * l, c.x - l * cc, c.y  + l * cc, c.x, c.y + 1.5 * l * cc, c.x, c.y - z * l + 0.5 * l * cc, 0.5 * PI, 5, 1)
    // S.hatch(
    //     c.x - l * cc, c.y,
    //     c.x - l * cc, c.y + l * cc,
    //     c.x, c.y + 1.5 * l * cc,
    //     c.x, c.y + 0.5 * l * cc,
    //         0 * PI, 3, 1.3
    //     )

    
        // textFont('Courier New', 10);
        // fill('red')
    // text(`(${cx},${cy})`, c.x, c.y)
}



function drawGrid(grid)
{
    let pv = 0.2

    function sidewalk(x, y, direction)
    {
        let p = Translate({ x: x, y: y })

        switch(direction)
        {
            case "SW":
                line(p.x - l * ( 1 - pv), p.y - 0.5 * pv * l, p.x + l * pv, p.y + 0.5 * (1 - pv) * l)
                break;

            case "NW":
                line(p.x - l * ( 1 - pv), p.y + 0.5 * pv * l, p.x + pv * l, p.y - 0.5 * (1 - pv) * l)
                break;
            case "SE":
                line(p.x - pv * l, p.y + 0.5 * (1 - pv) * l, p.x + l * (1 - pv), p.y - 0.5 * pv * l)
                break;

            case "NE":
                line(p.x - pv * l, p.y - 0.5 * (1 - pv) * l, p.x + l * (1 - pv), p.y + 0.5 * pv * l)
                break;
            
        }
    }

    function sidewalk_corner(x, y, direction)
    {
        let p = Translate({ x: x, y: y })
        switch (direction)
        {
            case "E":
                line(p.x + l * ( 1 - 2 * pv), p.y, p.x + l * ( 1 - pv), p.y - 0.5 * pv * l)
                line(p.x + l * ( 1 - 2 * pv), p.y, p.x + l * ( 1 - pv), p.y + 0.5 * pv * l)
                break;

            case "W":
                line(p.x - l * ( 1 - pv), p.y - 0.5 * pv * l, p.x - l * ( 1 - 2 * pv), p.y)
                line(p.x - l * ( 1 - pv), p.y + 0.5 * pv * l, p.x - l * ( 1 - 2 * pv), p.y)
                break;
            case "S":
                
                line(p.x, p.y + 0.5 * l * (1 - 2 * pv), p.x + pv * l, p.y + 0.5 * (1 - pv) * l)
                line(p.x, p.y + 0.5 * l * (1 - 2 * pv), p.x - pv * l, p.y + 0.5 * (1 - pv) * l)
                break;

            case "N":
                line(p.x, p.y - 0.5 * l * (1 - 2 * pv), p.x + pv * l, p.y - 0.5 * (1 - pv) * l)
                line(p.x, p.y - 0.5 * l * (1 - 2 * pv), p.x - pv * l, p.y - 0.5 * (1 - pv) * l)
                break;
        }
    }

    function crosswalk(x, y, direction)
    {
        let p = Translate({ x: x, y: y })
        let pcw = 0.2 
        let pc = 0.1

        strokeWeight(2)

        for (let i = 0; i < 6; i++)
        {
            let px
            let py
            let ox
            let oy

            switch (direction)
            {
                case "SE":

                
                    px = p.x - l * pc + l * pv - pcw * l
                    py = p.y + 0.5 * (1 - pc) * l - 0.5 * l * pv - 0.5 * pcw * l
                    ox = i / 6 * l * (1 - 2 * pv)
                    oy = i / 6 * 0.5 * l * ( 1 - 2 * pv)

                    circle(px, py, 5)

                    line(
                        px + ox,
                        py - oy,
                        px + ox + pcw * l,
                        py - oy + 0.5 * pcw * l
                    )
                    break

                case "NW":
                    line(
                        i / 6 * l * (1 - 2 * pv) + p.x - l * (1 - pc) + l * pv, 
                        - i / 6 * 0.5 * l * ( 1 - 2 * pv) + p.y + 0.5 * (pc) * l - 0.5 * l * pv, 
                        i / 6 * l * (1 - 2 * pv) + p.x - l * (1 - pc) + l * pv + pcw * l, 
                        - i / 6 * 0.5 * l * ( 1 - 2 * pv) + p.y + 0.5 * (pc) * l - 0.5 * l * pv + 0.5 * pcw * l, 
                    )
                    break

                case "NE":
                    px = p.x - l * (pc) + l * pv - pcw * l
                    py = p.y - 0.5 * (1 - pc) * l + 0.5 * l * pv + 0.5 * pcw * l
                    ox = i / 6 * l * (1 - 2 * pv)
                    oy = i / 6 * 0.5 * l * ( 1 - 2 * pv)

                    line(
                        px + ox, 
                        py + oy, 
                        px + ox + pcw * l, 
                        py + oy - 0.5 * pcw * l, 
                    )
                    break

                case "SW":
                    
                    line(
                        i / 6 * l * (1 - 2 * pv) + p.x - l * (1 - pc) + l * pv, 
                        i / 6 * 0.5 * l * ( 1 - 2 * pv) + p.y - 0.5 * (pc) * l + 0.5 * l * pv, 
                        i / 6 * l * (1 - 2 * pv) + p.x - l * (1 - pc) + l * pv + pcw * l, 
                        i / 6 * 0.5 * l * ( 1 - 2 * pv) + p.y - 0.5 * (pc) * l + 0.5 * l * pv - 0.5 * pcw * l, 
                    )
                    break
                   
               

            }
                
                
        }

    }

    for (let x = 0; x < grid.length; x++)
    {
        for (let y = 0; y < grid[x].length; y++)
        {
            let c = color("white")
            if (typeof grid[x][y] == "object")
            {
                //continue
            }
            if (typeof grid[x][y] == "object" && grid[x][y].type == "road")
            {
                let p = Translate({ x: x, y: y })
                
                // fill(0, 20)
                // noStroke()
                noFill()
                stroke(0, 40)
                drawTile(Translate({ x: x, y: y}))
                fill("blue")
                stroke(0)
                textFont("Courier New", 10)
               // text(grid[x][y].mask, p.x, p.y)
                // c = colors[grid[x][y].mask]

                switch(grid[x][y].mask)
                {
                    case 40:
                        sidewalk(x, y, "NE")
                        sidewalk(x, y, "SW")
                        
                        drawingContext.setLineDash([5, 5]);
                        line(p.x - 0.5 * l, p.y - 0.5 * (1 - 0.5) * l, p.x + l * (1 - 0.5), p.y + 0.5 * 0.5 * l)
                        drawingContext.setLineDash([]);
                        break;

                    case 105:
                        sidewalk(x, y, "NE")
                        sidewalk(x, y, "SW")
                        crosswalk(x, y, "NW")
                        break;

                    case 130:
                        sidewalk(x, y, "NW")
                        sidewalk(x, y, "SE")
                        drawingContext.setLineDash([2, 4, 4, 2])
                        line(p.x - 0.5 * l, p.y + 0.25 * l, p.x + l * (1 - 0.5), p.y - 0.25 * l)
                        drawingContext.setLineDash([]);
                        break;


                    case 135:
                        sidewalk(x, y, "NW");
                        sidewalk(x, y, "SE");
                        crosswalk(x, y, "NE");
                        break;

                    case 168:
                        sidewalk(x, y, "NE")
                        sidewalk_corner(x, y, "W")
                        sidewalk_corner(x, y, "S")
                        break;

                    case 170:
                        sidewalk_corner(x, y, "N")
                        sidewalk_corner(x, y, "S")
                        sidewalk_corner(x, y, "E")
                        sidewalk_corner(x, y, "W")

                        // line(p.x - pv * l, p.y + 0.5 * (1 - pv) * l, p.x + l * (1 - pv), p.y - 0.5 * pv * l)
                        drawingContext.setLineDash([2, 4, 4, 2])
                        // line(p.x - 0.5 * l, p.y - 0.5 * (1 - 0.5) * l, p.x + l * (1 - 0.5), p.y + 0.5 * 0.5 * l)
                        // line(p.x - 0.5 * l, p.y + 0.25 * l, p.x + l * (1 - 0.5), p.y - 0.25 * l)
                        drawingContext.setLineDash([]);
                        break;

                    case 300:
                        sidewalk(x, y, "NE")
                        sidewalk(x, y, "SW")
                        crosswalk(x, y, "SE")
                        break;


                    case 448:
                        sidewalk(x, y, "NW")
                        sidewalk(x, y, "SE")
                        crosswalk(x, y, "SW")
                        break;


                }
            }
            noFill()
            // let c = color(colors[grid[x][y].mask])
            // c.setAlpha(130)
            // fill(c)
            // drawTile(Translate({ x: x, y: y}))
        }
    }
}

function getTileMask(grid, x, y)
{
    let mask = 0
    let f = -1
    for (let j = -1; j < 2; j++)
    {
        for (let i = -1; i < 2; i++)
        {
            f++
            let p = x + i
            let q = y + j

            if (p < 0 || p >= grid.length)
            {
                continue
            }

            if (q < 0 || q >= grid[x].length)
            {
                continue
            }

            if ( i==0 && j == 0)
            {
                continue
            }

            if (typeof grid[p][q] === "object" && grid[p][q].type == "road")
            {
                mask |= (1 << f)
            }
        }
    }
    
    return mask
}

function createRoad(grid, a, b, l, d)
{
    for (let i = 0; i < l; i++)
    {
        let x = d == 0 ? a + i  : a
        let y = d == 0 ? b : b + i

        if ( x < 0 || x >= grid.length)
        {
            continue
        }

        if (y < 0 || y >= grid[x].length)
        {
            continue
        }

        let mask = getTileMask(grid, x, y)
        let disallowed = false
 
        for(let m of [11, 38, 200, 416])
        {
            if ((mask | m) == mask)
            {   
                disallowed = true;
                break;
            }
        }

        if (disallowed)
        {
            continue
        }

        grid[x][y] = { "type": "road"}
    }
}

function analyzeGrid(grid)
{
    for (let x = 0; x < grid.length; x++)
    {
        for (let y = 0; y < grid[x].length; y++)
        {
            let tile = grid[x][y]

            if (typeof tile !== "object")
            {
                continue
            }

            if (tile.type == "road")
            {
                tile.mask = getTileMask(grid, x, y)
            }
        }
    }
}

function setup()
{
   
    o  = { x: width * 2 + width, y: height / 2 - height / 2}

    createCanvas(500, 500)
    grid = createGrid(40, 40)
    drawGrid(grid, 40, 40)
    
    for (let i = 0; i < 20; i++)
    {
        let a = random() * 40 | 0;
        let b = random() * 40 | 0;
        let c = random() * 40 
        let d = random() * 2 | 0

        createRoad(grid, min(a, b), max(a, b), c, d) 
    }

    analyzeGrid(grid)
    drawGrid(grid)
    // ax = random() * 450 + 50
    // ay = random() * 450 + 50
    // bx = random() * 450 + 50
    // by = random() * 450 + 50

    // let l = 30

    // for (let j = 0; j < 2; j++)
    // {
    //     let x = random() * 10 | 0 + 10
    //     let y = random() * 3 | 0
    //     console.log(x, y)

    //     let c = Translate({ x: x, y: y })
    //     drawTile(c)
    //     console.log(c)
    // }

    let cubes = []

    for (let i = -20; i < 20; i++)
    {
        for (let j = -20; j < 20; j++)
        {
            if (i % 3 == 0 || j % 3 == 0)
            {
                continue
            }

            let q = (i * i + j * j)
            if (q == 0)
            {
                q = 1
            }

            let h = (noise(i , j)) * (50 / q)
    
            if (random() * 100 > 100 - (q))
            {
                h *= 2
            }

            if (random() * 100 > 100 - (q))
            {
                h *= 2
            }

            h = min(h, 10)


            cubes.push({x: i, y: j, z: 0, h: h, c: max(0.4, random() * 0.9) })
        }
    }
 

    cubes.sort((a, b) => (a.x + a.y) - (b.x + b.y))

    let i = 0

    for (let cube of cubes)
    {
        // drawCube(cube, cube.h, cube.c)
    }

    
}




   
    // fill(100, 255, 255)
    // circle(ax, ay, 3)
    // circle(bx, by, 3)

    // let vax = random() * 2 - 1
    // let vay = random() * 2 - 1
    // let vbx = random() * 2 - 1
    // let vby = random() * 2 - 1

    // line(ax, ay, ax + vax * 20, ay + vay * 20)
    // line(bx, by, bx + vbx * 20, by + vby * 20)

    // let p = S.intersect(ax, ay, vax, vay, bx, by, vbx, vby)

    // if (p)
    // {
    //     fill(255, 100, 255)
    //     circle(p.x, p.y, 4)
    // }

// }




