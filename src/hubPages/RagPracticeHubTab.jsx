import { HubPage } from "./HubPage.jsx";
import { RagPlayground } from "../components/ragPlayground/RagPlayground.jsx";
export default function RagPracticeHubTab({ onSelectTab }) {
  return (
    <>
      <RagPlayground />
      <HubPage childId="rag_practice" onSelectTab={onSelectTab} />
    </>
  );
}
