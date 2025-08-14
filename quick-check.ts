import fs from "fs";
import path from "path";
import yaml from "js-yaml";

function logSection(title: string) {
  console.log("\n=== " + title + " ===");
}

// 1. Cek file pnpm-workspace.yaml
const workspacePath = path.join(process.cwd(), "pnpm-workspace.yaml");
if (!fs.existsSync(workspacePath)) {
  console.error("❌ pnpm-workspace.yaml tidak ditemukan di root project!");
  process.exit(1);
}

const workspace = yaml.load(fs.readFileSync(workspacePath, "utf8")) as any;
logSection("PNPM Workspace Globs");
console.log(workspace.packages);

// 2. Cek semua folder apps/ & packages/
["apps", "packages"].forEach((folder) => {
  const dirPath = path.join(process.cwd(), folder);
  if (!fs.existsSync(dirPath)) {
    console.warn(`⚠ Folder ${folder} tidak ada`);
    return;
  }

  const subfolders = fs.readdirSync(dirPath);
  subfolders.forEach((pkgFolder) => {
    const pkgPath = path.join(dirPath, pkgFolder, "package.json");
    if (!fs.existsSync(pkgPath)) {
      console.warn(`⚠ ${folder}/${pkgFolder} tidak ada package.json`);
      return;
    }
    const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
    console.log(`📦 ${folder}/${pkgFolder} → name: ${pkg.name || "❌ MISSING NAME"}`);
  });
});
