import React from "react";
import "./SimplePage.scss";
import { FaFacebook, FaGoogle, FaLinkedin } from "react-icons/fa";
import Loader from "../../components/Loader/Loader";
function SimplePage() {
  const [loading, setLoading] = React.useState(false);
  const submitLogin = (e) => {
    setLoading(true);
    e.preventDefault();
    const email = e.target["email"].value;
    const password = e.target["password"].value;
    fetch("http://localhost:4000/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email: email, password: password })
    })
      .then((res) => res.json())
      .then((res) => {
        localStorage.setItem("token", JSON.stringify(res.token));
      });
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  };
  return (
    <div>
      <div className="simplePage">
        <div className="loginForm">
          <div className="header">
            <h4>Logo</h4>
          </div>
          <div className="titleSection">
            <h1>Login to your account</h1>
            <span>Login using social networks</span>
          </div>
          <div className="Oauth-buttons">
            <FaFacebook />
            <FaGoogle />
            <FaLinkedin />
          </div>
          <div className="orSeparetor">
            <hr />
          </div>
          <form className="formContainer" onSubmit={submitLogin}>
            <div className="inputContainer">
              <input type="text" name="email" id="email" placeholder="Email" />
            </div>
            <div className="inputContainer">
              <input type="password" name="password" id="password" placeholder="Password" />
            </div>
            {!loading ? <button type="submit">Login</button> : <Loader />}
          </form>
        </div>
        <div className="loginInfo">
          <div className="header">
            <span>X</span>
          </div>
          <h1>New Here ?</h1>
          <h3>Sign up and discover a great amount of new opportunities</h3>
          <button>Sign up</button>
        </div>
      </div>
    </div>
  );
}

export default SimplePage;
