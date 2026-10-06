"use client";

import Modal from "@/components/Modal/Modal";

type DeletePostModalProps = {
    modalId: string;
    postTitle?: string;
    open: boolean;
    setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
    onSubmit: () => void;
    loading?: boolean;
};

const DeletePostModal = ({
    modalId,
    postTitle,
    open,
    setOpenModal,
    onSubmit,
    loading,
}: DeletePostModalProps) => {
    return (
        <Modal
            modal_id={modalId}
            title="Delete post"
            open={open}
            setOpenModal={setOpenModal}
            onSubmit={onSubmit}
            objectName="Delete"
            loading={loading}
        >
            <p className="text-gray-600">
                Are you sure you want to delete{" "}
                <strong>{postTitle}</strong>? This action cannot be undone.
            </p>
        </Modal>
    );
};

export default DeletePostModal;
