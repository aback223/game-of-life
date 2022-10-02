class SimulationRunner extends HTMLElement {
  constructor() {
    super();
    this.timer = null;
    this.speed = 100;
  } 
  
  connectedCallback() {
    this.simulationCanvas = document.querySelector('simulation-canvas');

    setTimeout(() => {
      this.querySelector('.step').addEventListener('click', () => this.step());
      this.querySelector('.play').addEventListener('click', () => this.play());
      this.querySelector('.pause').addEventListener('click', () => this.pause());
      this.querySelector('.speed-down').addEventListener('click', () => this.speedDown());
      this.querySelector('.speed-up').addEventListener('click', () => this.speedUp());
      this.querySelector('.change-matrix-buttons')
        .addEventListener('click', event => {
          const matrixName = event.target.getAttribute('data-matrix');

          if (matrixName) {
            const matrix = START_MATRICES[matrixName];

            if (matrix) this.setMatrix(matrix);
            else console.warn('Matrix with name', matrixName, 'not found');
          }
        });

      this.setMatrix(START_MATRICES.SPINNER);
    });
  }

  setMatrix(newMatrix) {
    this.matrix = newMatrix;
    this.render();
  }

  step() {
    //holds the updated matrix
    let matrixUpdates = {};

    for(let row = 0; row < this.matrix.length; row++) {
      for(let col = 0; col < this.matrix[0].length; col++) {
        //if the cell is a live cell, or 1
        //it dies, or becomes 0, when it has less than 2 or more than 3 neighbors
        let cell = [row, col];
        if (this.matrix[row][col] === 1) {
          if (this.liveNeighborCount(cell) < 2 || this.liveNeighborCount(cell) > 3) {
            matrixUpdates[`${row},${col}`] = 0;
          }
        } else if (this.matrix[row][col] === 0) {
          if(this.liveNeighborCount(cell) === 3) {
            matrixUpdates[`${row},${col}`] = 1;
          }
        }
      }
    }

    //updates current matrix with updated cells
    for(let update in matrixUpdates) {
      let updateList = update.split(",");
      this.matrix[updateList[0]][updateList[1]] = matrixUpdates[update];
    }

    this.render();
  }

  liveNeighborCount(cellPosition) {
    let count = 0;
    const neighbors = [
      [-1, -1], //top left
      [-1, 0], //top middle
      [-1, 1], //top right
      [0, -1], //left
      [0, 1], //right
      [1, -1], //bottom left
      [1, 0], //bottom middle
      [1, 1] // bottom right
    ]
    for (const neighbor of neighbors) {
      let row = cellPosition[0] + neighbor[0];
      let col = cellPosition[1] + neighbor[1];

      //accounts for when a cell at current position is at a border
      if (row === -1) row = this.matrix.length - 1;
      if (row === this.matrix.length) row = 0; 
      if (col === -1) col = this.matrix[0].length - 1;
      if(col === this.matrix[0].length) col = 0;
      //increases the live count if the neighbor at specific coordinate is 1
      if(this.matrix[row][col] === 1) count ++;
    }

    return count;
  }

  play(speed = this.speed) {
    if(this.timer === null) {
      this.timer = setInterval(() => this.step(), speed);
    } 
    //clears the first setInterval before doing setInterval again
    this.pause();
    this.timer = setInterval(() => this.step(), speed);
  }

  pause() {
    clearInterval(this.timer);
  }

  speedUp() {
    this.speed += 50;
    this.pause();
    this.play(this.speed);
  }

  speedDown() {
    if (this.speed > 0) {
      this.speed -= 50;
      this.pause();
      this.play(this.speed);
    }
  }
 
  render() {
    this.simulationCanvas.render(this.matrix);
  }
}

customElements.define('simulation-runner', SimulationRunner);
