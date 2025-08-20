# tailwindcss?!

想必各位已经通过了常规的 css 的书写流程，那么各位就一定对各各属性以及属性值有较为深刻的印象，并且可以通过自己的想法随意更改排版样式，但是我们在制作样式时，总会出现一些问题，比如：你需要在制作样式时不停的更改你的工作空间的文件夹，来反复核对样式是否正确，这样长期以来效率变低，那么有什么可以避免这种情况的发生呢？

那么，tailwindcss 就可以帮助我们解决这个问题。

那么先得介绍一下它是什么？

Tailwind CSS 与传统的 UI 框架（如 Bootstrap、Foundation）不同，它不提供现成的组件，而是提供了一套完整的原子化 CSS 类。开发者可以通过组合这些类来构建独特的界面，实现高度定制化的设计。比如：

```html
<div class="bg-red-500 text-white p-4">这是一个红色的div</div>
```

欸别着急，我们是不是在常规 css 哪里已经经常使用 class 类名了，那么 tailwindcss 的类名和常规 css 的类名有什么区别呢？

之前如果我们需要一个特定的区块拥有我们特定的一些样式，我们可能会这样在 html 中写出代码：

```html
<div class="classname"></div>
```

然后我们会跑到 css 的文档内建立一个这样的 css 样式

```css
.classname {
  background-color: red;
}
```

这个过程其实就是 tailwindcss 的工作原理，只不过呢，他已经有了很多的样式类，我们只需要在 html 中的 class 属性中引入这些类名就可以了！我们就会在 output 的 css 样式文件夹中得到相应的自动创建的类与之对应，而却你无需担心这可能会重复或者覆盖，（这个问题我在我的 css 章节的学习记录中未提及，如果需要了解请依照经验查找相关资料！）那么接下来华丽的开始吧！

## 配置环境

如果你不只学习了一种语言，还接触过很多的其他语言，那么你肯定会了解到不同语言的运行环境一定会有所不同，比如我们的 C 语言的运行环境是在我们的操作系统中，这涉及到 GCC 转译
GCC 与编译链路 ​

- GCC（GNU Compiler Collection）作为 C 语言的主流编译器，构建了完整的代码转译流程：​
  - **预处理阶段**：处理宏定义（#define）、头文件包含（#include）等指令，生成.i 文件
  - **编译阶段**：将预处理后的代码转换为汇编语言，生成.s 文件
  - **汇编阶段**：将汇编代码转换为机器码，生成.o 目标文件
  - **链接阶段**：将多个目标文件与系统库链接，生成可执行文件

python 的运行环境则需要我们再错做系统上下载对应的解释器，这些都不是我们的重点，我们需要知道这个 tailwindcss 也是需要一个环境来运行的，这个环境就是 nodejs，那么我们就需要在我们的系统上下载 nodejs，下载完成后，我们就可以在命令行中输入 node -v 来查看 nodejs 的版本号，来确认是否安装成功。

nodejs 下载地址：[Node.js 中文网](https://nodejs.cn/download/)

小声说一句这个网址还有一个官方网址[Node.js 英文官网](https://nodejs.org/en)有可能打不开，tips：跟网络环境有关！

这里你下载的时候需要注意下载 npm，因为 tailwindcss 是基于 nodejs 的，所以我们需要下载 nodejs 的 npm 包管理器
至于版本我建议直接下载推荐的最新版就可以，因为一般情况下官网的推荐都是 LST 也是就是我们所说的稳定版 。

下载后请通过这样的代码见着是否安装成功在 power shell 中

```bash
node -v
npm -v
npx -v
```

来检测是否成功下载并且有对应的版本号

## 安装

在安装前我需要说明一下，IDE 我使用的是 VS Code 。这个编辑器没有 VS 那么强大的模块化自定义安装。但是 VS code 拥有大量的插件可以加载进行自定义。

首先我们已经在环境配置中下载了 nodejs，在 tailwindcss 的官网推荐了我们很多的使用方式，但是我经常使用的是 tailwind CLI,在官方的介绍中是如此介绍该方案的：

    The simplest and fastest way to get up and running with Tailwind CSS from scratch is with the Tailwind CLI tool. The CLI is also available as a standalone executable if you want to use it without installing Node.js.

**步骤一**：安装 tailwindcss

```bash
npm install tailwindcss @tailwindcss/cli
```

这一步使用后你将会在你的工作空间内看到 node_modules 文件夹，这个文件夹内包含了 tailwindcss 以及它的依赖。当然你还看到了自动为你生成的两份文件：`package.json`和`package-lock.json`，这两份文件极其重要，对于之后网页部署的环境极其重要，它指导你的环境中应该安装那些第三方依赖，比如这样的内容：

```json
{
  "name": "my-project",
  "version": "1.0.0",
  "description": "My project",
  "scripts": {
    "dev": "npx tailwindcss -i （入口css相对地址） -o （出口css相对地址） --watch",
    "build": "tailwindcss build styles.css -o output.css"
  },
  "devDependencies": {
    "@tailwindcss/cli": "^4.1.11",
    "chokidar": "^4.0.3",
    "fs-extra": "^11.3.1",
    "jsdom": "^26.1.0",
    "marked": "^16.1.2",
    "tailwindcss": "^4.1.11"
  }
}
```

其中的`devDependencies`就是我们安装的依赖，其后跟随的内容便是该依赖的版本号，我们可以根据需要进行修改。

```json
"name": "my-project",
"version": "1.0.0",
"description": "My project",
```

这些内容可以不写，只是便于我们辨认而已。

**步骤二**：将 tailwindcss 导入入口 CSS 文件中

```css
@import "tailwindcss";
```

这要写到你的入口 css 文件的顶部

**步骤三**：开始 tailwind cli 的创建工作

```bash
npx @tailwindcss/cli -i （入口css相对地址） -o （出口css相对地址） --watch
```

当输入终端就会现实 done xxxms ，这个 xxx 就是 tailwindcss 编译的时间，单位是毫秒。

**步骤四**：使用 tailwindcss

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link href="（出口css相对地址）" rel="stylesheet" />
  </head>
  <body>
    <h1 class="text-3xl font-bold underline">Hello world!</h1>
  </body>
</html>
```

## 使用

如果你也经常使用 AI，那么你应该会的带这样的答案，会让你在下载 tailwindcss 时，会让你在下载完成后，在命令行中输入`npx tailwindcss init`来初始化 tailwindcss 的配置文件。但如果你使用的是最新的版本 tailwindcss 那么这句命令就没有必要再写了，因为其中的初始化内容在`node_modules`文件夹中就已经进行初始化了。

不过在我上面的 json 的脚本中写下了这样一段命令

```json
"scripts": {
    "dev": "npx tailwindcss -i （入口css相对地址） -o （出口css相对地址） --watch",
    "build": "tailwindcss build styles.css -o output.css"
  },
```

这其实就已经包含了 dev 命令，我们只需要在命令行中输入以下指令就可以启动 tailwindcss 的编译过程。

```bash
npm run dev
```

这句代码的意思就是通过入口 css 中的文件（当然包含你自定义的一些样式），然后通过 tailwindcss 编译，生成出口 css 文件。在你的 html 文件中引用他就可以啦！

# 使用技巧以及文档

首先还是那句话，文档就是我们最好的老师我们要在学习一种东西的时候，一定要先去看它的文档，文档中包含了它的所有的使用方法，以及它的所有的配置项。如果你不看就很有可能出现一些本来根本没必要去解决的问题，当然如果你经验极其丰富，知道每个版本的环境中该怎么配置这些内容除外。这大多数人基本上都不太可能，比如如果你即其依赖 AI 的回答，你会发现无论你询问那里的 AI 都会给你一个步骤为`npx tailwindcss init`这其实是 node 16 版本需要的操作，但是我们一般下载最新且稳定版本，有可能会报错！另外如果你询问 ai 我想在入口 css 中添加一些 tailwindcss 的自定义类，那么他大有可能会告诉你:

```css
.root {
  --color-mint-500: oklch(0.72 0.11 178);
  //更多你自定义的内容
}
```

可是你去观看官方文档你会发现，官方是这样在入口 css 中写的

```css
@theme {
  --font-display: "Satoshi", "sans-serif";
  --breakpoint-3xl: 120rem;
  --color-avocado-100: oklch(0.99 0 0);
  --color-avocado-200: oklch(0.98 0.04 113.22);
  --color-avocado-300: oklch(0.94 0.11 115.03);
  --color-avocado-400: oklch(0.92 0.19 114.08);
  --color-avocado-500: oklch(0.84 0.18 117.33);
  --color-avocado-600: oklch(0.53 0.12 118.34);
  --ease-fluid: cubic-bezier(0.3, 0, 0, 1);
  --ease-snappy: cubic-bezier(0.2, 0, 0, 1);
  /* ... */
}
```

对此你也可以从官方文档中找到对应的解释

- Why @theme instead of :root?
  Theme variables aren't just CSS variables — they also instruct Tailwind to create new utility classes that you can use in your HTML.

  Since they do more than regular CSS variables, Tailwind uses special syntax so that defining theme variables is always explicit. Theme variables are also required to be defined top-level and not nested under other selectors or media queries, and using a special syntax makes it possible to enforce that.

  Defining regular CSS variables with can still be useful in Tailwind projects when you want to define a variable that isn't meant to be connected to a utility class. Use when you want a design token to map directly to a utility class, and use for defining regular CSS variables that shouldn't have corresponding utility classes.:root@theme:root

（书籍是人类最好的阶梯）这句话非常正确

# 重要属性

重要的 Tailwind 属性分类列举,如果你已经俩结果常规 css 方式，那么下面的内容会让你感到无比亲切！

## 一、布局定位类

布局类工具是构建页面结构的基础，控制元素的排列方式和位置关系：

**容器与网格**：`container`（响应式容器）、`grid`（网格布局）、`grid-cols-{n}`（定义列数）、`grid-rows-{n}`（定义行数）、`gap-{size}`（网格间距）

**弹性布局**：`flex`（弹性容器）、`inline-flex`（行内弹性容器）、`flex-row/flex-col`（主轴方向）、`flex-wrap`（换行控制）、`justify-start/center/end`（主轴对齐）、`items-start/center/end`（交叉轴对齐）

**定位**：`static`（静态定位）、`relative`（相对定位）、`absolute`（绝对定位）、`fixed`（固定定位）、`sticky`（粘性定位）、`top-{size}/right/bottom/left`（方位偏移）

**浮动与清除**：`float-left/right`（浮动）、`clear-both`（清除浮动）

## 二、盒模型与尺寸类

控制元素的尺寸、边距和内边距，是页面布局精细化调整的核心：

**宽度**：`w-0/w-auto/w-full`（基础宽度）、`w-screen`（屏幕宽度）、`w-{percentage}`（百分比宽度，如 `w-1/2`）、`w-min/w-max`（最小 / 最大内容宽度）

**高度**：`h-0/h-auto/h-full`（基础高度）、`h-screen`（屏幕高度）、`h-{percentage}`（百分比高度）、`h-min/h-max`（最小 / 最大内容高度）

**内外边距**：`p-{size}`（内边距，如 `p-4`）、`px-{size}`（水平内边距）、`py-{size}`（垂直内边距）、`m-{size}`（外边距）、`mx-{size}`（水平外边距）、`my-{size}`（垂直外边距）、`mt/mr/mb/ml`（单方向边距）

**盒模型**：`box-border`（边框盒模型）、`box-content`（内容盒模型）、`overflow-hidden/auto/scroll`（溢出控制）

## 三、排版类

负责文本样式的呈现，直接影响页面的可读性和视觉层级：

**字体**：`font-sans/serif/mono`（字体族）、`font-bold/semibold/normal/light`（字重）、`text-xs/sm/base/lg/xl/2xl...`（字体大小）

**文本对齐**：`text-left/center/right/justify`（水平对齐）、`align-baseline/top/middle/bottom`（垂直对齐）

**文本样式**：`text-uppercase/lowercase/capitalize`（大小写）、`italic`（斜体）、`underline/line-through`（文本装饰）、`tracking-tight/wide`（字间距）、`leading-tight/loose`（行高）

**文本颜色**：`text-{color}-{shade}`（如 `text-blue-500`、`text-gray-800`）、`text-current`（继承颜色）、`text-transparent`（透明文本）

## 四、背景与边框类

用于美化元素外观，增强视觉层次感：

**背景**：`bg-{color}-{shade}`（背景色）、`bg-transparent`（透明背景）、`bg-gradient-to-r/to-b`（渐变方向）、`bg-cover/contain`（背景图尺寸）、`bg-center/top/left`（背景位置）、`bg-repeat/no-repeat`（背景重复）

**边框**：`border`（边框宽度）、`border-{side}`（单边边框，如 `border-t`）、`border-{color}-{shade}`（边框颜色）、`border-solid/dashed/dotted`（边框样式）、`rounded/rounded-md/rounded-full`（圆角）、`ring/ring-{color}`（外围光环）

**阴影**：`shadow-sm/md/lg/xl`（阴影大小）、`shadow-inner`（内阴影）、`shadow-{color}`（阴影颜色）

## 五、交互状态类

控制元素在不同交互状态下的样式表现：

**伪类**：`hover:{class}`（悬停状态）、`focus:{class}`（聚焦状态）、`active:{class}`（激活状态）、`visited:{class}`（访问过状态）、`focus-within:{class}`（子元素聚焦）

**表单状态**：`disabled:{class}`（禁用状态）、`checked:{class}`（选中状态）、`invalid:{class}`（无效状态）、`required:{class}`（必填项）

**指针事件**：`pointer-events-none`（禁用指针事件）、`pointer-events-auto`（恢复指针事件）、`cursor-pointer/default/wait`（鼠标指针样式）

## 六、动画与过渡类

为元素添加动态效果，提升用户体验：

**过渡**：`transition`（过渡效果）、`transition-colors/transform`（指定过渡属性）、`duration-{ms}`（过渡时长，如 `duration-300`）、`ease-in/out/in-out`（过渡曲线）

**动画**：`animate-none`（无动画）、`animate-pulse`（脉冲动画）、`animate-spin`（旋转动画）、`animate-bounce`（弹跳动画）、`animate-slide-in/fade-in`（入场动画）、`animate-slide-out/fade-out`（出场动画）

**变换**：`transform`（变换基础）、`scale-{n}`（缩放）、`rotate-{deg}`（旋转）、`translate-x/y`（平移）、`skew-x/y`（倾斜）、`origin-{position}`（变换原点）

## 七、响应式与条件类

适配不同设备和场景，实现灵活布局：

**响应式前缀**：`sm:`（≥640px）、`md:`（≥768px）、`lg:`（≥1024px）、`xl:`（≥1280px）、`2xl:`（≥1536px），如 `sm:text-lg`、`lg:flex`

**深色模式**：`dark:{class}`（深色模式下的样式），配合 darkMode: 'class'配置使用

**打印样式**：`print:{class}`（打印时的样式），如 `print:hidden`（打印时隐藏）

## 八、其他实用类

涵盖一些高频使用的特殊功能：

**显示与隐藏**：`block/inline/inline-block`（显示方式）、`hidden`（隐藏元素）、`invisible`（视觉隐藏但保留空间）

**溢出控制**：`overflow-visible/hidden/scroll/auto`（内容溢出处理）、`truncate`（文本溢出省略）

**透明度**：`opacity-0/25/50/75/100`（透明度控制）

**层级控制**：`z-index`：`z-0/10/20...50`（层级控制）、`z-auto`（自动层级）

**打印样式**：`print:{class}`（打印时的样式），如 `print:hidden`（打印时隐藏）
