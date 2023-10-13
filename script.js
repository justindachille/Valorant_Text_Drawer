window.addEventListener('load', () => {
    const canvas = document.getElementById('drawCanvas');
    const penSizeSlider = document.getElementById('penSizeSlider');
    const ctx = canvas.getContext('2d');
    let penSize = 40;
    let drawing = false;
    let livePreviewInterval;
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    canvas.addEventListener('mousedown', () => {
        drawing = true;
        livePreviewInterval = setInterval(convertToAscii, 100);
      });
      
      canvas.addEventListener('mouseup', () => {
        drawing = false;
        ctx.beginPath();
        clearInterval(livePreviewInterval);
      });
    penSizeSlider.addEventListener('input', function() {
        penSize = this.value;
    });


  
    function setCanvasSize() {
      const maxWidth = window.innerWidth * 0.5;
      const aspectRatio = 26 / 12; // Width to Height ratio of ASCII art output
  
      // Calculate canvas dimensions
      const canvasWidth = Math.floor(maxWidth);
      const canvasHeight = Math.floor(canvasWidth / aspectRatio);
    
      canvas.width = canvasWidth;
      canvas.height = canvasHeight;
  
      // Initialize canvas with white background
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    setCanvasSize();

    // Resize canvas when window resizes (optional)
    window.addEventListener('resize', setCanvasSize);

    canvas.addEventListener('mouseup', () => {
      drawing = false;
      ctx.beginPath();
    });
  
    canvas.addEventListener('mousemove', draw);

    window.resetCanvas = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    };

    function draw(event) {
        if (!drawing) return;
        
        ctx.lineWidth = penSize;  // Use dynamic pen size
        ctx.lineCap = 'round';
        ctx.strokeStyle = 'black';
      
        ctx.lineTo(event.clientX - canvas.offsetLeft, event.clientY - canvas.offsetTop);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(event.clientX - canvas.offsetLeft, event.clientY - canvas.offsetTop);
      }
  
    window.convertToAscii = () => {
      let asciiArt = '';
    
      // Calculate step sizes based on canvas dimensions and desired ASCII dimensions (26x12)
      const xStep = canvas.width / 26;
      const yStep = canvas.height / 12;
    
      for (let y = 0; y < canvas.height; y += yStep) {
        for (let x = 0; x < canvas.width; x += xStep) {
          const pixel = ctx.getImageData(x, y, 1, 1).data;
          const alpha = pixel[3];
          const grayscale = (pixel[0] + pixel[1] + pixel[2]) / 3 * (alpha / 255.0);
    
          // Map grayscale values to specialized ASCII characters
          if (grayscale < 64) {
            asciiArt += '█';
          } else if (grayscale < 128) {
            asciiArt += '▄';
          } else if (grayscale < 192) {
            asciiArt += '▀';
          } else {
            asciiArt += '░';
          }
        }
        asciiArt += '\n';
      }
      document.getElementById('asciiArt').textContent = asciiArt;
    };
  });
  

function copyToClipboard() {
    const el = document.createElement('textarea');
    el.value = document.getElementById('asciiArt').textContent;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
}