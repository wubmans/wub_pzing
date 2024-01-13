let S = 
{
    line: function (ax, ay, bx, by, f = 1.0)
    {
        let dx = bx - ax
        let dy = by - ay

        let d = Math.sqrt(dx * dx + dy * dy);
        let p = f * d / 1000
        let steps = Math.floor(d / 10)

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
            x += dx / steps + randomGaussian(0, p)
            y += dy / steps + randomGaussian(0, p)
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

    hatch: function (ax, ay, bx, by, cx, cy, dx, dy, r, s, f)
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

let cx
let cy
let dx
let dy

let rects = []

function draw()
{
    if (random() * 1000 < 800)
    {
        return
    }


    clear()
    // S.hatch(ax, ay, bx, by, cx, cy, dx, dy)

    for (let rect of rects)
    {

        if (random() * 100 > 50)
        {
            rect.x += random() * 2 - 1
            rect.y += random() * 2 - 1
            rect.w += random() * 2 - 1
            rect.h += random() * 2 - 1
        }
        

        stroke(rect.c)

        S.rect(rect.x, rect.y, rect.w, rect.h, 5)
        // if (random() > 0.5)
        // {
        S.hatch(rect.x, rect.y, rect.x + rect.w, rect.y, rect.x, rect.y + rect.h, rect.x + rect.w , rect.y + rect.h, rect.r, rect.s, rect.f)
        // }
        // if (random() > 0.5)
        // {
        //     S.hatch(rect.x, rect.y, rect.x + rect.w, rect.y, rect.x, rect.y + rect.h, rect.x + rect.w , rect.y + rect.h, rect.r + 0.25 * PI, rect.s, rect.f)
        // }
    }
}

function setup()
{
    createCanvas(500, 500)

    let colors = 
    [
        "#22092C",
        "#872341",
        "#BE3144",
        "#F05941",
    ]

    for (let i = 0; i < 20; i++) 
    {

        x = random() * 400 + 50 
        y = random() * 400 + 50 
        w = random() * (100) + 10 
        h = random() * 100 + 10 

        rects.push(
            {
                x: x,
                y: y,
                w: w,
                h: h,
                r: random() * PI,
                f: random() * 5 + 5,
                s: random() * 10,
                c: colors[random() * (colors.length - 1) | 0]
            }
        )

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

