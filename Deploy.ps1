$spklFolder = Get-ChildItem "$PSScriptRoot\nuget" |
    Where-Object {
        $_.Name -match "spkl\."
    }
Set-Alias spkl "$PSScriptRoot\nuget\$spklFolder\tools\spkl.exe"

spkl webresources "$PSScriptRoot\spkl.json"

$logIndex = 1
while(Test-Path "$PSScriptRoot\logs\Log$logIndex.txt") {
    $logIndex++
}
Get-ChildItem $PSScriptRoot |
    Where-Object {
        $_.Name -match "Log[0-9]+.txt"
    } |
    ForEach-Object {
        Move-Item "$PSScriptRoot\$($_.Name)" "$PSScriptRoot\logs\Log$logIndex.txt"
        $logIndex++
    }