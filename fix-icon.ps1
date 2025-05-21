Add-Type -AssemblyName System.Drawing

# Create a bitmap with the icon
$bitmap = New-Object System.Drawing.Bitmap 256, 256
$graphics = [System.Drawing.Graphics]::FromImage($bitmap)

# Fill with blue color
$graphics.Clear([System.Drawing.Color]::FromArgb(0, 120, 212))

# Create a 16x16 bitmap (required for ICO format)
$bitmap16 = New-Object System.Drawing.Bitmap 16, 16
$graphics16 = [System.Drawing.Graphics]::FromImage($bitmap16)
$graphics16.Clear([System.Drawing.Color]::FromArgb(0, 120, 212))

# Create a 32x32 bitmap (required for ICO format)
$bitmap32 = New-Object System.Drawing.Bitmap 32, 32
$graphics32 = [System.Drawing.Graphics]::FromImage($bitmap32)
$graphics32.Clear([System.Drawing.Color]::FromArgb(0, 120, 212))

# Save all bitmaps to temporary files
$bitmap.Save("$env:TEMP\icon256.bmp", [System.Drawing.Imaging.ImageFormat]::Bmp)
$bitmap16.Save("$env:TEMP\icon16.bmp", [System.Drawing.Imaging.ImageFormat]::Bmp)
$bitmap32.Save("$env:TEMP\icon32.bmp", [System.Drawing.Imaging.ImageFormat]::Bmp)

# Clean up
$graphics.Dispose()
$bitmap.Dispose()
$graphics16.Dispose()
$bitmap16.Dispose()
$graphics32.Dispose()
$bitmap32.Dispose()

# For electron-builder, we'll use a PNG file instead
$outputPath = "C:\dev\test-email-generator\assets\icon.png"
Copy-Item "$env:TEMP\icon256.bmp" $outputPath
Write-Host "Created icon at $outputPath"

# Clean up temp files
Remove-Item "$env:TEMP\icon*.bmp" -Force
