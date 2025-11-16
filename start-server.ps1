# PowerShell script to start the server
$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $scriptPath
Write-Host "Starting Hotel Mahi Server..." -ForegroundColor Green
Write-Host "Current directory: $(Get-Location)" -ForegroundColor Cyan
node server.js


