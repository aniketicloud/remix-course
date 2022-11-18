import { Link } from "@remix-run/react";

export default function DemoPage() {
  return (
    <>
      <h1>Demo Page</h1>
      <Link to="/">Go to Home Page</Link>
    </>
  );
}
