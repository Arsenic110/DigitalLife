// { x: y: color: }

const particleAmount = 500;
const particles = [];
const colorPool = [];//["#FF0000", "#00FF00", "#0000FF", "#FFFF00"];

let abc = "ABCDEF00".split('');

for(let i = 0; i < 5; i++)
{
    let randString = "#";
    for(let j = 0; j < 6; j++)
    {
        randString += abc[Math.floor(Math.random() * abc.length)];
    }
    colorPool.push(randString);
}

const colorMatrix = [];

const bounds = { x: 500, y: 500 };
let frame = 0, prevFrame = 0;

function init()
{
    const canvas = document.getElementById("draw");
    canvas.width = bounds.x;
    canvas.height = bounds.y;

    for(let i = 0; i < particleAmount; i++)
    {
        particles.push(
            {
                x: Math.random() * bounds.x,
                y: Math.random() * bounds.y,
                color: Math.round(Math.random() * (colorPool.length - 1)),
                velocity: {x: 0, y: 0},
                mass: 1
            });
    }

    for(let c of colorPool)
    {
        let a = [];
        for(let t of colorPool)
        {
            a.push((Math.random() * 2) -1);
        }
        colorMatrix.push(a);
    }

    console.log(colorMatrix);
}

function update()
{
    for(let particle of particles)
    {
        for(let target of particles)
        {
            //compute distance to particle
            let distance = Math.round(Math.sqrt((target.x - particle.x) ** 2 + (target.y - particle.y) ** 2)); //fake distance

            let xDif = (target.x - particle.x) / 50
            let yDif = (target.y - particle.y) / 50

            if(distance < 100 && distance > 10) //performance
            {
                particle.velocity.x += xDif * (1 / distance) * colorMatrix[particle.color][target.color];
                particle.velocity.y += yDif * (1 / distance) * colorMatrix[particle.color][target.color];
            }
            else if(distance < 10 && distance > 5)
            {
                particle.velocity.x -= xDif * (1 / distance);
                particle.velocity.y -= yDif * (1 / distance);
            }
            else if (distance <= 5 && distance > 0)
            {
                //normal
                let nx = target.x - particle.x;
                let ny = target.y - particle.y;
                distance = Math.sqrt(nx * nx + ny * ny);
                nx /= distance;
                ny /= distance;

                //tangent
                let tx = -ny;
                let ty = nx;

                // Dot product tangent
                let dpTan1 = particle.velocity.x * tx + particle.velocity.y * ty;
                let dpTan2 = target.velocity.x * tx + target.velocity.y * ty;

                // Dot product normal
                let dpNorm1 = particle.velocity.x * nx + particle.velocity.y * ny;
                let dpNorm2 = target.velocity.x * nx + target.velocity.y * ny;
                
                // Conservation of momentum in 1D
                let m1 = (dpNorm1 * (particle.mass - target.mass) + 1 * target.mass * dpNorm2) / (particle.mass + target.mass);
                let m2 = (dpNorm2 * (target.mass - particle.mass) + 1 * particle.mass * dpNorm1) / (particle.mass + target.mass);

                particle.velocity.x = tx * dpTan1 + nx * m1;
                particle.velocity.y = ty * dpTan1 + ny * m1;
                target.velocity.x = tx * dpTan2 + nx * m2;
                target.velocity.y = ty * dpTan2 + ny * m2;
            }
            // else if (distance < 0)
            // {
            //     particle.velocity.x *= 0;
            //     particle.velocity.y *= 0;
            // }
        }

        particle.x += particle.velocity.x;
        particle.y += particle.velocity.y;

        //friction
        particle.velocity.x *= 0.99; 
        particle.velocity.y *= 0.99;

        //loopback
        if(particle.x >= bounds.x)
        {
            particle.x = 0;
        }
        if(particle.y >= bounds.y)
        {
            particle.y = 0;
        }

        if(particle.x < 0)
        {
            particle.x = bounds.x;
        }
        if(particle.y < 0)
        {
            particle.y = bounds.y;
        }
    }

}

function draw()
{

    const canvas = document.getElementById("draw");
    const ctx = canvas.getContext("2d");

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#373757";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for(let p of particles)
    {
        ctx.fillStyle = colorPool[p.color];

        ctx.beginPath();
        ctx.arc(p.x, p.y, 5, 0, 2*Math.PI, false);
        ctx.fill();
    }
}

window.addEventListener("load", () =>
{
    init();
    window.setInterval(() =>
    {
        update();
        draw();

        frame++
    }, 1)
})
