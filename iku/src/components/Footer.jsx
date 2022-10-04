import React from "react";
import "bulma/css/bulma.css";
import styles from "./../styles/cssHomepage.module.css";

export default function Footer() {
  return (
    <div>
      <div>
        <section class="hero is-small">
          <div class={styles.footer}>
            <div class="hero-body">
              <nav class="navbar">
                <div class="container">
                  <div class="navbar-brand">
                    <p class="has-text-white has-text-weight-bold is-size-5 m">
                      © 2022 IKU
                    </p>
                  </div>
                  <div id="navbarMenu" class="navbar-menu is-active">
                    <div class="navbar-end">
                      <div>
                        <a href="/register">
                          <p class="has-text-white has-text-weight-bold is-size-5 mr-6">
                            Help
                          </p>
                        </a>
                      </div>
                      <div>
                        <a href="/login">
                          <p class="has-text-white has-text-weight-bold is-size-5">
                            About Us
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
