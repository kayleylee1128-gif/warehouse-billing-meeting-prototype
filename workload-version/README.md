# 工作量计费版

本目录是独立的新原型。旧版源文件及 docs 根目录页面保持原样，新版发布到 docs/workload，使用独立的 billing-workload-v1 本地存储。

- 拣货工作量 = 任务内去重库位数 × 每库位工作量 + 任务内去重 SKU 款数 × 每款工作量 + 实际件数 × 每件工作量。
- 打包工作量 = 单内去重 SKU 款数 × 每款工作量 + 实际件数 × 每件工作量。
- 费用 = 总工作量 × 本节点工作量单价（元/工作量）。订单数独立统计，不额外参与折算。

每行条件命中后选取一组系数，按行顺序首个命中，未命中使用其他情况系数。工作量保留 4 位小数，单笔金额四舍五入到分后汇总。工作量系数和单价均允许 0；空值、负值或缺少来源属性会阻断计算或提交。

拣货保留难度与单件实重。打包保留四个固定必填条件，订单类型可多选。系数与单价随配置版本一起审批、生效、归档；统计使用独立归档的演示数据，不读取浏览器草稿，也没有真实 WMS、钉钉或数据权限后端。

运行 `node build-workload.cjs` 仅生成新版页面及离线包。验证运行 `node --test workload-version/workload.test.mjs`。

新版：[配置](https://kayleylee1128-gif.github.io/warehouse-billing-meeting-prototype/workload/index.html?v=1)、[统计](https://kayleylee1128-gif.github.io/warehouse-billing-meeting-prototype/workload/fees.html?v=1)。

原版：[配置](https://kayleylee1128-gif.github.io/warehouse-billing-meeting-prototype/index.html?v=18)、[统计](https://kayleylee1128-gif.github.io/warehouse-billing-meeting-prototype/fees.html?v=18)。
