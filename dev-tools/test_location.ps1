# Test if running the SAME exe from the installed location works when launched differently
Write-Host "=== Test: Copy unpacked to a simple path ==="

$testDir = "C:\Users\Raunak Patil\Desktop\resrescue-test"
if (Test-Path $testDir) { Remove-Item $testDir -Recurse -Force }

# Copy the unpacked version to a simple desktop path (no special chars in dir name)
Copy-Item ".\release\win-unpacked" -Destination $testDir -Recurse

Write-Host "Copied to $testDir"
Write-Host "Launching..."

$proc = Start-Process -FilePath "$testDir\Raunak's ResRescue.exe" -ArgumentList "--enable-logging" -PassThru -RedirectStandardError "test_desktop_err.txt"
Start-Sleep -Seconds 5

if ($proc.HasExited) {
    Write-Host "CRASHED with exit code: $($proc.ExitCode)"
} else {
    Write-Host "RUNNING (PID: $($proc.Id)) - SUCCESS!"
    Stop-Process -Id $proc.Id -Force
}

if (Test-Path "test_desktop_err.txt") {
    $errContent = Get-Content "test_desktop_err.txt" | Select-String "gpu_process_host"
    if ($errContent) {
        Write-Host "GPU errors found:"
        $errContent | Select-Object -First 5
    } else {
        Write-Host "No GPU errors!"
    }
}

# Cleanup
Remove-Item $testDir -Recurse -Force -ErrorAction SilentlyContinue
