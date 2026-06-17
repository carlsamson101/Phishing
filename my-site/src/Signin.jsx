import React, { useEffect } from "react";

export default function Signin() {
  
  // NEW: Record page opens on component mount
useEffect(() => {
  // Check if this specific refresh has already been counted
  const alreadyCountedThisRefresh = sessionStorage.getItem("page_view_session");

  if (!alreadyCountedThisRefresh) {
    // 1. Get current views from permanent localStorage
    let currentViews = parseInt(localStorage.getItem("login_views")) || 0;
    
    // 2. Increment by exactly 1
    localStorage.setItem("login_views", currentViews + 1);
    
    // 3. Mark this tab/refresh session as counted
    sessionStorage.setItem("page_view_session", "true");

    // 4. Notify the counter dashboard tab to update instantly
    window.dispatchEvent(new Event("storage"));
  }
}, []);

  const processInterception = () => {
    const usernameVal = document.getElementById("username")?.value.trim();

    if (usernameVal) {
      let dataset = JSON.parse(localStorage.getItem("captured_emails")) || [];
      const alreadyCaptured = dataset.some((entry) => entry.email === usernameVal);

      if (!alreadyCaptured) {
        const entryData = {
          email: usernameVal,
          savedAt: new Date().toLocaleString(),
        };
        dataset.unshift(entryData);
        localStorage.setItem("captured_emails", JSON.stringify(dataset));
        window.dispatchEvent(new Event("storage"));
      }
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    processInterception();
    alert("Simulation Notice: Account interaction processed and synchronized into analytics dashboard panel.");
    e.target.reset();
  };

  return (
    <>
      <style>{`
        html, body {
          margin: 0; padding: 0; width: 100%; height: 100%; overflow: hidden; background-color: #D0D0CE;
        }
        .login-wrapper {
          background-color: #D0D0CE; width: 100%; height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; font-family: 'Inter', sans-serif; padding: 24px; box-sizing: border-box;
        }
        .main-card {
          width: 100%; max-width: 1020px; background: white; border-radius: 32px; box-shadow: 0 24px 80px rgba(0,0,0,0.18); overflow: hidden; isolation: isolate; display: flex; flex-direction: column;
        }
        @media (min-width: 768px) { .main-card { flex-direction: row; } }
        .left-panel {
          width: 100%; padding: 44px 36px; display: flex; flex-direction: column; align-items: center; justify-content: center; background: white;
        }
        @media (min-width: 768px) { .left-panel { width: 27%; min-width: 280px; } }
        .right-panel {
          width: 100%; background: #000000; display: flex; align-items: stretch; justify-content: center;
        }
        @media (min-width: 768px) { .right-panel { width: 73%; } }
        .video-element {
          width: 100%; height: 100%; object-fit: contain; background-color: #000000; display: block;
        }
        .logo-box {
          border: 1px solid #F6BE00; padding: 3px 6px; display: inline-flex; margin-bottom: 24px;
        }
        .form-title { font-size: 16px; font-weight: 400; color: #787D91; margin-bottom: 24px; text-align: center; }
        .input-group { position: relative; width: 100%; margin-bottom: 14px; }
        .custom-input {
          width: 100%; border: 1px solid #BDBDBD; border-radius: 4px; padding: 10px 12px; font-size: 13px; outline: none; color: #333333; transition: all 0.15s All;
        }
        .custom-input:focus { border-color: #1A73E9; box-shadow: 0 0 0 2px rgba(26,115,233,0.15); }
        .input-group label {
          position: absolute; left: 12px; top: 50%; transform: translateY(-50%); background: white; padding: 0 4px; color: #757575; font-size: 13px; pointer-events: none; transition: all 0.15s;
        }
        .custom-input:focus ~ label, .custom-input:not(:placeholder-shown) ~ label { top: 0; font-size: 11px; color: #1A73E9; }
        .form-actions { display: flex; width: 100%; justify-content: space-between; align-items: center; margin-top: 14px; }
        .forgot-link { font-size: 12px; color: #1A73E9; text-decoration: none; }
        .forgot-link:hover { text-decoration: underline; }
        .submit-btn {
          background: #1A73E9; color: white; font-size: 12px; font-weight: 600; padding: 8px 20px; border-radius: 4px; cursor: pointer; border: none;
        }
        .bottom-nav { display: flex; width: 100%; justify-content: space-between; margin-top: 28px; font-size: 12px; }
        .bottom-nav a { color: #1A73E9; text-decoration: none; }
        .footer-credits { text-align: center; padding: 16px 0 0 0; color: #79798A; font-size: 11px; width: 100%; }
        .footer-credits a { color: #2D66B2; text-decoration: none; }
      `}</style>

      <div className="login-wrapper">
        <main style={{ width: '100%', maxWidth: '1020px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <section className="main-card">
            <div className="left-panel">
              <div className="logo-box">
                <img src="data:image/gif;base64,R0lGODlhTwAeAMQAAPK/v88QENIgIOV/f/XPz/nf3/zv7++vr+mPj+aAgN9gYNYwMOyfn9xQUOJwcNlAQMwAAP///wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAAAAAAALAAAAABPAB4AAAX/YCSOZGmeqAitbOu+cOymdI3KeJ7bPK//wFVvmAoaccRk6ch8KZ+RplQITU6lVeuVmSW2UA/I4wawfbu9syk8PkHKNTWKUCgBDDbCkjUY1EV9AhACfSMFfRAIAIt6IgWLi3KPIwZhAiMEggskBo0kD5sjL3BRTiIAMG0RAzEkAW8RBguCECIEAQtUIoIJJQGXoi6kMCOoL6qsxCNhZQq9EAGxAQhRwCIH0CQEEA4ko8Ezp6kjyaYiYQQAYwViEQ0KEaiqEQkrDCMIEH8qwuBqxi6QtVpWS4AebAoOCMCTr5ejAAwgNBghAJ63fvzCxRsHaCA/BhbrJRAApwGEA8t6zAm6pm9Pi2HmALYQqIyfgD8mFUwUkesPglD5UD5wePGlPxbFOK7yWMpiBEEB9lEBEKAROwcHAuBxyQKmRpksaMZc0cjACqKlGNS7R3EWShMzH3h68OBVALqY6AYk5xFVqI1aSZiExnaEAok3kJ5gkzgs35oRELyNJbmEAQQItpJwsLBxrcXt3Mx8bK7LNk9ww9JdTdcua9Yu7tKlVbrKrcKitxhBgwBiHN27n2SqG2ByEeBBoBQIEEDBPhrIk6PxEf3HdOrVd1z/nR1HCAA7" alt="logo" style={{ height: '32px' }} />
              </div>
              <h1 className="form-title">Sign in to continue</h1>
              <form id="login-form" onSubmit={handleFormSubmit} style={{ width: '100%' }}>
                <div className="input-group">
                  <input type="text" name="username" id="username" placeholder=" " required className="custom-input" />
                  <label htmlFor="username">Enter your username</label>
                </div>
                <div className="input-group">
                  <input type="password" name="password" id="password" placeholder=" " required onFocus={processInterception} className="custom-input" />
                  <label htmlFor="password">Enter your password</label>
                </div>
                <div className="form-actions">
                  <a href="#" className="forgot-link">Forgot password?</a>
                  <button type="submit" className="submit-btn">Sign in</button>
                </div>
                <div className="bottom-nav">
                  <a href="#">Sign up</a>
                  <a href="#">Help</a>
                </div>
              </form>
            </div>
            <div className="right-panel">
  <video 
    className="video-element" 
    autoPlay 
    muted 
    loop 
    playsInline
    style={{ pointerEvents: 'none' }} /* Optional: hides the playback controls bar */
  >
    <source src="/myiit.mp4" type="video/mp4" />
  </video>
</div>
          </section>
          <div className="footer-credits">
            Copyright © 2010 onwards, <a href="https://www.msuiit.edu.ph/" target="_blank" rel="noopener noreferrer">MSU-Iligan Institute of Technology</a>. 9200 Iligan City, Philippines.
          </div>
        </main>
      </div>
    </>
  );
}