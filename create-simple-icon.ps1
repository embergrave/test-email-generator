Add-Type -AssemblyName System.Drawing

# Create a bitmap with the icon
$bitmap = New-Object System.Drawing.Bitmap 256, 256
$graphics = [System.Drawing.Graphics]::FromImage($bitmap)

# Fill with blue color
$graphics.Clear([System.Drawing.Color]::FromArgb(0, 120, 212))

# Save as PNG
$bitmap.Save("$PSScriptRoot\assets\icon.png", [System.Drawing.Imaging.ImageFormat]::Png)

# Clean up
$graphics.Dispose()
$bitmap.Dispose()

Write-Host "Created icon at $PSScriptRoot\assets\icon.png"
