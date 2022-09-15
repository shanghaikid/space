import {
  lineNumbers,
  highlightActiveLineGutter,
  highlightSpecialChars,
  drawSelection,
  dropCursor,
  rectangularSelection,
  crosshairCursor,
  highlightActiveLine,
  keymap,
} from "@codemirror/view";
export { EditorView } from "@codemirror/view";
import { EditorState } from "@codemirror/state";
import {
  foldGutter,
  indentOnInput,
  syntaxHighlighting,
  HighlightStyle,
  defaultHighlightStyle,
  bracketMatching,
  foldKeymap,
  indentUnit,
} from "@codemirror/language";
import {
  history,
  defaultKeymap,
  historyKeymap,
  insertTab,
} from "@codemirror/commands";
import { highlightSelectionMatches, searchKeymap } from "@codemirror/search";
import {
  closeBrackets,
  autocompletion,
  closeBracketsKeymap,
  completionKeymap,
  acceptCompletion,
} from "@codemirror/autocomplete";
import { lintKeymap } from "@codemirror/lint";
import { sql, SQLDialect } from "@codemirror/lang-sql";
import { tags } from "@lezer/highlight";

const basicSetup = /*@__PURE__*/ (() => [
  lineNumbers(),
  highlightActiveLineGutter(),
  highlightSpecialChars(),
  history(),
  foldGutter(),
  drawSelection(),
  dropCursor(),
  EditorState.allowMultipleSelections.of(true),
  indentOnInput(),
  syntaxHighlighting(defaultHighlightStyle, { fallback: true }),
  bracketMatching(),
  closeBrackets(),
  autocompletion({
    closeOnBlur: false,
  }),
  rectangularSelection(),
  crosshairCursor(),
  highlightActiveLine(),
  highlightSelectionMatches(),
  keymap.of([
    ...closeBracketsKeymap,
    ...defaultKeymap,
    ...searchKeymap,
    ...historyKeymap,
    ...foldKeymap,
    ...completionKeymap,
    ...lintKeymap,
  ]),
  indentUnit.of("    "), // fix tab indentation
])();

const TabKeyBindings = keymap.of([
  { key: "Tab", run: acceptCompletion },
  { key: "Tab", run: insertTab },
]);

const lang_sql = sql({
  dialect: SQLDialect.define({
    keywords:
      "vector as avg sum select from where group order by dateadd database_refresh_history to_date count",
    builtin:
      "appinfo arraysize autocommit autoprint autorecovery autotrace blockterminator break btitle cmdsep colsep compatibility compute concat copycommit copytypecheck define echo editfile embedded feedback flagger flush heading headsep instance linesize lno loboffset logsource longchunksize markup native newpage numformat numwidth pagesize pause pno recsep recsepchar repfooter repheader serveroutput shiftinout show showmode spool sqlblanklines sqlcase sqlcode sqlcontinue sqlnumber sqlpluscompatibility sqlprefix sqlprompt sqlterminator suffix tab term termout timing trimout trimspool ttitle underline verify version wrap",
    types:
      "ascii bfile bfilename bigserial bit blob dec long number nvarchar nvarchar2 serial smallint string text uid varchar2 xml",
    operatorChars: "*/+-%<>!=~",
    doubleQuotedStrings: true,
    charSetCasts: true,
  }),
  schema: {
    t2: [
      { label: "c1", detail: "column name", type: "column" },
      { label: "c2", detail: "column name", type: "column" },
      { label: "z2x2", detail: "column name", type: "column" },
    ],
  },
  tables: [{ label: "t2", detail: "table name", type: "table" }], // https://codemirror.net/docs/ref/#autocomplete.Completion
  upperCaseKeywords: false,
});

// sql highlight color
const sqlSyntaxHighlight = syntaxHighlighting(
  HighlightStyle.define([
    { tag: tags.keyword, color: "#085bd7" },
    { tag: tags.bracket, color: "#333" },
    { tag: tags.number, color: "#0c7e5e" },
    { tag: tags.string, color: "#bf0822" },
    { tag: tags.function, color: "blue" },
    { tag: tags.comment, color: "#a2a2a2", fontStyle: "italic" },
  ])
);

export { basicSetup, TabKeyBindings, lang_sql, sqlSyntaxHighlight };
