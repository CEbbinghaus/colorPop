// Mr. JPrograms is the creator of this idea. See: https://www.khanacademy.org/computer-programming/color-pop/6416482056208384

//const st = 1; // node width and height
const clrOff = 20; // 0 to 255, how much the color can change between nodes

const dirs = [[-1, 0], [0, -1], [1, 0], [0, 1]];

const initBool = (b) => {return {value : b || true, set : function(v){this.value = v}}}
const initNum = (n) => {return {value : n || 0, set : function(v){this.value = v}}}

const bytesToHex = (r, g, b) => {
    return "#" + (1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1);
};
const randInt = (min, max) => Math.floor(Math.random() * (max + 1 - min) + min);
const constrain = (v, min, max) => (v < min ? min : (v > max ? max : v));
const randomID = () => {let id = '';for(let i = 0; i < 8; i++){id += Math.random() * 10 | 0}return id}
const setNode = (a, b) => {
    a.r = constrain(a.r + randInt(-clrOff, clrOff), 0, 255);
    a.g = constrain(a.g + randInt(-clrOff, clrOff), 0, 255);
    a.b = constrain(a.b + randInt(-clrOff, clrOff), 0, 255);

    ctx.fillStyle = bytesToHex(a.r, a.g, a.b);
    ctx.fillRect(a.x * settings.get("pixelSize").value, a.y * settings.get("pixelSize").value, settings.get("pixelSize").value, settings.get("pixelSize").value);

    for (const [x, y] of dirs) {
        const px = a.x + x;
        const py = a.y + y;
        if (px >= 0 && px < cols && py >= 0 && py < rows) {
            const nb = nodes[px][py];
            if (!nb.set == b) {
                nb.set = "";
                nb.r = a.r;
                nb.g = a.g;
                nb.b = a.b;
                list.push(nb);
            }
        }
    }
};
const initNodes = () => {
    nodes = new Array(cols);
    for (let x = 0; x < cols; x++) {
        let col = nodes[x] = new Array(rows);
        for (let y = 0; y < rows; y++) {
            col[y] = {
                set: false,
                x: x,
                y: y,
                r: 0,
                g: 0,
                b: 0
            };
        }
    }
};

const loop = () => {
    nodeProg += list.length / 5;
    while (nodeProg > 1 && list.length) {
        nodeProg--;
        setNode(list.splice(Math.random() * list.length | 0, 1)[0]);
    }
    requestAnimationFrame(loop);
};
let init = () => {
    canvas = document.getElementById("canvas");
    cols = (canvas.width = innerWidth) / settings.get("pixelSize").value | 0;
    rows = (canvas.height = innerHeight) / settings.get("pixelSize").value | 0;
    ctx = canvas.getContext("2d");
    initNodes();
    if(settings.get("onStartup").value){
        let first = nodes[Math.random() * cols | 0][Math.random() * rows | 0];
        first.r = randInt(0, 255);
        first.g = randInt(0, 255);
        first.b = randInt(0, 255);
        setNode(first);
    }
    loop();
    init = null;
};

let canvas;
let cols;
let rows;
let ctx;
let nodes;
let list = [];
let nodeProg = 0;
let settings = new Map();
settings.set("onStartup", initBool(true))
settings.set("enableMouse", initBool(true))
settings.set("pixelSize", initNum(1))

window.wallpaperPropertyListener = {
    applyUserProperties: function(properties) {
        settings.forEach((v, k) => {
            if(properties[k]){
                settings.get(k).set(properties[k].value);
                console.log(k, properties[k].value)
            }
        })
        if(init){
            init()
        }
    }
}

document.addEventListener("mousedown", (evt) => {
    if(settings.get("enableMouse").value){
        let id = randomID();
        let mouse = nodes[Math.floor(evt.clientX / settings.get("pixelSize").value)][Math.floor(evt.clientY / settings.get("pixelSize").value)];
        mouse.r = randInt(0, 255);
        mouse.g = randInt(0, 255);
        mouse.b = randInt(0, 255);
        setNode(mouse, id);
    }
})
