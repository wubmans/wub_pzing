let S = 
{
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

        // circle(x, y, 2)

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
        console.log(start)

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

    hatch: function (ax, ay, bx, by, cx, cy, dx, dy, r)
    {
        let points = this.sortClockwise([
            {x : ax, y: ay},
            {x : bx, y: by},
            {x : cx, y: cy},
            {x : dx, y: dy},
        ])


        text('A', points[0].x - 10, points[0].y - 10)
        text('B', points[1].x - 10, points[1].y - 10)
        text('C', points[2].x - 10, points[2].y - 10)
        text('D', points[3].x - 10, points[3].y - 10)

        line(points[0].x, points[0].y, points[1].x, points[1].y)
        line(points[1].x, points[1].y, points[2].x, points[2].y)
        line(points[2].x, points[2].y, points[3].x, points[3].y)
        line(points[3].x, points[3].y, points[0].x, points[0].y)

        // line(points[0].x, points[0].y, points[2].x, points[2].y)
        // line(points[1].x, points[1].y, points[3].x, points[3].y)

        r = random() * TWO_PI
        r = r % PI

        // r = 0

        // let eb
        // let ee

        // if (abs(by - ay) > abs(bx -ax))
        // {
        //     eb = min(by, ay)
        //     ee = max(by, ay)
        // }
        // else
        // {
        //     eb = min(bx, ax)
        //     ee = max(bx, ax)
        // }

        // let ebx = Math.min(... points.map(p => p.x))
        // let eby = Math.min(... points.map(p => p.y))

        // let eex = Math.max(... points.map(p => p.x))
        // let eey = Math.max(... points.map(p => p.y))
        // let eby = points[0].y

        // strokeWeight(0.2)
        // line(ebx, eby, eex, eby)
        // line(ebx, eey, eex, eey)
        // line(ebx, eby, ebx, eey)
        // line(eex, eby, eex, eey)

        // let eex = points[2].x
        // let eey = points[2].y

        strokeWeight(2)

      

        // // let ar = this.intersect_vector_vector(points[0].x, points[0].y, sin(r), cos(r), points[1].x, points[1].y, cos(r), sin(r))

        // // if (ar)
        // // {
        // //     line(points[0].x, points[0].y, ar.x, ar.y)
        // //     circle(ar.x, ar.y, 4)
        // // }

        // let q = atan(abs(eey - eby) / abs(eex - ebx))

        console.log(r / PI)
        // // console.log(q / PI)
       
        // if ((q - r) < 0)
        // {
        //     q += PI
        // }

        // //console.log((q - r) / PI)


        for (let p of points)
        {
            p.c = (- p.y * cos(r) - p.x * sin(r))
        }

        let pcs = [...points].sort((a, b) => a.c - b.c)

        let colors = 
        [
"rgb(255, 0, 0)",
"rgb(255, 100, 100)",
"rgb(255, 150, 150)",
"rgb(255, 250, 250)",
        ]

        pcs.forEach((pcs, i) => 
        {
            fill(colors[i])
            circle(pcs.x, pcs.y, 10)
        })

        let ebx = pcs[0].x
        let eby = pcs[0].y

        let eex = pcs[3].x
        let eey = pcs[3].y

        let d = Math.sqrt((eby - eey) * (eby - eey) + (ebx - eex) * (ebx - eex))

        let g = 7 / d
        let vx = cos(r)
        let vy = - sin(r)

        let vix
        let viy

        for (let i = 0; i < 1; i += g)
        {
            
            vix = ebx + (eex - ebx) * i
            viy = eby + (eey - eby) * i

            circle(vix, viy, 3)


            let ps = []

            for (let pi = 0; pi < points.length; pi++) 
            {
                let p = this.intersect_vector_line(vix, viy, vx, vy, points[pi].x, points[pi].y, points[(pi + 1) % points.length].x, points[(pi + 1) % points.length].y)
 
                if (p)
                {
                    ps.push(p)
                }
            }

            // intps.sort((a, b) => b.y - a.y)

            if (ps.length == 2)
            {
                line(ps[0].x, ps[0].y, ps[1].x, ps[1].y)
            }
            //}
            // {
            //     //circle(p.x, p.y, 4)
            //     stroke(0, 40)
            //     line(vix, viy, p.x, p.y)
            // }
        }
    }
}

let ax
let ay
let bx
let by

let cx
let cy
let dx
let dy

function draw()
{
    // clear()
    // S.hatch(ax, ay, bx, by, cx, cy, dx, dy)
}

function setup()
{
    createCanvas(500, 500)

    ax = random() * 400 + 50 
    ay = random() * 400 + 50 
    bx = random() * 400 + 50 
    by = random() * 400 + 50 

    cx = random() * 400 + 50 
    cy = random() * 400 + 50 
    dx = random() * 400 + 50 
    dy = random() * 400 + 50 

    S.hatch(ax, ay, bx, by, cx, cy, dx, dy)
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

