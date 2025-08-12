const fs = require("fs").promises;
const path = require("path");
const { JSDOM } = require("jsdom");
const marked = require("marked");

// 配置参数
const ARTICLES_DIR = "./article"; // Markdown源文件目录
const HTML_FILE = "./index.html"; // 首页HTML文件
const CATEGORY_PRO_ID = "programming"; // 编程分类section ID
const CATEGORY_MOD_ID = "modeling"; // 建模分类section ID

// 分类映射表
const CATEGORY_MAP = {
  [CATEGORY_PRO_ID]: ["HTML_", "PYTHON", "C#", "STM32", "TOOL"],
  [CATEGORY_MOD_ID]: [
    "3DMAX",
    "Blender",
    "CAD",
    "MAYA",
    "PR",
    "PS",
    "Rhino",
    "SOLIDWORKS_2025",
    "SP",
    "UNITY6",
    "Zbrush",
  ],
};

/**
 * 将Markdown文件转换为独立HTML文章（与MD同目录）
 * @param {string} mdPath - Markdown文件路径
 * @returns {string} 生成的HTML文件相对路径
 */
async function convertMdToHtml(mdPath) {
  try {
    // 1. 读取Markdown内容并转换为HTML
    const mdContent = await fs.readFile(mdPath, "utf8");
    const htmlContent = marked.parse(mdContent);

    // 2. 构建输出路径（与MD文件同目录，同名不同后缀）
    const mdDir = path.dirname(mdPath); // 获取MD文件所在目录
    const mdFileName = path.basename(mdPath, ".md"); // 获取MD文件名（不含后缀）
    const outputPath = path.join(mdDir, `${mdFileName}.html`); // 同目录下生成同名HTML

    // 3. 生成完整HTML文件（带基础样式和返回首页链接）
    const fullHtml = `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${mdFileName}</title>
  <style>
    body { 
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      line-height: 1.6;
      max-width: 800px;
      margin: 0 auto;
      padding: 2rem;
      color: #333;
    }
    h1, h2, h3 { color: #222; border-bottom: 1px solid #eee; padding-bottom: 0.5rem; }
    pre { 
      background: #f5f5f5; 
      padding: 1rem; 
      border-radius: 4px; 
      overflow-x: auto;
    }
    code { background: #f5f5f5; padding: 0.2rem 0.4rem; border-radius: 3px; }
    a { color: #007bff; text-decoration: none; }
    a:hover { text-decoration: underline; }
    .back-link { margin-bottom: 2rem; display: inline-block; }
    /* 图片自适应 */
    img { max-width: 100%; height: auto; border-radius: 4px; }
  </style>
</head>
<body>
  <div class="back-link">
    <a href="${path
      .relative(mdDir, HTML_FILE)
      .replace(/\\/g, "/")}">← 返回首页</a>
  </div>
  <article>
    ${htmlContent}
  </article>
</body>
</html>
    `.trim();

    await fs.writeFile(outputPath, fullHtml);
    // 返回相对于首页的路径（确保卡片链接正确）
    return path
      .relative(path.dirname(HTML_FILE), outputPath)
      .replace(/\\/g, "/");
  } catch (error) {
    console.error(`转换失败 ${mdPath}:`, error);
    return null;
  }
}

/**
 * 解析Markdown文件信息并生成卡片
 * @param {string} filePath - Markdown文件路径
 * @returns {object} 包含卡片HTML和分类信息的对象
 */
async function parseMarkdown(filePath) {
  try {
    const content = await fs.readFile(filePath, "utf8");

    // 提取标题
    const titleMatch = content.match(/^#\s*(.*)/m);
    const title = titleMatch
      ? titleMatch[1].trim()
      : path.basename(filePath, ".md");

    // 提取分类文件夹
    const parentFolder = path.basename(path.dirname(path.dirname(filePath)));

    // 获取更新时间
    const stats = await fs.stat(filePath);
    const updateDate = new Date(stats.mtime).toLocaleDateString("zh-CN");

    // 转换为HTML并获取访问路径
    const htmlFilePath = await convertMdToHtml(filePath);
    if (!htmlFilePath) return null;

    // 生成卡片HTML
    return {
      html: `
        <a href="${htmlFilePath}">
          <div class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <h2 class="text-xl font-bold mb-2">${title}</h2>
            <p class="text-gray-600 mb-4">分类: ${parentFolder}</p>
            <p class="text-gray-400">更新日期: ${updateDate}</p>
          </div>
        </a>
      `.trim(),
      category: getCategory(parentFolder),
      parentFolder,
    };
  } catch (error) {
    console.error(`解析失败 ${filePath}:`, error);
    return null;
  }
}

/**
 * 判断文件夹所属分类
 * @param {string} folderName - 文件夹名称
 * @returns {string} 分类ID
 */
function getCategory(folderName) {
  if (
    CATEGORY_MAP[CATEGORY_PRO_ID].some((prefix) => folderName.includes(prefix))
  ) {
    return CATEGORY_PRO_ID;
  }
  if (
    CATEGORY_MAP[CATEGORY_MOD_ID].some((prefix) => folderName.includes(prefix))
  ) {
    return CATEGORY_MOD_ID;
  }
  return CATEGORY_PRO_ID; // 默认分类
}

/**
 * 扫描所有Markdown文件
 * @param {string} dir - 扫描目录
 * @returns {string[]} 文件路径列表
 */
async function findAllMarkdownFiles(dir) {
  let results = [];
  const entries = await fs.readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results = [...results, ...(await findAllMarkdownFiles(fullPath))];
    } else if (entry.isFile() && entry.name.endsWith(".md")) {
      results.push(fullPath);
    }
  }
  return results;
}

/**
 * 更新分类区域卡片
 * @param {string} htmlContent - 原始HTML内容
 * @param {string} categoryId - 分类ID
 * @param {string[]} cards - 卡片HTML列表
 * @returns {string} 更新后的HTML内容
 */
async function updateCategorySection(htmlContent, categoryId, cards) {
  const dom = new JSDOM(htmlContent);
  const document = dom.window.document;

  // 查找分类section
  const section = document.getElementById(categoryId);
  if (!section) {
    console.error(`未找到分类区域: ${categoryId}`);
    return htmlContent;
  }

  // 查找网格容器
  const gridDiv = section.querySelector("div.grid");
  if (!gridDiv) {
    console.error(`未找到网格容器: ${categoryId}`);
    return htmlContent;
  }

  // 更新卡片内容
  gridDiv.innerHTML = [...new Set(cards)].join("\n    ");
  return dom.serialize();
}

/**
 * 主更新函数
 * @param {object} cardsByCategory - 分类卡片映射
 */
async function updateHtml(cardsByCategory) {
  try {
    let htmlContent = await fs.readFile(HTML_FILE, "utf8");

    // 更新两个分类区域
    htmlContent = await updateCategorySection(
      htmlContent,
      CATEGORY_PRO_ID,
      cardsByCategory[CATEGORY_PRO_ID]
    );
    htmlContent = await updateCategorySection(
      htmlContent,
      CATEGORY_MOD_ID,
      cardsByCategory[CATEGORY_MOD_ID]
    );

    // 写入更新后的首页
    await fs.writeFile(HTML_FILE, htmlContent);
    console.log(`首页更新完成:
      - 编程类: ${cardsByCategory[CATEGORY_PRO_ID].length}篇
      - 建模类: ${cardsByCategory[CATEGORY_MOD_ID].length}篇
    `);
    console.log("首页路径:", path.resolve(HTML_FILE));
  } catch (error) {
    console.error("首页更新失败:", error);
  }
}

/**
 * 主函数
 */
async function main() {
  try {
    // 扫描Markdown文件
    console.log("开始扫描文章...");
    const mdFiles = await findAllMarkdownFiles(ARTICLES_DIR);
    console.log(`找到 ${mdFiles.length} 篇Markdown文章`);

    // 分类处理文章
    const cardsByCategory = {
      [CATEGORY_PRO_ID]: [],
      [CATEGORY_MOD_ID]: [],
    };

    for (const file of mdFiles) {
      const cardInfo = await parseMarkdown(file);
      if (cardInfo) {
        cardsByCategory[cardInfo.category].push(cardInfo.html);
        console.log(`${path.basename(file)} → ${cardInfo.category}`);
      }
    }

    // 更新首页
    await updateHtml(cardsByCategory);
    console.log("所有操作完成");
  } catch (error) {
    console.error("执行失败:", error);
    process.exit(1);
  }
}

// 执行主函数
main();
