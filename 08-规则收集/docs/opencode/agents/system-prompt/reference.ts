import { Option, Schema } from "effect"
import { MessageV2 } from "../message-v2"
import { Reference } from "@/reference/reference"

const Source = Schema.Struct({
  value: Schema.String,
  start: Schema.Number,
  end: Schema.Number,
})

export const ReferencePromptMetadata = Schema.Struct({
  name: Schema.String,
  kind: Schema.Literals(["local", "git", "invalid"]),
  path: Schema.optional(Schema.String),
  repository: Schema.optional(Schema.String),
  branch: Schema.optional(Schema.String),
  target: Schema.optional(Schema.String),
  targetPath: Schema.optional(Schema.String),
  problem: Schema.optional(Schema.String),
  source: Source,
})
export type ReferencePromptMetadata = typeof ReferencePromptMetadata.Type

const decodeReferencePromptMetadata = Schema.decodeUnknownOption(ReferencePromptMetadata)

export function referencePromptMetadata(input: unknown) {
  return Option.getOrUndefined(decodeReferencePromptMetadata(input))
}

export function referenceTextPart(input: {
  reference: Reference.Resolved
  source: ReferencePromptMetadata["source"]
  target?: string
  targetPath?: string
  problem?: string
}): MessageV2.TextPartInput {
  const metadata: ReferencePromptMetadata = {
    name: input.reference.name,
    kind: input.reference.kind,
    ...(input.reference.kind === "invalid"
      ? { repository: input.reference.repository }
      : { path: input.reference.path }),
    ...(input.reference.kind === "git"
      ? { repository: input.reference.repository, branch: input.reference.branch }
      : {}),
    ...(input.target === undefined ? {} : { target: input.target }),
    ...(input.targetPath ? { targetPath: input.targetPath } : {}),
    problem: input.problem ?? (input.reference.kind === "invalid" ? input.reference.message : undefined),
    source: input.source,
  }
  const label = metadata.target === undefined ? `@${metadata.name}` : `@${metadata.name}/${metadata.target}`
  return {
    type: "text",
    synthetic: true,
    text: [
      `已引用配置的引用 ${label}。`,
      ...(metadata.kind === "local" ? ["类型：本地目录"] : []),
      ...(metadata.kind === "git" ? ["类型：git 仓库"] : []),
      ...(metadata.repository ? [`仓库：${metadata.repository}`] : []),
      ...(metadata.branch ? [`分支/ref：${metadata.branch}`] : []),
      ...(metadata.path ? [`引用根目录：${metadata.path}`] : []),
      ...(metadata.targetPath ? [`解析的路径：${metadata.targetPath}`] : []),
      ...(metadata.problem
        ? [`问题：${metadata.problem}`]
        : [
            "对于有针对性的上下文，直接使用 Read, Glob 和 Grep 检查引用路径。对于更广泛的研究，使用子代理 scout 调用 task 工具，并包含此引用路径。",
          ]),
    ].join("\n"),
    metadata: { reference: metadata },
  }
}

export * as ReferencePrompt from "./reference"
