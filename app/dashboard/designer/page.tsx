"use client";

import React, { useState } from "react";
import SnapScriptEditor from "./SnapScriptEditor";
import { runSnapScript } from "./actions";

export default function DesignerPage() {
  const [output, setOutput] = useState("");

  const onRun = async (code: string) => {
    const res = await runSnapScript(code);
    setOutput(res.output || "");
  };

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-3xl font-black">SnapScript Designer</h1>

      <SnapScriptEditor initialCode={"plot line\nx: 1 2 3\n"} onRun={onRun} />

      <div className="border rounded p-3 bg-gray-50">
        <div className="text-sm font-bold mb-2">Output</div>
        <pre className="text-xs whitespace-pre-wrap">{output}</pre>
      </div>
    </div>
  );
}
