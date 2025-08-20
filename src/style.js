// 定义要切换的文字数组
const texts = ["始于兴趣", "忠于热爱", "不败与心态"];
// 获取HTML中用于显示文字的元素
const fadeText = document.getElementById("fadeText");
// 当前显示的文字索引（默认从第1个开始）
let idx = 0;

// 显示文字的函数
function showText() {
  // 设置元素的文本为当前索引对应的文字
  fadeText.textContent = texts[idx];
  // 移除透明类，添加完全显示类（触发淡入动画）
  fadeText.classList.remove("opacity-0");
  fadeText.classList.add("opacity-100");
  // 显示1秒后调用隐藏函数
  setTimeout(hideText, 1000);
}

// 隐藏文字的函数
function hideText() {
  // 移除完全显示类，添加透明类（触发淡出动画）
  fadeText.classList.remove("opacity-100");
  fadeText.classList.add("opacity-0");
  // 计算下一个索引（循环切换：0→1→2→0...）
  idx = (idx + 1) % texts.length;
  // 隐藏1秒后调用显示函数，开始下一轮
  setTimeout(showText, 1000);
}

// 初始化：确保元素一开始是透明的
fadeText.classList.add("opacity-0");
// 启动动画
showText();

const mobileMenuBtn = document.getElementById("mobileMenuBtn");
const mobileMenu = document.getElementById("mobileMenu");
const closeMobileMenu = document.getElementById("closeMobileMenu");

// 打开菜单
function openMenu() {
  mobileMenu.classList.remove("opacity-0", "invisible", "translate-y-4");
  mobileMenu.classList.add("opacity-100", "visible", "translate-y-0");
  document.body.style.overflow = "hidden"; // 防止背景滚动
}

// 关闭菜单
function closeMenu() {
  mobileMenu.classList.remove("opacity-100", "visible", "translate-y-0");
  mobileMenu.classList.add("opacity-0", "invisible", "translate-y-4");
  document.body.style.overflow = "auto"; // 恢复背景滚动
}

mobileMenuBtn.addEventListener("click", openMenu);
closeMobileMenu.addEventListener("click", closeMenu);

// 点击菜单外部关闭菜单
mobileMenu.addEventListener("click", (e) => {
  if (e.target === mobileMenu) closeMenu();
});

// ESC键关闭菜单
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && !mobileMenu.classList.contains("invisible")) {
    closeMenu();
  }
});
