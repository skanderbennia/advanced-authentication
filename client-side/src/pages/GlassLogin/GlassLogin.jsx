import React, { useRef, useEffect, useState } from "react";
import "./GlassLogin.scss";
import { IoClose, IoLockClosed, IoMail } from "react-icons/io5";
import FacebookIcon from "./facebook.png";
import { useSearchParams } from "react-router-dom";
import Toast from "../../components/Toast/Toast";

function GlassLogin() {
  const [query, setQuery] = useSearchParams();
  const toastRef = useRef();
  const wrapperRef = useRef();
  const [connected, setConnected] = useState(false);
  function showToastMessage(title, description, error = false) {
    if (error) toastRef.current.classList.add(`error`);
    toastRef.current.classList.add(`active`);
    const childrenNodes = toastRef.current.childNodes;
    childrenNodes[0].innerHTML = title;
    childrenNodes[1].innerHTML = description;
    setConnected(true);
    setTimeout(() => {
      toastRef.current.classList.remove("active");
      toastRef.current.classList.remove(`error`);
    }, 3000);
  }
  function handleCallbackResponse(response) {
    fetch("http://localhost:4000/users/login/google", {
      headers: {
        "Content-Type": "application/json"
      },
      method: "POST",
      body: JSON.stringify({ token: response.credential })
    })
      .then((res) => res.json())
      .then((response) => {
        console.log(response);
        if (response.statusCode == 400) {
          showToastMessage("Authentication Error !", "Email or password is incorrect", true);
        } else {
          showToastMessage("Authentication completed !", "You have successfully logged in with Google Auth");
        }
      });
  }
  useEffect(() => {
    if (query && query.get("token")) {
      fetch("http://localhost:4000/users/validate", {
        headers: {
          "Content-Type": "application/json"
        },
        method: "POST",
        body: JSON.stringify({ token: query.get("token") })
      })
        .then((res) => res.json())
        .then((response) => {
          console.log(response);
        });
    }
  }, []);
  useEffect(() => {
    /*global google*/
    window.google.accounts.id.initialize({
      client_id: "197331722010-m8lpg53krhmtu9d04hklsikpbk3r6np7.apps.googleusercontent.com",
      callback: handleCallbackResponse
    });

    google.accounts.id.renderButton(document.getElementById("googleSignIn"), {
      theme: "outline",
      size: "large",
      locale: "en"
    });
  }, []);
  function submitLogin(event) {
    event.preventDefault();
    const email = event.target["email"].value;
    const password = event.target["password"].value;
    const rememberMe = event.target["remember"].checked;
    console.log(rememberMe);
    fetch("http://localhost:4000/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email: email, password: password, remember: rememberMe })
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.statusCode == 400) {
          showToastMessage("Authentication Error !", "Email or password is incorrect", true);
          event.target.reset();
        } else {
          localStorage.setItem("token", JSON.stringify(res.token));
          wrapperRef.current.classList.remove("active-popup");
          showToastMessage("Authentication completed !", "You have successfully loggedin with simple Login");
          event.target.reset();
        }
      });
  }
  function submitRegister(event) {
    event.preventDefault();
    const email = event.target["email"].value;
    const firstname = event.target["firstname"].value;
    const lastname = event.target["lastname"].value;
    const password = event.target["password"].value;
    fetch("http://localhost:4000/users/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password, firstname, lastname })
    })
      .then((res) => res.json())
      .then((res) => {
        localStorage.setItem("token", JSON.stringify(res.token));
        showToastMessage("Signup completed !", "You have successfully registred your account with simple Register");
        wrapperRef.current.classList.remove("active-popup");
      });
  }
  return (
    <div className="glassLogin">
      <Toast reference={toastRef} />
      <header>
        <h2 class="logo">Logo</h2>
        <nav className="navigation">
          <a href="#">Home</a>
          <a href="#">About</a>
          <a href="#">Services</a>
          <a href="#">Contact</a>
          {!connected ? (
            <button
              className="btnLogin-popup"
              onClick={() => {
                wrapperRef.current.classList.add("active-popup");
              }}
            >
              Login
            </button>
          ) : (
            <button className="btnLogin-popup" onClick={() => {}}>
              Logout
            </button>
          )}
        </nav>
      </header>
      <div className="wrapper" ref={wrapperRef}>
        <span
          className="icon-close"
          onClick={() => {
            wrapperRef.current.classList.remove("active-popup");
          }}
        >
          <IoClose />
        </span>
        <div className="form-box login">
          <h2>Login</h2>
          <form onSubmit={submitLogin}>
            <div className="input-box">
              <span className="icon">
                <IoMail />
              </span>
              <input type="text" required name="email" />
              <label htmlFor="">Email</label>
            </div>
            <div className="input-box">
              <span className="icon">
                <IoLockClosed />
              </span>
              <input type="password" required name="password" />
              <label htmlFor="">Password</label>
            </div>
            <div className="remember-forgot">
              <label htmlFor="">
                <input type="checkbox" name="remember" /> Remember me
              </label>
              <a href="#">Forgot password ?</a>
            </div>
            <button type="submit" className="btn">
              Login
            </button>
            <div className="login-register">
              <p>
                Don't have an account?
                <a
                  href="#"
                  className="register-link"
                  onClick={() => {
                    wrapperRef.current.classList.add("active");
                  }}
                >
                  Register
                </a>
              </p>
            </div>
          </form>

          <div className="oauths-wrapper">
            {/* <a href="" className="oauth-button google">
              <img className="auth-icon google" src={GoogleIcon} />
              <span>Sign in with Google</span>
            </a> */}
            <div id="googleSignIn" />
            <a href="" className="oauth-button microsoft">
              <img className="auth-icon microsft" src="https://cdn-icons-png.flaticon.com/512/732/732221.png" />
              <span>Sign in with Microsoft</span>
            </a>
            <a href="" className="oauth-button facebook">
              <img className="auth-icon facebook" src={FacebookIcon} />
              <span>Sign in with Facebook</span>
            </a>
          </div>
        </div>
        <div className="form-box register">
          <h2>Registration</h2>
          <form onSubmit={submitRegister}>
            <div className="input-box">
              <span className="icon"></span>
              <input type="text" required name="firstname" />
              <label htmlFor="">Firstname</label>
            </div>
            <div className="input-box">
              <span className="icon"></span>
              <input type="text" required name="lastname" />
              <label htmlFor="">Lastname</label>
            </div>
            <div className="input-box">
              <span className="icon">
                <IoMail />
              </span>
              <input type="text" required name="email" />
              <label htmlFor="">Email</label>
            </div>
            <div className="input-box">
              <span className="icon">
                <IoLockClosed />
              </span>
              <input type="password" required name="password" />
              <label htmlFor="">Password</label>
            </div>
            <div className="remember-forgot">
              <label htmlFor="">
                <input type="checkbox" name="remember" /> Agree to the terms & conditions
              </label>
            </div>
            <button type="submit" className="btn">
              Register
            </button>
            <div className="login-register">
              <p>
                Already have an account?
                <a
                  href="#"
                  className="register-link"
                  onClick={() => {
                    wrapperRef.current.classList.remove("active");
                  }}
                >
                  Login
                </a>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default GlassLogin;
