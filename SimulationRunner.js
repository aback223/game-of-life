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
    alert('step()');
  }

  render() {
    this.simulationCanvas.render(this.matrix);
  }
}

customElements.define('simulation-runner', SimulationRunner);
