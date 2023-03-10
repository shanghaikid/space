import { useRef, useEffect } from "react";
import Head from "next/head";
import { basicSetup, TabKeyBindings } from "../../modules/extensions";
import { rest } from "../../modules/lang-rest";
import { theme, baseTheme, highlights } from "../../modules/theme";
import { EditorState } from "@codemirror/state";
import { EditorView } from "@codemirror/view";

const doc = `# list 5 collections from 6
GET /collections?start=5&limit=5

# get new ID
POST /collections
# load
POST /collections/colId/load
# unload
POST /collections/colId/unload

# create new collection
PUT /collections/new_col
{
  "name" : "col1"
}
# get collection colId info 
GET /collections/colId
# update collection, disallowed now
POST /collections/colId
# delete old collection
DELETE /collections/old_col

# filter
GET /collections?filterId=colId
# data query
GET /collections/colId/data?id=1&vol>100
# Search on collection
GET /collections/colId/entities?field=car_face&vector=[13,3,3,4]&id=1&vol>100&top=100
`;

export default function CodeMirror() {
  const editorEl = useRef(null);
  const editor = useRef(null);

  useEffect(() => {
    if (editor.current) return;

    let state = EditorState.create({
      doc: doc,
      extensions: [
        basicSetup,
        TabKeyBindings,
        rest(),
        theme,
        baseTheme,
        highlights,
      ],
    });

    // init view
    editor.current = new EditorView({
      state,
      parent: editorEl.current,
    });
  }, []);

  const title = `Advanced auto completion`;
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