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

    window.addEventListener('mouseup', () => {
        drawing = false;
        ctx.beginPath();
        clearInterval(livePreviewInterval);
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
    
        // Set steps to represent the canvas dimensions for 26x12 blocks
        const xStep = canvas.width / 26;
        const yStep = canvas.height / 24;  // 24 instead of 12 to check half-height
    
        for (let y = 0; y < canvas.height; y += 2 * yStep) {
            for (let x = 0; x < canvas.width; x += xStep) {
    
                // Get grayscale for top and bottom halves
                const topHalfPixel = ctx.getImageData(x, y, 1, 1).data;
                const bottomHalfPixel = ctx.getImageData(x, y + yStep, 1, 1).data;
    
                const topHalfGray = (topHalfPixel[0] + topHalfPixel[1] + topHalfPixel[2]) / 3 * (topHalfPixel[3] / 255.0);
                const bottomHalfGray = (bottomHalfPixel[0] + bottomHalfPixel[1] + bottomHalfPixel[2]) / 3 * (bottomHalfPixel[3] / 255.0);
    
                // Determine which halves are filled
                const topFilled = topHalfGray < 128;
                const bottomFilled = bottomHalfGray < 128;
    
                // Add appropriate ASCII character
                if (topFilled && bottomFilled) {
                    asciiArt += '█';
                } else if (topFilled) {
                    asciiArt += '▀';
                } else if (bottomFilled) {
                    asciiArt += '▄';
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