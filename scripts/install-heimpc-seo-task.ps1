$ErrorActionPreference = "Stop"
$TaskName = "BELOWMARK_Daily_SEO_Flywheel"
$ProjectDir = "C:\Users\emrea\Desktop\belowmark"
$NodeExe = (Get-Command node).Source

$Action = New-ScheduledTaskAction `
  -Execute $NodeExe `
  -Argument "--use-system-ca --no-warnings scripts/seo-daily-flywheel.mjs --push-indexnow --auto-deploy" `
  -WorkingDirectory $ProjectDir

$Trigger = New-ScheduledTaskTrigger -Daily -At 7:20AM
$Settings = New-ScheduledTaskSettingsSet `
  -StartWhenAvailable `
  -AllowStartIfOnBatteries `
  -DontStopIfGoingOnBatteries `
  -ExecutionTimeLimit (New-TimeSpan -Minutes 15)

Register-ScheduledTask `
  -TaskName $TaskName `
  -Action $Action `
  -Trigger $Trigger `
  -Settings $Settings `
  -Description "Belowmark.com Daily Self-Improving SEO Flywheel (GSC 28d Harvest + 8-Market Autocomplete + IndexNow + Git Auto-Deploy)" `
  -Force | Out-Null

Get-ScheduledTask -TaskName $TaskName | Select-Object TaskName, State
Get-ScheduledTaskInfo -TaskName $TaskName | Select-Object NextRunTime, LastTaskResult
