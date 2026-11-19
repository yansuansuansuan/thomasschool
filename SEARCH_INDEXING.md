# 百度搜索收录与官网运营操作表

正式官网：https://thomasweek.top/  
源码仓库：yansuansuansuan/thomasschool  
托管：腾讯云 EdgeOne Makers，生产分支 main

## 目前由代码维护完成的项目

- 主域名的 canonical、结构化数据和文章 URL 使用 https://thomasweek.top/。
- 站点地图：https://thomasweek.top/sitemap.xml （随新增文章更新）。
- 搜索引擎规则：https://thomasweek.top/robots.txt。
- 百度普通收录可复制的纯文本 URL：https://thomasweek.top/baidu-urls.txt。
- 新文章新增或修改后运行：`node scripts/refresh-content.mjs`，自动同步首页文章目录相关索引、Sitemap、RSS、LLMS 目录和百度网址文本。
- 运行：`node scripts/check-site.mjs`，检查页面 canonical、标题、描述、JSON-LD、站内引用、Sitemap 与网址清单的一致性。
- GitHub Actions 的 `Website quality checks` 在 main 更新和 PR 时检查上述项目。

## 只有网站所有者账户能执行的操作

1. 登录 https://ziyuan.baidu.com/ ，选择站点管理，添加可公开访问的 `https://thomasweek.top/`。按平台页面实际规则完成主域名/协议配置。
2. 建议使用 HTML 标签验证。复制平台给出的**真实验证码**，将完整 meta 标签放进 `index.html` 的 `<head>`，发布后点击“验证”；也可用 DNS/CNAME 或官方要求的文件验证。**不要写入虚构验证值。**
3. 完成验证后进入“资源提交 → 普通收录”，如账户有 Sitemap 入口，提交 `https://thomasweek.top/sitemap.xml`；也可从 `baidu-urls.txt` 复制站点当前的网址逐条或批量提交，具体数量依账号配额。
4. 使用“抓取诊断”，检查首页、幼小衔接、少儿英语、文章中心和两篇文章是否能返回有效内容。注意诊断抓取成功 **不等于收录**。
5. 每周检查索引量、抓取异常、搜索词和实际自然搜索流量；没有数据时先解决收录和抓取问题，不要购买“保证排名”服务。

## 需要特别注意

- Safari 在手机无 VPN 情况下可打开，是用户已确认的访问事实；仍需检查其他运营商及微信内置浏览器。
- 微信中的“未完成 ICP 备案”提醒属于微信客户端的安全提示场景，不应靠修改网页中的备案号字符串规避，不能冒用 ICP 备案号。可以通过微信内提示中的站长申诉入口依法反馈，或按需要办理正式备案。
- 用户所见百度收录、排名依赖百度搜索本身，提交网址只是帮助发现，不保证收录。
- 官方站点只对自己实际经营的“托马斯学习馆王家湾人信汇校区”负责，不宣称代表旧加盟总部。
- 如果后续改用中国大陆节点，应先按实际机构资质与备案要求办理 ICP 备案；不能因为买了国内域名就默认已有备案。
- 不要在公开仓库提交百度 API 的私密推送 token。如需自动推送，使用 GitHub Actions 加密 Secrets 并设置资源配额。

## 官方入口

- 百度搜索资源平台：https://ziyuan.baidu.com/
- 百度站点管理：https://ziyuan.baidu.com/site/index
- 百度工具帮助：https://ziyuan.baidu.com/doc
- EdgeOne 控制台：https://console.cloud.tencent.com/edgeone/makers
