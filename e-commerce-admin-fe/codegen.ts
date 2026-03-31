import type { CodegenConfig } from "@graphql-codegen/cli";

const schema =
  process.env.NEXT_PUBLIC_GRAPHQL_URL ??
  process.env.CODEGEN_SCHEMA_URL ??
  "http://localhost:13000/graphql";

const config: CodegenConfig = {
  overwrite: true,
  schema,
  documents: "src/graphql/**/*.graphql",
  generates: {
    "src/graphql/generated.ts": {
      plugins: ["typescript", "typescript-operations", "typed-document-node"],
    },
  },
  ignoreNoDocuments: true,
};

export default config;
