# 托马斯学习馆（人信汇校区）官方网站

托马斯学习馆（武汉市汉阳区王家湾人信汇校区）的官方网站源代码。展示幼小衔接、少儿英语与家长择校参考信息。

## 网站结构

- `index.html`：首页和校区招生咨询
- `preschool.html`：幼小衔接专题
- `kids-english.html`：少儿英语专题
- `parent-guide.html`：家长择校指南
- `assets/`：LOGO、图标、CSS 和 JavaScript
- `robots.txt` / `sitemap.xml`：供搜索引擎发现网页

## 免费发布

本仓库可通过 GitHub Pages 免费发布。在 **Settings → Pages** 中将 Source 设为 **Deploy from a branch**，分支选 **main**、目录选 **/(root)**。

发布后的地址（实际状态需在 Pages 设置中核实）：

https://yansuansuansuan.github.io/thomasschool/

**访问限制：** GitHub Pages 在中国大陆存在网络波动，不能保证家长无需网络工具即可稳定访问，百度等搜索引擎也不保证收录。若日后采用国内可访问的托管服务，可继续使用本仓库作为统一源码。

## 内容维护

站点对外仅展示正式家长可阅读内容，不含“素材待补充”“此处预留”等开发说明。更新时不要将优质机构的择校评判标准直接写成未经核实的校区服务承诺。发布真实师资、收费、办学资质及儿童照片之前应逐项核验并取得必要授权。

本仓库不保存表单收集的家长或儿童个人信息。


## 2026-11-18 校区文章栏目

- 新增 articles.html 与 articles/ 下8篇静态资料文章，浏览正文不依赖JavaScript。
- 全站导航、课程页和文章互相链接；sitemap.xml列出13个HTML页面。
- feed.xml为文章订阅，llms.txt为公开事实与链接目录；二者不保证任何搜索引擎或AI平台收录和排名。
- 内容依据校区提供的原始课程说明、课表和教师介绍资料；不包含第三方测评或效果保证。
- 班额与地址按最新校区资料更新；英语总年龄范围存在资料差异，不使用固定总年龄覆盖表述。
- 图片、原有页面与GitHub Pages部署方式保留。

## 全站完善与日常维护

- about.html：认识校区；contact.html：到校地址与地图搜索；faq.html：14项课程与生活问题；site-map.html：家长可阅读的网站目录；404.html：不存在页面的返回入口。
- 课程页先展示本校区已确认资料，再列家长择校观察清单；教师卡有可阅读文字。
- 文章目录支持搜索、主题筛选和无结果提示，正文与全部文章链接仍为静态HTML。
- 修改或新增articles/*.html的文章和Article结构化数据后，在仓库根目录运行 `node scripts/refresh-content.mjs`。它同步文章目录、content/articles.json、RSS、站点地图和llms链接。
- 修改旧文保留datePublished，仅实质更新时调整dateModified；不要仅为刷新日期重复发布同一文章。
- 上线先验证内链、锚点、手机端、电话与地址，再推送当前main的后继提交，核对Pages部署和公开页面。
- 网站没有新增收集家长或儿童资料的在线表单；地图为用户主动点击的新窗口链接。
