# 订单件型计费版

基于保留的直接单价版独立生成，使用独立浏览器存储 billing-structured-v1；原版及工作量计费版保持不变。

打包按订单类型进入，再选单品、单品多件、多品。单品为1款1件，单品多件为1款多件，两者只维护每件单价；多品维护每款、每件单价并相加。件型从实际SKU款数和件数判断，配置中不再填写款数、件数范围。

三种订单类型各有三个固定件型，共九组基础价格。新增配置价格留空，九组必填；已通过版本展示虚构示例价格。最大单件实重可维护不重叠区间，未命中使用该组基础价格。缺源属性不能使用基础价格冒充匹配。

一个仓库一个维护入口：开始配置、继续配置、修改后重提、查看审批版本、查看待生效版本、创建改价版本，按当前状态决定。新增仓库后直接进入配置，当前生效版与变更版分别展示。

本期仅拣货、打包。拣货沿用直接单价版公式，不引入工作量版新增的库位系数。统计打包公式与配置模型一致；数据仍为独立归档示例，不读取草稿，没有真实WMS或钉钉后端。

构建：`node build-structured.cjs`。检查：`node --test structured-version/shape.test.mjs`。

[配置](https://kayleylee1128-gif.github.io/warehouse-billing-meeting-prototype/structured/index.html?v=1) · [统计](https://kayleylee1128-gif.github.io/warehouse-billing-meeting-prototype/structured/fees.html?v=1)
