import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

// 获取当前文件的目录名
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 源目录和目标目录
const sourceDirs = [
  path.resolve(__dirname, '../libs/cesium/Build/CesiumUnminified/Assets'),
  path.resolve(__dirname, '../libs/cesium/Build/CesiumUnminified/Workers'),
  path.resolve(__dirname, '../libs/cesium/Build/CesiumUnminified/ThirdParty'),
  path.resolve(__dirname, '../libs/cesium/Build/CesiumUnminified/Widgets')
];

// 添加 Cesium.d.ts 源文件路径
const cesiumFiles = [
  {
    src: path.resolve(__dirname, '../libs/cesium/Source/Cesium.d.ts'),
    dest: 'Cesium.d.ts'
  }
];

const targetBaseDir = path.resolve(__dirname, '../dist');

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

// 复制 Cesium 主文件
cesiumFiles.forEach(file => {
  if (fs.existsSync(file.src)) {
    fs.copySync(file.src, path.join(targetBaseDir, file.dest), { overwrite: true });
    console.log(`已复制 ${file.dest} 到 ${targetBaseDir}`);
  } else {
    console.warn(`文件不存在: ${file.src}`);
  }
});

console.log('Cesium资源文件复制完成');