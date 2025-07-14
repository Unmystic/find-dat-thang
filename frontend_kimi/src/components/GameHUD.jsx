export default function GameHUD({ attempts, time, message, gameOver }) {
    return (
        <header className="hud">
            <div className="hud-block">
                <span className="label">Attempts</span>
                <span className="value">{attempts}</span>
            </div>

            <div className={`hud-message ${gameOver ? "final" : ""}`}>{message}</div>

            <div className="hud-block">
                <span className="label">Time</span>
                <span className="value">{time}s</span>
            </div>
        </header>
    );
}
