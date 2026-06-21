type AppLoaderProps = {
  message?: string;
  exiting?: boolean;
};

export default function AppLoader({ message = 'Preparing your experience…', exiting = false }: AppLoaderProps) {
  return (
    <div
      className={`app-loader ${exiting ? 'app-loader-exit' : ''}`}
      role="status"
      aria-live="polite"
      aria-label="Loading"
    >
      <div className="app-loader-bg" aria-hidden />
      <div className="app-loader-orbs" aria-hidden>
        <span className="app-loader-orb app-loader-orb-1" />
        <span className="app-loader-orb app-loader-orb-2" />
        <span className="app-loader-orb app-loader-orb-3" />
      </div>

      <div className="app-loader-content">
        <div className="app-loader-logo-stage">
          <div className="app-loader-logo-card">
            <img
              src="/assets/branding/logo-white.png"
              alt="Plutonic"
              className="app-loader-logo"
              width={180}
              height={48}
            />
          </div>
        </div>

        <div className="app-loader-dots" aria-hidden>
          <span className="app-loader-dot" />
          <span className="app-loader-dot" />
          <span className="app-loader-dot" />
        </div>

        <p className="app-loader-brand">Plutonic Cleaning &amp; Technical Services</p>
        <p className="app-loader-tagline">Make your world as clean as mine</p>

        <div className="app-loader-bar" aria-hidden>
          <span className="app-loader-bar-fill" />
        </div>

        <p className="app-loader-message">{message}</p>
      </div>
    </div>
  );
}
