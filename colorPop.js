// Mr. JPrograms is the creator of this idea. See: https://www.khanacademy.org/computer-programming/color-pop/6416482056208384

//const st = 1; // node width and height
let clrOff = 0; // 0 to 255, how much the color can change between nodes

let dirs = [[-1, 0], [0, -1], [1, 0], [0, 1]];

const initBool = (b, x) => {let r = {value : b || true, set : function(v){this.value = v}}; for(let k in x){r[k] = x[k]};return r;}
const initNum = (n, x) => {let r = {value : n || 0, set : function(v){this.value = v}}; for(let k in x){r[k] = x[k]};return r;}
const initCol = (c, x) => {let r = {value : {r: c.r || 0, g: c.g || 0, b: c.b || 0}, set: function(v){console.log(v);let c = v.split(" "); c.forEach((e, i) => {c[i] = Math.round(parseFloat(e) * 255)});this.value.r = c[0];this.value.g = c[1];this.value.b = c[2]}};for(let k in x){r[k] = x[k]};return r;}

const bytesToHex = (r, g, b) => {
    return "#" + (1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1);
};
const randInt = (min, max) => Math.floor(Math.random() * (max + 1 - min) + min);
const constrain = (v, min, max) => (v < min ? min : (v > max ? max : v));
const randomID = () => {let id = '';for(let i = 0; i < 8; i++){id += Math.random() * 10 | 0}return id}
const setNode = (a, id) => {
    if(!id)return;
    if(!list.has(id)){
        list.set(id, [])
    }
    a.r = constrain(a.r + randInt(-clrOff, clrOff), 0, 255);
    a.g = constrain(a.g + randInt(-clrOff, clrOff), 0, 255);
    a.b = constrain(a.b + randInt(-clrOff, clrOff), 0, 255);

    ctx.fillStyle = bytesToHex(a.r, a.g, a.b);
    ctx.fillRect(a.x * settings.get("pixelSize").value, a.y * settings.get("pixelSize").value, settings.get("pixelSize").value, settings.get("pixelSize").value);
    for (let [x, y] of dirs) {
        const px = a.x + x;
        const py = a.y + y;
        if (px >= 0 && px < cols && py >= 0 && py < rows) {
            const nb = nodes[px][py];
            if (nb.set.indexOf(id) == -1) {
                nb.set.push(id);
                nb.r = a.r;
                nb.g = a.g;
                nb.b = a.b;
                list.get(id).push(nb);
            }
        }
    }
    let t = [];
    for(i = 0; i < 4; i++)
    {
        let n = Math.random() * dirs.length | 0;
        t.push(dirs[n]);
        dirs.splice(n, 1)
    }
    dirs = t;
};
const initNodes = () => {
    nodes = new Array(cols);
    for (let x = 0; x < cols; x++) {
        let col = nodes[x] = new Array(rows);
        for (let y = 0; y < rows; y++) {
            col[y] = {
                isActive: false,
                set: [],
                x: x,
                y: y,
                r: 0,
                g: 0,
                b: 0
            };
        }
    }
};
const update = () => {
    cols = Math.ceil(innerWidth / settings.get("pixelSize").value);
    rows = Math.ceil(innerHeight / settings.get("pixelSize").value);
    initNodes();
}
const loop = () => {
    list.forEach((v, k) => {
        nodeProg += v.length / 5;
        while (nodeProg > 1 && v.length) {
            nodeProg--;
            switch(settings.get('cal').value){
                case 0:
                    setNode(v.splice(Math.random() * v.length | 0, 1)[0], k);
                break
                case 1:
                    setNode(v.splice(v.length > 1 ? v.length - 1:v.length - 2, 1)[0], k);
                break
            }
        }
        if(v.length <= 0)list.delete(k);
    })
    requestAnimationFrame(loop);
};
let init = () => {
    canvas = document.getElementById("canvas");
    cols = Math.ceil((canvas.width = innerWidth) / settings.get("pixelSize").value);
    rows = Math.ceil((canvas.height = innerHeight) / settings.get("pixelSize").value);
    ctx = canvas.getContext("2d");
    initNodes();
    loop();
    init = null;
};

let canvas;
let cols;
let rows;
let ctx;
let nodes;
let list = new Map();
let nodeProg = 0;
let settings = new Map();
settings.set("pixelSize", initNum(1, {set: function(v){this.value = v; update()}}))
settings.set("updateSpeed", initNum(5000))
settings.set("rainbow", initBool(true))
settings.set("c1", initCol({r: 0, g: 0, b: 0}))
settings.set("c2", initCol({r: 0, g: 0, b: 0}))
settings.set("cal", initNum(0))

window.wallpaperPropertyListener = {
    applyUserProperties: function(properties) {
        if(properties.c1){
            console.log(properties.c1)
        }
        settings.forEach((v, k) => {
            if(properties[k]){
                settings.get(k).set(properties[k].value);
                console.log(k, properties[k].value)
            }
        })
        if(init){
            init()
            test()
        }
    }
}
/*
document.addEventListener("mousedown", (evt) => {
    let id = randomID();
    let mouse = nodes[Math.floor(evt.clientX / settings.get("pixelSize").value)][Math.floor(evt.clientY / settings.get("pixelSize").value)];
    mouse.r = randInt(0, 255);
    mouse.g = randInt(0, 255);
    mouse.b = randInt(0, 255);
    setNode(mouse, id);
})*/

function test () {
    let r = settings.get("rainbow").value
    let id = randomID();
    let n = nodes[rand(cols)][rand(rows)]
    let c;
    if(!r)c = settings.get("c1").value;
    n.r = r ? randInt(0, 255) : c.r
    n.g = r ? randInt(0, 255) : c.g
    n.b = r ? randInt(0, 255) : c.b
    setNode(n, id);
    id = randomID();
    b = nodes[rand(cols)][rand(rows)]
    if(!r)c = settings.get("c2").value;
    b.r = r ? randInt(0, 255) : c.r
    b.g = r ? randInt(0, 255) : c.g
    b.b = r ? randInt(0, 255) : c.b
    setNode(b, id);
    setTimeout(() => {
        test();
    },settings.get("updateSpeed").value)
}

const rand = (n) => {
    return Math.floor(Math.random() * n)
}
