# 订单件型计费版

逐条规则维护：左侧直接选择订单类型（多选）、订单件型，并输入最大单件实重上下限；右侧维护对应价格。不使用固定九项，不设置基础价格或实重条件子行。新增规则直接展示全部输入。

单品为1款1件，单品多件为1款多件，两者只维护每件单价；多品维护每款、每件单价并相加。实际件型从SKU款数和件数判断，配置中不填写款数、件数范围。

实重下限不含、上限含；上限留空为不限。同一订单类型与件型的范围重叠会阻断提交。缺少关键属性或未命中范围进入异常，不套用默认价。至少一条有效规则，单价非负且必填。

旧版基础价格与区间转换为等价的直接范围，保留原价格。新版写入 billing-structured-v3，只在首次加载时读取旧存储，不改写旧存储。原版及工作量版保持不变。

维护入口随版本状态变化；新增仓库直接进入配置。当前生效版与变更版分开显示。本期仅拣货、打包，拣货沿用直接单价版。统计使用独立归档示例数据，不读取草稿，没有真实WMS、钉钉或权限后端。

构建：`node build-structured.cjs`。检查：`node --test structured-version/shape.test.mjs`。

[配置](https://kayleylee1128-gif.github.io/warehouse-billing-meeting-prototype/structured/index.html?v=3) · [统计](https://kayleylee1128-gif.github.io/warehouse-billing-meeting-prototype/structured/fees.html?v=3)
