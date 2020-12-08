$tempFolder = "$PSScriptRoot\temp"
md $tempFolder -ErrorAction Ignore

$nugetFolder = "$PSScriptRoot\nuget"

$sourceNugetExe = "https://dist.nuget.org/win-x86-commandline/latest/nuget.exe"
$targetNugetExe = "$tempFolder\nuget.exe"
Remove-Item $targetNugetExe -ErrorAction Ignore
Invoke-WebRequest $sourceNugetExe -OutFile $targetNugetExe
Set-Alias nuget $targetNugetExe -Scope Global

Remove-Item $nugetFolder -ErrorAction Ignore -Force -Recurse

nuget install spkl -O $nugetFolder

Remove-Item $targetNugetExe -ErrorAction Ignore