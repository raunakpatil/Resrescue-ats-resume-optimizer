# Test 1: Run the unpacked version
Write-Host "=== Test 1: Unpacked version ==="
$proc = Start-Process -FilePath ".\release\win-unpacked\Raunak's ResRescue.exe" -ArgumentList "--enable-logging" -PassThru -RedirectStandardError "test_unpacked_err.txt"
Start-Sleep -Seconds 5
if ($proc.HasExited) {
    Write-Host "CRASHED with exit code: $($proc.ExitCode)"
} else {
    Write-Host "RUNNING (PID: $($proc.Id))"
    Stop-Process -Id $proc.Id -Force
}
Write-Host ""
if (Test-Path "test_unpacked_err.txt") {
    Write-Host "--- stderr ---"
    Get-Content "test_unpacked_err.txt" | Select-Object -First 15
}

# Test 2: Run the dev electron
Write-Host ""
Write-Host "=== Test 2: Dev electron ==="
$proc2 = Start-Process -FilePath "node_modules\electron\dist\electron.exe" -ArgumentList ".", "--enable-logging" -PassThru -RedirectStandardError "test_dev_err.txt"
Start-Sleep -Seconds 5
if ($proc2.HasExited) {
    Write-Host "CRASHED with exit code: $($proc2.ExitCode)"
} else {
    Write-Host "RUNNING (PID: $($proc2.Id))"
    Stop-Process -Id $proc2.Id -Force
}
Write-Host ""
if (Test-Path "test_dev_err.txt") {
    Write-Host "--- stderr ---"
    Get-Content "test_dev_err.txt" | Select-Object -First 15
}
