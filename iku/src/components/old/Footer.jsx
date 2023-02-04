import React from "react";
import styles from "./../styles/cssHomepage.module.css";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <div>
      <div>
        <section className="hero is-small">
          <div className={styles.footer}>
            <div className="hero-body">
              <nav className="navbar">
                <div className="container">
                  <div className="navbar-brand">
                    <p className="has-text-white has-text-weight-bold is-size-5 m">
                      © 2022 IKU
                    </p>
                  </div>
                  <div id="navbarMenu" className="navbar-menu is-active">
                    <div className="navbar-end">
                      <div>
                        <a href="/register">
                          <p className="has-text-white has-text-weight-bold is-size-5 mr-6">
                            <Link className="has-text-white" to="/">
                              Help
                            </Link>
                          </p>
                        </a>
                      </div>
                      <div>
                        <a href="/login">
                          <p className="has-text-white has-text-weight-bold is-size-5">
                            <Link className="has-text-white" to="/aboutUs">
                              About Us
                            </Link>
                          </p>
                        </a>
                      </div>
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
