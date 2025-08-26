@echo off
powershell -Command "(Get-Content index.html) -replace 'src=\"(?!images/)([^\"]*\.jpg)\"', 'src=\"images/$1\"' | Set-Content index.html"
echo Fixed all image paths