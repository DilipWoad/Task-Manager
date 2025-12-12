const ToastCard = ({ animation, toastCardMessage, toastCss }) => {
  return (
    <p
      className={`${toastCss} text-nowrap absolute top-0 left-1/2 -translate-x-1/2 mt-2 bg-gray-900 text-gray-100 p-4 text-sm rounded-md transition-all duration-1000 z-50 ${
        animation ? "opacity-0 -translate-y-4" : "opacity-100 translate-y-0"
      }`}
    >
      {toastCardMessage}
      {/* Response message */}
    </p>
  );
};

export default ToastCard;
