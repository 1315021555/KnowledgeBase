const CracoLessPlugin = require("craco-less");

module.exports = {
  webpack: {
    configure: (config) => {
      config.resolve.extensions = [".js", ".jsx", ".ts", ".tsx"]; // 添加支持的后缀
      // 配置别名
      config.resolve.alias = {
        ...config.resolve.alias,
        "@": require("path").resolve(__dirname, "src"),
      };
      return config;
    },
  },
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            javascriptEnabled: true,
          },
        },
      },
    },
  ],
};
