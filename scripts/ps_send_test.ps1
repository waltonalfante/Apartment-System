$username = 'waltonalfante4@gmail.com'
$password = 'scsonfjqschtezpl'
$securePassword = ConvertTo-SecureString $password -AsPlainText -Force
$credential = New-Object System.Management.Automation.PSCredential($username, $securePassword)

try {
    Send-MailMessage -From $username -To $username -Subject 'Apartment SMTP test' -Body 'PowerShell SMTP test' -SmtpServer 'smtp.gmail.com' -Port 587 -UseSsl -Credential $credential -ErrorAction Stop
    'send_mail_ok'
} catch {
    'send_mail_failed: ' + $_.Exception.Message
}