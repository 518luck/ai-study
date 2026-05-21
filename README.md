# AI编程深度调研笔记

基于对14个大型开源项目AI约束规则、6个企业实操案例、以及主流Agent平台的深度调研整理。

---

## 目录

| 章节 | 内容 |
|------|------|
| [01-AI开发全景与趋势](./01-AI开发全景与趋势/) | 三代演进、主要工具、关键趋势数据、适用场景判断 |
| [02-企业实操案例](./02-企业实操案例/) | Amplitude、NAB、PayPal、Money Forward、Cursor、Rippling |
| [03-大型项目AI约束规则](./03-大型项目AI约束规则/) | 6层约束体系、14个项目规则文件合集、共同模式分析 |
| [04-Agent代理系统详解](./04-Agent代理系统详解/) | 云端自动化Agent、可编程Agent、子Agent、Hook系统、多Agent协作、自进化Agent |
| [05-AI开发的风险与边界](./05-AI开发的风险与边界/) | 核心结论、风险等级、适用/不适用领域、缺乏数据的领域 |
| [06-个人项目约束实践](./06-个人项目约束实践/) | 6层约束体系的落地方法、规则文件模板、Skill工作流、CI门禁 |

## 核心观点

1. **AI开发 = 用测试代替理解**。不是纯赌博，但前提是测试覆盖率+灰度发布+回滚能力缺一不可。
2. **规则文件只是最表面的一层**。大项目搭建了完整的Agent基础设施：Skill、MCP、Hook、权限、CI门禁。
3. **Agent是趋势方向**。从Tab补全→对话Agent→云Agent，工程师角色从"写代码"变成"指挥Agent"。
4. **缺乏长期数据**。所有案例都是近1-2年，AI代码的长期可维护性和技术债积累速度没有数据支撑。
5. **NAB和Amplitude的隐藏前提**：资深工程师兜底，低风险才自动合并，不是无脑让AI跑。

## 信息来源

- Cursor Automations官方文档和博客
- Claude Agent SDK官方文档
- GitHub Copilot官方文档
- OpenAI Codex GitHub仓库
- 14个开源项目的AGENTS.md/CLAUDE.md（来源：GitHub实际仓库）
- 企业案例：Amplitude、NAB、PayPal、Money Forward、Rippling
- Cursor×NVIDIA多Agent研究

## 调研时间

2026年5月
