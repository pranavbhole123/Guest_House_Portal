import React, { useState } from "react";
import { useSelector } from "react-redux";
import StepperComponent from "./Stepper";
import http from "../utils/httpService";
import { toast } from "react-toastify";

const DiningWorkflow = ({ id, userRecord, reviewers, setReviewers }) => {
  console.log(userRecord);
  let diningRecord = userRecord;
  const steps = ["Place Order", "Approval", "Payment"];
  const [paymentId, setPaymentId] = useState({ id: diningRecord.payment.paymentId, confirmId: "" });
  console.log(paymentId);
  const stepsCompleted = userRecord.stepsCompleted;
  const user = useSelector((state) => state.user);
  const reviewer = reviewers.find((reviewer) => reviewer.role === user.role);
  const comments = reviewer?.comments;
  return (
    <div className=" flex flex-col justify-center col-span-3 bg-[rgba(255,255,255,0.5)] rounded-lg shadow-lg p-8 gap-10">
      <StepperComponent steps={steps} stepsCompleted={stepsCompleted || 0} />
      <div className="w-full mt-10 flex justify-around">
        {user.role === "CASHIER" && (
          <div className="flex flex-col gap-4 w-full">
            <div className="flex items-baseline justify-between w-full">
              <div> Payment ID:</div>
              <div>
                <input
                  onChange={(e) =>
                    setPaymentId((prev) => ({ ...prev, id: e.target.value }))
                  }
                  value={paymentId.id}
                  className="p-2 rounded-lg"
                ></input>
              </div>
            </div>
            <div className="flex items-baseline justify-between w-full">
              <div>Confirm ID:</div>
              <div>
                <input
                  onChange={(e) =>
                    setPaymentId((prev) => ({
                      ...prev,
                      confirmId: e.target.value,
                    }))
                  }
                  value={paymentId.confirmId}
                  className="p-2 rounded-lg"
                ></input>
              </div>
            </div>
            <div className="justify-center flex w-full">
              <button
                className="p-3 px-4  mt-8 bg-[rgb(54,88,153)] rounded-lg text-white"
                onClick={() => {
                  if(paymentId.id !== paymentId.confirmId) {
                    toast.error("Payment ID does not match Confirm Payment ID")
                    return;
                  }
                  diningRecord.payment.paymentId = paymentId.id;
                  diningRecord.payment.status = "PAID";
                  console.log(diningRecord);
                  try {
                    http.put("/dining/" + id, diningRecord);
                    window.location.reload();
                  } catch (error) {
                    console.log(error);
                  }
                }}
              >
                Submit
              </button>
            </div>
          </div>
        )}
        {user.role !== "USER" && user.role !== "CASHIER" && (
          <>
            <button
              onClick={() => {
                http.put("/dining/approve/" + id, { comments });
                window.location.reload();
              }}
              className="border rounded-lg p-3 px-4 bg-green-400 hover:bg-green-500"
            >
              Approve
            </button>
            <button
              onClick={() => {
                http.put("/dining/reject/" + id, { comments });
                window.location.reload();
              }}
              className="border rounded-lg p-3 px-4 bg-red-400 hover:bg-red-500"
            >
              Reject
            </button>
            <button
              onClick={() => {
                http.put("/dining/hold/" + id, { comments });
                window.location.reload();
              }}
              className="border rounded-lg p-3 px-4 bg-yellow-400 hover:bg-yellow-500"
            >
              Review
            </button>
          </>
        )}
      </div>
      {user.role !== "CASHIER" && (
        <div className="w-full">
          {user.role === "USER" ? (
            comments && (
              <div className="border shadow-lg rounded-lg">
                <div className="p-2">Comments</div>
                <hr className="" />
                <div className="font-['Dosis'] p-2">{comments}</div>
              </div>
            )
          ) : (
            <textarea
              // disabled={user.role !== "ADMIN"}
              className="w-full p-2 bg-white border-gray-500 rounded-lg"
              rows={5}
              value={comments || ""}
              onChange={(e) =>
                setReviewers((prev) =>
                  prev.map((r) =>
                    r.role === user.role
                      ? { ...r, comments: e.target.value }
                      : r
                  )
                )
              }
              placeholder={"Write any review or comments"}
            ></textarea>
          )}
        </div>
      )}
    </div>
  );
};

export default DiningWorkflow;
