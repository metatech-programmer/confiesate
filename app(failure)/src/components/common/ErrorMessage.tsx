interface ErrorMessageProps {
  message: string;
}

const ErrorMessage = ({ message }: ErrorMessageProps) => (
  <div className="text-center py-10">
    <p className="text-red-500">{message}</p>
  </div>
);

export default ErrorMessage;
