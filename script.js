let S = 
{
    line: function (ax, ay, bx, by, f = 1.0)
    {
        let dx = bx - ax
        let dy = by - ay

        let d = Math.sqrt(dx * dx + dy * dy);
        let p = f * d / 150
        let steps = 20

        // let steps = 10

        // strokeWeight(1.5)
        // stroke(100, 255)
        // noFill()

        let x = ax
        let y = ay

        beginShape();
       
        vertex(x, y)

        for (let i = 0; i < steps; i++)
        {   
            x = ax + dx * (i / steps) + randomGaussian(0, d * 0.008)
            y = ay + dy * (i / steps) + randomGaussian(0, d * 0.008)
            vertex(x, y)
        }

        endShape()
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

let l = 20
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

function setup()
{
   
    createCanvas(500, 500)

    o  = { x: width / 2, y: height / 2}
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

    stroke(200)
    for (let i = -20; i < 20; i++)
    {
        for (let j = -20; j < 20; j++)
        {
            drawTile(Translate({ x: i, y: j}))
        }
    }


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

        drawCube(cube, cube.h, cube.c)
        // fill("blue")
        // text(i, Translate(cube).x, Translate(cube).y - 5)
        // i++
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



