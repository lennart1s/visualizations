const data = [[1,0,0,1,0,0,1],
              [1,0,0,1,0,0,0],
              [0,0,0,1,1,0,1],
              [0,0,1,0,1,1,0],
              [0,1,1,0,0,1,1],
              [0,1,0,0,0,0,1]]
let matrix = new Matrix(data)
let solutionRows = new Array(data.length).fill(0)

let sudoku = [[7,1,0,0,0,4,5,8,0],
              [0,3,0,0,0,5,4,0,0],
              [0,0,0,0,1,0,2,0,6],
              [5,7,3,0,0,2,0,0,0],
              [0,0,2,4,5,3,8,0,0],
              [0,0,0,0,0,0,0,0,0],
              [6,0,0,0,2,9,0,0,0],
              [0,0,0,8,0,0,0,0,0],
              [1,2,0,0,0,0,0,4,0]]

function sudokuToMatrix(sudoku) {
  let data = new Array(729)
  for (let i = 0; i < data.length; i++) {
    data[i] = new Array(324).fill(0)
  }

  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      for (let n = 0; n < 9; n++) {
        let i = n + c*9 + r*9*9
        
        if (sudoku[r][c] != 0 && n+1 != sudoku[r][c]) {
          continue
        }

        // Row-Column Constraints
        data[i][c+r*9] = 1

        // Row-Number Constraints
        let colOff = 9*9
        data[i][colOff + n+r*9] = 1

        // Column-Number Constraints
        colOff += 9*9
        data[i][colOff + n+c*9] = 1

        // Box-Number Constraints
        colOff += 9*9
        data[i][colOff + n+(Math.floor(r/3)*3+Math.floor(c/3))*9] = 1

      }
    }
  }

  return new Matrix(data)
}

function solutionRowsToSudoku(rows) {
  let sudoku = [[0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0]]
  
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      let number = -1;
      for (let n = 0; n < 9; n++) {
        let i = n + c*9 + r*9*9
        if (rows[i]) {
          if (number == -1) {
            number = n
          } else {
            console.log('invalid solution row data in row', i)
          }
        }
      }
      sudoku[r][c] = number+1
    }
  }

  return sudoku
}

let suma = sudokuToMatrix(sudoku)
window.onload = () => {
  // document.getElementById('text').innerText = suma.print()
}

let res = undefined

function algorithmX(mat, solRows) {
  if (res) {
    return
  }
   // mat.print()
  if (!mat.activeCols.some((x) => x == 1)) {
    console.log('end')
    // console.log('solRows', JSON.stringify(solRows))
    res = JSON.parse(JSON.stringify(solRows))
    return solRows
  }

  let c = -1
  let minOnes = 0
  mat.forActiveCols((col) => {
    let ones = 0
    mat.forActiveRows((row) => {
      ones += mat.get(row, col)
    })
    if (c == -1 || ones < minOnes) {
      c = col
      minOnes = ones 
    }
  })
  // console.log(c, minOnes)

  mat.forActiveRows((r) => {
    if (mat.get(r, c)) {
      let reduced = mat.clone()
      solRows[r] = 1

      mat.forActiveCols((j) => {
        if (mat.get(r, j)) {
          mat.forActiveRows((i) => {
            if (mat.get(i, j)) {
              reduced.disableRow(i)
            }
          })
          reduced.disableCol(j)
        }
      })

      algorithmX(reduced, solRows)

      solRows[r] = 0
    }
  })
  // console.log('activeRows', mat.activeRows)
  // console.log('activeCols', mat.activeCols)
}

let sudokuSolRows = new Array(9*9*9).fill(0)
let start = Date.now()
algorithmX(suma, sudokuSolRows)
console.log(Date.now() - start)
console.log(JSON.stringify(solutionRowsToSudoku(res)))


function clone(x) {
  return JSON.parse(JSON.stringify(x))
}