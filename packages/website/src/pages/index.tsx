import React from "react";
import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Layout from "@theme/Layout";

import styles from "./index.module.css";

export default function Home(): JSX.Element {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      title={`Hello from ${siteConfig.title}`}
      description="Description will go into a meta tag in <head />"
    >
      <main>
        <section id="hero">
          <div className="container">
            <div className={styles.content}>
              <h1 className={styles.heading}>
                Library for making gRPC requests from a browser.
              </h1>
              <h2 className={styles.subHeading}>
                gRPC Client is the port of{" "}
                <Link
                  href="https://github.com/grpc/grpc-web"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  grpc-web
                </Link>{" "}
                library.
              </h2>
              <p className={styles.description}>
                <strong>gRPC Client</strong> is a typescript library using which
                we can directly talk to the gRPC service via web-browser.{" "}
                <strong>gRPC Client</strong> connects to gRPC services via a
                special gateway proxy(
                <Link
                  href="https://www.envoyproxy.io/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Envoy proxy
                </Link>
                ) which is going to be a docker service in our case running on
                the same server machine which bridges{" "}
                <Link
                  href="https://grpc.io/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  GRPC
                </Link>
                ( HTTP/2) with Browser Communication (HTTP/1.1).
              </p>
              <div className={styles.buttons}>
                <Link
                  className="button button--primary button--lg"
                  href="/docs/intro"
                >
                  Getting Started
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
}
