import { exec } from "child_process";
import { config } from "dotenv";


config();

const API_URL = process.env.VITE_API_BASE_URL;

if (!API_URL) {
  console.error("❌ Ошибка: VITE_API_BASE_URL не задан в .env!");
  process.exit(1);
}

console.log(`🚀 Генерируем типы из ${API_URL}/openapi.json...`);

// const command = `npx openapi-typescript ${API_URL}/openapi.json -o src/types/api.ts`;
const command = `npx openapi-typescript ${API_URL}/openapi.json -o src/types/api.ts --noValidate`;

exec(command, (err, stdout, stderr) => {
  if (err) {
    console.error(`❌ Ошибка: ${err.message}`);
    return;
  }
  if (stderr) {
    console.error(`⚠️ Предупреждение: ${stderr}`);
  }
  console.log(stdout);
  console.log("✅ Типы успешно сгенерированы!");
});

