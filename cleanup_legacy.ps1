# Cleanup legacy app data from previous app names
Write-Host "=== Cleaning up legacy app data ==="

# Kill any running instances first
Get-Process | Where-Object { $_.ProcessName -like '*ResRescue*' -or $_.ProcessName -like '*cv-mitra*' -or $_.ProcessName -like '*electron*' } | Stop-Process -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 1

$dirs = @(
    # Old installations
    'C:\Users\Raunak Patil\AppData\Local\Programs\raunaks-cv-mitra',
    # Old roaming app data
    'C:\Users\Raunak Patil\AppData\Roaming\ats-resume-optimizer',
    'C:\Users\Raunak Patil\AppData\Roaming\raunaks-cv-mitra',
    'C:\Users\Raunak Patil\AppData\Roaming\raunaks-resrescue',
    # Old updater data
    'C:\Users\Raunak Patil\AppData\Local\ats-resume-optimizer-updater',
    'C:\Users\Raunak Patil\AppData\Local\raunaks-cv-mitra-updater',
    'C:\Users\Raunak Patil\AppData\Local\raunaks-resrescue-updater'
)

foreach ($dir in $dirs) {
    if (Test-Path $dir) {
        Write-Host "DELETING: $dir"
        Remove-Item -Path $dir -Recurse -Force -ErrorAction SilentlyContinue
        if (Test-Path $dir) {
            Write-Host "  WARNING: Could not fully delete (some files may be locked)"
        } else {
            Write-Host "  DONE"
        }
    } else {
        Write-Host "SKIP (not found): $dir"
    }
}

Write-Host ""
Write-Host "=== Cleanup complete ==="
