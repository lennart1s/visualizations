class Matrix {
  
  mat
  activeRows
  activeCols

  constructor(m) {
    this.mat = m
    this.activeRows = new Array(this.mat.length).fill(1)
    this.activeCols = new Array(this.mat[0].length).fill(1)
  }

  get(r, c) {
    return this.mat[r][c]
  }

  forActiveRows(func) {
    for (let r = 0; r < this.mat.length; r++) {
      if (this.activeRows[r]) {
        func(r)
      }
    }
  }

  forActiveCols(func) {
    for (let c = 0; c < this.mat[0].length; c++) {
      if (this.activeCols[c]) {
        func(c)
      }
    }
  }

  disableRow(r) {
    this.activeRows[r] = 0
  }

  enableRow(r) {
    this.activeRows[r] = 1
  }

  disableCol(c) {
    this.activeCols[c] = 0
  }

  enableCol(c) {
    this.activeCols[c] = 1
  }

  clone() {
    let m = new Matrix(JSON.parse(JSON.stringify(this.mat)))
    m.activeRows = JSON.parse(JSON.stringify(this.activeRows))
    m.activeCols = JSON.parse(JSON.stringify(this.activeCols))

    return m
  }

  print() {
    let text = ""
    this.forActiveRows((r) => {
      this.forActiveCols((c) => {
        text += `${this.mat[r][c]}, `
      })
      text += '\n'
    })

    console.log(text)
    return text
  }
}