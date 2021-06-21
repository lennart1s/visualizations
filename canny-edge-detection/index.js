var img


function preload() {
    img = loadImage("res/deadpool.jpg")

}

function setup() {

    createCanvas(800, 800)
    
    image(img, 0, 0, 200, img.height*200/img.width)
    
    grayscale()
    image(img, 250, 0, 200, img.height*200/img.width)

    gaussianBlur(5, 1.2)
    image(img, 500, 0, 200, img.height*200/img.width)
}

function gaussianBlur(R, s) {
    img.loadPixels()

    let old = [...img.pixels]
    let gbk = gaussianKernel(R, s)

    for (let x = 0; x < img.width; x++) {
        for (let y = 0; y < img.height; y++) {
            var i = (x + y * img.width)*4;
            
            let red = 0
            let green = 0
            let blue = 0
            for (let dx = max(0, x-R); dx <= min(x+R, img.width-1); dx++) {
                for (let dy = max(0, y-R); dy <= min(y+R, img.height-1); dy++) {
                    var j = (dx + dy * img.width)*4;
                    red += old[j] * gbk[dx-x+R][dy-y+R]
                    green += old[j+1] * gbk[dx-x+R][dy-y+R]
                    blue += old[j+2] * gbk[dx-x+R][dy-y+R]
                }    
            }

            img.pixels[i] = red
            img.pixels[i+1] = green
            img.pixels[i+2] = blue
        }
    }
    img.updatePixels()

} 

function gaussianKernel(r, s=1) {
    let kernel = []
    for (let i = 1; i <= 2*r+1; i++) {
        let line = []
        for(let j = 1; j <= 2*r+1; j++) {
            let v = 1/(2*Math.PI*s*s)
            v *= Math.exp(- (pow(i-(r+1), 2)+pow(j-(r+1), 2)) / (2*s*s))
            line.push(v)
        }
        kernel.push(line)
    }

    return kernel
}

function grayscale() {
    img.loadPixels()
    for (let x = 0; x < img.width; x++) {
        for (let y = 0; y < img.height; y++) {
            var i = (x + y * img.width)*4;
            
            let c = (img.pixels[i]+img.pixels[i+1]+img.pixels[i+2]) / 3
            img.pixels[i] = c
            img.pixels[i+1] = c
            img.pixels[i+2] = c
        }
    }
    img.updatePixels()
}