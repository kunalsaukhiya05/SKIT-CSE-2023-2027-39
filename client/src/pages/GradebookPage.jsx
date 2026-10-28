import React, { useState } from 'react';
import GradebookTable from '../components/classroom/GradebookTable';
import { useStudentGrades } from '../hooks/useStudentGrades';

/**
 * GradebookPage — full-page view for a student's gradebook.
 * Renders class selector + GradebookTable with filter controls.
 */
export default function GradebookPage() {
  const [selectedClass, setSelectedClass] = useState(null);
  const { grades, summary, loading, error } = useStudentGrades(selectedClass);

  return (
    <div className="page-container gradebook-page">
      <header className="page-header">
        <h1>My Gradebook</h1>
        {summary && (
          <div className="gradebook-summary">
            <span className="summary-chip">
              Overall: <strong>{summary.overallPercentage?.toFixed(1) ?? '--'}%</strong>
            </span>
            {summary.bestSubject && (
              <span className="summary-chip best">
                Best: <strong>{summary.bestSubject}</strong>
              </span>
            )}
            {summary.worstSubject && (
              <span className="summary-chip worst">
                Needs Work: <strong>{summary.worstSubject}</strong>
              </span>
            )}
          </div>
        )}
      </header>

      {error && <p className="error-text">{error}</p>}

      <GradebookTable
        grades={grades}
        loading={loading}
        onClassChange={setSelectedClass}
      />
    </div>
  );
}
