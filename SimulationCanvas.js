class SimulationCanvas extends HTMLElement {
  getSize() {
    return {
      width: this.getAttribute('width'),
      height: this.getAttribute('height')
    };
  }

  /**
   * similar to React's componentDidMount hook,
   * this runs after this component has been added to the DOM
   */
  connectedCallback() {
    const { width, height } = this.getSize();

    if (! width || !height) throw new Error('Invalid width / height');
    
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    this.appendChild(canvas);
    this.context = canvas.getContext('2d');
  }

  render(matrix) {
    const { width, height } = this.getSize();

    this.context.fillStyle = '#000';
    this.context.fillRect(0, 0, width, height);

    const rows = matrix.length;
    const cols = matrix[0].length;

    this.context.fillStyle = '#FFF';

    const cellWidth = width / cols;
    const cellHeight = height / rows;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (matrix[r][c]) {
          this.context.fillRect(
            width * (c / cols),
            height * (r / rows),
            cellWidth,
            cellHeight
          );
        }
      }
    }
  }
}

customElements.define('simulation-canvas', SimulationCanvas);