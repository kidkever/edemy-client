import { Modal } from "antd";
import { useState } from "react";
import ReactPlayer from "react-player";

const PreviewModal = ({ showModal, setShowModal, preview }) => {
  return (
    <>
      <Modal
        title={null}
        bodyStyle={{ padding: "0px", cursor: "pointer" }}
        visible={showModal}
        onCancel={() => setShowModal(!showModal)}
        width={720}
        footer={null}
      >
        <ReactPlayer url={preview} playing={showModal} controls width="100%" />
      </Modal>
    </>
  );
};

export default PreviewModal;
