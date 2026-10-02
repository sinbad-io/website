import { Footer, Header } from "@/chrome";

export default function NotFound() {
  return (
    <div className="page">
      <Header />
      <main>
        <div className="lead">
          <h1 className="title">Not here</h1>
          <p>
            Nothing lives at this address. <a href="/">Start from the top</a>.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
