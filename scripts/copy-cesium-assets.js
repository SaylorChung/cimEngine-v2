import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

// 获取当前文件的目录名
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 源目录和目标目录 - 使用 Build/CesiumUnminified 路径
// 只复制必要的资源文件，不复制 Cesium.js
const sourceDirs = [
  path.resolve(__dirname, '../libs/cesium/Build/CesiumUnminified/Assets'),
  path.resolve(__dirname, '../libs/cesium/Build/CesiumUnminified/Workers'),
  path.resolve(__dirname, '../libs/cesium/Build/CesiumUnminified/ThirdParty'),
  path.resolve(__dirname, '../libs/cesium/Build/CesiumUnminified/Widgets')
];

const targetBaseDir = path.resolve(__dirname, '../dist/assets/cesium');

// 确保目标目录存在
fs.ensureDirSync(targetBaseDir);

// 复制每个源目录到目标目录
sourceDirs.forEach(sourceDir => {
  const dirName = path.basename(sourceDir);
  const targetDir = path.join(targetBaseDir, dirName);
  
  if (fs.existsSync(sourceDir)) {
    fs.copySync(sourceDir, targetDir, { overwrite: true });
    console.log(`已复制 ${sourceDir} 到 ${targetDir}`);
  } else {
    console.warn(`源目录不存在: ${sourceDir}`);
  }
});

console.log('Cesium资源文件复制完成');