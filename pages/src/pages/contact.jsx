import { Link } from "react-router-dom";

export function Contact() {
  return (
    <>
    <h2>Contact</h2>
    <p>You can reach us via email or phone for any inquiries or support.</p>
    <div style={{display: 'flex', flexDirection: 'column', gap: '10px'}}>
      <div><Link to="/contact/email">Email: reactapp@gmail.com</Link></div>
      <div><Link to="/contact/phone">Phone: +91 1234567809</Link></div>
    </div>
    
    
    
    
    </>
  );
}

