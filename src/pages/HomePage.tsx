import { Link } from 'react-router-dom'

// Welcome page
export function HomePage() {
  return (
    <main className="home-page">
      {/* Background video */}
      <video
        className="home-video"
        autoPlay
        muted
        loop
        playsInline
      >
        <source
          src="/videos/kitchen.mp4"
          type="video/mp4"
        />
      </video>

      {/* Dark overlay */}
      <div className="home-overlay" />

      {/* Welcome content */}
      <div className="home-content">
        <p className="home-welcome">Welcome to</p>

        <h1>Kitchen 67</h1>

        <p className="home-tagline">
          Fresh flavors. Made for you.
        </p>

        <Link
          className="home-button"
          to="/menu"
        >
          Start Your Order
        </Link>
      </div>
    </main>
  )
}