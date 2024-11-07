// Get references to the DOM elements
const colorPicker = document.getElementById('colorPicker');
const colorHex = document.getElementById('colorHex');
const colorRGB = document.getElementById('colorRGB');
const colorHSL = document.getElementById('colorHSL');
const downloadButton = document.getElementById('downloadButton');
const canvas = document.getElementById('colorCanvas');
const ctx = canvas.getContext('2d');
const body = document.querySelector('body');

// Function to update color info dynamically
function updateColorInfo() {
    const color = colorPicker.value;
    colorHex.textContent = color;
    const rgb = hexToRgb(color);
    colorRGB.textContent = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
    colorHSL.textContent = rgbToHsl(rgb.r, rgb.g, rgb.b);

    // Change the background color of the body to the selected color
    body.style.backgroundColor = color;

    // Change the background color of the download button to the selected color
    downloadButton.style.backgroundColor = color;
}

// Convert Hex to RGB
function hexToRgb(hex) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return { r, g, b };
}

// Convert RGB to HSL
function rgbToHsl(r, g, b) {
    r /= 255;
    g /= 255;
    b /= 255;
    let cmin = Math.min(r, g, b),
        cmax = Math.max(r, g, b),
        delta = cmax - cmin,
        h = 0,
        s = 0,
        l = (cmax + cmin) / 2;

    if (delta !== 0) {
        s = (delta / (1 - Math.abs(2 * l - 1))) * 100;
        switch (cmax) {
            case r:
                h = ((g - b) / delta) % 6;
                break;
            case g:
                h = (b - r) / delta + 2;
                break;
            case b:
                h = (r - g) / delta + 4;
                break;
        }
        h *= 60;
        if (h < 0) h += 360;
    }

    s = s.toFixed(1);
    l = l.toFixed(1);
    return `hsl(${h}, ${s}%, ${l}%)`;
}

// Generate PNG from selected color and include the color information
function generatePNG(color) {
    const rgb = hexToRgb(color);
    ctx.fillStyle = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Add text with the color information (with proper styling)
    ctx.fillStyle = 'black';
    ctx.font = '18px Arial';
    ctx.fillRect(0, canvas.height - 80, canvas.width, 80); // black background for text
    ctx.fillStyle = 'white';
    ctx.fillText(`Color Code: ${color}`, 10, canvas.height - 60);
    ctx.fillText(`RGB: ${rgb.r}, ${rgb.g}, ${rgb.b}`, 10, canvas.height - 35);
    ctx.fillText(`HSL: ${rgbToHsl(rgb.r, rgb.g, rgb.b)}`, 10, canvas.height - 10);

    // Create PNG data and trigger download
    const dataUrl = canvas.toDataURL("image/png");
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = 'color.png';
    link.click();
}

// Event listener for color picker change
colorPicker.addEventListener('input', updateColorInfo);

// Event listener for download button
downloadButton.addEventListener('click', () => {
    const color = colorPicker.value;
    generatePNG(color);
});

// Initialize color info on page load
updateColorInfo();