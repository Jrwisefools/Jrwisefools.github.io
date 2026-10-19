/**
 * 项目作品数据源 —— 新增仓库往数组里加一项即可，
 * 首页 Hero 的「个项目」计数与侧栏卡片都从这里读，不会两处不一致。
 *
 *   name: 项目名称
 *   desc: 一句话描述（技术栈 / 定位），留空则不显示描述行
 *   url:  项目地址（Gitee / GitHub / 线上站点）
 */
export const projects = [
  {
    name: '财务单据智能风控审核系统',
    desc: 'FastAPI + MySQL + MinIO + qwen-vl 多模态解析：9 条风控规则、风险评分与四级评级、双轨人机复核、PDF/Excel 报告导出',
    url: 'https://gitee.com/luzhongmilu/financial-risk-review'
  },
  {
    name: '育儿知识库 RAG 问答',
    desc: '基于大模型的检索增强生成：文档解析、向量存储、检索召回与智能问答',
    url: 'https://gitee.com/luzhongmilu/parenting_knowledge_base'
  },
  {
    name: '经营归因分析系统',
    desc: '面向企业经营的智能多维归因：FastAPI 模块化单体 + ARQ 异步任务 + PostgreSQL 16 数仓，支持差额 / LMDI / Shapley / What-If 拆解与统计检验',
    url: 'https://gitee.com/luzhongmilu/attribution-analysis'
  },
  {
    name: '电商客服系统后端',
    desc: 'FastAPI + SQLAlchemy + MySQL + Docker：用户会话管理、消息收发、知识库问答等客服核心接口',
    url: 'https://gitee.com/luzhongmilu/customer-service-backend'
  }
]
