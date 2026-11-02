const Spinner = ({ text = "Loading..." }) => {
    return (
        <div className="loading-overlay" role="status" aria-live="polite">
            <div className="loading-spinner"></div>
            <span className="loading-text">{text}</span>
        </div>
    );
};

export default Spinner;