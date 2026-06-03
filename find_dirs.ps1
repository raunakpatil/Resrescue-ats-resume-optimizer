$dirs = Get-ChildItem 'C:\Users\Raunak Patil\AppData\Roaming' -Directory
foreach ($d in $dirs) {
    if ($d.Name -like '*raunak*' -or $d.Name -like '*cv*mitra*' -or $d.Name -like '*resrescue*' -or $d.Name -like '*ats*') {
        Write-Host "ROAMING: $($d.Name)"
    }
}
$dirs2 = Get-ChildItem 'C:\Users\Raunak Patil\AppData\Local' -Directory
foreach ($d in $dirs2) {
    if ($d.Name -like '*raunak*' -or $d.Name -like '*cv*mitra*' -or $d.Name -like '*resrescue*' -or $d.Name -like '*ats*') {
        Write-Host "LOCAL: $($d.Name)"
    }
}
