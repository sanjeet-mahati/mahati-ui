"use client";

import { MahatiTexttoAudio } from "@mahatisystems/mahati-ui-components";
import { CodePreview } from "../CodePreview";
import { PropsTable } from "../PropsTable";

export default function Page() {
  const props = [
    {
      name: "icons",
      type: "IconSet",
      default: "defaultIcons",
      description:
        "Custom icons for controls like play, pause, skip, stop and loop",
    },
  ];

  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      
      {/* Heading */}
      <h1 className="text-3xl font-bold mb-4">Text To Audio</h1>

      {/* Props Table */}
      <PropsTable title="Props" props={props} />

      <br />

      {/* Code Preview */}
      <CodePreview
        title="Basic Usage"
        code={`<MahatiTexttoAudio 
              icons={{
               play: "/icons/play-btn.png",
               pause: "/icons/pause-btn.png",
               stop: "/icons/hard-stop.png",
               repeat: "/icons/repeat-icon.png",
               skipForward: "/icons/skip-forward.png",
               skipBackward: "/icons/Backward-icon.png",
               tenForward: "/icons/ten-skip-forward.png",
               tenBackward: "/icons/ten-skip-backward.png",
              }}
          />`}
        preview={
          <div className="bg-white text-black p-4">
        <MahatiTexttoAudio />
        </div>
        }
      />
    </div>
  );
}