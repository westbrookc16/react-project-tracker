import React, { useState, useRef } from "react";
import {
  AlertDialog,
  AlertDialogLabel,
  AlertDialogDescription
} from "@reach/alert-dialog";

export const useConfirm = (msg, callback) => {
  const cancelRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const close = () => {
    setIsOpen(false);
  };
  const open = () => {
    setIsOpen(true);
  };
  const ConfirmDialog = () => {
    return (
      <>
        {isOpen && (
          <AlertDialog leastDestructiveRef={cancelRef}>
            <AlertDialogLabel>Please Confirm!</AlertDialogLabel>

            <AlertDialogDescription>{msg}</AlertDialogDescription>

            <div className="alert-buttons">
              <button
                onClick={e => {
                  e.preventDefault();
                  callback();
                  setIsOpen(false);
                }}
              >
                Yes
              </button>{" "}
              <button ref={cancelRef} onClick={close}>
                No
              </button>
            </div>
          </AlertDialog>
        )}
      </>
    );
  };
  return [open, ConfirmDialog];
};
