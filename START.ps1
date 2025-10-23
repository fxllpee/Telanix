# 🎬 SCRIPT DE INICIALIZAÇÃO - TELANIX
# Inicia backend e frontend automaticamente

Write-Host "`n╔════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║   🎬 TelaNix - Iniciando...   ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════╝`n" -ForegroundColor Cyan

# Verificar se PostgreSQL está rodando
Write-Host "🔍 Verificando PostgreSQL..." -ForegroundColor Yellow
$pgRunning = Get-Process -Name "postgres" -ErrorAction SilentlyContinue
if (!$pgRunning) {
    Write-Host "❌ PostgreSQL não está rodando!" -ForegroundColor Red
    Write-Host "⚠️  Abra o pgAdmin e inicie o servidor PostgreSQL`n" -ForegroundColor Yellow
    Read-Host "Pressione Enter após iniciar o PostgreSQL"
}
Write-Host "✅ PostgreSQL OK`n" -ForegroundColor Green

# Verificar .env do backend
if (!(Test-Path "backend\.env")) {
    Write-Host "❌ Arquivo backend\.env não encontrado!" -ForegroundColor Red
    Write-Host "📝 Crie o arquivo com:" -ForegroundColor Yellow
    Write-Host "DATABASE_URL=postgresql://postgres:SUA_SENHA@localhost:5432/telanix_db`n" -ForegroundColor White
    exit 1
}
Write-Host "✅ backend\.env OK`n" -ForegroundColor Green

# Iniciar Backend
Write-Host "🚀 Iniciando Backend..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\backend'; Write-Host '🎬 BACKEND - TelaNix API' -ForegroundColor Green; pnpm dev"
Start-Sleep -Seconds 3

# Iniciar Frontend
Write-Host "🚀 Iniciando Frontend..." -ForegroundColor Cyan
Start-Sleep -Seconds 2
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD'; Write-Host '🎬 FRONTEND - TelaNix' -ForegroundColor Blue; pnpm dev"
Start-Sleep -Seconds 5

# Abrir navegador
Write-Host "`n✅ TUDO INICIADO!`n" -ForegroundColor Green
Write-Host "📍 Frontend: http://localhost:8080" -ForegroundColor Cyan
Write-Host "📍 Backend:  http://localhost:3001" -ForegroundColor Cyan
Write-Host "📍 Health:   http://localhost:3001/health`n" -ForegroundColor Cyan

Write-Host "⚡ Abrindo navegador..." -ForegroundColor Yellow
Start-Sleep -Seconds 3
Start-Process "http://localhost:8080"

Write-Host "`n✅ Pronto! Site no ar! 🎉" -ForegroundColor Green
Write-Host "Pressione Ctrl+C nas janelas para parar`n" -ForegroundColor Yellow

