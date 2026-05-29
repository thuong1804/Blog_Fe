import { useEffect } from "react";

type ModalProps = {
    children: React.ReactNode;
    title: string;
    className?: string;
    containerClassName?: string;
    modal_id: string;
    open: boolean;
    setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
    onSubmit: () => void,
    objectName?: string,
    loading?: boolean,
};

const Modal = ({
    children,
    title,
    className,
    containerClassName,
    modal_id,
    setOpenModal,
    open = false,
    onSubmit,
    objectName,
    loading,
}: ModalProps) => {

    const handleSubmit = () => {
        onSubmit?.()
    }

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
                        <form method="dialog" onSubmit={handleSubmit} className="flex gap-2.5">
                            <button
                                className="btn"
                                type="button"
                                onClick={() => setOpenModal(false)}
                            >
                                Close
                            </button>
                            <button
                                className="btn bg-red-500 text-white"
                                type="submit"
                                disabled={loading}
                            >
                                {objectName || 'Confirm'}
                            </button>
                        </form>
                    </div>
                </div>
            </dialog>
        </>
    );
};
export default Modal;
