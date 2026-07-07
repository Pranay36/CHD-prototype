const Toast = ({ message }) => (
  <div className={`toast${message ? " open" : ""}`} role="status" aria-live="polite">
    {message}
  </div>
);

export default Toast;
