import { useEffect } from "react";

type ModalProps = {
    children: React.ReactNode;
    title: string;
    className?: string;
    containerClassName?: string;
    modal_id: string;
    open: boolean;
    setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
};

const Modal = ({
    children,
    title,
    className,
    containerClassName,
    modal_id,
    setOpenModal,
    open = false,
}: ModalProps) => {
    useEffect(() => {
        if (open) {
            (
                document.getElementById(modal_id!) as HTMLDialogElement | null
            )?.showModal();
        } else {
            (
                document.getElementById(modal_id!) as HTMLDialogElement | null
            )?.close();
        }
    }, [open, modal_id]);

    return (
        <>
            <dialog id={modal_id} className={`modal ${className}`}>
                <div className={`modal-box ${containerClassName}`}>
                    <h3 className="font-bold text-lg">{title}</h3>
                    {children}
                    <div className="modal-action">
                        <form method="dialog">
                            <button
                                className="btn"
                                onClick={() => setOpenModal(false)}
                            >
                                Close
                            </button>
                        </form>
                    </div>
                </div>
            </dialog>
        </>
    );
};
export default Modal;
