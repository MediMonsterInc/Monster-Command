import { DataPanel } from "@/components/DataPanel";
import { PageHeader } from "@/components/PageHeader";
import { SourceNotice } from "@/components/SourceNotice";
import { asText } from "@/lib/format";
import { getScores } from "@/lib/supabase/queries";

export default async function ScoresPage() {
  const scores = await getScores();

  return (
    <>
      <PageHeader eyebrow="Score Board" title="Scores" description="Stress, breeding, grow, and badge values read from Supabase scores." />
      <DataPanel title="Score Rows" subtitle="stress_score, breeding_score, grow_score, badge" empty={scores.data.length === 0}>
        <SourceNotice state={scores} table="scores" />
        <div className="mt-3 overflow-x-auto">
          <table className="monster-table">
            <thead>
              <tr>
                <th>Plant ID</th>
                <th>Stress</th>
                <th>Breeding</th>
                <th>Grow</th>
                <th>Badge</th>
              </tr>
            </thead>
            <tbody>
              {scores.data.map((score, index) => (
                <tr key={`${asText(score.plant_id)}-${index}`}>
                  <td>{asText(score.plant_id)}</td>
                  <td>{asText(score.stress_score, "n/a")}</td>
                  <td>{asText(score.breeding_score, "n/a")}</td>
                  <td>{asText(score.grow_score ?? score.value, "n/a")}</td>
                  <td>{asText(score.badge ?? score.score_type, "n/a")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DataPanel>
    </>
  );
}
