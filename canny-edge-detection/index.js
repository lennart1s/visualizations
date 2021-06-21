var img


function preload() {
    img = loadImage("res/deadpool.jpg")

}

function setup() {

    createCanvas(1400, 1400)
    
    image(img, 0, 0, 300, img.height*300/img.width)
    
    grayscale()
    image(img, 350, 0, 300, img.height*300/img.width)

    gaussianBlur(2, 1.4)
    image(img, 0, 300, 300, img.height*300/img.width)

    let theta = sobelFilters()
    image(img, 350, 300, 300, img.height*300/img.width)
    console.log(theta[311][347] * 180 / Math.PI)

    nonMaxSuppression(theta)
    image(img, 0, 600, 300, img.height*300/img.width)

    /*for (let x = 0; x < theta.length; x++) {
        for (let y = 0; y < theta[x].length; y++) {
            colorMode(HSB, 2*Math.PI)
            strokeWeight(1)
            stroke(theta[x][y], 5, 5)
            point(650+x, 200+y)
            colorMode(RGB, 255)
        }
    }*/

    doubleThreshold()
    image(img, 350, 600, 300, img.height*300/img.width)

    hysteresis()
    image(img, 0, 900, 300, img.height*300/img.width)
}

function hysteresis() {
    img.loadPixels()
    let old = [...img.pixels]

    for (let x = 1; x < img.width-1; x++) {
        for (let y = 1; y < img.height-1; y++) {
            let i = (x+ y*img.width)*4
            if (img.pixels[i] != 60) {
                continue
            }

            if (old[((x+1)+ (y+0)*img.width)*4] == 255 || old[((x+0)+ (y+1)*img.width)*4] == 255 || old[((x+1)+ (y+1)*img.width)*4] == 255 ||
            old[((x-1)+ (y+0)*img.width)*4] == 255 || old[((x+0)+ (y-1)*img.width)*4] == 255 || old[((x-1)+ (y-1)*img.width)*4] == 255 ||
            old[((x+1)+ (y-1)*img.width)*4] == 255 || old[((x-1)+ (y+1)*img.width)*4] == 255) {
                img.pixels[i] = 255
                img.pixels[i+1] = 255
                img.pixels[i+2] = 255
            } else {
                img.pixels[i] = 0
                img.pixels[i+1] = 0
                img.pixels[i+2] = 0
            }
        }
    }

    img.updatePixels()
}

function doubleThreshold(lowThresh = 20, highTresh = 40) {
    img.loadPixels()

    for (let x = 1; x < img.width-1; x++) {
        for (let y = 1; y < img.height-1; y++) {
            let i = (x+ y*img.width)*4

            let v = 0
            if (img.pixels[i] < lowThresh) {
                v = 0
            } else if (img.pixels[i] < highTresh) {
                v = 60
            } else {
                v = 255
            }
            img.pixels[i] = v
            img.pixels[i+1] = v
            img.pixels[i+2] = v
        }
    }

    img.updatePixels()
}

function nonMaxSuppression(theta) {
    img.loadPixels()

    let old = [...img.pixels]

    for (let x = 1; x < img.width-1; x++) {
        for (let y = 1; y < img.height-1; y++) {
            let i = (x+ y*img.width)*4

            let q = 255
            let r = 255
            let angle = theta[x][y] * 180 / Math.PI
            if (0 <= angle && angle < 22.5 || 157.5 <= angle && angle <= 180) {
                let j = ((x+0) + (y+1)*img.width)*4
                let k = ((x-0) + (y-1)*img.width)*4
                q = old[j]
                r = old[k]
            } else if (22.5 <= angle && angle < 67.5) {
                let j = ((x+1) + (y-1)*img.width)*4
                let k = ((x-1) + (y+1)*img.width)*4
                q = old[j]
                r = old[k]
            } else if (67.5 <= angle && angle < 112.5) {
                let j = ((x+1) + (y+0)*img.width)*4
                let k = ((x-1) + (y+0)*img.width)*4
                q = old[j]
                r = old[k]
            } else if (112.5 <= angle && angle < 157.5) {
                let j = ((x-1) + (y-1)*img.width)*4
                let k = ((x+1) + (y+1)*img.width)*4
                q = old[j]
                r = old[k]
            } 

            if (img.pixels[i] < q || img.pixels[i] < r) {
                img.pixels[i] = 0
                img.pixels[i+1] = 0
                img.pixels[i+2] = 0
            }
        }
    }

    img.updatePixels()
}

function sobelFilters() {
    img.loadPixels()

    let old = [...img.pixels]
    let Kx = [[-1, 0, 1], 
              [-2, 0, 2], 
              [-1, 0, 1]]
    let Ky = [[1, 2, 1],
              [0, 0, 0],
              [-1, -2, -1]]
    let M = 0
    let theta = []

    for (let x = 0; x < img.width; x++) {
        let thetaLine = []
        for (let y = 0; y < img.height; y++) {
            var i = (x + y * img.width)*4;
            
            let redX = 0
            let greenX = 0
            let blueX = 0
            let redY = 0
            let greenY = 0
            let blueY = 0
            for (let dx = max(0, x-1); dx <= min(x+1, img.width-1); dx++) {
                for (let dy = max(0, y-1); dy <= min(y+1, img.height-1); dy++) {
                    var j = (dx + dy * img.width)*4;
                    redX   += old[j]   * Kx[dx-x+1][dy-y+1]
                    greenX += old[j+1] * Kx[dx-x+1][dy-y+1]
                    blueX  += old[j+2] * Kx[dx-x+1][dy-y+1]
                    redY   += old[j]   * Ky[dx-x+1][dy-y+1]
                    greenY += old[j+1] * Ky[dx-x+1][dy-y+1]
                    blueY  += old[j+2] * Ky[dx-x+1][dy-y+1]
                }    
            }

            img.pixels[i] = sqrt(pow(redX,2)+pow(redY,2))
            img.pixels[i+1] = sqrt(pow(greenX,2)+pow(greenY,2))
            img.pixels[i+2] = sqrt(pow(blueX,2)+pow(blueY,2))
            if (max(img.pixels[i], img.pixels[i+1], img.pixels[i+2]) > M) {
                M = max([img.pixels[i], img.pixels[i+1], img.pixels[i+2]])
            }

            let ix = (redX+greenX+blueX)/3
            let iy = (redY+greenY+blueY)/3
            let t = Math.atan2(iy, ix)
            if (t < 0) {
                t = Math.PI + t
            }
            thetaLine.push(t)
        }
        theta.push(thetaLine)
    }

    for (let x = 0; x < img.width; x++) {
        for (let y = 0; y < img.height; y++) {
            var i = (x + y * img.width)*4;
            img.pixels[i] *= 255/M
            img.pixels[i+1] *= 255/M
            img.pixels[i+2] *= 255/M
        }
    }


    img.updatePixels()

    return theta
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
    let sum = 0
    for (let i = 1; i <= 2*r+1; i++) {
        let line = []
        for(let j = 1; j <= 2*r+1; j++) {
            let v = 1/(2*Math.PI*s*s)
            v *= Math.exp(- (pow(i-(r+1), 2)+pow(j-(r+1), 2)) / (2*s*s))
            line.push(v)
            sum += v
        }
        kernel.push(line)
    }

    let nfac = 1/sum
    for (let x = 0; x < kernel.length; x++) {
        for (let y = 0; y < kernel[x].length; y++) {
            kernel[x][y] *= nfac
        }
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

/*function max(numbers) {
    let max = 0
    for (let n of numbers) {
        if (n > max) {
            max = n
        }
    }

    return max
}*/