window.addEventListener('load', () => {
    const canvas = document.getElementById('drawCanvas');
    const penSizeSlider = document.getElementById('penSizeSlider');
    const ctx = canvas.getContext('2d');
    let penSize = 40;
    let drawing = false;
    let erasing = false;
    let livePreviewInterval;
    
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    canvas.addEventListener('mousedown', (e) => {
        if (e.button === 0) {
            drawing = true;
        } else if (e.button === 2) {
            erasing = true;
        }
        livePreviewInterval = setInterval(convertToAscii, 100);
    });
    
    canvas.addEventListener('mouseup', () => {
        drawing = false;
        erasing = false;
        ctx.beginPath();
        clearInterval(livePreviewInterval);
    });
    
    canvas.addEventListener('contextmenu', (e) => {
        e.preventDefault();
    });
    
    penSizeSlider.addEventListener('input', function() {
        penSize = this.value;
    });
    
    window.addEventListener('mouseup', () => {
        drawing = false;
        erasing = false;
        ctx.beginPath();
        clearInterval(livePreviewInterval);
    });
    
    canvas.addEventListener('mousemove', draw);
    
    function draw(event) {
        if (!drawing && !erasing) return;
    
        ctx.lineWidth = penSize;
        ctx.lineCap = 'round';
        ctx.strokeStyle = erasing ? 'white' : 'black';
    
        ctx.lineTo(event.clientX - canvas.offsetLeft, event.clientY - canvas.offsetTop);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(event.clientX - canvas.offsetLeft, event.clientY - canvas.offsetTop);
    }

    function setCanvasSize() {
      const maxWidth = window.innerWidth * 0.5;
      const aspectRatio = 26 / 12;
  
      const canvasWidth = Math.floor(maxWidth);
      const canvasHeight = Math.floor(canvasWidth / aspectRatio);
    
      canvas.width = canvasWidth;
      canvas.height = canvasHeight;
  
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    setCanvasSize();

    window.addEventListener('resize', setCanvasSize);

    window.resetCanvas = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      convertToAscii();
    };

    window.convertToAscii = () => {
        let asciiArt = '';
        const asciiColumns = 26;
        const asciiRows = 12;
        const xStep = canvas.width / (asciiColumns * 2);
        const yStep = canvas.height / (asciiRows * 2);
      
        for (let y = 0; y < asciiRows * 2; y += 2) {
          for (let x = 0; x < asciiColumns * 2; x += 2) {
            let topHalf = 0, bottomHalf = 0, leftHalf = 0, rightHalf = 0;
      
            for (let subY = 0; subY < 2; subY++) {
              for (let subX = 0; subX < 2; subX++) {
                const pixel = ctx.getImageData(x * xStep + subX * xStep / 2, y * yStep + subY * yStep / 2, 1, 1).data;
                const grayscale = (pixel[0] + pixel[1] + pixel[2]) / 3;
      
                if (grayscale < 128) {
                  if (subY === 0) topHalf++;
                  if (subY === 1) bottomHalf++;
                  if (subX === 0) leftHalf++;
                  if (subX === 1) rightHalf++;
                }
              }
            }
      
            // Mapping conditions to ASCII block characters
            if (topHalf === 2 && bottomHalf === 2) asciiArt += '█';
            else if (topHalf === 2) asciiArt += '▀';
            else if (bottomHalf === 2) asciiArt += '▄';
            else if (leftHalf === 2) asciiArt += '▌';
            else if (rightHalf === 2) asciiArt += '▐';
            else if (topHalf === 1 && leftHalf === 1) asciiArt += '▘';
            else if (topHalf === 1 && rightHalf === 1) asciiArt += '▝';
            else if (bottomHalf === 1 && leftHalf === 1) asciiArt += '▖';
            else if (bottomHalf === 1 && rightHalf === 1) asciiArt += '▗';
            else if (topHalf === 1 && bottomHalf === 1 && leftHalf === 1) asciiArt += '▛';
            else if (topHalf === 1 && bottomHalf === 1 && rightHalf === 1) asciiArt += '▜';
            else if (topHalf === 1 && leftHalf === 1 && rightHalf === 1) asciiArt += '▟';
            else if (bottomHalf === 1 && leftHalf === 1 && rightHalf === 1) asciiArt += '▙';
            else if (topHalf === 1 && bottomHalf === 1) asciiArt += '▚';
            else if (leftHalf === 1 && rightHalf === 1) asciiArt += '▞';
            else asciiArt += '░';
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