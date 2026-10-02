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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit?.();
    };

    useEffect(() => {
        const dialog = document.getElementById(modal_id) as HTMLDialogElement | null;
        if (!dialog) return;

        if (open) {
            if (!dialog.open) {
                dialog.showModal();
            }
        } else {
            if (dialog.open) {
                dialog.close();
            }
        }
    }, [open, modal_id]);

    return (
        <dialog
            id={modal_id}
            className={`modal ${className || ""}`}
            onClose={() => setOpenModal(false)}
        >
            <div className={`modal-box ${containerClassName || ""}`}>
                <h3 className="font-bold text-lg">{title}</h3>
                <div className="py-4">{children}</div>
                <div className="modal-action">
                    <form onSubmit={handleSubmit} className="flex gap-2.5">
                        <button
                            className="btn"
                            type="button"
                            disabled={loading}
                            onClick={() => setOpenModal(false)}
                        >
                            Close
                        </button>
                        <button
                            className="btn bg-red-500 hover:bg-red-600 text-white flex items-center gap-2"
                            type="submit"
                            disabled={loading}
                        >
                            {loading && <span className="loading loading-spinner loading-sm"></span>}
                            {objectName || "Confirm"}
                        </button>
                    </form>
                </div>
            </div>
        </dialog>
    );
};
export default Modal;
