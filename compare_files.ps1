# Compare file sizes between unpacked (working) and installed (crashing)
Write-Host "=== UNPACKED (working) ==="
$unpacked = Get-ChildItem ".\release\win-unpacked" -File | Sort-Object Name | Select-Object Name, Length
$unpacked | Format-Table -AutoSize

Write-Host ""
Write-Host "=== INSTALLED (crashing) ==="
$installed = Get-ChildItem "C:\Users\Raunak Patil\AppData\Local\Programs\raunaks-resrescue" -File | Sort-Object Name | Select-Object Name, Length
$installed | Format-Table -AutoSize

Write-Host ""
Write-Host "=== DIFF ==="
foreach ($f in $unpacked) {
    $match = $installed | Where-Object { $_.Name -eq $f.Name }
    if ($match) {
        if ($f.Length -ne $match.Length) {
            Write-Host "SIZE MISMATCH: $($f.Name) unpacked=$($f.Length) installed=$($match.Length)"
        }
    } else {
        Write-Host "MISSING in installed: $($f.Name)"
    }
}
foreach ($f in $installed) {
    $match = $unpacked | Where-Object { $_.Name -eq $f.Name }
    if (-not $match) {
        Write-Host "EXTRA in installed: $($f.Name)"
    }
}
