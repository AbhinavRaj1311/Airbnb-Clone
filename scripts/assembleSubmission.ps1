$ErrorActionPreference = "Stop"

$sourceDir = "submission\source"
if (Test-Path $sourceDir) {
    Remove-Item -Recurse -Force $sourceDir
}
New-Item -ItemType Directory -Force -Path $sourceDir | Out-Null
New-Item -ItemType Directory -Force -Path "$sourceDir\client" | Out-Null
New-Item -ItemType Directory -Force -Path "$sourceDir\server" | Out-Null

Write-Host "Copying client files..."
Copy-Item -Recurse -Force "client\src" "$sourceDir\client\src"
Copy-Item -Recurse -Force "client\public" "$sourceDir\client\public"
Copy-Item -Recurse -Force "client\tests" "$sourceDir\client\tests"
Copy-Item "client\index.html" "$sourceDir\client\index.html"
Copy-Item "client\package.json" "$sourceDir\client\package.json"
Copy-Item "client\vite.config.js" "$sourceDir\client\vite.config.js"
if (Test-Path "client\playwright.config.js") { Copy-Item "client\playwright.config.js" "$sourceDir\client\playwright.config.js" }
if (Test-Path "client\.eslintrc.cjs") { Copy-Item "client\.eslintrc.cjs" "$sourceDir\client\.eslintrc.cjs" }

Write-Host "Copying server files..."
Copy-Item -Recurse -Force "server\src" "$sourceDir\server\src"
Copy-Item "server\package.json" "$sourceDir\server\package.json"
Copy-Item "server\.env.example" "$sourceDir\server\.env.example"

Write-Host "Copying root files to source..."
Copy-Item "package.json" "$sourceDir\package.json"
if (Test-Path "package-lock.json") { Copy-Item "package-lock.json" "$sourceDir\package-lock.json" }
Copy-Item "README.md" "$sourceDir\README.md"
Copy-Item ".env.example" "$sourceDir\.env.example"
Copy-Item -Recurse -Force "client\public" "$sourceDir\public"

Write-Host "Verifying no node_modules or .env exist in submission..."
$badFiles = Get-ChildItem -Path "submission" -Recurse -Include "node_modules", ".env", "dist", ".vite", "test-results" -Force -ErrorAction SilentlyContinue
if ($badFiles) {
    Write-Host "Removing unwanted files:"
    $badFiles | Remove-Item -Recurse -Force
}

Write-Host "Submission source prepared successfully!"
