import React from "react";

const formatTime = (date) =>
  new Date(date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
const statusGroup = {
  Confirmed: "Confirmed",
  Preparing: "Preparing",
  Packed: "Packed",
  "Available for Delivery": "Packed",
  "Accepted by Agent": "Packed",
  "Out for Delivery": "Out for Delivery",
  Delivered: "Delivered",
};
const OrderStatusTracker = ({
  status,
  steps,
  icons,
  orderTime,
  updatedAt,
  simplifyView = false,
}) => {
  let displayStatus = status;

  if (simplifyView) {
    const statusGroup = {
      "Available for Delivery": "Packed",
      "Accepted by Agent": "Packed",
    };

    displayStatus = statusGroup[status] || status;
  }
  const currentIndex = steps.findIndex((step) => step === displayStatus);

  const getEtaMessage = () => {
    if (status === "Delivered") {
      return `Delivered at ${formatTime(updatedAt)}`;
    }

    if (!orderTime) return "";

    const totalDeliveryTimeMs = 45 * 60 * 1000;
    const etaTimestamp = new Date(orderTime).getTime() + totalDeliveryTimeMs;

    const minutesRemaining = Math.round((etaTimestamp - Date.now()) / 60000);

    if (minutesRemaining > 1) {
      return `Arriving in ~${minutesRemaining} mins`;
    }
    if (minutesRemaining >= 0) {
      return `Arriving soon`;
    }
    return `Delivery is running late`;
  };
  return (
    <div className="w-full mt-4">
      <div className="flex items-center">
        {steps.map((step, index) => {
          const isCompleted = index < currentIndex;
          const isCurrent = index === currentIndex;
          const Icon = icons[step];

          return (
            <React.Fragment key={step}>
              <div className={`flex flex-col items-center`}>
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500
                                    ${isCompleted ? "bg-green-500" : ""}
                                    ${
                                      isCurrent
                                        ? "bg-yellow-400 animate-pulse"
                                        : ""
                                    }
                                    ${
                                      !isCompleted && !isCurrent
                                        ? "bg-gray-700"
                                        : ""
                                    }
                                `}
                >
                  <Icon size={20} className="text-white" />
                </div>
                <p
                  className={`mt-2 text-xs text-center transition-colors duration-500 ${
                    isCompleted || isCurrent ? "text-white" : "text-gray-500"
                  }`}
                >
                  {step}
                </p>
              </div>

              {index < steps.length - 1 && (
                <div className="flex-1 h-1 bg-gray-700 relative mx-1">
                  <div
                    className="h-1 absolute top-0 left-0 bg-gradient-to-r from-green-500 to-yellow-400 transition-all duration-1000"
                    style={{
                      width: isCompleted ? "100%" : isCurrent ? "50%" : "0%",
                    }}
                  ></div>
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
      <p className="text-center text-sm text-yellow-300 mt-4 animate-pulse">
        {getEtaMessage()}
      </p>
    </div>
  );
};

export default OrderStatusTracker;
