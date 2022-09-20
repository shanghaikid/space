import { parser } from "./lang-rest-parser.js";
// import { foldNodeProp, foldInside, indentNodeProp } from "@codemirror/language";
import { styleTags, tags as t } from "@lezer/highlight";
import { LRLanguage } from "@codemirror/language";
import { LanguageSupport } from "@codemirror/language";
import { completeFromList } from "@codemirror/autocomplete";

let parserWithMetadata = parser.configure({
  props: [
    styleTags({
      VERB: t.annotation,
      Keyword: t.keyword,
      Query: t.string,
      Action: t.operator,
      Identifier: t.literal,
      Path: t.string,
      Url: t.string,
      LineComment: t.comment,
      "( )": t.paren,
    }),
  ],
});

export const restLanguage = LRLanguage.define({
  parser: parserWithMetadata,
  languageData: {
    commentTokens: { line: ";" },
  },
});

export const restCompletion = restLanguage.data.of({
  autocomplete: completeFromList([
    { label: "defun", type: "keyword" },
    { label: "defvar", type: "keyword" },
    { label: "let", type: "keyword" },
    { label: "cons", type: "function" },
    { label: "car", type: "function" },
    { label: "cdr", type: "function" },
  ]),
});

export function rest() {
  return new LanguageSupport(restLanguage, []);
}
