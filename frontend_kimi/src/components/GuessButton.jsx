export default function GuessButton({ disabled, onClick }) {
    return (
        <button className="guess-btn" disabled={disabled} onClick={onClick}>
            Make Guess
        </button>
    );
}
