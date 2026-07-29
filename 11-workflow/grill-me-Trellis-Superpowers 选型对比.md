# grill-me、Trellis、Superpowers

> ## Excerpt
>
> 最近在水贴的时候 看到一个大佬发的帖子Trellis + grill-me 组合用起来很爽，我看到很多佬友都在讨论，有人说 grill-me 好用，有人推荐 Trellis，还有人在用 Superpowers。这三个我都有用， 但是看到很多佬友好像都在问哪个更好用，但是我觉得其实这三个工具各有各的场景需要吧。 我自己的理解是这样的： grill-me 负责把我们的需求问清楚 Trellis 负责长任务执行和流程接力 Superpowers 负责更重的正式交付流程 我觉得它们不是替代关系，而是三种不同场景的工作方式吧。 比如这样的场景： 小问题很多时候根本不用上 skill，感觉直接裸对话就足够了。 需求不清楚时，我们可以用 grill-me来完善需求。 需求清楚后但任务长时，我们可以再接入Trellis 进行长任务开发。 如果任务大、协作重、要文档计划和审计时，我就需要用 Superpowers来开发了。 毕竟不是所有任务都值得上 workflow的，有些开发任务本来就很小，硬套一套流程反而更麻烦。而且还浪费token，这时候我觉得就裸对话形式就足够了。相反如果我们需要...

---

最近在水贴的时候 看到一个大佬发的帖子[Trellis + grill-me 组合用起来很爽](https://linux.do/t/topic/2084756)，我看到很多佬友都在讨论，有人说 grill-me 好用，有人推荐 Trellis，还有人在用 Superpowers。这三个我都有用， 但是看到很多佬友好像都在问哪个更好用，但是我觉得其实这三个工具各有各的场景需要吧。

我自己的理解是这样的：

- `grill-me` 负责把我们的需求问清楚
- `Trellis` 负责长任务执行和流程接力
- `Superpowers` 负责更重的正式交付流程

我觉得它们不是替代关系，而是三种不同场景的工作方式吧。

比如这样的场景：

- 小问题很多时候根本不用上 skill，感觉直接裸对话就足够了。
- 需求不清楚时，我们可以用 `grill-me`来完善需求。
- 需求清楚后但任务长时，我们可以再接入`Trellis` 进行长任务开发。
- 如果任务大、协作重、要文档计划和审计时，我就需要用 `Superpowers`来开发了。

毕竟不是所有任务都值得上 workflow的，有些开发任务本来就很小，硬套一套流程反而更麻烦。而且还浪费token，这时候我觉得就裸对话形式就足够了。相反如果我们需要走workflow的时候还是裸对话的话 反正需要复工多次 会更加增加成本。

---

### [](https://linux.do/t/topic/2151853#p-17708644-h-1)工具介绍

grill-me 就几句话的 skill，专门用来澄清需求的，仓库地址:[grill-me](https://github.com/mattpocock/skills/blob/main/skills/productivity/grill-me/SKILL.md)

`Trellis` npm CLI + 项目级框架，按需加载 spec，仓库地址: [Trellis](https://github.com/mindfold-ai/trellis)

Superpowers 完整的工作流系统（brainstorming → plan → execute → test → review）,仓库地址: [Superpowers](https://github.com/obra/superpowers)

---

### [](https://linux.do/t/topic/2151853#p-17708644-h-2)使用场景

比如我现在大多是在 Codex 里面开发的，日常流程是这样的：

**简单问题 不是很复杂的** ： 直接就裸对话来处理了,大多数情况下都是这样。

**小需求、求快速迭代的** ：直接对话 + grill-me，比如我要加个小功能，需求不是很明确，我就可以用grill-me 快速确认需求然后直接开始让ai开发。

**中等项目、有一定规范的** ：那就是grill-me + Trellis，比如我需要先用 grill-me 把需求问清楚，然后让 grill-me 输出一个 summary或者plan，最后再交给 Trellis，它会读取项目上下文、加载相关 spec、跑测试、做 review就OK了。

**大项目、多人协作、有严格流程的** ：那就用Superpowers，比如在我们公司，每次有新功能需求，都需要先写文档，然后开会评审需求，三方对齐，code review、提交说明等。而且领导需要了解每个功能的变动、新增、逻辑交互这些。这种情况下，我就会更倾向用 Superpowers。

---

### [](https://linux.do/t/topic/2151853#p-17708644-h-3)个人感觉

所以我的想法是，轻量不等于更好，而重流程也不代表最差。就像Superpowers，我不太觉得它重是坏事。它只是更适合需要处理一些复杂度的场景吧。

所以我觉得如果是我们日常开发之间比较做一些轻量化功能的时候直接裸对话，或者使用grill-me + Trellis 会更简单且省成本。

如果像我们公司这样的开发流程的话，那我觉得还是用Superpowers会更好一些吧。

当然，捯饬自己的项目的时候我就一直是裸对话的 没有那么的规范了 ![:rofl:](https://cdn.ldstatic.com/images/emoji/twemoji/rofl.png?v=15 ":rofl:")
