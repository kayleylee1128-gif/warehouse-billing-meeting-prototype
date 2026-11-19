# 成本/收入方案恢复点

加入成本/收入双维度前的提交：aa1ff0f62e832457a8bcc618f2c6b2cb4cb2ca03
Git 标签：before-cost-income-20261119
独立界面快照：docs/cost-only/index.html

恢复时保留此前确认的全部计费节点与费用统计调整，仅撤回成本/收入方案。成本配置数据仍使用原 versions 字段，收入独立存于 incomeVersions；撤回时无需清空成本数据。
