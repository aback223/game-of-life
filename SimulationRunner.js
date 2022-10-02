class SimulationRunner extends HTMLElement {
  connectedCallback() {
    this.simulationCanvas = document.querySelector('simulation-canvas');

    setTimeout(() => {
      // our inner content isn't available immediately in chrome
      this.querySelector('.step').addEventListener('click', () => this.step());

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

    this.render();
  }

  render() {
    this.simulationCanvas.render(this.matrix);
  }
}

customElements.define('simulation-runner', SimulationRunner);
