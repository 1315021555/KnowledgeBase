// electron 模块可以用来控制应用的生命周期和创建原生浏览窗口
const { app, BrowserWindow, globalShortcut } = require("electron");
const path = require("path");
// 保持window对象的全局引用,避免JavaScript对象被垃圾回收时,窗口被自动关闭.
let mainWindow;

const createWindow = () => {
  // 创建浏览窗口
  mainWindow = new BrowserWindow({
    title: "个人知识库123",
    width: 1350,
    height: 700,
    // frame: false,
    webPreferences: {
      nodeIntegration: true,
      enableBlinkFeatures: true,
      contextIsolation: false,
    },
  });

  // 隐藏菜单栏
  mainWindow.setMenu(null);

  const isDev = process.env.NODE_ENV === "development";
  if (!isDev) {
    // 加载应用----react 打包
    mainWindow.loadFile(path.join(__dirname, "./index.html"));
  } else {
    // 加载应用----适用于 react 开发时项目
    // 注册快捷键打开开发者工具
    globalShortcut.register("CommandOrControl+Shift+I", () => {
      mainWindow.webContents.openDevTools();
    });
    // 注册重启应用的快捷键
    globalShortcut.register("CommandOrControl+R", () => {
      app.relaunch();
      app.quit();
    });
    mainWindow.loadURL("http://localhost:3000/");
  }

  isDev && mainWindow.webContents.openDevTools();
  mainWindow.once("ready-to-show", () => {
    mainWindow.show();
  });
  mainWindow.webContents.on("dom-ready", () => {});

  mainWindow.webContents.on("did-finish-load", () => {});

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
};

// 当 app 启动之后，执行窗口创建等操作
app.on("ready", () => {
  createWindow();
});

// 所有窗口关闭时退出应用.
app.on("window-all-closed", function () {
  // macOS中除非用户按下 `Cmd + Q` 显式退出,否则应用与菜单栏始终处于活动状态.
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", function () {
  // macOS中点击Dock图标时没有已打开的其余应用窗口时,则通常在应用中重建一个窗口
  if (mainWindow === null) {
    createWindow();
  }
});

// 你可以在这个脚本中续写或者使用require引入独立的js文件.
