const ToastCard = ({ animation, toastCardMessage, toastCss }) => {
  console.log("Does card is called?")
  return (
    <p
      className={`${toastCss} wrap-break-word w-auto absolute top-0 left-1/2 -translate-x-1/2 mt-2 bg-primaryColor text-quaternaryColor font-semibold text-center p-4 text-sm sm:text-lg rounded-md transition-all duration-1000 z-50${
        animation ? "opacity-0 -translate-y-4" : "opacity-100 translate-y-0"
      }`}
    >
      {toastCardMessage}
      {/* Response message */}
    </p>
  );
};

export default ToastCard;
