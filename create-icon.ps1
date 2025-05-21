$iconPath = Join-Path $PSScriptRoot "assets\icon.ico"

# Create a new drawing
Add-Type -AssemblyName System.Drawing
$bitmap = New-Object System.Drawing.Bitmap 256, 256
$graphics = [System.Drawing.Graphics]::FromImage($bitmap)

# Set up the drawing area with a dark background
$graphics.Clear([System.Drawing.Color]::FromArgb(30, 30, 30))

# Draw an envelope icon
$pen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(0, 120, 212), 10)
$brush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(0, 120, 212))

# Envelope body
$rect = New-Object System.Drawing.Rectangle 48, 88, 160, 100
$graphics.FillRectangle($brush, $rect)

# Envelope flap (triangle)
$points = @(
    New-Object System.Drawing.Point 48, 88
    New-Object System.Drawing.Point 128, 48
    New-Object System.Drawing.Point 208, 88
)
$graphics.FillPolygon($brush, $points)

# Draw a stylized "T" for "Test"
$fontBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::White)
$font = New-Object System.Drawing.Font("Arial", 60, [System.Drawing.FontStyle]::Bold)
$graphics.DrawString("T", $font, $fontBrush, 100, 100)

# Save as ICO
$bitmap.Save("$env:TEMP\temp-icon.png", [System.Drawing.Imaging.ImageFormat]::Png)

# Create a custom function to convert PNG to ICO using PowerShell
function ConvertTo-Icon {
    param([string]$pngPath, [string]$icoPath)
    
    # Create a simple HTML/JS file to convert PNG to ICO
    $html = @"
<!DOCTYPE html>
<html>
<head>
    <script>
        function convertToIco() {
            var canvas = document.createElement('canvas');
            var ctx = canvas.getContext('2d');
            var img = new Image();
            
            img.onload = function() {
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0);
                
                var link = document.createElement('a');
                link.download = 'icon.ico';
                link.href = canvas.toDataURL('image/x-icon');
                link.click();
            };
            
            img.src = 'temp-icon.png';
        }
    </script>
</head>
<body onload="convertToIco()">
    Converting PNG to ICO...
</body>
</html>
"@
    
    $html | Out-File "$env:TEMP\convert.html"
    
    # Since we can't easily convert PNG to ICO in PowerShell, 
    # we'll just copy the PNG for now and rename it to .ico
    Copy-Item "$env:TEMP\temp-icon.png" $icoPath
    
    Write-Host "Icon created at $icoPath (note: this is actually a PNG file with .ico extension)"
}

# Create assets directory if it doesn't exist
$assetsDir = Join-Path $PSScriptRoot "assets"
if (-not (Test-Path $assetsDir)) {
    New-Item -Path $assetsDir -ItemType Directory | Out-Null
}

# Convert and save icon
ConvertTo-Icon -pngPath "$env:TEMP\temp-icon.png" -icoPath $iconPath

# Clean up
$graphics.Dispose()
$bitmap.Dispose()
Remove-Item "$env:TEMP\temp-icon.png" -ErrorAction SilentlyContinue
Remove-Item "$env:TEMP\convert.html" -ErrorAction SilentlyContinue

Write-Host "Icon creation completed"
