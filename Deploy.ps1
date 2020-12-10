$spklFolder = Get-ChildItem "$PSScriptRoot\nuget" |
    Where-Object {
        $_.Name -match "spkl\."
    }
Set-Alias spkl "$PSScriptRoot\nuget\$spklFolder\tools\spkl.exe"

spkl webresources "$PSScriptRoot\spkl.json"
 
$logsDirectory = "$PSScriptRoot\logs"
md $logsDirectory -ErrorAction Ignore | Out-Null
$logIndex = 1
while(Test-Path "$logsDirectory\Log$logIndex.txt") {
    $logIndex++
}
Get-ChildItem $PSScriptRoot |
    Where-Object {
        $_.Name -match "Log[0-9]+.txt"
    } |
    ForEach-Object {
        Move-Item "$PSScriptRoot\$($_.Name)" "$logsDirectory\Log$logIndex.txt"
        $logIndex++
    }