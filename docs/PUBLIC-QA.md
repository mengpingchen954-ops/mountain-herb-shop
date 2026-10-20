# GitHub Pages 公开验收

日期：2026-10-20（Asia/Shanghai）。

可玩地址：https://mengpingchen954-ops.github.io/mountain-herb-shop/

仓库：https://github.com/mengpingchen954-ops/mountain-herb-shop

GitHub Actions生产部署成功。使用Chrome 155.0.8059.85的全新headless浏览器上下文，无登录会话、无cookie和无预置游戏存档，从公开地址完整试玩。

- 公开HTTPS地址可访问，仓库子路径下JS/CSS/favicon加载，无404和控制台错误。
- 全部66项玩法断言通过：辨识、纠错、采集、两条实际加工路线、分级、包装与库存、六份订单、工具解锁、低等级基础出售、刷新存档。
- 390×844移动视口可操作并无横向溢出。
- RTX3060 / Core Ultra7 265KF / Windows Chrome，药铺约52–60FPS，21次绘制调用。该性能仅代表测试设备。
- 额外公开韧性检查：拖动/滚轮、重复采集、损坏导入、WebGL丢失/恢复，均通过。

本地原始报告：artifacts/public-playthrough-report.json 和 artifacts/resilience-report.json。截图为匿名公开页面真实运行结果。此类测试产物不上传仓库。
