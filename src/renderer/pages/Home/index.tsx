// import { Link } from "react-router-dom";
// 根据文件系统大小写敏感性，统一导入路径的大小写
import MyTree from "@/renderer/components/tree"
import BlockNote from "@/renderer/components/blocknote";
import "./index.less";


const Home = () => {
  return (
    <div className="container">
      {/* 左侧目录结构 */}
      <div className="sidebar">
        <MyTree />
      </div>
      {/* 右侧文章内容 */}
      <div className="content">
      <BlockNote />
      </div>
    </div>
  );
};

export default Home;
