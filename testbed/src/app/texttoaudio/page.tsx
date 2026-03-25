"use client";

import { MahatiTexttoAudio } from "@mahatisystems/mahati-ui-components";
import { CodePreview } from "../CodePreview";
import { PropsTable } from "../PropsTable";

export default function Page() {
  const props = [
    {
      name: "mode",
      type: `"component" | "page"`,
      default: `"component"`,
      description: "Reads text entered in the textarea or the entire webpage content",
    },
    {
      name: "icons",
      type: "IconSet",
      default: "defaultIcons",
      description: "Custom icons for play, pause, stop, forward, backward and loop buttons",
    },
    {
      name: "defaultVolume",
      type: "number",
      default: "1",
      description: "Initial volume level (range: 0 to 1)",
    },
    {
      name: "defaultSpeed",
      type: "number",
      default: "1",
      description: "Initial playback speed (range: 0.5x to 2x)",
    },
    {
      name: "autoPlay",
      type: "boolean",
      default: "false",
      description: "Automatically starts reading when text or page content is loaded",
    },
    {
      name: "loopMode",
      type: `"off" | "once" | "continuous"`,
      default: `"off"`,
      description: "Controls looping behavior of the audio playback",
    },
    {
      name: "showSummary",
      type: "boolean",
      default: "true",
      description: "Shows or hides the Quick Summary panel",
    },
    {
      name: "showControls",
      type: "boolean",
      default: "true",
      description: "Shows or hides playback controls (play, pause, seek, volume, speed)",
    },
  ];

  return (
    <div className="w-full px-4 py-6">
      <h1 className="text-3xl font-bold">Text To Audio</h1>

      <PropsTable title="Props" props={props} />

      <CodePreview
        title="Text To Audio"
        code={`<MahatiTexttoAudio />`}
        preview={
          <div className="w-full min-w-[900px]">
        <MahatiTexttoAudio />
        </div>
        
        }
      />
    </div>
  );
}