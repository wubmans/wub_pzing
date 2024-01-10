let S = 
{
    intersect: function(ax, ay, vax, vay, bx, by, vbx, vby)
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
        
        let cx = ax + l * vax
        let cy = ay + l * vay

        // noFill()
        // circle(cx, cy, 10)

        return { x: x, y: y}
    },

    hatch: function (ax, ay, bx, by, cx, cy, dx, dy, r)
    {

        text('A', ax - 10, ay - 10)
        text('B', bx - 10, by - 10)
        text('C', cx - 10, cy - 10)
        text('D', dx - 10, dy - 10)
        line(ax, ay, bx, by)
        line(bx, by, cx, cy)
        line(cx, cy, dx, dy)
        line(dx, dy, ax, ay)

        let vcdx = dx - cx
        let vcdy = dy - cy

        

        r = random() * TWO_PI

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

        let ebx = ax
        let eby = ay

        let eex = cx
        let eey = cy

        let d = Math.sqrt((eby - eey) * (eby - eey) + (ebx - eex) * (ebx - eex))

        let g = 7 / d

        for (let i = 0; i < 1; i += g)
        {
            let vx = sin(r)
            let vy = cos(r)

            let vix = ebx + (eex - ebx) * i
            let viy = eby + (eey - eby) * i

           // circle(vix, viy, 3)

            let ps = [
                { x: ax, y: ay},
                { x: bx, y: by},
                { x: cx, y: cy},
                { x: dx, y: dy}
            ]

            let intps = []

            for (let pi = 0; pi < ps.length; pi++) 
            {
                let p = this.intersect(vix, viy, vx, vy, ps[pi].x, ps[pi].y, ps[(pi + 1) % ps.length].x - ps[pi].x, ps[(pi + 1) % ps.length].y - ps[pi].y)
 
                if (p)
                {
                    intps.push(p)
                }
            }

            // for (let p of intps)
            // {
            //     circle(p.x, p.y, 3)
            // }

            intps.sort((a, b) => b.x - a.x)

            if (intps.length == 4)
            {
                line(intps[1].x, intps[1].y, intps[2].x, intps[2].y)
            }
            // {
            //     //circle(p.x, p.y, 4)
            //     stroke(0, 40)
            //     line(vix, viy, p.x, p.y)
            // }
        }
    }
}

function setup()
{
    createCanvas(500, 500)

    let ax = random() * 400 + 50 
    let ay = random() * 400 + 50 
    let bx = random() * 400 + 50 
    let by = random() * 400 + 50 

    let cx = random() * 400 + 50 
    let cy = random() * 400 + 50 
    let dx = random() * 400 + 50 
    let dy = random() * 400 + 50 

    
    line(ax, ay, bx, by)
    line(cx, cy, dx, dy)

    S.hatch(ax, ay, bx, by, cx, cy, dx, dy)

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

}
