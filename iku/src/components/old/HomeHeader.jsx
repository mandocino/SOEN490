import React from "react";
import Logo from "./../assets/iku_logo_white.png";
import styles from "./../styles/cssHomepage.module.css";
import { Link } from "react-router-dom";

export default function HomeHeader() {
  return (
    <div>
      <div>
        <section className="hero">
          <div className={styles.header}>
            <div className="hero-body">
              <nav className="navbar">
                <div className="container">
                  <div className="navbar-brand">
                    <img
                      src={Logo}
                      width="200"
                      height="300"
                      alt="ikulogo"
                    ></img>
                  </div>
                  <div id="navbarMenu" className="navbar-menu is-active">
                    <div className="navbar-end">
                      <div>
                        <Link to="/">
                          <p className="has-text-white has-text-weight-bold is-size-4 mt-6 mr-6">
                            Home
                          </p>
                        </Link>
                      </div>
                      {
                        localStorage.getItem('authenticated') !== 'true' ?
                        <>
                          <div>
                            <Link to="/register">
                              <p className="has-text-white has-text-weight-bold is-size-4 mt-6 mr-6">
                                Sign Up
                              </p>
                            </Link>
                          </div>
                          <div>
                            <Link to="/login">
                              <p className="has-text-white has-text-weight-bold is-size-4 mt-6">
                                Login
                              </p>
                            </Link>
                          </div>
                        </>
                        :
                        <>
                          <Link
                            to='/accountpage'
                            className="has-text-white has-text-weight-bold is-size-4 mt-6 mr-6"
                          >
                            { localStorage.getItem('first_name') }
                          </Link>
                          <Link
                            to='/'
                            className="has-text-white has-text-weight-bold is-size-4 mt-6 mr-6"
                            onClick={() => {
                              localStorage.removeItem('authenticated');
                              localStorage.removeItem('first_name');
                              localStorage.removeItem("user_id");
                              window.location.reload();
                            }}
                          >
                            Sign Out
                          </Link>
                        </>
                      }
                    </div>
                  </div>
                </div>
              </nav>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
