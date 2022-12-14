import { useRef, useEffect } from "react";
import Head from "next/head";
import { basicSetup } from "codemirror";
import { EditorState } from "@codemirror/state";
import { EditorView, keymap } from "@codemirror/view";
import { insertTab } from "@codemirror/commands";
import {
  indentUnit,
  HighlightStyle,
  syntaxHighlighting,
} from "@codemirror/language";
import { tags } from "@lezer/highlight";
import { sql, SQLDialect } from "@codemirror/lang-sql";

const doc = `/* Tutorial 1: Sample queries on TPC-H data
Prerequisites
This tutorial requires the Snowflake provided
snowflake_sample_data database.  If you don't
have this database already in your account 
please add it by following these instructions:
https://docs.snowflake.net/manuals/user-guide/sample-data-using.html
 
Pricing Summary Report Query (Q1) 
This query demonstrates basic SQL 
functionality using the included TPC-H sample
data.  The results are the amount of business
that was billed, shipped, and returned. 

Business Question: The Pricing Summary Report
Query provides a summary pricing report for 
all line items shipped as of a given date. The
date is within 60 - 120 days of the greatest 
ship date contained in the database. The query
lists totals for extended price, discounted 
extended price, discounted extended price plus
tax, average quantity, average extended price,
and average discount. These aggregates are 
grouped by RETURNFLAG and LINESTATUS, and 
listed in ascending order of RETURNFLAG and 
LINESTATUS. A count of the number of line items
in each group is included. 
*/

use schema snowflake_sample_data.tpch_sf1; 

select database_refresh_history(d)

SELECT
l_returnflag,
l_linestatus,
sum(l_quantity) as sum_qty,
sum(l_extendedprice) as sum_base_price,
sum(l_extendedprice * (1-l_discount)) 
  as sum_disc_price,
sum(l_extendedprice * (1-l_discount) * 
  (1+l_tax)) as sum_charge,
avg(l_quantity) as avg_qty,
avg(l_extendedprice) as avg_price,
avg(l_discount) as avg_disc,
count(*) as count_order
FROM
lineitem
WHERE
l_shipdate <= dateadd(day, -90, to_date('1998-12-01'))
GROUP BY
l_returnflag,
l_linestatus
ORDER BY
l_returnflag,
l_linestatus;
`;

export default function CodeMirror() {
  const editorEl = useRef(null);
  const editor = useRef(null);

  useEffect(() => {
    if (editor.current) return;
    // sql highlight color
    const definedStyle = HighlightStyle.define([
      { tag: tags.keyword, color: "#085bd7" },
      { tag: tags.bracket, color: "#333" },
      { tag: tags.number, color: "#0c7e5e" },
      { tag: tags.string, color: "#bf0822" },
      { tag: tags.standard(tags.name), color: "blue" },
      { tag: tags.comment, color: "#a2a2a2", fontStyle: "italic" },
    ]);

    let state = EditorState.create({
      doc: doc,
      extensions: [
        basicSetup,
        keymap.of([{ key: "Tab", run: insertTab }]), // fix tab behaviour
        indentUnit.of("    "), // fix tab indentation
        sql({
          dialect: SQLDialect.define({
            keywords:
              "vector as avg sum select from where group order by dateadd database_refresh_history to_date count",
            builtin: "appinfo version show",
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
        }),
        EditorView.theme({
          "&.cm-editor": {
            "&.cm-focused": {
              outline: "none",
            },
          },
          ".cm-content": {
            color: "#484D52",
            fontFamily: "ApercuMonoPro Light",
            fontSize: "13.5px",
          },
          ".cm-line": { padding: " 0 4px 0 15px" },
          "&.cm-focused .cm-content": {
            color: "#484D52",
          },
          ".cm-activeLine": { backgroundColor: "transparent" },
          ".cm-lineNumbers .cm-gutterElement": {
            padding: "0 22px 0 26px",
          },
        }),
        EditorView.baseTheme({
          "&light .cm-selectionBackground": {
            backgroundColor: "rgb(195,222,252)",
          },
          "&light.cm-focused .cm-selectionBackground": {
            backgroundColor: "rgb(195,222,252)",
          },
          "&light .cm-gutters": {
            backgroundColor: "#fff",
          },
          "&light .cm-activeLineGutter": {
            backgroundColor: "transparent",
            fontWeight: "bold",
          },
        }),
        syntaxHighlighting(definedStyle),
      ],
    });

    // init view
    editor.current = new EditorView({
      state,
      parent: editorEl.current,
    });
  }, []);

  const title = `Sql Highlight`;
  return (
    <div className="container">
      <Head>
        <title>{title}</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="main">
        <h1 className="text-4xl font-bold my-4">{title}</h1>
        <div ref={editorEl}></div>
      </main>
    </div>
  );
}
